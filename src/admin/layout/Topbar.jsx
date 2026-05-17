import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, Command, Moon, PanelLeftClose, PanelLeftOpen, Sun } from "lucide-react";
import ProfileDropdown from "../profile/ProfileDropdown";
import { useAdminBlogs, useBookings, useContacts, useGallery, useNotifications, useUsers } from "../../hooks/useCms";
import { useAuth } from "../../context/useAuth";

/**
 * Topbar Component
 * Handles global search, mobile menu toggle, and quick notifications.
 */
const Topbar = ({
  onSidebarControlClick,
  isSidebarCollapsed,
  isSidebarOpen,
  isDesktopSidebar,
  theme,
  setTheme,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const searchRef = useRef(null);
  const isDark = theme === "dark";
  const isAdmin = user?.role === "Admin";
  const { data: notifications = [] } = useNotifications(isAdmin);
  const { data: bookings = [] } = useBookings(isAdmin);
  const { data: blogs = [] } = useAdminBlogs();
  const { data: galleryItems = [] } = useGallery();
  const { data: users = [] } = useUsers(isAdmin);
  const { data: contacts = [] } = useContacts(isAdmin);
  const [globalQuery, setGlobalQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const sidebarControlLabel = isDesktopSidebar
    ? (isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar")
    : (isSidebarOpen ? "Close sidebar" : "Open sidebar");

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const globalResults = useMemo(() => {
    const query = globalQuery.trim().toLowerCase();
    if (!query) return [];

    const results = [];

    bookings.forEach((item) => {
      const haystack = [item.customer, item.bookingCode, item.tour, item.email, item.phone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (haystack.includes(query)) {
        results.push({
          id: `booking-${item.id}`,
          title: item.customer || item.bookingCode || "Booking",
          subtitle: item.tour || item.bookingCode || "Booking result",
          route: `/admin/bookings?search=${encodeURIComponent(globalQuery.trim())}`,
          type: "Booking",
        });
      }
    });

    blogs.forEach((item) => {
      const haystack = [item.title, item.slug, item.author, item.status].filter(Boolean).join(" ").toLowerCase();
      if (haystack.includes(query)) {
        results.push({
          id: `blog-${item.id}`,
          title: item.title || "Blog",
          subtitle: item.author || item.status || "Blog post",
          route: `/admin/blogs?search=${encodeURIComponent(globalQuery.trim())}`,
          type: "Blog",
        });
      }
    });

    galleryItems.forEach((item) => {
      const haystack = [item.title, item.category, item.alt, item.status].filter(Boolean).join(" ").toLowerCase();
      if (haystack.includes(query)) {
        results.push({
          id: `gallery-${item.id}`,
          title: item.title || "Gallery item",
          subtitle: item.category || item.status || "Gallery",
          route: `/admin/gallery?search=${encodeURIComponent(globalQuery.trim())}`,
          type: "Gallery",
        });
      }
    });

    users.forEach((item) => {
      const haystack = [item.name, item.email, item.role, item.status].filter(Boolean).join(" ").toLowerCase();
      if (haystack.includes(query)) {
        results.push({
          id: `user-${item.id}`,
          title: item.name || "Team member",
          subtitle: item.email || item.role || "User",
          route: `/admin/users?search=${encodeURIComponent(globalQuery.trim())}`,
          type: "User",
        });
      }
    });

    contacts.forEach((item) => {
      const haystack = [item.sender, item.subject, item.email, item.message].filter(Boolean).join(" ").toLowerCase();
      if (haystack.includes(query)) {
        results.push({
          id: `contact-${item.id}`,
          title: item.sender || "Inquiry",
          subtitle: item.subject || item.email || "Inquiry",
          route: `/admin/contacts?search=${encodeURIComponent(globalQuery.trim())}`,
          type: "Inquiry",
        });
      }
    });

    return results.slice(0, 8);
  }, [blogs, bookings, contacts, galleryItems, globalQuery, users]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openResult = (route) => {
    navigate(route);
    setIsSearchOpen(false);
  };

  const handleSearchSubmit = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const query = globalQuery.trim();
    if (!query) return;
    if (globalResults[0]?.route) {
      openResult(globalResults[0].route);
      return;
    }
    navigate(`/admin/bookings?search=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
  };

  return (
    <header
      className="admin-soft-topbar sticky top-0 z-30 flex min-h-18 items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-7"
    >
      {/* --- LEFT SECTION: MOBILE MENU & SMART SEARCH --- */}
      <div className="flex flex-1 items-center gap-3 sm:gap-4">
        <button
          onClick={onSidebarControlClick}
          className="admin-soft-icon-button h-10 w-10 sm:h-11 sm:w-11"
          aria-label={sidebarControlLabel}
          title={sidebarControlLabel}
        >
          {isDesktopSidebar
            ? (isSidebarCollapsed ? <PanelLeftOpen size={18} className="sm:h-[1.15rem] sm:w-[1.15rem]" /> : <PanelLeftClose size={18} className="sm:h-[1.15rem] sm:w-[1.15rem]" />)
            : (isSidebarOpen ? <PanelLeftClose size={18} className="sm:h-[1.15rem] sm:w-[1.15rem]" /> : <PanelLeftOpen size={18} className="sm:h-[1.15rem] sm:w-[1.15rem]" />)}
        </button>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative hidden w-full max-w-xl sm:block">
          <div className="group flex w-full items-center gap-3 rounded-[1.2rem] border border-white/35 bg-white/70 px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl">
          <Search
            size={18}
            className="text-[var(--admin-muted)] transition-colors group-focus-within:text-[var(--admin-accent)]"
          />
          <input
            type="text"
            value={globalQuery}
            onChange={(event) => {
              setGlobalQuery(event.target.value);
              setIsSearchOpen(Boolean(event.target.value.trim()));
            }}
            onFocus={() => setIsSearchOpen(Boolean(globalQuery.trim()))}
            onKeyDown={handleSearchSubmit}
            placeholder="Search bookings, blogs, users, gallery..."
            className="w-full border-none bg-transparent px-1 text-sm font-bold outline-none shadow-none ring-0"
          />
          {/* Keyboard Shortcut Hint */}
          <div className="hidden items-center gap-1 rounded-xl border border-white/45 bg-white/60 px-2.5 py-1 text-[10px] font-black text-[var(--admin-muted)] lg:flex">
            <Command size={10} /> K
          </div>
        </div>
          {isSearchOpen ? (
            <div className="admin-soft-panel absolute left-0 right-0 top-[calc(100%+0.7rem)] z-40 overflow-hidden rounded-[1.4rem] border border-white/40 p-2">
              {globalResults.length ? (
                globalResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openResult(item.route)}
                    className="flex w-full items-start justify-between gap-3 rounded-[1rem] px-3 py-3 text-left transition hover:bg-white/70"
                  >
                    <div>
                      <p className="text-sm font-black text-[var(--admin-text)]">{item.title}</p>
                      <p className="mt-1 text-xs text-[var(--admin-muted)]">{item.subtitle}</p>
                    </div>
                    <span className="rounded-full bg-[rgba(var(--c-brand-rgb),0.1)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--admin-accent)]">
                      {item.type}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4">
                  <p className="text-sm font-black text-[var(--admin-text)]">No matching admin results</p>
                  <p className="mt-1 text-xs text-[var(--admin-muted)]">Press Enter to search bookings for this query.</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* --- RIGHT SECTION: SYSTEM ALERTS & USER PROFILE --- */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          className="admin-soft-icon-button hidden lg:inline-flex"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Activity Notifications */}
        {isAdmin ? (
          <button
            onClick={() => navigate("notifications")}
            className="admin-soft-icon-button group relative hidden lg:inline-flex"
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
        <div className="mx-1 hidden h-10 w-px bg-white/35 lg:block"></div>

        {/* Profile Component (External logic for Logout/Profile) */}
        <div className="pl-0 lg:pl-1">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
