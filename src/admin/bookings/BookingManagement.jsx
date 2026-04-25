import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  Printer,
  FileText,
  Trash2,
} from "lucide-react";
import { useBookings, useDeleteBooking } from "../../hooks/useCms";
import { useNotifications, useUpdateNotification } from "../../hooks/useCms";
import { useToast } from "../../context/ToastContext";

const parseCustomRequest = (value = "") =>
  String(value || "")
    .split(/\r?\n/)
    .reduce((acc, line) => {
      const index = line.indexOf(":");
      if (index === -1) return acc;
      const key = line.slice(0, index).trim();
      const fieldValue = line.slice(index + 1).trim();
      if (key) acc[key] = fieldValue;
      return acc;
    }, {});

const prettifyValue = (value, fallback = "-") => {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).replace(/_/g, " ");
};
const actionButtonClass = "admin-soft-icon-button inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all";


const isRecentlyReceived = (value) => {
  if (!value) return false;
  const at = new Date(value).getTime();
  if (Number.isNaN(at)) return false;
  return Date.now() - at <= 2 * 24 * 60 * 60 * 1000;
};

const getSavedItinerary = (booking) => {
  const itinerary = booking.customItinerary || {};
  if (itinerary.title || itinerary.planDetails || itinerary.finalBudget || (Array.isArray(itinerary.planDays) && itinerary.planDays.length)) return itinerary;
  return {};
};

const getCustomRequestDetails = (booking) => {
  const fallback = parseCustomRequest(booking.customRequirements);
  const custom = booking.customRequest || {};
  const preferredDestinations = Array.isArray(custom.preferredDestinations) && custom.preferredDestinations.length
    ? custom.preferredDestinations.join(", ")
    : fallback["Preferred Destinations"] || "Flexible destination";

  return {
    preferredDestinations,
    sourceTourTitle: custom.sourceTourTitle || fallback["Source Tour"] || booking.tour || "Not linked",
    startDate: custom.startDate || fallback["Start Date"] || "Flexible",
    endDate: custom.endDate || fallback["End Date"] || "Flexible",
    persons: custom.persons || fallback["Persons"] || booking.groupSize || 0,
    childrenBelowThree: custom.childrenBelowThree ?? fallback["Children below 3 years"] ?? booking.children ?? 0,
    budget: custom.budget || fallback["Budget"] || "Not specified",
    budgetMode: custom.budgetMode || fallback["Budget Mode"] || "",
    hotelPreference: custom.hotelPreference || fallback["Hotel Preference"] || booking.facilities?.hotelType || "",
    vehiclePreference: custom.vehiclePreference || fallback["Vehicle Preference"] || booking.facilities?.vehicleType || "",
    requirements: custom.requirements || fallback["Requirements"] || booking.specialRequirements || "None",
  };
};

