import React, { useState } from "react";
import {
  X,
  Trash2,
  Send,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

const MessageDetail = ({ message, onClose, onDelete, onMarkReplied }) => {
  const [reply, setReply] = useState("");
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    onMarkReplied(message.id, reply);
    setReply("");
    setIsReplyOpen(false);
  };

  return (
    <div className="flex flex-1 animate-in slide-in-from-right-4 flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-xl duration-300">
      {/* Detail Header */}
      <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 p-3">
        <button
          onClick={onClose}
          className="rounded-xl p-2 hover:bg-white lg:hidden"
        >
          <X size={16} />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onDelete(message.id)}
            className="rounded-xl p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {/* User Profile Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-blue-600 text-base font-black text-white">
              {message.sender.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                {message.sender}
              </h2>
              <div className="mt-1 flex flex-wrap gap-2.5">
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Mail size={12} /> {message.email}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Phone size={12} /> {message.phone}
                </span>
              </div>
            </div>
          </div>
          <div
            className={`rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-[0.18em] ${
              message.urgency === "High"
                ? "bg-rose-50 text-rose-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {message.urgency} Priority
          </div>
        </div>

        {/* Message Content */}
        <div className="relative rounded-[1.6rem] bg-slate-50 p-5">
          <h3 className="mb-3 text-sm font-black text-slate-800">
            "{message.subject}"
          </h3>
          <p className="min-h-[220px] whitespace-pre-line text-[15px] font-medium leading-8 text-slate-600">
            {message.message}
          </p>
          <div className="absolute -top-3 right-5 flex items-center gap-1.5 rounded-full border border-slate-100 bg-white px-3 py-1 text-[9px] font-bold text-slate-400">
            <Calendar size={11} /> Received {message.date}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-[10px] font-bold ${
              message.status === "Replied"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            {message.status === "Replied" ? (
              <CheckCircle2 size={14} />
            ) : (
              <RotateCcw size={14} />
            )}
            Status: {message.status}
          </div>
        </div>
      </div>

      {/* Reply Area */}
      <div className="border-t border-slate-50 bg-white p-3.5">
        {!isReplyOpen ? (
          <button
            type="button"
            onClick={() => setIsReplyOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-[11px] font-bold text-white shadow-lg transition-all hover:bg-blue-600"
          >
            Write Reply <Send size={12} />
          </button>
        ) : (
          <form onSubmit={handleSend} className="relative">
            <textarea
              placeholder="Type your reply here..."
              className="h-36 w-full resize-none rounded-[1.25rem] border-none bg-slate-50 p-4 pb-14 text-sm font-medium text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-100"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <div className="absolute bottom-3.5 right-3.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setReply("");
                  setIsReplyOpen(false);
                }}
                className="rounded-xl bg-slate-100 px-3.5 py-2 text-[11px] font-bold text-slate-700 transition-all hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-[11px] font-bold text-white shadow-lg transition-all hover:bg-blue-600"
              >
                Send Reply <Send size={12} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MessageDetail;
