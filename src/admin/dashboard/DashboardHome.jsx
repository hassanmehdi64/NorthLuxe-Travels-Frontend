import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
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
  useContacts,
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

const DashboardHome = () => {
  const { data: overview } = useDashboardOverview();
  const { data: bookings = [] } = useBookings();
  const { data: contacts = [] } = useContacts();
  const { data: notifications = [] } = useNotifications();
  const { data: tours = [] } = usePublicTours();
  const { data: blogs = [] } = usePublicBlogs();
  const { data: gallery = [] } = useGallery();
  const { data: users = [] } = useUsers();
  const { data: activities = [] } = useAdminContentList("activity");
  const { data: services = [] } = useAdminContentList("service");

  const stats = overview?.stats || {};
  const latestBookings = overview?.latestBookings || bookings.slice(0, 6);

  const unreadNotifications = notifications.filter((item) => !item.isRead).length;
  const customPlanRequests = contacts.filter((item) =>
    String(item.subject || "").toLowerCase().includes("custom tour plan request") ||
    String(item.subject || "").toLowerCase().includes("custom plan"),
  ).length;

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
      hint: "From contact forms",
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
      title: "Custom Plan Inquiries",
      desc: "Handle tailored trip requests from contact forms.",
      to: "/admin/contacts",
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
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Admin Console</p>
        <h1 className="mt-2 text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          Monitor bookings, payments, requests, and content from one place.
        </p>
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
              latestBookings.slice(0, 6).map((item) => (
                <div key={item.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.user || item.customer || "Guest"}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">{item.tour || item.tourTitle || item.bookingCode || "Tour Booking"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">${item.amount || 0}</p>
                    <p className="text-[10px] uppercase font-black tracking-[0.12em] text-slate-400 dark:text-slate-300">{item.status || "pending"}</p>
                  </div>
                </div>
              ))
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
