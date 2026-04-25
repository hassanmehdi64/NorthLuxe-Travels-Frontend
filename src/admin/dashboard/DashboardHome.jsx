import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  Volume2,
  BookOpen,
  Briefcase,
  CreditCard,
  FolderOpen,
  Image,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  useBookings,
  useAdminContentList,
  useDashboardOverview,
  useGallery,
  useNotifications,
  usePublicBlogs,
  usePublicTours,
  useUsers,
} from "../../hooks/useCms";

const isManualPaymentMethod = (value = "") => {
  const v = String(value).toLowerCase();
  return ["easypaisa", "jazzcash", "bank_transfer", "manual"].includes(v);
};

const formatNumber = (value) => {
  const num = Number(value || 0);
  return new Intl.NumberFormat("en-US").format(num);
};

const formatCurrency = (value) => {
  const num = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(num);
};
const isRecentlyReceived = (value) => {
  if (!value) return false;
  const at = new Date(value).getTime();
  if (Number.isNaN(at)) return false;
  return Date.now() - at <= 2 * 24 * 60 * 60 * 1000;
};


const playTestNotificationSound = async () => {
  if (typeof window === "undefined") return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  try {
    if (context.state === "suspended") {
      await context.resume();
    }
    const playTone = (frequency, startTime, duration, gainValue) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(frequency, startTime);
      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.exponentialRampToValueAtTime(gainValue, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration + 0.02);
    };

    const now = context.currentTime;
    playTone(880, now, 0.18, 0.18);
    playTone(1174, now + 0.2, 0.2, 0.16);
  } catch {
    // ignore audio errors
  }
};

