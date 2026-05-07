import { FC } from "react";
import { ArsLogo } from "./ArsLogo";
import { LayoutDashboard, Radio, Users, ClipboardCheck, History, BarChart2, Settings } from "lucide-react";
import { motion } from "motion/react";

const NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Live Emergencies", icon: Radio, hasBadge: true },
  { name: "Rescuers", icon: Users },
  { name: "Assignments", icon: ClipboardCheck },
  { name: "History", icon: History },
  { name: "Analytics", icon: BarChart2 },
  { name: "Settings", icon: Settings },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-[#0A0F1C] border-r border-slate-800/60 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
        <ArsLogo className="w-10 h-10 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        <div>
          <h2 className="font-bold text-lg text-white tracking-wide">ARS</h2>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Command Center</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.name;
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                isActive 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                />
              )}
              <Icon className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" : ""}`} />
              <span className="font-medium text-sm">{item.name}</span>
              {item.hasBadge && (
                <span className="ml-auto bg-red-500/20 text-red-500 text-xs font-bold px-2 py-0.5 rounded-full border border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                  3
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/60">
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">System Load</span>
            <span className="text-xs font-bold text-green-400">24%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[24%] shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
