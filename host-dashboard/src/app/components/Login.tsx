import { FC, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ShieldAlert, Activity, ArrowRight, User, Phone } from "lucide-react";
import { ArsLogo } from "./ArsLogo";

export const Login: FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center relative overflow-hidden font-sans text-slate-200">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542382257-80dedb725088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBtYXAlMjBkYXJrJTIwbW9kZXxlbnwxfHx8fDE3NzgxNTkyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-10 mix-blend-luminosity grayscale"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/80 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0A0F1C]/0 to-[#0A0F1C]/0"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.2 }}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <motion.div 
                animate={{ boxShadow: ['0 0 0px rgba(59,130,246,0)', '0 0 40px rgba(59,130,246,0.8)', '0 0 0px rgba(59,130,246,0)'] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="rounded-2xl bg-blue-500/5 p-2 mb-4"
              >
                <ArsLogo className="w-24 h-24 drop-shadow-[0_0_25px_rgba(59,130,246,0.9)]" />
              </motion.div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">ARS</h1>
              <p className="text-blue-300/80 text-sm font-medium tracking-widest uppercase">Real-Time Emergency Command Center</p>
            </div>

            <div className="flex items-center justify-center gap-2 mb-8 bg-blue-500/10 py-2 px-4 rounded-full border border-blue-500/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              <span className="text-xs text-blue-400 font-semibold tracking-wide">SYSTEM ONLINE & SECURE</span>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 ml-1">Host/Rescuer ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter operator name"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 ml-1">Authentication Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3.5 px-4 rounded-xl font-semibold shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Enter Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
          
          <div className="bg-slate-950/80 p-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800">
            <span className="flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5"/> End-to-end Encrypted</span>
            <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5"/> v2.4.1</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
