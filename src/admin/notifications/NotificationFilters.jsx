import React from "react";

const NotificationFilters = ({ activeFilter, setActiveFilter, counts }) => {
  const tabs = ["All", "Bookings", "System"];

  return (
    <div className="flex w-full flex-wrap items-center gap-2 rounded-[1.25rem] border border-white/35 bg-white/65 p-2 shadow-[0_10px_24px_rgba(148,163,184,0.06)]">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveFilter(tab)}
          className={`inline-flex items-center gap-2 rounded-[1rem] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] transition-all ${
            activeFilter === tab
              ? "border border-[rgba(var(--c-brand-rgb),0.16)] bg-white text-[var(--admin-text)] shadow-[0_8px_18px_rgba(15,23,42,0.05)]"
              : "border border-transparent text-[var(--admin-muted)] hover:bg-white/75 hover:text-[var(--admin-text)]"
          }`}
        >
          {tab}
          <span
            className={`inline-flex min-w-6 items-center justify-center rounded-full px-2 py-1 text-[9px] ${
              activeFilter === tab
                ? "bg-[rgba(var(--c-brand-rgb),0.08)] text-[var(--admin-accent)]"
                : "bg-slate-100 text-[var(--admin-muted)]"
            }`}
          >
            {counts[tab]}
          </span>
        </button>
      ))}
    </div>
  );
};

export default NotificationFilters;
