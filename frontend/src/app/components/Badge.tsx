import React from 'react';

type BadgeProps = {
  children: React.ReactNode;
  variant?: 'high' | 'medium' | 'low' | 'neutral' | 'ai';
  className?: string;
};

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider";
  
  const variants = {
    high: "bg-red-500/10 text-red-500 border border-red-500/20",
    medium: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    low: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    neutral: "bg-slate-700 text-slate-300 border border-slate-600",
    ai: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
