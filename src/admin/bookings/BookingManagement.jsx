import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Check,
  X,
  Search,
  Filter,
  AlertCircle,
  Calendar,
  MapPin,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { useBookings, useUpdateBooking } from "../../hooks/useCms";
import { useNotifications, useUpdateNotification } from "../../hooks/useCms";

const BookingManagement = () => {
  const { data: bookings = [] } = useBookings();
  const updateBooking = useUpdateBooking();
  const { data: notifications = [] } = useNotifications();
  const updateNotification = useUpdateNotification();

  // Modal States
  const [activeModal, setActiveModal] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [adminNote, setAdminNote] = useState("");

  const statusStyles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    confirmed: "bg-blue-50 text-blue-600 border-blue-100",
    completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cancelled: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const handleAction = (e) => {
    e.preventDefault();
    updateBooking.mutate({
      id: selectedBooking.id,
      status: activeModal === "confirm" ? "confirmed" : "cancelled",
      adminNote,
    });
    closeModal();
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedBooking(null);
    setAdminNote("");
  };

  useEffect(() => {
    const unreadBookingAlerts = notifications.filter(
      (n) => !n?.isRead && String(n?.type || "") === "Bookings",
    );
    if (!unreadBookingAlerts.length) return;

    unreadBookingAlerts.forEach((n) => {
      updateNotification.mutate({ id: n.id, isRead: true });
    });
  }, [notifications, updateNotification]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className=" text-xl xl:3xl font-black text-slate-900 tracking-tighter uppercase dark:text-slate-100">
            Booking Management
          </h1>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-300">
            Monitor, confirm, and manage customer reservations.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all w-full md:w-64 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-slate-700 dark:focus:border-slate-600"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/70">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-300 tracking-widest">
                  Customer Details
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-300 tracking-widest">
                  Trip Info
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-300 tracking-widest text-center">
                  Payment
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-300 tracking-widest">
                  Status
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-300 tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-500 dark:text-slate-300 uppercase">
                        {b.customer.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-slate-100 leading-none mb-1">
                          {b.customer}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400">
                          {b.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-100">
                        <MapPin size={14} className="text-blue-500" /> {b.tour}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                        <Calendar size={14} /> {new Date(b.date || b.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                        {b.currency} {b.amount}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-tighter ${b.payment === "Paid" ? "text-emerald-500" : b.payment === "Partially Paid" ? "text-blue-500" : "text-amber-500"}`}
                      >
                        {b.payment}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">{b.paymentMethod || "-"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusStyles[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/bookings/${b.id}`}
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                      >
                        <Eye size={20} />
                      </Link>
                      {b.status === "pending" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedBooking(b);
                              setActiveModal("confirm");
                            }}
                            className="p-2.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(b);
                              setActiveModal("cancel");
                            }}
                            className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                          >
                            <X size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ACTION MODAL --- */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />
          <form
            onSubmit={handleAction}
            className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300 dark:bg-slate-900 dark:border dark:border-slate-700"
          >
            <div
              className={`w-16 h-16 rounded-[1.5rem] mb-6 flex items-center justify-center shadow-inner ${activeModal === "confirm" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
            >
              {activeModal === "confirm" ? (
                <Check size={32} />
              ) : (
                <AlertCircle size={32} />
              )}
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2 uppercase">
              {activeModal === "confirm" ? "Confirm Trip?" : "Decline Booking?"}
            </h2>
            <p className="text-slate-500 dark:text-slate-300 text-sm font-bold mb-8 leading-relaxed">
              Confirming this will finalize the itinerary for{" "}
              <span className="text-slate-900 dark:text-slate-100">
                {selectedBooking?.customer}
              </span>
              . A notification will be sent automatically.
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-300 ml-1">
                  Internal Admin Note
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Verified payment via bank..."
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all resize-none h-28 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-slate-700 dark:focus:border-slate-600"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all shadow-xl ${activeModal === "confirm" ? "bg-emerald-500 shadow-emerald-200 hover:bg-emerald-600" : "bg-rose-500 shadow-rose-200 hover:bg-rose-600"}`}
                >
                  {activeModal === "confirm" ? "Confirm" : "Decline"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
