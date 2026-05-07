import { FC } from "react";
import { HistoryLog, MOCK_HISTORY } from "../data";
import { Clock, User, CheckCircle } from "lucide-react";

export const HistoryView: FC = () => {
  return (
    <div className="flex-1 bg-[#060913] p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-500" />
          Emergency Resolution History
        </h2>
        
        <div className="bg-[#0A0F1C] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                <th className="p-4 font-semibold">Alert ID</th>
                <th className="p-4 font-semibold">Rescuer</th>
                <th className="p-4 font-semibold">Resolved At</th>
                <th className="p-4 font-semibold">Response Time</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {MOCK_HISTORY.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 text-sm font-mono text-slate-300">{log.alertId}</td>
                  <td className="p-4 text-sm text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" /> {log.rescuerName}
                  </td>
                  <td className="p-4 text-sm text-slate-400">{log.resolvedAt}</td>
                  <td className="p-4 text-sm text-slate-400">{log.duration}</td>
                  <td className="p-4 text-sm">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                      <CheckCircle className="w-3 h-3" /> RESOLVED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
