import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { SOSAlert } from '../data/mockData';
import 'leaflet/dist/leaflet.css';
import { Badge } from './Badge';

interface RealMapViewProps {
  alerts: SOSAlert[];
  activeAlertId: string | null;
  onMarkerClick: (id: string) => void;
}

// Custom icon creator function
const createCustomIcon = (priority: string, status: string, isActive: boolean) => {
  const isResolved = status === 'Resolved';
  let bgColor = 'bg-blue-500';
  let pulseColor = '';

  if (isResolved) {
    bgColor = 'bg-slate-500';
  } else {
    switch (priority) {
      case 'High':
        bgColor = 'bg-red-500';
        pulseColor = 'bg-red-400';
        break;
      case 'Medium':
        bgColor = 'bg-amber-500';
        pulseColor = 'bg-amber-400';
        break;
      case 'Low':
        bgColor = 'bg-emerald-500';
        break;
    }
  }

  const pulseHtml = (priority === 'High' && !isResolved) 
    ? `<span class="absolute flex h-full w-full -z-10 rounded-full animate-ping ${pulseColor} opacity-75 scale-150"></span>`
    : '';

  const activeStyles = isActive ? 'ring-4 ring-white scale-125' : '';
  const resolvedStyles = isResolved ? 'opacity-60 grayscale' : 'shadow-lg';

  const html = `
    <div class="relative flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${bgColor} border-2 border-slate-900 ${activeStyles} ${resolvedStyles}">
      ${pulseHtml}
      <div class="w-2 h-2 bg-white rounded-full"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Component to handle auto-centering when activeAlertId changes
function MapController({ alerts, activeAlertId }: { alerts: SOSAlert[], activeAlertId: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (activeAlertId) {
      const activeAlert = alerts.find(a => a.id === activeAlertId);
      if (activeAlert) {
        map.flyTo([activeAlert.location.lat, activeAlert.location.lng], 16, {
          animate: true,
          duration: 1.5
        });
      }
    }
  }, [activeAlertId, alerts, map]);

  return null;
}

// Cluster calculation helper (basic proximity grouping)
function getClusters(alerts: SOSAlert[], thresholdKm = 1.5) {
  const clusters: { center: [number, number], alerts: SOSAlert[] }[] = [];
  
  alerts.forEach(alert => {
    let addedToCluster = false;
    for (let cluster of clusters) {
      const dLat = Math.abs(cluster.center[0] - alert.location.lat) * 111; // rough km
      const dLng = Math.abs(cluster.center[1] - alert.location.lng) * 85; // rough km at SF lat
      const dist = Math.sqrt(dLat*dLat + dLng*dLng);
      
      if (dist < thresholdKm) {
        cluster.alerts.push(alert);
        addedToCluster = true;
        break;
      }
    }
    if (!addedToCluster) {
      clusters.push({ center: [alert.location.lat, alert.location.lng], alerts: [alert] });
    }
  });

  return clusters;
}

const createClusterIcon = (count: number) => {
  const html = `
    <div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-red-600/90 border-2 border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.6)] backdrop-blur-sm z-50">
      <span class="absolute flex h-full w-full -z-10 rounded-full animate-pulse bg-red-500/50 scale-125"></span>
      <span class="text-white font-bold text-xs">${count}</span>
    </div>
    <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-red-950 text-red-200 text-[10px] font-bold px-2 py-0.5 rounded border border-red-800 shadow-xl pointer-events-none">
      ⚠️ High Risk Zone
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-cluster-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};


export function RealMapView({ alerts, activeAlertId, onMarkerClick }: RealMapViewProps) {
  const [clusters, setClusters] = useState(getClusters(alerts));

  // Default center (San Francisco)
  const defaultCenter: [number, number] = [37.7749, -122.4194];

  useEffect(() => {
    // Only cluster active, non-resolved alerts to highlight high risk zones
    const activeAlerts = alerts.filter(a => a.status !== 'Resolved');
    setClusters(getClusters(activeAlerts));
  }, [alerts]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-700 shadow-inner relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        zoomControl={false}
      >
        {/* Dark theme map tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <MapController alerts={alerts} activeAlertId={activeAlertId} />

        {/* Render Clusters for High Risk Zones (if > 1 alert in area) */}
        {clusters.map((cluster, idx) => {
          if (cluster.alerts.length > 1) {
            return (
              <Marker 
                key={`cluster-${idx}`} 
                position={cluster.center}
                icon={createClusterIcon(cluster.alerts.length)}
                eventHandlers={{
                  click: () => {
                    // Could zoom in or open list, for now just basic interaction
                  }
                }}
              />
            );
          }
          return null;
        })}

        {/* Render individual markers */}
        {alerts.map((alert) => (
          <Marker
            key={alert.id}
            position={[alert.location.lat, alert.location.lng]}
            icon={createCustomIcon(alert.priority, alert.status, activeAlertId === alert.id)}
            eventHandlers={{
              click: () => onMarkerClick(alert.id),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1 min-w-[200px]">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-900">{alert.id}</span>
                  <Badge variant={alert.priority === 'High' ? 'high' : alert.priority === 'Medium' ? 'medium' : 'low'} className="text-[10px] py-0">
                    {alert.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className={`font-semibold ${alert.battery < 20 ? 'text-red-600' : alert.battery <= 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                    🔋 {alert.battery}%
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-600">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-slate-600 mb-2 font-mono">
                  {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                </p>
                <p className="text-sm font-medium text-slate-800 line-clamp-2">{alert.message}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
