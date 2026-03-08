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
      className={`admin-shell flex min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDark ? "dark bg-slate-900 text-slate-200" : "bg-[#eef3f5] text-slate-900"
      }`}
    >
      {/* Sidebar Component */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        theme={theme}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden ${isDark ? "bg-slate-800/60" : "bg-[#eef3f5]"}`}>
        {/* Topbar Component */}
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          theme={theme}
          setTheme={setTheme}
        />

        {/* Dynamic Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 xl:p-10">
          <div className="max-w-[1500px] mx-auto">
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
