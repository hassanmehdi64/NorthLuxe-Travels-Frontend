import React from "react";

const NotificationFilters = ({ activeFilter, setActiveFilter, counts }) => {
  const tabs = ["All", "Bookings", "System"];

  return (
    <div className="flex items-center gap-2 bg-slate-100/40 p-1.5 rounded-[1.8rem] w-fit border border-slate-100/50">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveFilter(tab)}
          className={`px-7 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${
            activeFilter === tab
              ? "bg-white text-slate-900 shadow-sm border border-slate-100"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {tab}
          <span
            className={`ml-2 px-2 py-0.5 rounded-md text-[9px] ${activeFilter === tab ? "bg-slate-100 text-slate-900" : "bg-slate-200/50 text-slate-400"}`}
          >
            {counts[tab]}
          </span>
        </button>
      ))}
    </div>
  );
};

export default NotificationFilters;
