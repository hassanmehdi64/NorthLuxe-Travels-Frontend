import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Check,
  ArrowRight,
  MoreVertical,
  BellOff,
  Flag,
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
      className={`group relative flex items-start gap-4 p-5 rounded-[2.5rem] border transition-all duration-500 ${
        item.isLatest
          ? "bg-blue-50/65 border-blue-200 shadow-sm shadow-blue-100/60"
          : item.isRead
            ? "bg-slate-50/40 border-slate-100 opacity-75"
            : "bg-white border-blue-100 shadow-sm shadow-blue-100/50 hover:shadow-xl hover:shadow-blue-200/20"
      }`}
    >
      {/* Unread Indicator */}
      {!item.isRead && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
      )}

      {/* Type Icon */}
      <div
        className={`shrink-0 p-4 rounded-2xl ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform`}
      >
        {item.icon}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4
            className={`text-sm font-black uppercase tracking-tight ${item.isRead ? "text-slate-500" : "text-slate-900"}`}
          >
            {item.title}
          </h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap">
            {item.time}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {item.message}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleViewDetails}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center gap-2 active:scale-95"
          >
            View Details <ArrowRight size={12} />
          </button>

          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2.5 rounded-xl transition-all ${showMenu ? "bg-slate-100 text-slate-900" : "text-slate-300 hover:text-slate-900 hover:bg-slate-50"}`}
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in duration-200 origin-top-left">
                  {!item.isRead && (
                    <button
                      onClick={() => {
                        onMarkAsRead(item.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Check size={14} /> Mark Read
                    </button>
                  )}
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-colors">
                    <BellOff size={14} /> Mute
                  </button>
                  <button
                    onClick={() => {
                      onDelete(item.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50 transition-colors border-t border-slate-50"
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
  );
};

export default NotificationItem;
