import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, User, Settings, LogOut, History } from "lucide-react";
import { useAuth } from "../../context/useAuth";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "My Profile", icon: User, path: "/admin/profile/MyProfile" },
    {
      label: "Account Settings",
      icon: Settings,
      path: "/admin/profile/AccountSettings",
    },
    { label: "Activity Log", icon: History, path: "/admin/profile/ActivityLog" },
  ];

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 rounded-2xl border border-white/35 bg-white/45 px-3 py-2 shadow-[0_12px_28px_rgba(148,163,184,0.08)] backdrop-blur-xl transition-all focus:outline-none hover:-translate-y-0.5"
      >
        <div className="text-right hidden sm:block">
          <p className="text-xs font-black uppercase tracking-tight text-[var(--admin-text)]">
            {user?.name || "Admin User"}
          </p>
          <p className="text-[10px] font-bold text-[var(--admin-accent)]">{user?.role || "Admin"}</p>
        </div>
        <img
          src="https://i.pravatar.cc/150?u=hassan"
          alt="profile"
          className="h-10 w-10 rounded-2xl border-2 border-white/80 object-cover shadow-[0_10px_24px_rgba(148,163,184,0.18)]"
        />
        <ChevronDown
          size={14}
          className={`text-[var(--admin-muted)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-60 rounded-[1.5rem] border border-white/35 bg-white/80 py-2 shadow-[0_24px_50px_rgba(148,163,184,0.18)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-2">
          {/* User Email Header */}
          <div className="mb-1 border-b border-white/35 px-5 py-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-muted)]">
              Signed in as
            </p>
            <p className="truncate text-sm font-bold text-[var(--admin-text)]">
              {user?.email || "-"}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="px-2 space-y-0.5">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-[var(--admin-muted)] transition-all hover:bg-white/75 hover:text-[var(--admin-accent)]"
              >
                <item.icon
                  size={16}
                  className="text-[var(--admin-muted)] group-hover:text-[var(--admin-accent)]"
                />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mx-4 my-2 h-px bg-white/40"></div>

          {/* Sign Out Button */}
          <div className="px-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-rose-500 transition-colors hover:bg-rose-50/70"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
