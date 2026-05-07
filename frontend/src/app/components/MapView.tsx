import React from 'react';
import { SOSAlert } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  alerts: SOSAlert[];
  activeAlertId: string | null;
  onMarkerClick: (id: string) => void;
}

export function MapView({ alerts, activeAlertId, onMarkerClick }: MapViewProps) {
  
  const getMarkerColor = (priority: string, status: string) => {
    if (status === 'Resolved') return 'bg-slate-500';
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-amber-500';
      case 'Low': return 'bg-emerald-500';
      default: return 'bg-blue-500';
    }
  };

  const getRingColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'border-red-500';
      case 'Medium': return 'border-amber-500';
      case 'Low': return 'border-emerald-500';
      default: return 'border-blue-500';
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
      {/* Map Background Image (Simulated Map) */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-luminosity bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1629044932273-259127aec85b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY2l0eSUyMG1hcCUyMHRvcCUyMGRvd24lMjB2aWV3fGVufDF8fHx8MTc3NzgxNjcyM3ww&ixlib=rb-4.1.0&q=80&w=1080")',
          filter: 'grayscale(80%) contrast(120%) brightness(80%)'
        }}
      />
      
      {/* Grid Overlay for technical feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Markers */}
      <AnimatePresence>
        {alerts.map((alert) => {
          const isActive = activeAlertId === alert.id;
          const isResolved = alert.status === 'Resolved';
          
          // Map lat/lng to percentage based coordinates for our visual map
          const top = `${alert.location.lat}%`;
          const left = `${alert.location.lng}%`;

          return (
            <motion.div
              key={alert.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ top, left, zIndex: isActive ? 50 : 10 }}
            >
              <button
                onClick={() => onMarkerClick(alert.id)}
                className="relative group flex flex-col items-center justify-center outline-none"
              >
                {/* Ping Animation for High Priority Unresolved */}
                {alert.priority === 'High' && !isResolved && (
                  <span className="absolute flex h-8 w-8 -top-2.5 -left-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  </span>
                )}

                {/* Main Marker */}
                <div className={`
                  relative flex items-center justify-center w-6 h-6 rounded-full shadow-lg transition-all duration-300
                  ${getMarkerColor(alert.priority, alert.status)}
                  ${isActive ? 'scale-125 ring-4 ring-offset-2 ring-offset-slate-900 ' + getRingColor(alert.priority) : 'hover:scale-110'}
                  ${isResolved ? 'opacity-60 grayscale' : 'opacity-100'}
                `}>
                  <MapPin className="w-3.5 h-3.5 text-white" />
                </div>

                {/* Tooltip / Label */}
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded border border-slate-700 shadow-xl whitespace-nowrap z-50 pointer-events-none"
                  >
                    <div className="font-semibold">{alert.id}</div>
                    <div className="text-slate-400 text-[10px]">{alert.location.address}</div>
                  </motion.div>
                )}
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
