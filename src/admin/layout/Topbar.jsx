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
      className="admin-soft-topbar sticky top-0 z-30 flex h-20 items-center justify-between px-5 lg:px-8"
    >
      {/* --- LEFT SECTION: MOBILE MENU & SMART SEARCH --- */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={onMenuClick}
          className="admin-soft-icon-button md:hidden"
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar */}
        <div className="group hidden w-full max-w-xl items-center gap-3 rounded-[1.45rem] border border-white/35 bg-white/50 px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl md:flex">
          <Search
            size={18}
            className="text-[var(--admin-muted)] transition-colors group-focus-within:text-[var(--admin-accent)]"
          />
          <input
            type="text"
            placeholder="Search bookings, tours..."
            className="w-full border-none bg-transparent px-1 text-sm font-bold outline-none shadow-none ring-0"
          />
          {/* Keyboard Shortcut Hint */}
          <div className="hidden items-center gap-1 rounded-xl border border-white/45 bg-white/60 px-2.5 py-1 text-[10px] font-black text-[var(--admin-muted)] lg:flex">
            <Command size={10} /> K
          </div>
        </div>
      </div>

      {/* --- RIGHT SECTION: SYSTEM ALERTS & USER PROFILE --- */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleTheme}
          className="admin-soft-icon-button"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Activity Notifications */}
        {isAdmin ? (
          <button
            onClick={() => navigate("notifications")}
            className="admin-soft-icon-button group relative"
          >
            <Bell
              size={22}
              className={`group-hover:rotate-[15deg] transition-transform duration-300 ${unreadCount > 0 ? "animate-pulse" : ""}`}
            />
            {/* Unread Count Badge */}
            {unreadCount > 0 && (
              <span
                className={`absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full text-[10px] leading-5 font-black text-center transition-transform group-hover:scale-110 ${
                  isDark
                    ? "border border-slate-950 bg-[var(--admin-accent)] text-white"
                    : "border border-white bg-[var(--admin-accent)] text-white"
                }`}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        ) : null}

        {/* Divider Line */}
        <div className="mx-1 hidden h-10 w-px bg-white/35 sm:block"></div>

        {/* Profile Component (External logic for Logout/Profile) */}
        <div className="pl-1">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
