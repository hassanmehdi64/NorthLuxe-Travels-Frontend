import React, { useMemo } from "react";
import { AlertCircle, BellRing, Briefcase, CheckCircle2, Clock3, MessageSquare, ShieldCheck } from "lucide-react";
import { useBookings, useContacts, useNotifications } from "../../hooks/useCms";
import { useAuth } from "../../context/useAuth";

const formatTime = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  const diff = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
};

const ActivityLog = () => {
  const { user } = useAuth();
  const { data: notifications = [] } = useNotifications();
  const { data: bookings = [] } = useBookings(user?.role === "Admin");
  const { data: contacts = [] } = useContacts(user?.role === "Admin");

  const activityItems = useMemo(() => {
    const items = [];

    if (user?.lastLoginAt) {
      items.push({
        id: `login-${user.id || "current"}`,
        title: "Successful admin sign in",
        detail: `${user.name || "You"} accessed the admin dashboard.`,
        time: user.lastLoginAt,
        tone: "success",
        icon: ShieldCheck,
      });
    }

    notifications.slice(0, 6).forEach((item) => {
      items.push({
        id: `notification-${item.id}`,
        title: item.title || "System notification",
        detail: item.message || "A new admin update was recorded.",
        time: item.time || item.createdAt,
        tone: item.isRead ? "info" : "alert",
        icon: BellRing,
      });
    });

    bookings.slice(0, 5).forEach((booking) => {
      items.push({
        id: `booking-${booking.id}`,
        title: `Booking ${booking.bookingCode || booking.id || ""}`.trim(),
        detail: `${booking.customer || booking.user || "Guest"} booked ${booking.tour || booking.tourTitle || "a tour"}.`,
        time: booking.createdAt || booking.date,
        tone: String(booking.status || "").toLowerCase() === "confirmed" ? "success" : "info",
        icon: Briefcase,
      });
    });

    contacts.slice(0, 4).forEach((contact) => {
      items.push({
        id: `contact-${contact.id}`,
        title: `Inquiry from ${contact.sender || "Guest"}`,
        detail: contact.subject || "New contact message received.",
        time: contact.createdAt || contact.date,
        tone: String(contact.status || "").toLowerCase() === "read" ? "info" : "alert",
        icon: MessageSquare,
      });
    });

    return items
      .filter((item) => item.time)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 12);
  }, [bookings, contacts, notifications, user]);

  const toneStyles = {
    success: {
      card: "border-emerald-100 bg-emerald-50/45",
      icon: "bg-emerald-50 text-emerald-600",
      badge: <CheckCircle2 size={16} className="text-emerald-500" />,
    },
    alert: {
      card: "border-amber-100 bg-amber-50/40",
      icon: "bg-amber-50 text-amber-600",
      badge: <AlertCircle size={16} className="text-amber-500" />,
    },
    info: {
      card: "border-slate-100 bg-white",
      icon: "bg-slate-50 text-slate-500",
      badge: <Clock3 size={16} className="text-slate-300" />,
    },
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div>
        <h1 className="admin-page-title normal-case">Activity Log</h1>
        <p className="admin-page-subtitle mt-1">
          Recent account activity, booking events, inquiry updates, and notification history.
        </p>
      </div>

      {activityItems.length ? (
        activityItems.map((log) => {
          const Icon = log.icon;
          const style = toneStyles[log.tone] || toneStyles.info;
          return (
            <div
              key={log.id}
              className={`admin-soft-panel flex items-center justify-between gap-4 p-5 transition-all hover:-translate-y-0.5 ${style.card}`}
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-2xl p-3 ${style.icon}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{log.title}</p>
                  <p className="mt-1 text-[13px] text-slate-500">{log.detail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                    {formatTime(log.time)}
                  </p>
                </div>
                {style.badge}
              </div>
            </div>
          );
        })
      ) : (
        <div className="admin-soft-panel rounded-[1.6rem] border border-dashed border-slate-200 px-6 py-10 text-center">
          <p className="text-sm font-black text-slate-700">No recent activity found.</p>
          <p className="mt-2 text-sm text-slate-500">New admin events will appear here automatically.</p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
