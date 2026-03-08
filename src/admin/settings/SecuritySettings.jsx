import React from "react";
import {
  Database,
  Key,
  ShieldAlert,
  Monitor,
  Cloud,
  RotateCcw,
} from "lucide-react";

const SecuritySettings = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      {/* Security Alert Banner */}
      <div className="flex items-start gap-4 p-5 bg-blue-50/50 rounded-[2rem] border border-blue-100">
        <ShieldAlert className="text-blue-500 shrink-0 mt-1" size={24} />
        <div>
          <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">
            Auto-Backup Active
          </h4>
          <p className="text-xs text-blue-700 font-medium leading-relaxed">
            Your system database is currently scheduled for backup every 24
            hours to AWS S3. The last successful sync was 4 hours ago.
          </p>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backup Action */}
        <button className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Database size={18} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-slate-400">
                Database
              </p>
              <p className="text-xs font-bold text-slate-700">Backup Now</p>
            </div>
          </div>
          <Cloud size={16} className="text-slate-300" />
        </button>

        {/* Cache Action */}
        <button className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Monitor size={18} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-slate-400">
                System
              </p>
              <p className="text-xs font-bold text-slate-700">Clear Cache</p>
            </div>
          </div>
          <RotateCcw size={16} className="text-slate-300" />
        </button>
      </div>

      {/* Advanced Security */}
      <div className="pt-6 border-t border-slate-50 space-y-4">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
          Advanced Controls
        </h3>

        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3">
            <Key size={18} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-700">
              Force Global Password Reset
            </span>
          </div>
          <button className="px-4 py-2 bg-rose-50 text-rose-600 text-[10px] font-black uppercase rounded-lg hover:bg-rose-600 hover:text-white transition-all">
            Execute
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
