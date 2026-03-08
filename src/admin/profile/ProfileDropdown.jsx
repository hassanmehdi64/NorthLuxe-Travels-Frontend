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
        className="flex items-center gap-3 group px-2 py-1 rounded-2xl hover:bg-slate-50 transition-all focus:outline-none"
      >
        <div className="text-right hidden sm:block">
          <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
            {user?.name || "Admin User"}
          </p>
          <p className="text-[10px] font-bold text-blue-500">{user?.role || "Admin"}</p>
        </div>
        <img
          src="https://i.pravatar.cc/150?u=hassan"
          alt="profile"
          className="h-10 w-10 rounded-xl border-2 border-white shadow-sm object-cover"
        />
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-60 bg-white border border-slate-100 rounded-[1.5rem] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
          {/* User Email Header */}
          <div className="px-5 py-4 border-b border-slate-50 mb-1">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Signed in as
            </p>
            <p className="text-sm font-bold text-slate-900 truncate">
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
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"
              >
                <item.icon
                  size={16}
                  className="text-slate-400 group-hover:text-blue-500"
                />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="h-[1px] bg-slate-50 my-2 mx-4"></div>

          {/* Sign Out Button */}
          <div className="px-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
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
