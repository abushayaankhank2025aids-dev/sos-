import React, { forwardRef } from 'react';
import { SOSAlert } from '../data/mockData';
import { Badge } from './Badge';
import { MapPin, Clock, Navigation, CheckCircle, Navigation2, ShieldAlert, Sparkles, Battery, BatteryLow, BatteryMedium, BatteryFull, Mic, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

interface SOSCardProps {
  alert: SOSAlert;
  onUpdateStatus: (id: string, newStatus: SOSAlert['status']) => void;
  isActive: boolean;
  onClick: () => void;
}

export const SOSCard = forwardRef<HTMLDivElement, SOSCardProps>(({ alert, onUpdateStatus, isActive, onClick }, ref) => {
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'border-red-500 shadow-red-500/20';
      case 'Medium': return 'border-amber-500 shadow-amber-500/20';
      case 'Low': return 'border-emerald-500 shadow-emerald-500/20';
      default: return 'border-slate-700 shadow-slate-900/50';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return 'neutral';
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInMins = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} min ago`;
    const hours = Math.floor(diffInMins / 60);
    return `${hours} hr ago`;
  };

  const getBatteryColor = (battery: number) => {
    if (battery < 20) return 'text-red-500';
    if (battery <= 50) return 'text-yellow-500';
    return 'text-emerald-500';
  };

  const getBatteryIcon = (battery: number) => {
    if (battery < 20) return BatteryLow;
    if (battery <= 50) return BatteryMedium;
    return BatteryFull;
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className={`
        relative p-4 rounded-xl cursor-pointer transition-all duration-200 
        ${isActive ? `bg-slate-800 border-2 shadow-[0_0_15px_rgba(0,0,0,0.5)] ${getPriorityColor(alert.priority)}` : `bg-slate-800/80 border-l-4 border-y border-r border-slate-700 hover:bg-slate-750 ${getPriorityColor(alert.priority).split(' ')[0]}`}
      `}
    >
      {/* New Alert Glow Indicator */}
      {alert.isNew && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-slate-900"></span>
        </span>
      )}

      {/* Header Info */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2 items-center">
          <Badge variant={getPriorityVariant(alert.priority)}>{alert.priority}</Badge>
          <Badge variant={
            alert.status === 'Pending' ? 'neutral' :
            alert.status === 'Accepted' ? 'medium' :
            alert.status === 'Reached' ? 'high' : 'low'
          }>
            {alert.status}
          </Badge>
          <span className="text-slate-500 text-xs font-mono hidden sm:inline-block">{alert.id}</span>
        </div>
        <div className={`flex items-center text-xs gap-1 font-medium ${alert.isNew ? 'text-red-400' : 'text-slate-400'}`}>
          <Clock className="w-3.5 h-3.5" />
          {formatTime(alert.timestamp)}
        </div>
      </div>

      {/* Trigger Type & Battery */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-700/50">
        {/* Trigger Type */}
        <div className="flex items-center gap-1.5 text-xs">
          {alert.triggerType === 'voice' ? (
            <>
              <Mic className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-400 font-semibold">Voice Trigger</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-semibold">Manual Trigger</span>
            </>
          )}
        </div>

        {/* Battery Level */}
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${getBatteryColor(alert.battery)}`}>
          {React.createElement(getBatteryIcon(alert.battery), { className: "w-4 h-4" })}
          <span>{alert.battery}%</span>
        </div>
      </div>

      {/* Raw Message */}
      <p className="text-slate-400 text-sm mb-3 line-clamp-3 leading-relaxed">
        💬 "{alert.message}"
      </p>

      {/* Live Location */}
      <div className="bg-slate-950/50 border border-slate-700/50 rounded-lg p-2.5 mb-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Live Location</span>
        </div>
        <div className="text-xs text-slate-300 font-mono space-y-0.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Lat:</span>
            <span>{alert.location.lat.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Lng:</span>
            <span>{alert.location.lng.toFixed(4)}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 truncate">{alert.location.address}</div>
        </div>
      </div>

      {/* AI Summary Box */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900/30 to-violet-900/30 border border-violet-500/30 rounded-lg p-3 mb-4 shadow-inner">
        <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
        <div className="flex items-center gap-1.5 mb-1.5 text-violet-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-xs font-bold uppercase tracking-wider">AI Insight</span>
        </div>
        <p className="text-violet-50 text-sm font-medium leading-tight">
          {alert.aiSummary}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
        
        {/* Status indicator / actions based on current status */}
        <div className="flex gap-2">
          {alert.status === 'Pending' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateStatus(alert.id, 'Accepted'); }}
              className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-900/20"
            >
              <ShieldAlert className="w-4 h-4" />
              Accept
            </button>
          )}
          {alert.status === 'Accepted' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateStatus(alert.id, 'Reached'); }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-900/20"
            >
              <Navigation2 className="w-4 h-4" />
              Mark Reached
            </button>
          )}
          {alert.status === 'Reached' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateStatus(alert.id, 'Resolved'); }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-900/20"
            >
              <CheckCircle className="w-4 h-4" />
              Resolve
            </button>
          )}
          {alert.status === 'Resolved' && (
            <span className="text-emerald-500 text-sm font-medium flex items-center gap-1.5 px-2">
              <CheckCircle className="w-4 h-4" /> Completed
            </span>
          )}
        </div>

        {/* Universal Navigate Button */}
        {alert.status !== 'Resolved' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Open Google Maps with coordinates
              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${alert.location.lat},${alert.location.lng}`;
              window.open(mapsUrl, '_blank');
            }}
            className="text-white bg-slate-700 hover:bg-slate-600 border border-slate-600 px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5"
          >
            <Navigation className="w-4 h-4" />
            Navigate
          </button>
        )}
      </div>
    </motion.div>
  );
});
