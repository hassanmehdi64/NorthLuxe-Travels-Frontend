import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("admin-sidebar-collapsed") === "true";
  });
  const [isDesktopSidebar, setIsDesktopSidebar] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 640px)").matches;
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("admin-theme") || "light";
  });
  const location = useLocation();

  // Close sidebar automatically when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    localStorage.setItem("admin-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(min-width: 640px)");
    const syncSidebarMode = (event) => {
      setIsDesktopSidebar(event.matches);
      if (event.matches) {
        setSidebarOpen(false);
      }
    };

    setIsDesktopSidebar(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncSidebarMode);
      return () => mediaQuery.removeEventListener("change", syncSidebarMode);
    }

    mediaQuery.addListener(syncSidebarMode);
    return () => mediaQuery.removeListener(syncSidebarMode);
  }, []);

  const isDark = theme === "dark";

  return (
    <div
      className={`admin-shell admin-shell-soft flex min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDark ? "dark text-slate-200" : "text-slate-900"
      }`}
    >
      {/* Sidebar Component */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        setSidebarCollapsed={setIsSidebarCollapsed}
        theme={theme}
      />

      {/* Main Content Area */}
      <div className="admin-main-stage flex-1 flex min-w-0 flex-col overflow-hidden px-2.5 pb-2.5 pt-2.5 sm:px-3 sm:pb-3 sm:pt-3 lg:px-4 lg:pb-4 lg:pt-4">
        {/* Topbar Component */}
        <Topbar
          onSidebarControlClick={() => {
            if (isDesktopSidebar) {
              setIsSidebarCollapsed((prev) => !prev);
              return;
            }
            setSidebarOpen((prev) => !prev);
          }}
          isSidebarCollapsed={isSidebarCollapsed}
          isSidebarOpen={isSidebarOpen}
          isDesktopSidebar={isDesktopSidebar}
          theme={theme}
          setTheme={setTheme}
        />

        {/* Dynamic Content Outlet */}
        <main className="relative z-[1] flex-1 overflow-y-auto px-1.5 pb-4 pt-4 sm:px-2 sm:pb-5 sm:pt-5 lg:px-6 lg:pb-8 lg:pt-6 xl:px-8">
          <div className="mx-auto max-w-[1520px]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay Component */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-40 sm:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