const DashboardHome = () => {
  const { data: overview } = useDashboardOverview();
  const { data: bookings = [] } = useBookings();

  const { data: notifications = [] } = useNotifications();
  const { data: tours = [] } = usePublicTours();
  const { data: blogs = [] } = usePublicBlogs();
  const { data: gallery = [] } = useGallery();
  const { data: users = [] } = useUsers();
  const { data: activities = [] } = useAdminContentList("activity");
  const { data: services = [] } = useAdminContentList("service");

  const stats = overview?.stats || {};
  const unreadBookingCodes = new Set(
    notifications
      .filter((item) => !item?.isRead && String(item?.type || "") === "Bookings")
      .map((item) => `${item?.title || ""} ${item?.message || ""}`),
  );

  const latestBookings = [...(overview?.latestBookings || bookings)]
    .sort((a, b) => {
      const aRecent = isRecentlyReceived(a?.createdAt || a?.date);
      const bRecent = isRecentlyReceived(b?.createdAt || b?.date);
      if (aRecent !== bRecent) return Number(bRecent) - Number(aRecent);
      const aTime = new Date(a?.createdAt || a?.date || 0).getTime();
      const bTime = new Date(b?.createdAt || b?.date || 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 6);

  const unreadNotifications = notifications.filter((item) => !item.isRead).length;
  const customPlanRequests = bookings.filter((item) => item.bookingType === "custom" || item.isCustomTour).length;

  const pendingPaymentVerifications = bookings.filter((item) => {
    const status = String(item.status || "").toLowerCase();
    const paymentStatus = String(item.payment || "").toLowerCase();
    const method = item.paymentMethod || "";
    if (!isManualPaymentMethod(method)) return false;
    return (
      paymentStatus.includes("pending") ||
      paymentStatus.includes("unverified") ||
      status === "pending"
    );
  }).length;

  const cards = [
    {
      title: "Weekly Sales",
      value: formatNumber(stats.totalBookings ?? bookings.length),
      hint: "New bookings processed",
      icon: Briefcase,
      tone: "peach",
    },
    {
      title: "Weekly Orders",
      value: formatCurrency(stats.totalRevenue || 0),
      hint: "Confirmed collections",
      icon: CreditCard,
      tone: "sky",
    },
    {
      title: "Visitors Online",
      value: formatNumber(stats.totalUsers ?? users.length),
      hint: "Active customer touchpoints",
      icon: Users,
      tone: "mint",
    },
    {
      title: "Pending Payments",
      value: formatNumber(pendingPaymentVerifications),
      hint: "Need verification",
      icon: ShieldCheck,
      tone: "violet",
    },
  ];

  const quickLinks = [
    {
      title: "Review Payments",
      desc: "Check manual payment claims and booking proofs.",
      to: "/admin/bookings",
      icon: ShieldCheck,
    },
    {
      title: "Custom Booking Requests",
      desc: "Review tailored trip requests saved in booking management.",
      to: "/admin/bookings",
      icon: MessageSquare,
    },
    {
      title: "Notifications",
      desc: "Track fresh booking and system updates.",
      to: "/admin/notifications",
      icon: Bell,
    },
    {
      title: "Content Control",
      desc: `Tours ${tours.length} - Blogs ${blogs.length} - Media ${gallery.length}`,
      to: "/admin/tours",
      icon: FolderOpen,
    },
    {
      title: "Manage Activities",
      desc: `${activities.length} total entries. Add or update activity data.`,
      to: "/admin/activities",
      icon: Briefcase,
    },
    {
      title: "Manage Services",
      desc: `${services.length} total entries. Add or update service data.`,
      to: "/admin/services",
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="admin-soft-panel p-6 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="admin-soft-label text-[var(--admin-accent)]">Overview</p>
            <h1 className="admin-soft-heading mt-2 text-2xl md:text-3xl font-black tracking-tight">
              Dashboard Overview
            </h1>
            <p className="admin-soft-muted mt-2 max-w-2xl text-sm">
              A softer control center for bookings, payments, team activity, and content updates.
            </p>
          </div>
          <button
            type="button"
            onClick={playTestNotificationSound}
            className="admin-soft-button-ghost self-start"
          >
            <Volume2 size={15} />
            Test Sound
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="admin-soft-label">
            Live Snapshot
          </h2>
          <p className="admin-soft-muted mt-1 text-xs">
            Soft-glance metrics for operations, guests, and requests.
          </p>
        </div>
        <p className="admin-soft-muted hidden sm:block text-[11px] font-semibold">
          Updated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="admin-soft-kpi"
              data-tone={card.tone}
            >
              <div className="relative z-[1] flex items-center justify-between">
                <p className="text-sm font-bold tracking-wide text-white/88">{card.title}</p>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white">
                  <Icon size={16} />
                </span>
              </div>
              <p className="relative z-[1] mt-5 text-[2rem] font-black tracking-tight text-white">{card.value}</p>
              <p className="relative z-[1] mt-4 text-sm font-semibold text-white/85">{card.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="grid xl:grid-cols-3 gap-5">
        <div className="admin-soft-table xl:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/30 px-6 py-5">
            <div>
              <h2 className="admin-soft-heading text-lg font-bold">Recent Bookings</h2>
              <p className="admin-soft-muted text-xs">Latest customer transactions and status.</p>
            </div>
            <Link to="/admin/bookings" className="admin-soft-button-ghost px-4 py-2 text-xs">
              View All
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-white/25">
            {latestBookings.length ? (
              latestBookings.slice(0, 6).map((item) => {
                const isLatest = isRecentlyReceived(item?.createdAt || item?.date);
                return (
                <div key={item.id} className={`flex items-center justify-between gap-3 px-6 py-4 ${isLatest ? "bg-white/28" : ""}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="admin-soft-heading text-sm font-semibold">{item.user || item.customer || "Guest"}</p>
                      {isLatest ? <span className="admin-soft-badge admin-soft-badge-primary">New</span> : null}
                    </div>
                    <p className="admin-soft-muted text-xs">{item.tour || item.tourTitle || item.bookingCode || "Tour Booking"}</p>
                  </div>
                  <div className="text-right">
                    <p className="admin-soft-heading text-sm font-bold">${item.amount || 0}</p>
                    <p className="admin-soft-muted text-[10px] uppercase font-black tracking-[0.12em]">{item.status || "pending"}</p>
                  </div>
                </div>
              );})
            ) : (
              <p className="admin-soft-muted px-6 py-10 text-sm">No booking data available yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="admin-soft-panel p-5">
            <h3 className="admin-soft-heading text-sm font-bold">Quick Actions</h3>
            <div className="mt-3 space-y-2.5">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    to={item.to}
                    className="block rounded-[1.35rem] border border-white/35 bg-white/45 px-3 py-3 transition hover:-translate-y-0.5 hover:border-[rgba(155,108,255,0.28)] hover:bg-white/70"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(155,108,255,0.16),rgba(87,199,255,0.16))] text-[var(--admin-accent)]">
                        <Icon size={14} />
                      </span>
                      <div>
                        <p className="admin-soft-heading text-sm font-semibold">{item.title}</p>
                        <p className="admin-soft-muted mt-0.5 text-xs">{item.desc}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="admin-soft-panel p-5">
            <h3 className="admin-soft-heading text-sm font-bold">Content Snapshot</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-200">
              <p className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5"><Briefcase size={13} /> Tours</span><b>{tours.length}</b></p>
              <p className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5"><Briefcase size={13} /> Activities</span><b>{activities.length}</b></p>
              <p className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5"><BookOpen size={13} /> Services</span><b>{services.length}</b></p>
              <p className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5"><BookOpen size={13} /> Blogs</span><b>{blogs.length}</b></p>
              <p className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5"><Image size={13} /> Gallery Media</span><b>{gallery.length}</b></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;





