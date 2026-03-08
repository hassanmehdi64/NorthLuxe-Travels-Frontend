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
    <div className="flex-1 bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-300">
      {/* Detail Header */}
      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <button
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-white rounded-xl"
        >
          <X size={20} />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onDelete(message.id)}
            className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* User Profile Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white text-xl font-black">
              {message.sender.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {message.sender}
              </h2>
              <div className="flex flex-wrap gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                  <Mail size={14} /> {message.email}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                  <Phone size={14} /> {message.phone}
                </span>
              </div>
            </div>
          </div>
          <div
            className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
              message.urgency === "High"
                ? "bg-rose-50 text-rose-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {message.urgency} Priority
          </div>
        </div>

        {/* Message Content */}
        <div className="bg-slate-50 rounded-[2.5rem] p-8 relative">
          <h3 className="font-black text-slate-800 mb-4 text-lg">
            "{message.subject}"
          </h3>
          <p className="text-slate-600 leading-relaxed font-medium">
            {message.message}
          </p>
          <div className="absolute -top-3 right-8 px-4 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-slate-400 flex items-center gap-2">
            <Calendar size={12} /> Received {message.date}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${
              message.status === "Replied"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            {message.status === "Replied" ? (
              <CheckCircle2 size={16} />
            ) : (
              <RotateCcw size={16} />
            )}
            Status: {message.status}
          </div>
        </div>
      </div>

      {/* Reply Area */}
      <div className="p-6 bg-white border-t border-slate-50">
        {!isReplyOpen ? (
          <button
            type="button"
            onClick={() => setIsReplyOpen(true)}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm inline-flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg"
          >
            Write Reply <Send size={16} />
          </button>
        ) : (
          <form onSubmit={handleSend} className="relative">
            <textarea
              placeholder="Type your reply here..."
              className="w-full p-6 pb-16 bg-slate-50 border-none rounded-[2rem] outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-700 resize-none h-40"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setReply("");
                  setIsReplyOpen(false);
                }}
                className="px-5 py-3 rounded-2xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg"
              >
                Send Reply <Send size={16} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MessageDetail;
