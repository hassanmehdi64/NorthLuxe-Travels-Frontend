import React from "react";
import { Lock, ShieldCheck } from "lucide-react";

const AccountSettings = () => {
  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in duration-500">
      <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Lock size={20} />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            Security Credentials
          </h3>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-100"
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-100"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-100"
          />
        </div>

        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all">
          Update Password
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;