const openTourPlanPrint = (booking) => {
  const isCustomBooking = booking.bookingType === "custom" || booking.isCustomTour;
  const request = getCustomRequestDetails(booking);
  const itinerary = booking.customItinerary || {};
  if (!itinerary?.title) return;

  const win = window.open("", "_blank", "width=960,height=760");
  if (!win) return;

  win.document.write(`
    <html>
      <head>
        <title>${itinerary.title || "Tour Plan"} - Print</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 28px; color: #2B2B2B; }
          h1 { margin-bottom: 6px; }
          p { line-height: 1.65; }
          .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 18px; }
          .card { border: 1px solid #e2e8f0; border-radius: 16px; padding: 14px; }
          .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b; }
          .value { margin-top: 6px; font-size: 15px; font-weight: 700; }
        </style>
      </head>
      <body>
        <h1>${itinerary.title || "Created Tour Plan"}</h1>
        <p>Prepared for ${booking.customer || "Customer"} from ${isCustomBooking ? `custom booking request ${booking.bookingCode || ""}` : `booking ${booking.bookingCode || ""}` }.</p>
        <div class="grid">
          <div class="card"><div class="label">${isCustomBooking ? "Requested Destinations" : "Tour"}</div><div class="value">${isCustomBooking ? request.preferredDestinations : booking.tour || "Selected Tour"}</div></div>
          <div class="card"><div class="label">${isCustomBooking ? "Travel Window" : "Travel Date"}</div><div class="value">${isCustomBooking ? `${request.startDate}${request.endDate && request.endDate !== "Flexible" ? ` - ${request.endDate}` : ""}` : new Date(booking.date || booking.createdAt).toLocaleDateString()}</div></div>
          <div class="card"><div class="label">Final Budget</div><div class="value">${itinerary.currency || booking.currency || "PKR"} ${itinerary.finalBudget || booking.amount || 0}</div></div>
          <div class="card"><div class="label">Duration</div><div class="value">${itinerary.durationLabel || (isCustomBooking ? "Custom Duration" : "Scheduled Tour")}</div></div>
        </div>
        <div class="card" style="margin-top: 16px;"><div class="label">Itinerary Details</div><div class="value">${itinerary.planDetails || request.requirements || booking.specialRequirements || "No itinerary details added yet."}</div></div>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 350);
};

const BookingManagement = () => {
  const toast = useToast();
  const { data: bookings = [] } = useBookings();
  const deleteBooking = useDeleteBooking();
  const { data: notifications = [] } = useNotifications();
  const updateNotification = useUpdateNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("standard");
  const customTab = activeTab === "custom";

  const statusStyles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    confirmed: "bg-blue-50 text-blue-600 border-blue-100",
    completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cancelled: "bg-rose-50 text-rose-600 border-rose-100",
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

  const filteredBookings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return bookings.filter((booking) => {
      const isCustomBooking = booking.bookingType === "custom" || booking.isCustomTour;
      const matchesTab = customTab ? isCustomBooking : !isCustomBooking;
      if (!matchesTab) return false;

      const request = getCustomRequestDetails(booking);
      if (!query) return true;

      const haystack = [
        booking.customer,
        booking.email,
        booking.phone,
        booking.bookingCode,
        booking.tour,
        booking.status,
        booking.payment,
        booking.paymentMethod,
        booking.currency,
        booking.customRequirements,
        request.preferredDestinations,
        request.sourceTourTitle,
        request.budget,
        request.budgetMode,
        request.vehiclePreference,
        request.hotelPreference,
        request.requirements,
        getSavedItinerary(booking)?.title,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    }).sort((a, b) => {
      const aRecent = isRecentlyReceived(a?.createdAt || a?.date);
      const bRecent = isRecentlyReceived(b?.createdAt || b?.date);
      if (aRecent !== bRecent) return Number(bRecent) - Number(aRecent);
      const aTime = new Date(a?.createdAt || a?.date || 0).getTime();
      const bTime = new Date(b?.createdAt || b?.date || 0).getTime();
      return bTime - aTime;
    });
  }, [bookings, customTab, searchTerm]);

  const createdPlans = useMemo(
    () => filteredBookings.filter((booking) => {
      const itinerary = getSavedItinerary(booking);
      return itinerary.title || itinerary.planDetails || itinerary.finalBudget || (Array.isArray(itinerary.planDays) && itinerary.planDays.length);
    }),
    [filteredBookings],
  );

  const handleDeleteBooking = (booking) => {
    toast.confirm(
      "Delete Booking?",
      `This will permanently remove the booking for ${booking.customer}.`,
      async () => {
        await deleteBooking.mutateAsync(booking.id);
        toast.success("Deleted", "Booking removed successfully.");
      },
      {
        confirmLabel: "Delete",
        tone: "danger",
      },
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="admin-soft-heading text-xl xl:3xl font-black tracking-tighter uppercase">
            Booking Management
          </h1>
          <p className="admin-soft-muted text-sm font-bold">
            Monitor, confirm, and manage customer reservations.
          </p>
        </div>

        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative group">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] transition-colors group-focus-within:text-[var(--c-brand)]"
              size={16}
            />
            <input
              type="text"
              placeholder={customTab ? "Search by name, destinations, itinerary..." : "Search by name, booking code, email, tour..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 text-xs font-medium md:w-72"
            />
          </div>
          <button className="admin-soft-button-ghost flex items-center gap-2 whitespace-nowrap">
            <Filter size={15} />
            Filter
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("standard")}
          className={`cursor-pointer rounded-xl border px-3.5 py-2 text-xs font-black transition-all ${
            !customTab
              ? "border-[var(--c-brand)] bg-[var(--c-brand)] text-white shadow-sm"
              : "border-white/40 bg-white/55 text-[var(--admin-muted)] hover:border-[rgba(32,183,122,0.26)] hover:bg-white/80"
          }`}
        >
          Standard Tour Booking
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("custom")}
          className={`cursor-pointer rounded-xl border px-3.5 py-2 text-xs font-black transition-all ${
            customTab
              ? "border-[var(--c-brand)] bg-[var(--c-brand)] text-white shadow-sm"
              : "border-white/40 bg-white/55 text-[var(--admin-muted)] hover:border-[rgba(32,183,122,0.26)] hover:bg-white/80"
          }`}
        >
          Custom Booking Request
        </button>
      </div>

      <div className="admin-soft-table overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">Customer Details</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">{customTab ? "Request Details" : "Trip Info"}</th>
                <th className="px-5 py-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">{customTab ? "Plan Summary" : "Payment"}</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">Status</th>
                <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/25 dark:divide-slate-800">
              {filteredBookings.length ? filteredBookings.map((booking) => {
                const isCustomBooking = booking.bookingType === "custom" || booking.isCustomTour;
                const request = getCustomRequestDetails(booking);
                const requestedDates = [request.startDate, request.endDate]
                  .filter(Boolean)
                  .filter((item) => item !== "Flexible")
                  .join(" - ");

                const isLatest = isRecentlyReceived(booking?.createdAt || booking?.date);
                return (
                  <tr key={booking.id} className={`group align-top transition-colors hover:bg-slate-50/30 dark:hover:bg-slate-800/50 ${isLatest ? "bg-[var(--c-brand)]/5" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--c-brand)]/10 text-[11px] font-black uppercase text-[var(--c-brand)]">
                          {booking.customer?.charAt(0) || "C"}
                        </div>
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <p className="text-sm font-black leading-none text-slate-900 dark:text-slate-100">{booking.customer}</p>
                            {isLatest ? <span className="admin-soft-badge admin-soft-badge-primary">New</span> : null}
                          </div>
                          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400">{booking.email}</p>
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">{booking.phone || "No phone added"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {isCustomBooking ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-100">
                            <MapPin size={14} className="text-blue-500" />
                            {request.preferredDestinations}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-tighter text-slate-400">
                            <Calendar size={14} />
                            {requestedDates || "Flexible dates"}
                          </div>
                          <p className="text-[11px] font-semibold text-slate-500">Source Tour: {request.sourceTourTitle}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-100">
                            <MapPin size={14} className="text-blue-500" /> {booking.tour}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-tighter text-slate-400">
                            <Calendar size={14} /> {new Date(booking.date || booking.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {isCustomBooking ? (
                        <div className="inline-flex flex-col items-center gap-1.5">
                          <span className="text-sm font-black text-slate-900 dark:text-slate-100">{getSavedItinerary(booking)?.title || getSavedItinerary(booking)?.finalBudget ? `${getSavedItinerary(booking).currency || "PKR"} ${getSavedItinerary(booking).finalBudget || 0}` : request.budget}</span>
                          <span className="text-[10px] font-black uppercase tracking-tighter text-sky-600">{request.persons ? `${request.persons} person(s)` : "Guests not set"}</span>
                          <span className="text-[10px] uppercase text-slate-400">{prettifyValue(request.vehiclePreference, "Vehicle flexible")}</span>
                          <span className="text-[10px] uppercase text-slate-400">{prettifyValue(request.hotelPreference, "Hotel flexible")}</span>
                          {getSavedItinerary(booking)?.title ? (
                            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                              <FileText size={11} /> {getSavedItinerary(booking).title}
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <div className="inline-flex flex-col items-center">
                          <span className="text-sm font-black text-slate-900 dark:text-slate-100">{booking.currency} {booking.amount}</span>
                          <span className={`text-[10px] font-black uppercase tracking-tighter ${booking.payment === "Paid" ? "text-emerald-500" : booking.payment === "Partially Paid" ? "text-blue-500" : "text-amber-500"}`}>{booking.payment}</span>
                          <span className="text-[10px] uppercase text-slate-400">{booking.paymentMethod || "-"}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusStyles[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/bookings/${booking.id}`}
                          className={`${actionButtonClass} text-slate-400 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-800`}
                          title="View booking"
                        >
                          <Eye size={18} />
                        </Link>
                        {getSavedItinerary(booking)?.title ? (
                          <button
                            type="button"
                            onClick={() => openTourPlanPrint(booking)}
                            className={`${actionButtonClass} text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/20`}
                            title="Print itinerary"
                          >
                            <Printer size={17} />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleDeleteBooking(booking)}
                          className={`${actionButtonClass} text-rose-500 hover:border-rose-100 hover:bg-rose-50 dark:hover:bg-rose-900/20`}
                          title="Delete booking"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="mx-auto max-w-md space-y-2">
                      <p className="text-sm font-black text-slate-700 dark:text-slate-100">
                        {customTab ? "No custom booking requests found." : "No standard tour bookings found."}
                      </p>
                      <p className="text-sm text-slate-400 dark:text-slate-500">
                        {searchTerm.trim()
                          ? "Try a different search term to find the booking you need."
                          : customTab
                            ? "New custom requests will appear here with their actual form data and created plans."
                            : "Standard tour bookings will appear here once customers submit them."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <section className="admin-soft-panel space-y-4 p-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">{customTab ? "Custom Tour Plans" : "Standard Tour Plans"}</p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">{customTab ? "Saved Itineraries for Custom Requests" : "Saved Itineraries for Standard Bookings"}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{customTab ? "Every itinerary created from a custom request is saved here so you can reopen or print it anytime." : "Every itinerary created for a standard booking is saved here so you can reopen or print it anytime."}</p>
          </div>

          {createdPlans.length ? (
            <div className="admin-soft-table overflow-hidden rounded-[1.25rem] border border-white/30 dark:border-slate-800">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                    <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Created Itinerary</th>
                    <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Requested Destinations</th>
                    <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/25 dark:divide-slate-800">
                  {createdPlans.map((booking) => {
                    const request = getCustomRequestDetails(booking);
                    return (
                      <tr key={`plan-${booking.id}`} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/40">
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-black text-slate-900 dark:text-slate-100">{booking.customer}</p>
                          <p className="mt-1 text-[11px] font-semibold text-slate-400">{booking.bookingCode}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-black text-slate-900 dark:text-slate-100">{getSavedItinerary(booking)?.title || "Created Tour Plan"}</p>
                          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{`${prettifyValue(getSavedItinerary(booking)?.status, "Draft")} ? ${getSavedItinerary(booking)?.currency || "PKR"} ${getSavedItinerary(booking)?.finalBudget || 0}`}</p>
                        </td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-300">{customTab ? request.preferredDestinations : booking.tour || "Selected Tour"}</td>
                        <td className="px-5 py-3.5">
                          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusStyles[booking.status]}`}>{booking.status}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-end gap-2">
                            <Link to={`/admin/bookings/${booking.id}`} className="admin-soft-icon-button">
                              <Eye size={18} />
                            </Link>
                            <button
                              type="button"
                              onClick={() => openTourPlanPrint(booking)}
                              className="admin-soft-icon-button"
                            >
                              <Printer size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-slate-200 px-6 py-10 text-center dark:border-slate-700">
              <p className="text-sm font-black text-slate-700 dark:text-slate-100">No itineraries have been created yet.</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{customTab ? "Open a custom booking request and use Create Itinerary. The saved plan will appear here automatically." : "Open a standard booking and use Create Itinerary. The saved plan will appear here automatically."}</p>
            </div>
          )}
      </section>

    </div>
  );
};

export default BookingManagement;
