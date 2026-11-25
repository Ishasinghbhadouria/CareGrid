import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, accentColor, onClick }) {
  const colorMap = {
    teal: {
      iconBg: 'bg-teal-600 text-white shadow-teal-600/20',
      dot: 'bg-teal-500',
      link: 'text-teal-700',
    },
    blue: {
      iconBg: 'bg-sky-600 text-white shadow-sky-600/20',
      dot: 'bg-sky-500',
      link: 'text-sky-700',
    },
    cyan: {
      iconBg: 'bg-cyan-600 text-white shadow-cyan-600/20',
      dot: 'bg-cyan-500',
      link: 'text-cyan-700',
    },
    emerald: {
      iconBg: 'bg-emerald-600 text-white shadow-emerald-600/20',
      dot: 'bg-emerald-500',
      link: 'text-emerald-700',
    },
    rose: {
      iconBg: 'bg-rose-600 text-white shadow-rose-600/20',
      dot: 'bg-rose-500',
      link: 'text-rose-700',
    },
  };

  const style = colorMap[accentColor] || colorMap.teal;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left clinical-card rounded-2xl p-5 hover:border-teal-300/70 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
    >
      <div className="flex items-start justify-between gap-3 w-full">
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            {title}
          </p>
          <p className="font-display text-2xl sm:text-[1.75rem] font-extrabold text-slate-900 tracking-tight tabular-nums leading-none">
            {value}
          </p>
        </div>
        <div className={`p-2.5 rounded-xl ${style.iconBg} shadow-md shrink-0 transition-transform group-hover:scale-105`}>
          <Icon className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between w-full gap-2">
        <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5 truncate">
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />
          <span className="truncate">{subtitle}</span>
        </span>
        <span className={`text-xs font-bold ${style.link} inline-flex items-center gap-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform`}>
          Open
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );
}
