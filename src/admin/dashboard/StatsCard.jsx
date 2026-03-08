import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatsCard = ({ title, value, icon, color, bgColor, change, trend }) => {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
      {/* Background Decorative Element */}
      <div
        className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 transition-transform group-hover:scale-150 duration-700 ${bgColor}`}
      />

      <div className="flex justify-between items-start mb-4 relative z-10">
        {/* Soft Tinted Icon Container */}
        <div
          className={`p-4 rounded-2xl ${bgColor} ${color} transition-all duration-300 group-hover:shadow-lg group-hover:shadow-current/10`}
        >
          {React.cloneElement(icon, { size: 22 })}
        </div>

        {/* Growth/Trend Badge */}
        {change && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black tracking-tighter shadow-sm border ${
              trend === "up"
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-rose-50 text-rose-600 border-rose-100"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.15em] mb-1">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {value}
          </h3>
          <span className="text-[10px] font-bold text-slate-300">
            this month
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
