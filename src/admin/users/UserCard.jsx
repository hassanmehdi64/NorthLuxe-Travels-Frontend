import React, { useState } from "react";
import {
  MoreVertical,
  ShieldCheck,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit3,
} from "lucide-react";

// Added onEdit to the props destructuring
const UserCard = ({ user, onToggleStatus, onDelete, onEdit, disableDangerActions = false }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
      <div className="flex justify-between items-start mb-4">
        {/* Avatar & Status Indicator */}
        <div className="relative">
          <img
            src={user.avatar}
            className="w-14 h-14 rounded-2xl object-cover"
            alt={user.name}
          />
          <div
            className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white ${
              user.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
            }`}
          >
            {user.status === "Active" ? (
              <CheckCircle2 size={10} className="text-white" />
            ) : (
              <AlertCircle size={10} className="text-white" />
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <>
              {/* Click outside to close overlay */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 overflow-hidden">
                <button
                  onClick={() => {
                    onEdit(); // This triggers the openEditModal function in UserList
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
                <button
                  disabled={disableDangerActions}
                  onClick={() => {
                    onDelete(user.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Trash2 size={14} /> Remove User
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="space-y-1 mb-6">
        <h3 className="font-black text-slate-900 leading-tight">{user.name}</h3>
        <div className="flex items-center gap-2 text-slate-400">
          <Mail size={14} />
          <span className="text-xs font-medium">{user.email}</span>
        </div>
      </div>

      {/* Footer: Role & Toggle Action */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2">
          {user.role === "Admin" ? (
            <ShieldCheck size={16} className="text-blue-500" />
          ) : (
            <User size={16} className="text-slate-400" />
          )}
          <span
            className={`text-[10px] font-black uppercase tracking-widest ${
              user.role === "Admin" ? "text-blue-600" : "text-slate-500"
            }`}
          >
            {user.role}
          </span>
        </div>

        <button
          disabled={disableDangerActions}
          onClick={() => onToggleStatus(user.id)}
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
            user.status === "Active"
              ? "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
          }`}
        >
          {user.status === "Active" ? "Suspend" : "Activate"}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
