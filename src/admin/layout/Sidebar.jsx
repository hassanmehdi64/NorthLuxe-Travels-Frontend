import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { adminNavItems } from "./navConfig";
import { useAuth } from "../../context/useAuth";
import { useNotifications } from "../../hooks/useCms";

const playAdminNotificationSound = async ({ audioContextRef, audioUnlockedRef, force = false } = {}) => {
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

const Sidebar = ({ isSidebarOpen, setSidebarOpen, theme }) => {
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
    const currentIds = new Set(unreadItems.map((item) => String(item?.id || "")));

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
            const notification = new Notification(item?.title || "New admin update", {
              body: item?.message || "A new update has arrived.",
              tag: `northluxe-${item?.id || Date.now()}`,
              renotify: true,
            });
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
    return String(n?.type || "") === "System" && (text.includes("contact") || text.includes("inquiry"));
  }).length;

  const badgeCounts = {
    overview: unreadNotifications.length,
    bookings: unreadBookingAlerts,
    contacts: unreadContactAlerts,
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
        admin-soft-sidebar fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:static md:inset-0 md:shrink-0
        ${isDark ? "text-white" : "text-slate-900"}
        ${mobileVisibility}
      `}>
      <div className="flex flex-col h-full">
        <div className="flex h-22 items-center justify-between border-b border-white/30 px-7">
          <div>
            <p className="text-sm md:text-xl font-black uppercase tracking-[0.28em] text-[var(--admin-accent)]">
              North Luxe
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="admin-soft-icon-button md:hidden">
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pt-5">
          <div className="rounded-[1.6rem] border border-white/35 bg-white/55 px-4 py-4 shadow-[0_16px_34px_rgba(148,163,184,0.12)] backdrop-blur-xl">
            <p className="text-sm font-black text-[var(--admin-text)]">
              {user?.name || "North Luxe Team"}
            </p>
            <p className="mt-1 text-xs font-semibold text-[var(--admin-muted)]">
              {role || "Editor Access"}
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/admin"}
              className="mb-1.5">
              {({ isActive }) => (
                <div
                  className="admin-soft-nav-link flex items-center justify-between gap-3 px-4 py-3 text-sm font-bold"
                  data-active={isActive ? "true" : "false"}>
                  <span className="inline-flex min-w-0 items-center gap-3">
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
                        isActive
                          ? "bg-[linear-gradient(135deg,var(--admin-accent),var(--admin-accent-2))] text-white shadow-[0_14px_30px_rgba(155,108,255,0.24)]"
                          : "bg-white/70 text-[var(--admin-muted)]"
                      }`}>
                      <item.icon size={18} />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {badgeCounts[item.id] > 0 ? (
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
            className="admin-soft-button-ghost w-full justify-start text-rose-500">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
