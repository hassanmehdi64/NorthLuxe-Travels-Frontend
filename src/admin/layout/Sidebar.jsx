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
        fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:static md:inset-0 md:shrink-0
        ${isDark ? "bg-slate-950 border-r border-slate-800 text-white" : "bg-white border-r border-slate-200 text-slate-900"}
        ${mobileVisibility}
      `}
    >
      <div className="flex flex-col h-full">
        <div
          className={`h-20 flex items-center justify-between px-8 border-b ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <span className="text-xl font-black tracking-tighter italic">
            <span className={isDark ? "text-white" : "text-[var(--c-navy)]"}>NORTH</span><span className="text-[var(--c-brand)]">LUXE</span>
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`md:hidden p-2 ${isDark ? "text-white/80" : "text-slate-500"}`}
          >
            <X size={20} />
          </button>
        </div>

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
                <span className="inline-flex min-w-5 h-5 px-1.5 items-center justify-center rounded-full text-[10px] leading-5 font-black bg-[var(--c-brand)] text-white shadow-[0_0_0_4px_rgba(198,162,75,0.18)] animate-pulse">
                  {badgeCounts[item.id] > 99 ? "99+" : badgeCounts[item.id]}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

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
