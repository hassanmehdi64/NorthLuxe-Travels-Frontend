import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
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
        theme={theme}
      />

      {/* Main Content Area */}
      <div className="admin-main-stage flex-1 flex min-w-0 flex-col overflow-hidden px-3 pb-3 pt-3 lg:px-4 lg:pb-4 lg:pt-4">
        {/* Topbar Component */}
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          theme={theme}
          setTheme={setTheme}
        />

        {/* Dynamic Content Outlet */}
        <main className="relative z-[1] flex-1 overflow-y-auto px-2 pb-5 pt-5 lg:px-6 lg:pb-8 lg:pt-6 xl:px-8">
          <div className="mx-auto max-w-[1520px]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay Component */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
