import React from "react";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

const logs = [
  {
    id: 1,
    action: "Updated Tour: Skardu Adventure",
    time: "2 hours ago",
    status: "success",
  },
  {
    id: 2,
    action: "Logged in from Chrome (Mac)",
    time: "5 hours ago",
    status: "info",
  },
  { id: 3, action: "Failed Login Attempt", time: "Yesterday", status: "alert" },
];

const ActivityLog = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-2xl ${log.status === "alert" ? "bg-rose-50 text-rose-500" : "bg-slate-50 text-slate-500"}`}
            >
              <Clock size={18} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                {log.action}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {log.time}
              </p>
            </div>
          </div>
          {log.status === "success" ? (
            <CheckCircle2 size={16} className="text-emerald-500" />
          ) : (
            <AlertCircle size={16} className="text-slate-300" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ActivityLog;
