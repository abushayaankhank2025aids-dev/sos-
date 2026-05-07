import { FC, useState } from "react";
import { SOSAlert, Rescuer } from "../data";
import { AlertTriangle, Battery, Clock, MapPin, User, CheckCircle, Crosshair } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RightPanelProps {
  alerts: SOSAlert[];
  rescuers: Rescuer[];
  selectedAlert: SOSAlert | null;
  onSelectAlert: (alert: SOSAlert) => void;
  onAssign: (alertId: string, rescuerId: string) => void;
}

export const RightPanel: FC<RightPanelProps> = ({ alerts, rescuers, selectedAlert, onSelectAlert, onAssign }) => {
  const [assignMode, setAssignMode] = useState<string | null>(null);

  const activeAlerts = alerts.filter(a => a.status !== "RESOLVED");

  return (
    <div className="w-80 bg-[#0A0F1C] border-l border-slate-800/60 flex flex-col z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.5)]">
      <div className="p-4 border-b border-slate-800/60 bg-slate-900/50">
        <h3 className="font-bold text-white flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Live ARS Feed
        </h3>
        <p className="text-xs text-slate-400 mt-1">{activeAlerts.length} Active Emergencies</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence>
          {activeAlerts.map(alert => {
            const isSelected = selectedAlert?.id === alert.id;
            const isAssigning = assignMode === alert.id;

            return (
              <motion.div
                layout
                key={alert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-slate-900 border rounded-xl overflow-hidden transition-all duration-300 ${
                  isSelected ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-4" onClick={() => onSelectAlert(alert)}>
                  <div className="flex justify-between items-start mb-3 cursor-pointer">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          alert.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs font-mono text-slate-500">{alert.id}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-200">{alert.victimName}</h4>
                    </div>
                    {alert.status === 'ASSIGNED' && (
                      <div className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-1 rounded border border-blue-500/20 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Assigned
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-slate-400 mb-4 bg-slate-950/50 p-2 rounded border border-slate-800/50">
                    "{alert.message}"
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5"><Battery className="w-3.5 h-3.5 text-slate-400"/> {alert.battery}%</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400"/> {new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    <div className="flex items-center gap-1.5 col-span-2"><MapPin className="w-3.5 h-3.5 text-slate-400"/> {alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}</div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button 
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-1.5"
                    >
                      <Crosshair className="w-3.5 h-3.5" /> Locate
                    </button>
                    {alert.status === 'ACTIVE' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setAssignMode(alert.id); }}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold py-2 rounded-lg transition-colors border border-red-500/20 hover:border-red-500/40"
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isAssigning && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-800 bg-slate-950/80 p-3"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-slate-300">Available Rescuers</span>
                        <button onClick={() => setAssignMode(null)} className="text-xs text-slate-500 hover:text-white">Cancel</button>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {rescuers.filter(r => r.status !== 'OFFLINE').map(rescuer => (
                          <div key={rescuer.id} className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex justify-between items-center hover:border-blue-500/30 transition-colors">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-200">{rescuer.name}</span>
                              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${rescuer.status === 'ONLINE' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                {rescuer.status} • {rescuer.activeAssignments} Active
                              </span>
                            </div>
                            <button 
                              onClick={() => { onAssign(alert.id, rescuer.id); setAssignMode(null); }}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-colors"
                            >
                              Dispatch
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
};
