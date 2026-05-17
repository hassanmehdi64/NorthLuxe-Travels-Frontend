import React, { useState } from "react";
import {
  CheckCheck,
  Calendar,
  Inbox,
  Sparkles,
  BellRing,
  ShieldCheck,
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
  const recent = notifications.filter((n) => isRecentlyReceived(n.time || n.createdAt));
  const counts = {
    All: unread.length,
    Bookings: unread.filter((n) => n.type === "Bookings").length,
    System: unread.filter((n) => n.type === "System").length,
  };

  return (
    <div className="space-y-6 py-2 animate-in fade-in duration-500">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="admin-soft-label">Notifications</p>
          <h1 className="admin-page-title mt-2 normal-case">
            Alerts & Activity
          </h1>
          <p className="admin-page-subtitle mt-2 max-w-2xl">
            Review live booking updates, system alerts, and recent admin activity from one clean inbox.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="admin-soft-button-ghost inline-flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.12em]"
        >
          <CheckCheck size={16} /> Mark all read
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="admin-soft-panel rounded-[1.35rem] p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[1rem] bg-[rgba(var(--c-brand-rgb),0.1)] text-[var(--admin-accent)]">
              <BellRing size={18} />
            </span>
            <div>
              <p className="admin-soft-label">Unread</p>
              <p className="mt-1 text-[1.2rem] font-black text-[var(--admin-text)]">{unread.length}</p>
            </div>
          </div>
        </div>
        <div className="admin-soft-panel rounded-[1.35rem] p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[1rem] bg-blue-50 text-blue-600">
              <Calendar size={18} />
            </span>
            <div>
              <p className="admin-soft-label">Booking Alerts</p>
              <p className="mt-1 text-[1.2rem] font-black text-[var(--admin-text)]">{counts.Bookings}</p>
            </div>
          </div>
        </div>
        <div className="admin-soft-panel rounded-[1.35rem] p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[1rem] bg-violet-50 text-violet-600">
              <ShieldCheck size={18} />
            </span>
            <div>
              <p className="admin-soft-label">Recent Updates</p>
              <p className="mt-1 text-[1.2rem] font-black text-[var(--admin-text)]">{recent.length}</p>
            </div>
          </div>
        </div>
      </div>

      <NotificationFilters
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        counts={counts}
      />

      <div className="grid gap-5">
        {filteredData.length > 0 ? (
          filteredData.map((item) => {
            const typeStyles =
              item.type === "Bookings"
                ? { icon: <Calendar size={18} />, color: "text-blue-600", bgColor: "bg-blue-50" }
                : { icon: <Sparkles size={18} />, color: "text-violet-600", bgColor: "bg-violet-50" };
            return (
              <NotificationItem
                key={item.id}
                item={{
                  ...item,
                  ...typeStyles,
                  time: new Date(item.time || item.createdAt || Date.now()).toLocaleString(),
                  isLatest: isRecentlyReceived(item.time || item.createdAt),
                }}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            );
          })
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/40 bg-white/45 py-20 text-center">
            <div className="mb-5 inline-flex rounded-full bg-white p-6 text-slate-200 shadow-sm">
              <Inbox size={48} strokeWidth={1} />
            </div>
            <h3 className="admin-section-title text-[1.02rem]">No Notifications</h3>
            <p className="admin-soft-muted text-sm">
              Everything looks clear in {activeFilter}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
