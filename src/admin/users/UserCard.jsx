import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Edit3,
  Mail,
  MoreVertical,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import { getUserAvatar } from "../utils/userAvatar";

const UserCard = ({ user, onToggleStatus, onDelete, onEdit, disableDangerActions = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const isAdmin = user.role === "Admin";
  const isActive = user.status === "Active";

  return (
    <div className="admin-soft-panel relative overflow-hidden rounded-[1.6rem] p-5 transition-all duration-200 hover:-translate-y-0.5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={getUserAvatar(user)}
              className="h-14 w-14 rounded-[1.2rem] object-cover shadow-[0_10px_24px_rgba(148,163,184,0.12)]"
              alt={user.name}
            />
            <div
              className={`absolute -bottom-1 -right-1 rounded-full border-2 border-white p-1 ${
                isActive ? "bg-emerald-500" : "bg-rose-500"
              }`}
            >
              {isActive ? (
                <CheckCircle2 size={10} className="text-white" />
              ) : (
                <AlertCircle size={10} className="text-white" />
              )}
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="admin-soft-heading truncate text-base font-black leading-tight">{user.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-[var(--admin-muted)]">
              <Mail size={14} />
              <span className="truncate text-xs font-medium">{user.email}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button onClick={() => setShowMenu((prev) => !prev)} className="admin-soft-icon-button">
            <MoreVertical size={18} />
          </button>

          {showMenu ? (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-white/40 bg-white/92 shadow-[0_18px_36px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                <button
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
                <button
                  disabled={disableDangerActions}
                  onClick={() => {
                    onDelete(user.id);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 size={14} /> Remove User
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/35 pt-4">
        <span className={`admin-soft-badge ${isAdmin ? "admin-soft-badge-primary" : "admin-soft-badge-muted"}`}>
          {isAdmin ? <ShieldCheck size={12} /> : <User size={12} />}
          {user.role}
        </span>
        <span className={`admin-soft-badge ${isActive ? "admin-soft-badge-success" : "admin-soft-badge-muted"}`}>
          {user.status}
        </span>
        <button
          disabled={disableDangerActions}
          onClick={() => onToggleStatus(user.id)}
          className={`ml-auto rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
            isActive
              ? "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
          }`}
        >
          {isActive ? "Suspend" : "Activate"}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
