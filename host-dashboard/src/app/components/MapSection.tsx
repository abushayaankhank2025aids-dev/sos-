import { FC } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import { SOSAlert, Rescuer } from "../data";

// Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapSectionProps {
  alerts: SOSAlert[];
  rescuers: Rescuer[];
  selectedAlert: SOSAlert | null;
}

function FlyToLocation({ selectedAlert }: { selectedAlert: SOSAlert | null }) {
  const map = useMap();

  if (selectedAlert) {
    map.flyTo([selectedAlert.lat, selectedAlert.lng], 12, {
      duration: 2,
    });
  }

  return null;
}

export const MapSection: FC<MapSectionProps> = ({
  alerts,
  rescuers,
  selectedAlert,
}) => {
  return (
    <div className="flex-1 relative overflow-hidden rounded-xl">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        {/* Dark World Map */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Auto Focus */}
        <FlyToLocation selectedAlert={selectedAlert} />

        {/* SOS ALERTS */}
        {alerts.map((alert) => (
          <CircleMarker
            key={alert.id}
            center={[alert.lat, alert.lng]}
            radius={12}
            pathOptions={{
              color:
                alert.status === "RESOLVED"
                  ? "#22c55e"
                  : "#ef4444",
              fillColor:
                alert.status === "RESOLVED"
                  ? "#22c55e"
                  : "#ef4444",
              fillOpacity: 0.8,
            }}
          >
            <Popup>
              <div>
                <h3>{alert.victimName}</h3>
                <p>{alert.message}</p>
                <p>{alert.severity}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* RESCUERS */}
        {rescuers.map((rescuer) => (
          <Marker
            key={rescuer.id}
            position={[rescuer.lat, rescuer.lng]}
          >
            <Popup>
              <div>
                <h3>{rescuer.name}</h3>
                <p>Status: {rescuer.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};