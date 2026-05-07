import { FC } from "react";
import { Search, Bell, Activity, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { ArsLogo } from "./ArsLogo";

export const TopHeader: FC = () => {
  return (
    <header className="h-16 bg-[#0A0F1C]/90 backdrop-blur-md border-b border-slate-800/60 flex items-center justify-between px-6 z-20 shadow-md">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pr-4 border-r border-slate-800/60">
          <ArsLogo className="w-8 h-8 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <span className="font-bold text-white tracking-wide text-sm hidden md:block">ARS Command Center</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </div>
          <span className="text-xs font-bold tracking-wide text-blue-400">SYSTEM LIVE</span>
        </div>
        
        <div className="h-5 w-px bg-slate-700"></div>
        
        <div className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="text-slate-300">Rescuers Online: <strong className="text-white">124</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search ID, Location, Name..." 
            className="w-64 bg-slate-900 border border-slate-700/60 rounded-full pl-9 pr-4 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <button className="relative p-2 text-slate-400 hover:text-white transition-colors bg-slate-900 rounded-full border border-slate-800 hover:border-slate-700">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-[#0A0F1C] rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-800/60 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-900 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shadow-[0_0_10px_rgba(59,130,246,0.2)]">
            OP
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white leading-tight">Operator 01</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide">Primary Host</span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </header>
  );
};
