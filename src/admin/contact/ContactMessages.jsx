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
import { useToast } from "../../context/ToastContext";

const isRecentlyReceived = (value) => {
  if (!value) return false;
  const at = new Date(value).getTime();
  if (Number.isNaN(at)) return false;
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
  return Date.now() - at <= threeDaysMs;
};

const ContactMessages = () => {
  const toast = useToast();
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
    toast.confirm(
      "Delete Message?",
      "This will permanently remove this inquiry.",
      () =>
        deleteContact.mutate(id, {
          onSuccess: () => {
            toast.success("Deleted", "Inquiry removed successfully.");
            if (selectedMessage?.id === id) setSelectedMessage(null);
          },
        }),
      {
        confirmLabel: "Delete",
        tone: "danger",
      },
    );
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
    <div className="flex h-[calc(100vh-180px)] flex-col gap-4 lg:flex-row">
      {/* LEFT: Messages List */}
      <div
        className={`flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar ${selectedMessage ? "hidden lg:block" : "block"}`}
      >
        <div className="mb-4 flex items-center justify-between">
            <h1 className="flex items-center gap-2 text-lg font-black uppercase tracking-tight text-slate-900 xl:text-2xl">
            <Inbox size={20} className="text-blue-600" /> Inbox
          </h1>
          <div className="flex gap-2">
            <button className="rounded-xl border border-slate-100 bg-white p-2 text-slate-400 shadow-sm transition-all hover:text-slate-600">
              <Archive size={16} />
            </button>
          </div>
        </div>

        <div className="relative mb-4">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search inquiries..."
            className="w-full rounded-2xl border border-slate-100 bg-white py-2.5 pl-11 pr-4 text-sm font-medium shadow-sm outline-none transition-all focus:ring-4 focus:ring-slate-50"
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
                className={`cursor-pointer rounded-[1.6rem] border-2 p-4 transition-all ${
                  selectedMessage?.id === msg.id
                    ? "border-blue-500 bg-blue-50/30"
                    : isLatest
                      ? "border-blue-200 bg-blue-50/55 shadow-sm"
                      : "border-white bg-white hover:border-slate-100 shadow-sm"
                }`}
              >
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        ["unread", "new"].includes(String(msg.status || "").toLowerCase()) || !msg.status
                          ? "bg-blue-500 animate-pulse"
                          : "bg-transparent"
                      }`}
                    />
                    <span className="text-sm font-black text-slate-900">
                      {msg.sender}
                    </span>
                    {isLatest ? (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.14em] text-blue-700">
                        New
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {new Date(msg.date).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="mb-1 text-[11px] font-bold text-slate-700 truncate">
                  {msg.subject}
                </h4>
                <p className="line-clamp-3 text-[13px] leading-5 text-slate-500">
                  {msg.message}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Detail View */}
      <div
        className={`h-full lg:w-[520px] xl:w-[680px] ${!selectedMessage ? "hidden lg:flex" : "flex"}`}
      >
        {selectedMessage ? (
          <MessageDetail
            message={selectedMessage}
            onClose={() => setSelectedMessage(null)}
            onDelete={deleteMessage}
            onMarkReplied={(id, reply) => replyContact.mutate({ id, message: reply })}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-100 bg-white p-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-200">
              <Mail size={32} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Select a message
            </h3>
            <p className="mt-2 max-w-[200px] text-xs font-medium text-slate-300">
              Choose an inquiry from the left to read or reply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessages;

