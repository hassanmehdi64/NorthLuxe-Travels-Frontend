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
    currency: "USD",
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
      title: "Total Bookings",
      value: formatNumber(stats.totalBookings ?? bookings.length),
      hint: "All recorded bookings",
      icon: Briefcase,
      tone: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Revenue",
      value: formatCurrency(stats.totalRevenue || 0),
      hint: "Confirmed collections",
      icon: CreditCard,
      tone: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Custom Requests",
      value: formatNumber(customPlanRequests),
      hint: "From custom booking form",
      icon: MessageSquare,
      tone: "text-violet-600 bg-violet-50 border-violet-100",
    },
    {
      title: "Pending Payments",
      value: formatNumber(pendingPaymentVerifications),
      hint: "Need verification",
      icon: ShieldCheck,
      tone: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Unread Alerts",
      value: formatNumber(unreadNotifications),
      hint: "Awaiting review",
      icon: Bell,
      tone: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      title: "Active Users",
      value: formatNumber(stats.totalUsers ?? users.length),
      hint: "Accessible accounts",
      icon: Users,
      tone: "text-cyan-600 bg-cyan-50 border-cyan-100",
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
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-7 shadow-sm dark:bg-slate-900 dark:border-slate-700">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Admin Console</p>
            <h1 className="mt-2 text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Dashboard Overview
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              Monitor bookings, payments, requests, and content from one place.
            </p>
          </div>
          <button
            type="button"
            onClick={playTestNotificationSound}
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-[var(--c-brand)]/25 bg-[var(--c-brand)]/10 px-4 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-slate-900 transition hover:bg-[var(--c-brand)]/18"
          >
            <Volume2 size={15} />
            Test Sound
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
            Live Snapshot
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
            Quick health metrics for operations, users, and requests.
          </p>
        </div>
        <p className="hidden sm:block text-[11px] font-semibold text-slate-400 dark:text-slate-300">
          Updated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">{card.title}</p>
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border ${card.tone}`}>
                  <Icon size={16} />
                </span>
              </div>
              <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">{card.value}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{card.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="grid xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-700">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between dark:border-slate-700">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Bookings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-300">Latest customer transactions and status.</p>
            </div>
            <Link to="/admin/bookings" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
              View All
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {latestBookings.length ? (
              latestBookings.slice(0, 6).map((item) => {
                const isLatest = isRecentlyReceived(item?.createdAt || item?.date);
                return (
                <div key={item.id} className={`px-5 py-3.5 flex items-center justify-between gap-3 ${isLatest ? "bg-[var(--c-brand)]/6" : ""}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.user || item.customer || "Guest"}</p>
                      {isLatest ? <span className="rounded-full bg-[var(--c-brand)]/14 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[var(--c-brand)]">New</span> : null}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-300">{item.tour || item.tourTitle || item.bookingCode || "Tour Booking"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">${item.amount || 0}</p>
                    <p className="text-[10px] uppercase font-black tracking-[0.12em] text-slate-400 dark:text-slate-300">{item.status || "pending"}</p>
                  </div>
                </div>
              );})
            ) : (
              <p className="px-5 py-10 text-sm text-slate-500 dark:text-slate-300">No booking data available yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Quick Actions</h3>
            <div className="mt-3 space-y-2.5">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    to={item.to}
                    className="block rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 hover:border-blue-300 hover:bg-blue-50/40 transition dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                        <Icon size={14} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 dark:text-slate-300">{item.desc}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Content Snapshot</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
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





