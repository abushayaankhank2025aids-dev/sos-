import { FC, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArsLogo } from "./ArsLogo";

export const Splash: FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // Show splash for 2.5 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0A0F1C]/0 to-[#0A0F1C]/0"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1 }}></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Radar and Logo container */}
        <div className="relative flex items-center justify-center w-48 h-48 mb-8">
          {/* Radar sweep animation */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-blue-500/20 border-t-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          />
          
          {/* Radar pulses */}
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-4 rounded-full bg-blue-500/20"
          />
          <motion.div
            animate={{ scale: [1, 2], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            className="absolute inset-8 rounded-full bg-blue-500/20"
          />

          {/* Logo pulsing */}
          <motion.div
            animate={{ scale: [0.9, 1.1, 0.9], filter: ['drop-shadow(0 0 10px rgba(59,130,246,0.5))', 'drop-shadow(0 0 30px rgba(59,130,246,0.9))', 'drop-shadow(0 0 10px rgba(59,130,246,0.5))'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 bg-[#0A0F1C] rounded-full p-4"
          >
            <ArsLogo className="w-20 h-20" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-3 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
            ARS
          </h2>
          
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <p className="text-blue-300 text-sm font-medium tracking-widest uppercase animate-pulse">
              Connecting to Emergency Network...
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};