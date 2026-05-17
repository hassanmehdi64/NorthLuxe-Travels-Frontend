import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { adminNavItems } from "./navConfig";
import { useAuth } from "../../context/useAuth";
import { useNotifications } from "../../hooks/useCms";
import { getUserAvatar } from "../utils/userAvatar";

const playAdminNotificationSound = async ({
  audioContextRef,
  audioUnlockedRef,
  force = false,
} = {}) => {
  if (typeof window === "undefined") return false;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;

  if (!audioContextRef.current) {
    audioContextRef.current = new AudioContextClass();
  }

  const context = audioContextRef.current;
  if (!context) return false;

  try {
    if (context.state === "suspended") {
      await context.resume();
    }

    if (audioUnlockedRef) {
      audioUnlockedRef.current = true;
    }

    if (!force && audioUnlockedRef && !audioUnlockedRef.current) {
      return false;
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
      oscillator.stop(startTime + duration + 0.03);
    };

    const now = context.currentTime;
    playTone(880, now, 0.2, 0.18);
    playTone(1174, now + 0.22, 0.22, 0.16);
    return true;
  } catch {
    return false;
  }
};

const Sidebar = ({
  isSidebarOpen,
  setSidebarOpen,
  isSidebarCollapsed,
  setSidebarCollapsed,
  theme,
}) => {
  const { user, logout } = useAuth();
  const isDark = theme === "dark";
  const role = user?.role;
  const isAdmin = role === "Admin";

  const { data: notifications = [] } = useNotifications(isAdmin);

  const previousUnreadRef = useRef(null);
  const previousNotificationIdsRef = useRef(new Set());
  const audioContextRef = useRef(null);
  const audioUnlockedRef = useRef(false);

  useEffect(() => {
    if (!isAdmin || typeof window === "undefined") return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return undefined;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    const unlockAudio = async () => {
      const context = audioContextRef.current;
      if (!context) return;
      try {
        if (context.state === "suspended") {
          await context.resume();
        }
        if ("Notification" in window && Notification.permission === "default") {
          void Notification.requestPermission();
        }
        audioUnlockedRef.current = true;
      } catch {
        // ignore unlock issues
      }
    };

    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin || typeof window === "undefined") return;

    const unreadItems = notifications.filter((n) => !n?.isRead);
    const currentUnreadCount = unreadItems.length;
    const currentIds = new Set(
      unreadItems.map((item) => String(item?.id || "")),
    );

    if (previousUnreadRef.current === null) {
      previousUnreadRef.current = currentUnreadCount;
      previousNotificationIdsRef.current = currentIds;
      return;
    }

    const newItems = unreadItems.filter(
      (item) => !previousNotificationIdsRef.current.has(String(item?.id || "")),
    );

    if (newItems.length) {
      if (audioUnlockedRef.current) {
        void playAdminNotificationSound({ audioContextRef, audioUnlockedRef });
      }

      if ("Notification" in window && Notification.permission === "granted") {
        newItems.slice(0, 2).forEach((item) => {
          try {
            const notification = new Notification(
              item?.title || "New admin update",
              {
                body: item?.message || "A new update has arrived.",
                tag: `northluxe-${item?.id || Date.now()}`,
                renotify: true,
              },
            );
            notification.onclick = () => {
              window.focus();
              notification.close();
            };
          } catch {
            // ignore browser notification errors
          }
        });
      }
    }

    previousUnreadRef.current = currentUnreadCount;
    previousNotificationIdsRef.current = currentIds;
  }, [notifications, isAdmin]);

  const unreadNotifications = notifications.filter((n) => !n?.isRead);
  const unreadBookingAlerts = unreadNotifications.filter(
    (n) => String(n?.type || "") === "Bookings",
  ).length;
  const unreadContactAlerts = unreadNotifications.filter((n) => {
    const text = `${n?.title || ""} ${n?.message || ""}`.toLowerCase();
    return (
      String(n?.type || "") === "System" &&
      (text.includes("contact") || text.includes("inquiry"))
    );
  }).length;

  const badgeCounts = {
    overview: unreadNotifications.length,
    bookings: unreadBookingAlerts,
    contacts: unreadContactAlerts,
  };

  const visibleNavItems = adminNavItems.filter(
    (item) => !item.roles?.length || item.roles.includes(role),
  );

  const visibilityClass = isSidebarOpen
    ? "translate-x-0"
    : "-translate-x-full sm:translate-x-0";
  const desktopWidth = isSidebarCollapsed ? "sm:w-24" : "sm:w-72";

  return (
    <aside
      className={`
        admin-soft-sidebar fixed inset-y-0 left-0 z-50 w-72 overflow-hidden transform transition-[width,transform] duration-180 ease-out will-change-[width,transform] sm:static sm:inset-0 sm:shrink-0
        ${desktopWidth}
        ${isDark ? "text-white" : "text-slate-900"}
        ${visibilityClass}
      `}>
      <div className="flex flex-col h-full">
        <div className="relative border-b border-white/30 px-4 py-4">
          <div
            className={`flex min-w-0 items-center px-4 ${
              isSidebarCollapsed ? "justify-center sm:px-0" : "justify-start"
            }`}>
            <img
              src="/logo-light.png"
              alt="North Luxe"
              className="h-16 w-auto object-contain lg:h-20"
            />
          </div>
        </div>

        <div className="px-4 pt-4">
          <div
            className={`rounded-[1.3rem] border border-white/35 bg-white/74 px-4 py-4 shadow-[0_10px_24px_rgba(148,163,184,0.08)] backdrop-blur-xl ${isSidebarCollapsed ? "sm:px-2.5" : ""}`}>
            <div
              className={`flex items-center gap-3 ${isSidebarCollapsed ? "sm:flex-col sm:justify-center" : ""}`}>
              <div className="relative shrink-0">
                <img
                  src={getUserAvatar(user)}
                  alt={user?.name || "North Luxe Team"}
                  className="h-12 w-12 rounded-[1rem] border-2 border-white/80 object-cover shadow-[0_10px_24px_rgba(15,23,42,0.14)]"
                />
                <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[var(--admin-accent)]" />
              </div>
              <div
                className={`${isSidebarCollapsed ? "sm:hidden" : "min-w-0"}`}>
                <p className="truncate text-[14px] font-black text-[var(--admin-text)]">
                  {user?.name || "North Luxe Team"}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[var(--admin-muted)]">
                  {role || "Editor Access"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/admin"}
              className="mb-1.5">
              {({ isActive }) => (
                <div
                  className="admin-soft-nav-link flex items-center justify-between gap-3 px-4 py-3 text-sm font-bold"
                  data-active={isActive ? "true" : "false"}
                  title={isSidebarCollapsed ? item.label : undefined}>
                  <span
                    className={`inline-flex min-w-0 items-center gap-3 ${isSidebarCollapsed ? "sm:w-full sm:justify-center" : ""}`}>
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
                        isActive
                          ? "bg-[rgba(var(--c-brand-rgb),0.12)] text-[var(--admin-accent)] shadow-[0_10px_22px_rgba(15,23,42,0.05)]"
                          : "bg-white/70 text-[var(--admin-muted)]"
                      }`}>
                      <item.icon size={18} />
                    </span>
                    <span
                      className={`${isSidebarCollapsed ? "sm:hidden" : "truncate"}`}>
                      {item.label}
                    </span>
                  </span>
                  {badgeCounts[item.id] > 0 && !isSidebarCollapsed ? (
                    <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--admin-accent)] px-2 py-1 text-[10px] font-black leading-none text-white shadow-[0_10px_22px_rgba(155,108,255,0.26)]">
                      {badgeCounts[item.id] > 99 ? "99+" : badgeCounts[item.id]}
                    </span>
                  ) : null}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/30 p-4">
          <button
            onClick={logout}
            className={`admin-soft-button-ghost w-full text-rose-500 ${isSidebarCollapsed ? "justify-center sm:px-0" : "justify-start"}`}
            title={isSidebarCollapsed ? "Sign Out" : undefined}>
            <LogOut size={20} />
            <span className={`${isSidebarCollapsed ? "sm:hidden" : ""}`}>
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
