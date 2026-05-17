import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Check,
  ArrowRight,
  MoreVertical,
  BellOff,
} from "lucide-react";

const NotificationItem = ({ item, onMarkAsRead, onDelete }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Dynamic Navigation based on type
  const handleViewDetails = async () => {
    const text = `${item?.title || ""} ${item?.message || ""}`.toLowerCase();
    const routes = {
      Bookings: `/admin/bookings`,
      User: `/admin/users`,
    };

    let target = routes[item.type] || "/admin";
    if (item.type === "System") {
      if (text.includes("contact") || text.includes("inquiry")) target = "/admin/contacts";
      else target = "/admin/settings";
    }

    if (!item.isRead) {
      try {
        await onMarkAsRead(item.id);
      } catch {
        // Allow navigation even if mark-read fails.
      }
    }

    navigate(target);
  };

  return (
    <div
      className={`group relative rounded-[1.5rem] border p-4 transition-all duration-300 ${
        !item.isRead
          ? "border-[rgba(var(--c-brand-rgb),0.16)] bg-white shadow-[0_12px_28px_rgba(148,163,184,0.08)]"
          : item.isLatest
            ? "border-blue-100 bg-blue-50/45 shadow-[0_10px_24px_rgba(148,163,184,0.06)]"
            : "border-white/35 bg-white/68 shadow-[0_10px_24px_rgba(148,163,184,0.05)]"
      }`}
    >
      {!item.isRead && (
        <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-[var(--admin-accent)]" />
      )}

      <div className="flex items-start gap-4">
        <div
          className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] ${item.bgColor} ${item.color} transition-transform group-hover:scale-[1.03]`}
        >
          {item.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-[rgba(var(--c-brand-rgb),0.08)] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[var(--admin-accent)]">
                  {item.type}
                </span>
                {item.isLatest ? (
                  <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-blue-600">
                    New
                  </span>
                ) : null}
              </div>
              <h4
                className={`text-[15px] font-black tracking-tight ${item.isRead ? "text-slate-600" : "text-[var(--admin-text)]"}`}
              >
                {item.title}
              </h4>
            </div>
            <span className="shrink-0 text-[11px] font-semibold text-[var(--admin-muted)]">
              {item.time}
            </span>
          </div>

          <p className="mb-4 text-[13.5px] leading-6 text-[var(--admin-muted)]">
            {item.message}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleViewDetails}
              className="admin-soft-button inline-flex min-h-10 items-center gap-2 px-4 text-[10px] font-black uppercase tracking-[0.12em]"
            >
              View Details <ArrowRight size={12} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`admin-soft-icon-button h-10 w-10 ${showMenu ? "bg-slate-100 text-[var(--admin-text)]" : ""}`}
              >
                <MoreVertical size={16} />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute left-0 z-20 mt-2 w-48 rounded-[1.25rem] border border-white/35 bg-white/92 py-2 shadow-[0_24px_50px_rgba(148,163,184,0.18)] backdrop-blur-xl animate-in fade-in zoom-in duration-200 origin-top-left">
                    {!item.isRead && (
                      <button
                        onClick={() => {
                          onMarkAsRead(item.id);
                          setShowMenu(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Check size={14} /> Mark Read
                      </button>
                    )}
                    <button className="flex w-full items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600 transition-colors hover:bg-slate-50">
                      <BellOff size={14} /> Mute
                    </button>
                    <button
                      onClick={() => {
                        onDelete(item.id);
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-3 border-t border-slate-50 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-rose-500 transition-colors hover:bg-rose-50"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
