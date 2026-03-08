import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, Menu, Command, Moon, Sun } from "lucide-react";
import ProfileDropdown from "../profile/ProfileDropdown";
import { useNotifications } from "../../hooks/useCms";
import { useAuth } from "../../context/useAuth";

/**
 * Topbar Component
 * Handles global search, mobile menu toggle, and quick notifications.
 */
const Topbar = ({ onMenuClick, theme, setTheme }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDark = theme === "dark";
  const isAdmin = user?.role === "Admin";
  const { data: notifications = [] } = useNotifications(isAdmin);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header
      className={`h-20 backdrop-blur-md border-b px-6 lg:px-10 flex justify-between items-center sticky top-0 z-30 transition-colors duration-300 ${
        isDark
          ? "bg-slate-950/95 border-slate-800"
          : "bg-white/95 border-slate-200"
      }`}
    >
      {/* --- LEFT SECTION: MOBILE MENU & SMART SEARCH --- */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={onMenuClick}
          className={`md:hidden p-3 rounded-2xl transition-all active:scale-90 ${
            isDark
              ? "hover:bg-white/10 text-white/80"
              : "hover:bg-slate-100 text-slate-800"
          }`}
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar */}
        <div
          className={`hidden md:flex items-center px-4 py-2.5 rounded-2xl border transition-all w-full max-w-md group ${
            isDark
              ? "bg-white/5 border-white/10 focus-within:border-accent/70 focus-within:bg-white/10"
              : "bg-white border-slate-200 focus-within:border-[var(--c-brand)] focus-within:bg-white focus-within:shadow-xl focus-within:shadow-slate-500/5"
          }`}
        >
          <Search
            size={18}
            className={`transition-colors ${
              isDark
                ? "text-white/60 group-focus-within:text-accent"
                : "text-slate-600 group-focus-within:text-slate-900"
            }`}
          />
          <input
            type="text"
            placeholder="Search bookings, tours..."
            className={`bg-transparent border-none outline-none px-3 text-sm font-bold w-full placeholder:font-medium ${
              isDark
                ? "text-white placeholder:text-white/45"
                : "text-slate-900 placeholder:text-slate-500"
            }`}
          />
          {/* Keyboard Shortcut Hint */}
          <div
            className={`hidden lg:flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${
              isDark
                ? "bg-white/5 border border-white/10 text-white/60"
                : "bg-white border border-slate-200 text-slate-700"
            }`}
          >
            <Command size={10} /> K
          </div>
        </div>
      </div>

      {/* --- RIGHT SECTION: SYSTEM ALERTS & USER PROFILE --- */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-2xl transition-all ${
            isDark
              ? "text-accent hover:bg-white/10"
              : "text-slate-800 hover:bg-slate-100 hover:text-slate-900"
          }`}
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Activity Notifications */}
        {isAdmin ? (
          <button
            onClick={() => navigate("notifications")}
            className={`relative p-3 rounded-2xl transition-all group ${
              isDark
                ? "text-white/70 hover:bg-white/10 hover:text-accent"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Bell
              size={22}
              className="group-hover:rotate-[15deg] transition-transform duration-300"
            />
            {/* Unread Count Badge */}
            {unreadCount > 0 && (
              <span
                className={`absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full text-[10px] leading-5 font-black text-center transition-transform group-hover:scale-110 ${
                  isDark
                    ? "bg-[var(--c-brand)] text-slate-900 border border-slate-950"
                    : "bg-[var(--c-brand)] text-slate-900 border border-white"
                }`}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        ) : null}

        {/* Divider Line */}
        <div
          className={`h-10 w-[1px] mx-1 hidden sm:block ${
            isDark ? "bg-white/10" : "bg-slate-200"
          }`}
        ></div>

        {/* Profile Component (External logic for Logout/Profile) */}
        <div className="pl-1">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
