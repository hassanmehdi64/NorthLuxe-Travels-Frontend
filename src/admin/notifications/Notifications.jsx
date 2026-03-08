import React, { useState } from "react";
import {
  Bell,
  CheckCheck,
  Calendar,
  AlertTriangle,
  Inbox,
  Sparkles,
} from "lucide-react";
import NotificationItem from "./NotificationItem";
import NotificationFilters from "./NotificationFilters";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useNotifications,
  useUpdateNotification,
} from "../../hooks/useCms";

const isRecentlyReceived = (value) => {
  if (!value) return false;
  const at = new Date(value).getTime();
  if (Number.isNaN(at)) return false;
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
  return Date.now() - at <= threeDaysMs;
};

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const { data: notifications = [] } = useNotifications();
  const updateNotification = useUpdateNotification();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  // Logic Handlers
  const handleMarkAsRead = async (id) => {
    await updateNotification.mutateAsync({ id, isRead: true });
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  const handleDelete = (id) => {
    deleteNotification.mutate(id);
  };

  const filteredData = notifications
    .filter((n) => activeFilter === "All" || n.type === activeFilter)
    .sort((a, b) => {
      const unreadSort = Number(Boolean(a?.isRead)) - Number(Boolean(b?.isRead));
      if (unreadSort !== 0) return unreadSort;
      const aTime = new Date(a?.time || a?.createdAt || 0).getTime();
      const bTime = new Date(b?.time || b?.createdAt || 0).getTime();
      return bTime - aTime;
    });

  const unread = notifications.filter((n) => !n.isRead);
  const counts = {
    All: unread.length,
    Bookings: unread.filter((n) => n.type === "Bookings").length,
    System: unread.filter((n) => n.type === "System").length,
  };

  return (
    <div className="max-w-4xl space-y-10 py-6 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className=" text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase">
            Notifications
          </h1>
          <p className="text-sm font-bold text-slate-400">
            Manage your latest activity and system alerts.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 text-slate-900 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-slate-200/50 active:scale-95"
        >
          <CheckCheck size={16} /> Mark all read
        </button>
      </div>

      {/* Filter Component */}
      <NotificationFilters
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        counts={counts}
      />

      {/* List Container */}
      <div className="grid gap-5">
        {filteredData.length > 0 ? (
          filteredData.map((item) => {
            const typeStyles =
              item.type === "Bookings"
                ? { icon: <Calendar size={18} />, color: "text-blue-600", bgColor: "bg-blue-50" }
                : { icon: <Sparkles size={18} />, color: "text-purple-600", bgColor: "bg-purple-50" };
            return (
            <NotificationItem
              key={item.id}
              item={{
                ...item,
                ...typeStyles,
                time: new Date(item.time).toLocaleString(),
                isLatest: isRecentlyReceived(item.time || item.createdAt),
              }}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          );
        })
        ) : (
          <div className="py-24 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="inline-flex p-8 bg-white rounded-full text-slate-200 mb-6 shadow-sm">
              <Inbox size={48} strokeWidth={1} />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              Zero Notifications
            </h3>
            <p className="text-sm font-medium text-slate-400">
              Everything looks clear in {activeFilter}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
