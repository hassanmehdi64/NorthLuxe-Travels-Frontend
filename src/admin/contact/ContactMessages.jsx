import React, { useEffect, useState } from "react";
import {
  Mail,
  MessageSquare,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  Filter,
  User,
  Archive,
  Inbox,
} from "lucide-react";
import MessageDetail from "./MessageDetail";
import {
  useContacts,
  useDeleteContact,
  useReplyContact,
  useUpdateContact,
  useNotifications,
  useUpdateNotification,
} from "../../hooks/useCms";

const isRecentlyReceived = (value) => {
  if (!value) return false;
  const at = new Date(value).getTime();
  if (Number.isNaN(at)) return false;
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
  return Date.now() - at <= threeDaysMs;
};

const ContactMessages = () => {
  const { data: messages = [] } = useContacts();
  const { data: notifications = [] } = useNotifications();
  const deleteContact = useDeleteContact();
  const updateContact = useUpdateContact();
  const replyContact = useReplyContact();
  const updateNotification = useUpdateNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  // --- HANDLERS ---
  const deleteMessage = (id) => {
    if (window.confirm("Delete this message?")) {
      deleteContact.mutate(id);
      if (selectedMessage?.id === id) setSelectedMessage(null);
    }
  };

  const markAsStatus = (id, newStatus) => {
    updateContact.mutate({ id, status: newStatus });
    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const filteredMessages = messages
    .filter((m) => {
      const subject = String(m.subject || "").toLowerCase();
      const isCustomPlan = subject.includes("custom tour plan request") || subject.includes("custom plan");
      if (isCustomPlan) return false;

      const query = searchTerm.toLowerCase();
      return m.sender.toLowerCase().includes(query) || m.subject.toLowerCase().includes(query);
    })
    .sort((a, b) => {
      const aTime = new Date(a?.date || a?.createdAt || 0).getTime();
      const bTime = new Date(b?.date || b?.createdAt || 0).getTime();
      return bTime - aTime;
    });

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    const status = String(msg?.status || "").toLowerCase();
    if (status === "unread" || status === "new" || !status) {
      markAsStatus(msg.id, "Read");
    }
  };

  useEffect(() => {
    const unreadContactAlerts = notifications.filter((n) => {
      if (n?.isRead) return false;
      const text = `${n?.title || ""} ${n?.message || ""}`.toLowerCase();
      return String(n?.type || "") === "System" && (text.includes("contact") || text.includes("inquiry"));
    });

    if (!unreadContactAlerts.length) return;

    unreadContactAlerts.forEach((n) => {
      updateNotification.mutate({ id: n.id, isRead: true });
    });
  }, [notifications, updateNotification]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
      {/* LEFT: Messages List */}
      <div
        className={`flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar ${selectedMessage ? "hidden lg:block" : "block"}`}
      >
        <div className="flex justify-between items-center mb-6">
            <h1 className=" text-xl xl:3xl font-black text-slate-900 tracking-tighter uppercase">
            <Inbox size={24} className="text-blue-600" /> Inbox
          </h1>
          <div className="flex gap-2">
            <button className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all shadow-sm">
              <Archive size={18} />
            </button>
          </div>
        </div>

        <div className="relative mb-6">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search inquiries..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-slate-50 transition-all font-medium text-sm shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const isLatest = isRecentlyReceived(msg?.date || msg?.createdAt);
            return (
              <div
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`cursor-pointer transition-all rounded-[2rem] p-5 border-2 ${
                  selectedMessage?.id === msg.id
                    ? "border-blue-500 bg-blue-50/30"
                    : isLatest
                      ? "border-blue-200 bg-blue-50/55 shadow-sm"
                      : "border-white bg-white hover:border-slate-100 shadow-sm"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        ["unread", "new"].includes(String(msg.status || "").toLowerCase()) || !msg.status
                          ? "bg-blue-500 animate-pulse"
                          : "bg-transparent"
                      }`}
                    />
                    <span className="font-black text-slate-900 text-sm">
                      {msg.sender}
                    </span>
                    {isLatest ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide bg-blue-100 text-blue-700">
                        New
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {new Date(msg.date).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-700 truncate mb-1">
                  {msg.subject}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Detail View */}
      <div
        className={`lg:w-[450px] xl:w-[600px] h-full ${!selectedMessage ? "hidden lg:flex" : "flex"}`}
      >
        {selectedMessage ? (
          <MessageDetail
            message={selectedMessage}
            onClose={() => setSelectedMessage(null)}
            onDelete={deleteMessage}
            onMarkReplied={(id, reply) => replyContact.mutate({ id, message: reply })}
          />
        ) : (
          <div className="flex-1 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-10">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
              <Mail size={40} />
            </div>
            <h3 className="font-black text-slate-400 uppercase tracking-widest text-sm">
              Select a message
            </h3>
            <p className="text-slate-300 text-xs font-medium max-w-[200px] mt-2">
              Choose an inquiry from the left to read or reply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessages;

