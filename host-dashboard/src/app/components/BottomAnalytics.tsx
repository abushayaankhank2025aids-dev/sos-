import { FC } from "react";
import { ShieldCheck, Activity, Users, Clock } from "lucide-react";

export const BottomAnalytics: FC = () => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#0A0F1C]/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-4 flex gap-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-20">
      
      <div className="flex items-center gap-4 px-2">
        <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white leading-none">03</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-1">Active Alerts</div>
        </div>
      </div>

      <div className="w-px h-10 bg-slate-800"></div>

      <div className="flex items-center gap-4 px-2">
        <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white leading-none">42</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-1">Resolved Today</div>
        </div>
      </div>

      <div className="w-px h-10 bg-slate-800"></div>

      <div className="flex items-center gap-4 px-2">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Clock className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white leading-none">4m 12s</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-1">Avg Response</div>
        </div>
      </div>

      <div className="w-px h-10 bg-slate-800"></div>

      <div className="flex items-center gap-4 px-2">
        <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <Users className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white leading-none">12/15</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-1">Available Units</div>
        </div>
      </div>

    </div>
  );
};
