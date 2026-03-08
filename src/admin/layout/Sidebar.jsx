import React from "react";
import { NavLink } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { adminNavItems } from "./navConfig";
import { useAuth } from "../../context/useAuth";
import {
  useAdminBlogs,
  useAdminContentList,
  useAdminTestimonials,
  useAdminTours,
  useNotifications,
} from "../../hooks/useCms";

const Sidebar = ({ isSidebarOpen, setSidebarOpen, theme }) => {
  const { user, logout } = useAuth();
  const isDark = theme === "dark";
  const role = user?.role;
  const isAdmin = role === "Admin";

  const { data: notifications = [] } = useNotifications(isAdmin);
  const { data: tours = [] } = useAdminTours();
  const { data: blogs = [] } = useAdminBlogs();
  const { data: contentItems = [] } = useAdminContentList();
  const { data: testimonials = [] } = useAdminTestimonials();

  const unreadNotifications = notifications.filter((n) => !n?.isRead);
  const unreadBookingAlerts = unreadNotifications.filter(
    (n) => String(n?.type || "") === "Bookings",
  ).length;
  const unreadContactAlerts = unreadNotifications.filter((n) => {
    const text = `${n?.title || ""} ${n?.message || ""}`.toLowerCase();
    return String(n?.type || "") === "System" && (text.includes("contact") || text.includes("inquiry"));
  }).length;

  const badgeCounts = {
    overview:
      unreadBookingAlerts +
      unreadContactAlerts +
      unreadNotifications.length +
      tours.filter((t) => String(t?.status || "").toLowerCase() !== "published").length +
      blogs.filter((b) => String(b?.status || "").toLowerCase() !== "published").length +
      contentItems.filter((i) => String(i?.status || "").toLowerCase() !== "published").length +
      testimonials.filter((t) => String(t?.status || "").toLowerCase() !== "published").length,
    bookings: unreadBookingAlerts,
    tours: tours.length,
    activities: contentItems.filter((i) => String(i?.type || "").toLowerCase() === "activity").length,
    services: contentItems.filter((i) => String(i?.type || "").toLowerCase() === "service").length,
    blogs: blogs.length,
    content: contentItems.length,
    testimonials: testimonials.length,
    contacts: unreadContactAlerts,
    notifications: unreadNotifications.length,
  };

  const visibleNavItems = adminNavItems.filter(
    (item) => !item.roles?.length || item.roles.includes(role),
  );

  const mobileVisibility = isSidebarOpen
    ? "translate-x-0"
    : "-translate-x-full md:translate-x-0";

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:static md:inset-0 md:shrink-0
        ${isDark ? "bg-slate-950 border-r border-slate-800 text-white" : "bg-white border-r border-slate-200 text-slate-900"}
        ${mobileVisibility}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo Area */}
        <div
          className={`h-20 flex items-center justify-between px-8 border-b ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <span className="text-xl font-black tracking-tighter italic">
            NORTH<span className={isDark ? "text-accent" : "text-[var(--c-brand)]"}>LUXE</span>
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`md:hidden p-2 ${isDark ? "text-white/80" : "text-slate-500"}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) => `
                flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 mb-1
                ${
                  isActive
                    ? isDark
                      ? "bg-white/12 text-white border border-white/20"
                      : "bg-[var(--c-brand)]/16 text-slate-900 border border-[var(--c-brand)]/35"
                    : isDark
                      ? "text-white/85 border border-transparent hover:text-white"
                      : "text-slate-700 border border-transparent hover:text-slate-900"
                }
              `}
            >
              <span className="inline-flex items-center gap-3 min-w-0">
                <item.icon size={20} />
                <span className="truncate">{item.label}</span>
              </span>
              {badgeCounts[item.id] > 0 ? (
                <span
                  className={`inline-flex min-w-5 h-5 px-1.5 items-center justify-center rounded-full text-[10px] leading-5 font-black ${
                    isDark
                      ? "bg-[var(--c-brand)] text-slate-900"
                      : "bg-[var(--c-brand)] text-slate-900"
                  }`}
                >
                  {badgeCounts[item.id] > 99 ? "99+" : badgeCounts[item.id]}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Profile/Logout */}
        <div className={`p-4 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}>
          <button
            onClick={logout}
            className={`flex items-center gap-3 w-full px-4 py-3 font-bold text-sm rounded-xl transition-colors ${
              isDark
                ? "text-white hover:bg-white/10"
                : "text-rose-600 hover:bg-rose-50"
            }`}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
