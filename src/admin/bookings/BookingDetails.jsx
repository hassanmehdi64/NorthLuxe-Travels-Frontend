import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  CreditCard,
  Check,
  FileText,
  MapPinned,
  ShieldCheck,
  UserRound,
  Wallet,
  XCircle,
  PlusSquare,
  Printer,
  PencilLine,
  Trash2,
  Upload,
} from "lucide-react";
import { useAdminTours, useBooking, useConfirmBookingPayment, useUpdateBooking } from "../../hooks/useCms";
import { useToast } from "../../context/ToastContext";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const paymentStyles = {
  Pending: "bg-slate-100 text-slate-700 border-slate-200",
  "Verification Pending": "bg-amber-50 text-amber-700 border-amber-200",
  "Partially Paid": "bg-sky-50 text-sky-700 border-sky-200",
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Failed: "bg-rose-50 text-rose-700 border-rose-200",
  Refunded: "bg-violet-50 text-violet-700 border-violet-200",
};

const prettifyValue = (value, fallback = "-") => {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).replace(/_/g, " ");
};

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

const getCustomRequestDetails = (booking) => {
  const fallback = parseCustomRequest(booking.customRequirements);
  const custom = booking.customRequest || {};
  const preferredDestinationsList = Array.isArray(custom.preferredDestinations) && custom.preferredDestinations.length
    ? custom.preferredDestinations
    : String(fallback["Preferred Destinations"] || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .filter((item) => item.toLowerCase() !== "flexible");

  return {
    preferredDestinations: preferredDestinationsList.length ? preferredDestinationsList.join(", ") : "Flexible",
    sourceTourTitle: custom.sourceTourTitle || fallback["Source Tour"] || booking.tour || "Not linked",
    startDate: custom.startDate || fallback["Start Date"] || "Flexible",
    endDate: custom.endDate || fallback["End Date"] || "Flexible",
    persons: custom.persons || fallback["Persons"] || booking.groupSize || "-",
    childrenBelowThree: custom.childrenBelowThree ?? fallback["Children below 3 years"] ?? booking.children ?? 0,
    budget: custom.budget || fallback["Budget"] || "Not specified",
    budgetMode: custom.budgetMode || fallback["Budget Mode"] || "Not specified",
    hotelPreference: custom.hotelPreference || fallback["Hotel Preference"] || booking.facilities?.hotelType || "Not selected",
    vehiclePreference: custom.vehiclePreference || fallback["Vehicle Preference"] || booking.facilities?.vehicleType || "Not selected",
    requirements: custom.requirements || fallback["Requirements"] || booking.specialRequirements || "None",
  };
};

const getStandardBookingDetails = (booking, fallbackTour = null) => {
  const tourDetails = booking.tourDetails || fallbackTour || {};
  const fallbackDuration = tourDetails.durationDays
    ? `${tourDetails.durationDays} Day${tourDetails.durationDays > 1 ? "s" : ""}`
    : "";

  return {
    tourTitle: tourDetails.title || booking.tour || "Selected Tour",
    route: tourDetails.location || booking.tour || "Selected Tour",
    travelDate: booking.date ? new Date(booking.date).toLocaleDateString() : "Flexible",
    hotelPreference: booking.facilities?.hotelType || "Not selected",
    vehiclePreference: booking.facilities?.vehicleType || "Not selected",
    requirements: booking.specialRequirements || booking.notes || tourDetails.description || tourDetails.shortDescription || "",
    durationLabel: tourDetails.durationLabel || fallbackDuration,
    finalBudget: Number(booking.amount || booking.totalAmount || tourDetails.price || 0),
    currency: booking.currency || tourDetails.currency || "PKR",
    itinerary: Array.isArray(tourDetails.itinerary) ? tourDetails.itinerary : [],
    description: tourDetails.description || tourDetails.shortDescription || "",
  };
};

const InfoChip = ({ label, value, accent = false }) => (
  <div className="rounded-[0.95rem] border border-white/35 bg-white/76 px-4 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.03)]">
    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--admin-muted)]">{label}</p>
    <p className={`mt-1.5 text-[14px] font-bold leading-5 ${accent ? "text-[var(--admin-text)]" : "text-slate-700 dark:text-slate-200"}`}>
      {value || "-"}
    </p>
  </div>
);

const DetailRow = ({ label, value, accent = false, multiline = false }) => (
  <div className={`gap-3 border-b border-white/30 py-3.5 last:border-b-0 ${multiline ? "space-y-2" : "flex flex-col items-start justify-between gap-1.5 sm:flex-row sm:gap-4"}`}>
    <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--admin-muted)] sm:pt-0.5">{label}</span>
    {multiline ? (
      <p className="whitespace-pre-line rounded-[0.9rem] border border-white/30 bg-white/70 px-3.5 py-3 text-[12.5px] font-medium leading-6 text-slate-600 dark:text-slate-300">
        {value || "-"}
      </p>
    ) : (
      <span
        className={[
          "w-full text-left text-[13.5px] font-semibold leading-6 sm:max-w-[62%] sm:text-right",
          accent ? "text-[var(--admin-text)]" : "text-slate-700 dark:text-slate-200",
        ].join(" ")}
      >
        {value || "-"}
      </span>
    )}
  </div>
);

const SectionCard = ({ icon: Icon, title, children }) => (
  <section className="admin-soft-panel rounded-[1.35rem] p-4 md:p-5">
    <div className="flex items-center gap-3 border-b border-white/30 pb-3">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-[0.9rem] border border-white/45 bg-white/72 text-[var(--admin-accent)] shadow-[0_6px_14px_rgba(15,23,42,0.04)]">
        <Icon size={15} />
      </span>
      <h2 className="text-[15px] font-black tracking-tight text-[var(--admin-text)]">{title}</h2>
    </div>
    <div className="pt-3">{children}</div>
  </section>
);

const SummaryMetric = ({ label, value, tone = "default" }) => {
  const toneClass = {
    default: "border-white/35 bg-white/74",
    success: "border-emerald-200 bg-emerald-50/85",
    warning: "border-amber-200 bg-amber-50/85",
  }[tone] || "border-white/35 bg-white/74";

  return (
    <div className={`rounded-[1rem] border px-4 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.03)] ${toneClass}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--admin-muted)]">{label}</p>
      <p className="mt-1.5 text-[15px] font-black leading-5 text-[var(--admin-text)]">{value}</p>
    </div>
  );
};

const BookingStage = ({ title, active = false, done = false }) => (
  <div className="flex min-w-0 items-center gap-2.5 rounded-[0.95rem] border border-white/30 bg-white/62 px-3 py-2.5">
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-black ${
        done
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : active
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : "border-white/35 bg-white/70 text-[var(--admin-muted)]"
      }`}
    >
      {done ? "✓" : ""}
    </span>
    <p className={`text-sm font-bold ${active || done ? "text-[var(--admin-text)]" : "text-[var(--admin-muted)]"}`}>
      {title}
    </p>
  </div>
);

const bookingActionButtonClass =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[1rem] px-4 text-[15px] font-bold transition-all duration-200";
const bookingActionGhostClass = `${bookingActionButtonClass} admin-soft-button-ghost`;
const bookingActionSuccessClass =
  `${bookingActionButtonClass} border border-emerald-200 bg-emerald-50 text-emerald-700 hover:-translate-y-[1px] hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800`;
const bookingActionDangerClass =
  `${bookingActionButtonClass} border border-rose-200 bg-white text-rose-600 hover:-translate-y-[1px] hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700`;

const parseLegacyPlanDays = (value = "") => {
  const text = String(value || "").trim();
  if (!text) return [];

  const lines = text.replace(/\r\n/g, "\n").split(/\n/);
  const days = [];
  let currentDay = null;

  lines.forEach((rawLine) => {
    const line = String(rawLine || "").trim();
    if (!line) return;

    const dayMatch = line.match(/^Day\s*(\d+)\s*:\s*(.*)$/i);
    if (dayMatch) {
      if (currentDay) days.push(currentDay);
      currentDay = {
        title: dayMatch[2].trim(),
        planLines: [],
      };
      return;
    }

    if (currentDay) {
      currentDay.planLines.push(line);
    }
  });

  if (currentDay) days.push(currentDay);

  if (days.length) {
    return days.map((item, index) => ({
      title: item.title || `Day ${index + 1}`,
      plan: item.planLines.join("\n").trim(),
    }));
  }

  return [
    {
      title: "",
      plan: text,
    },
  ];
};

const createItineraryDraft = (booking, context, isCustomBooking) => {
  const savedItinerary = booking.customItinerary || {};
  const legacyPlanDays = parseLegacyPlanDays(savedItinerary.planDetails || "");
  const savedPlanDays = Array.isArray(savedItinerary.planDays)
    ? savedItinerary.planDays
        .map((item) => ({
          title: item?.title || "",
          plan: item?.plan || "",
        }))
        .filter((item) => item.title || item.plan)
    : [];
  const standardTourPlanDays = !isCustomBooking && Array.isArray(context.itinerary) && context.itinerary.length
    ? context.itinerary.map((item, index) => ({
        title: item?.title || `Day ${item?.day || index + 1}`,
        plan: item?.description || "",
      }))
    : [];
  const preferredRoute = isCustomBooking
    ? (context.preferredDestinations !== "Flexible" ? context.preferredDestinations : context.sourceTourTitle)
    : context.route;
  const fallbackDuration = isCustomBooking
    ? [context.startDate, context.endDate].filter(Boolean).filter((item) => item !== "Flexible").join(" - ") || "Custom Duration"
    : context.durationLabel || context.travelDate || booking.travelTime || "Scheduled Tour";
  const fallbackBudget = isCustomBooking
    ? Number(String(context.budget || "0").replace(/[^\d.]/g, "")) || 0
    : Number(context.finalBudget || booking.amount || booking.totalAmount || 0);
  const hasMeaningfulSavedItinerary = Boolean(
    String(savedItinerary.title || "").trim() ||
    String(savedItinerary.route || "").trim() ||
    String(savedItinerary.durationLabel || "").trim() ||
    Number(savedItinerary.finalBudget || 0) > 0 ||
    String(savedItinerary.hotelPlan || "").trim() ||
    String(savedItinerary.vehiclePlan || "").trim() ||
    String(savedItinerary.planDetails || "").trim() ||
    savedPlanDays.length ||
    legacyPlanDays.length
  );

  return {
    planDays: savedPlanDays.length
      ? savedPlanDays
      : legacyPlanDays.length
        ? legacyPlanDays
        : standardTourPlanDays.length
          ? standardTourPlanDays
          : [
              {
                title: "",
                plan: context.requirements && context.requirements !== "None" ? context.requirements : "",
              },
            ],
    title: hasMeaningfulSavedItinerary && savedItinerary.title
      ? savedItinerary.title
      : `${isCustomBooking ? booking.customer : context.tourTitle || booking.tour || booking.customer} Itinerary`,
    route: hasMeaningfulSavedItinerary && savedItinerary.route ? savedItinerary.route : preferredRoute || booking.tour || "",
    durationLabel: hasMeaningfulSavedItinerary && savedItinerary.durationLabel ? savedItinerary.durationLabel : fallbackDuration,
    finalBudget: hasMeaningfulSavedItinerary && Number(savedItinerary.finalBudget || 0) > 0 ? savedItinerary.finalBudget : fallbackBudget,
    currency: (hasMeaningfulSavedItinerary && savedItinerary.currency) || context.currency || booking.currency || "PKR",
    hotelPlan: hasMeaningfulSavedItinerary && savedItinerary.hotelPlan ? savedItinerary.hotelPlan : prettifyValue(context.hotelPreference, "Not selected"),
    vehiclePlan: hasMeaningfulSavedItinerary && savedItinerary.vehiclePlan ? savedItinerary.vehiclePlan : prettifyValue(context.vehiclePreference, "Not selected"),
    planDetails: legacyPlanDays.length ? "" : savedItinerary.planDetails || "",
    status: savedItinerary.status || "draft",
  };
};

const BookingDetails = () => {
  const { id } = useParams();
  const toast = useToast();
  const { data: booking, refetch: refetchBooking } = useBooking(id);
  const { data: tours = [] } = useAdminTours();
  const updateBooking = useUpdateBooking();
  const confirmBookingPayment = useConfirmBookingPayment();
  const [isItineraryFormOpen, setIsItineraryFormOpen] = useState(false);
  const [openPlanDay, setOpenPlanDay] = useState(0);
  const [itineraryForm, setItineraryForm] = useState({
    planDays: [{ title: "", plan: "" }],
    title: "",
    route: "",
    durationLabel: "",
    finalBudget: 0,
    currency: "PKR",
    hotelPlan: "",
    vehiclePlan: "",
    planDetails: "",
    status: "draft",
  });

  const linkedTour = !booking || booking.bookingType === "custom" || booking.isCustomTour
    ? null
    : tours.find((item) => String(item.id || item._id || "") === String(booking.tourId || "")) || null;

  useEffect(() => {
    if (!booking) return;
    const isCustomBooking = booking.bookingType === "custom" || booking.isCustomTour;
    const context = isCustomBooking ? getCustomRequestDetails(booking) : getStandardBookingDetails(booking, linkedTour);
    setItineraryForm(createItineraryDraft(booking, context, isCustomBooking));
    setOpenPlanDay(0);
  }, [booking, linkedTour]);

  const updateStatus = async (newStatus) => {
    await updateBooking.mutateAsync({ id, status: newStatus });
  };

  const verifyAdvancePayment = async () => {
    const suggestedAdvance = booking.advanceAmount || Math.round(Number(booking.amount || 0) * 0.1);
    await confirmBookingPayment.mutateAsync({
      bookingId: id,
      paidAmount: suggestedAdvance,
      paymentMethod: booking.paymentMethod || "bank_transfer",
      transactionReference: booking.transactionReference || `admin_verify_${Date.now()}`,
    });
  };

  if (!booking) return <div className="admin-soft-muted p-6">Loading booking...</div>;

  const isCustomBooking = booking.bookingType === "custom" || booking.isCustomTour;
  const request = getCustomRequestDetails(booking);
  const standardDetails = getStandardBookingDetails(booking, linkedTour);
  const travelWindow = [request.startDate, request.endDate]
    .filter(Boolean)
    .filter((item) => item !== "Flexible")
    .join(" - ");
  const savedItinerary = booking.customItinerary || {};
  const hasSavedItinerary = Boolean(savedItinerary.title);
  const legacySavedDays = parseLegacyPlanDays(savedItinerary.planDetails || "");
  const itineraryDays = Array.isArray(savedItinerary.planDays) && savedItinerary.planDays.length
    ? savedItinerary.planDays.filter((item) => item?.title || item?.plan)
    : legacySavedDays;
  const extraNotes = Array.isArray(savedItinerary.planDays) && savedItinerary.planDays.length
    ? savedItinerary.planDetails || ""
    : "";
  const totalAmount = Number(booking.totalAmount || booking.amount || standardDetails.finalBudget || 0);
  const paidAmount = Number(booking.paidAmount || booking.advanceAmount || 0);
  const paymentPercent = totalAmount > 0 ? Math.min(100, Math.round((paidAmount / totalAmount) * 100)) : 0;
  const bookingStages = [
    { key: "created", title: "Booking Created", done: true, active: booking.status === "pending" && !booking.paymentVerified },
    {
      key: "advance",
      title: "Advance Received",
      done: paidAmount > 0,
      active: paidAmount > 0 && !booking.paymentVerified,
    },
    {
      key: "verified",
      title: "Payment Verification",
      done: Boolean(booking.paymentVerified),
      active: !booking.paymentVerified && !isCustomBooking,
    },
    {
      key: "confirmed",
      title: "Booking Confirmed",
      done: booking.status === "confirmed" || booking.status === "completed",
      active: booking.status === "confirmed" || booking.status === "completed",
    },
  ];

  const handleOpenItineraryEditor = () => {
    if (!booking) return;
    const context = isCustomBooking ? getCustomRequestDetails(booking) : getStandardBookingDetails(booking, linkedTour);
    setItineraryForm(createItineraryDraft(booking, context, isCustomBooking));
    setOpenPlanDay(0);
    setIsItineraryFormOpen(true);
  };

  const handleSaveItinerary = async (event) => {
    event.preventDefault();
    if (!itineraryForm.title.trim()) {
      toast.error("Missing title", "Please add an itinerary title first.");
      return;
    }

    try {
      await updateBooking.mutateAsync({
        id,
        customItinerary: {
          ...itineraryForm,
          planDays: itineraryForm.planDays
            .map((item) => ({
              title: item.title.trim(),
              plan: item.plan.trim(),
            }))
            .filter((item) => item.title || item.plan),
          title: itineraryForm.title.trim(),
          route: itineraryForm.route.trim(),
          hotelPlan: itineraryForm.hotelPlan.trim(),
          vehiclePlan: itineraryForm.vehiclePlan.trim(),
          planDetails: itineraryForm.planDetails.trim(),
          savedAt: new Date().toISOString(),
        },
      });
      await refetchBooking();
      toast.success("Itinerary saved", "The custom tour plan is now saved in the database and reloaded here.");
      setIsItineraryFormOpen(false);
    } catch (error) {
      toast.error("Save failed", error?.response?.data?.message || "Could not save the itinerary right now.");
    }
  };

  const handlePrintTourPlan = () => {
    const draftItinerary = {
      ...itineraryForm,
      title: itineraryForm.title?.trim(),
      route: itineraryForm.route?.trim(),
      hotelPlan: itineraryForm.hotelPlan?.trim(),
      vehiclePlan: itineraryForm.vehiclePlan?.trim(),
      planDetails: itineraryForm.planDetails?.trim(),
      planDays: Array.isArray(itineraryForm.planDays)
        ? itineraryForm.planDays
            .map((item) => ({
              title: String(item?.title || "").trim(),
              plan: String(item?.plan || "").trim(),
            }))
            .filter((item) => item.title || item.plan)
        : [],
    };
    const itinerary = booking.customItinerary?.title ? booking.customItinerary : draftItinerary;
    if (!itinerary.title) return;

    const printDays = Array.isArray(itinerary.planDays) && itinerary.planDays.length
      ? itinerary.planDays
      : parseLegacyPlanDays(itinerary.planDetails || "");

    const summaryRows = isCustomBooking
      ? [
          ["Requested Destinations", request.preferredDestinations || "Flexible"],
          ["Route", itinerary.route || request.sourceTourTitle || "-"],
          ["Duration", itinerary.durationLabel || travelWindow || "Custom Duration"],
          ["Final Budget", `${itinerary.currency || booking.currency || "PKR"} ${itinerary.finalBudget || 0}`],
          ["Hotel Plan", itinerary.hotelPlan || prettifyValue(request.hotelPreference, "Not selected")],
          ["Vehicle Plan", itinerary.vehiclePlan || prettifyValue(request.vehiclePreference, "Not selected")],
        ]
      : [
          ["Tour", booking.tour || "Selected Tour"],
          ["Route", itinerary.route || standardDetails.route || "-"],
          ["Travel Date", standardDetails.travelDate || "Scheduled Tour"],
          ["Final Budget", `${itinerary.currency || booking.currency || "PKR"} ${itinerary.finalBudget || booking.amount || 0}`],
          ["Hotel Plan", itinerary.hotelPlan || prettifyValue(standardDetails.hotelPreference, "Not selected")],
          ["Vehicle Plan", itinerary.vehiclePlan || prettifyValue(standardDetails.vehiclePreference, "Not selected")],
        ];

    const extraNotes = itinerary.planDays?.length ? itinerary.planDetails || "" : "";
    const brandColor = "#20b77a";
    const win = window.open("", "_blank", "width=960,height=760");
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>${itinerary.title || "Tour Plan"} - Print</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              color: #111827;
              background: #ffffff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .sheet {
              max-width: 860px;
              margin: 0 auto;
              background: #ffffff;
              padding: 28px 30px 32px;
            }
            .header {
              padding-bottom: 18px;
              border-bottom: 1px solid #e5e7eb;
            }
            .header-grid {
              display: grid;
              grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.85fr);
              gap: 18px;
              align-items: start;
            }
            .eyebrow {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              font-size: 10px;
              font-weight: 700;
              letter-spacing: 0.18em;
              text-transform: uppercase;
              color: #4b5563;
              margin: 0 0 8px;
            }
            .eyebrow::before {
              content: "";
              width: 20px;
              height: 1px;
              border-radius: 999px;
              background: #9ca3af;
            }
            .title {
              margin: 0;
              font-size: 28px;
              line-height: 1.15;
              letter-spacing: -0.02em;
              font-weight: 700;
              color: #111827;
            }
            .subtitle {
              margin: 10px 0 0;
              max-width: 100%;
              font-size: 13px;
              line-height: 1.7;
              color: #4b5563;
            }
            .meta-panel {
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              background: #ffffff;
              padding: 12px;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 8px;
            }
            .meta-card {
              border-radius: 8px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              padding: 10px 11px;
            }
            .meta-card .label {
              font-size: 9px;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: #6b7280;
              font-weight: 700;
            }
            .meta-card .value {
              margin-top: 5px;
              font-size: 13px;
              line-height: 1.4;
              color: #111827;
              font-weight: 700;
            }
            .body {
              padding-top: 22px;
            }
            .section {
              margin-top: 22px;
            }
            .section-title {
              margin: 0 0 10px;
              font-size: 10px;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: #6b7280;
              font-weight: 700;
            }
            .intro-grid {
              display: grid;
              grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
              gap: 12px;
            }
            .intro-card,
            .summary-card {
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              background: #ffffff;
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .intro-card {
              padding: 14px 16px;
            }
            .intro-title {
              margin: 0;
              font-size: 10px;
              font-weight: 700;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: #6b7280;
            }
            .intro-value {
              margin: 8px 0 0;
              font-size: 13px;
              line-height: 1.7;
              color: #374151;
              font-weight: 400;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 12px 14px;
              border-bottom: 1px solid #e5e7eb;
              text-align: left;
              vertical-align: top;
            }
            tr:last-child th, tr:last-child td {
              border-bottom: none;
            }
            th {
              width: 28%;
              font-size: 9px;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: #6b7280;
              font-weight: 700;
              background: #f9fafb;
            }
            td {
              font-size: 13px;
              line-height: 1.7;
              color: #111827;
              font-weight: 500;
            }
            .day-card {
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 14px 16px;
              margin-bottom: 12px;
              background: #ffffff;
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .day-kicker {
              margin: 0;
              font-size: 9px;
              font-weight: 700;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: #6b7280;
            }
            .day-title {
              margin: 8px 0 0;
              font-size: 16px;
              line-height: 1.35;
              letter-spacing: -0.01em;
              color: #111827;
              font-weight: 700;
            }
            .day-plan {
              margin: 8px 0 0;
              font-size: 13px;
              line-height: 1.75;
              color: #4b5563;
              white-space: pre-line;
              font-weight: 400;
            }
            .notes-card {
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 14px 16px;
              background: #ffffff;
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .notes-text {
              margin: 0;
              font-size: 13px;
              line-height: 1.75;
              color: #4b5563;
              white-space: pre-line;
              font-weight: 400;
            }
            .footer-note {
              margin-top: 18px;
              padding-top: 12px;
              border-top: 1px solid #e5e7eb;
              font-size: 9px;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: #9ca3af;
              font-weight: 600;
            }
            @media print {
              body {
                background: #ffffff;
              }
              .sheet {
                margin: 0 auto;
                padding: 0;
              }
              .day-card,
              .intro-card,
              .summary-card,
              .notes-card,
              table,
              tr,
              td,
              th {
                break-inside: avoid;
                page-break-inside: avoid;
              }
            }
            @page {
              margin: 10mm;
            }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="header">
              <div class="header-grid">
                <div>
                  <p class="eyebrow">${isCustomBooking ? "Custom Tour Plan" : "Standard Tour Plan"}</p>
                  <h1 class="title">${itinerary.title || "Created Tour Plan"}</h1>
                  <p class="subtitle">Prepared for ${booking.customer || "Customer"} from ${isCustomBooking ? `custom request ${booking.bookingCode || ""}` : `booking ${booking.bookingCode || ""}`}. This print view summarizes the approved route, travel setup, and day-wise itinerary in one clean document.</p>
                </div>
                <div class="meta-panel">
                  <div class="meta-grid">
                    <div class="meta-card">
                      <div class="label">Booking Code</div>
                      <div class="value">${booking.bookingCode || "-"}</div>
                    </div>
                    <div class="meta-card">
                      <div class="label">Plan Status</div>
                      <div class="value">${prettifyValue(itinerary.status || "draft", "Draft")}</div>
                    </div>
                    <div class="meta-card">
                      <div class="label">Saved At</div>
                      <div class="value">${itinerary.savedAt ? new Date(itinerary.savedAt).toLocaleDateString() : "Just now"}</div>
                    </div>
                    <div class="meta-card">
                      <div class="label">Budget</div>
                      <div class="value">${itinerary.currency || booking.currency || "PKR"} ${itinerary.finalBudget || booking.amount || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="body">
              <section class="section" style="margin-top:0;">
                <h2 class="section-title">Overview</h2>
                <div class="intro-grid">
                  <div class="intro-card">
                    <p class="intro-title">Prepared For</p>
                    <p class="intro-value">${booking.customer || "Customer"}<br />${booking.email || "-"}<br />${booking.phone || "-"}</p>
                  </div>
                  <div class="intro-card">
                    <p class="intro-title">${isCustomBooking ? "Trip Context" : "Booking Context"}</p>
                    <p class="intro-value">${isCustomBooking ? `Requested destinations: ${request.preferredDestinations || "Flexible"}<br />Travel window: ${travelWindow || "Flexible"}` : `Tour: ${booking.tour || "Selected Tour"}<br />Travel date: ${standardDetails.travelDate || "Scheduled Tour"}`}</p>
                  </div>
                </div>
              </section>

              <section class="section">
                <h2 class="section-title">Plan Summary</h2>
                <div class="summary-card">
                  <table>
                    <tbody>
                      ${summaryRows
                        .map(
                          ([label, value]) => `
                            <tr>
                              <th>${label}</th>
                              <td>${value || "-"}</td>
                            </tr>
                          `,
                        )
                        .join("")}
                    </tbody>
                  </table>
                </div>
              </section>

              <section class="section">
                <h2 class="section-title">Day Wise Itinerary</h2>
                ${printDays.length
                  ? printDays
                      .map(
                        (item, index) => `
                          <article class="day-card">
                            <p class="day-kicker">Day ${index + 1}</p>
                            <h3 class="day-title">${item.title || `Plan ${index + 1}`}</h3>
                            <p class="day-plan">${item.plan || "No day plan added yet."}</p>
                          </article>
                        `,
                      )
                      .join("")
                  : `
                      <article class="day-card">
                        <p class="day-kicker">Itinerary</p>
                        <h3 class="day-title">Custom Plan</h3>
                        <p class="day-plan">${(isCustomBooking ? request.requirements : standardDetails.requirements) || "No itinerary details added yet."}</p>
                      </article>
                    `}
              </section>

              ${extraNotes
                ? `
                  <section class="section">
                    <h2 class="section-title">Extra Notes</h2>
                    <div class="notes-card">
                      <p class="notes-text">${extraNotes}</p>
                    </div>
                  </section>
                `
                : ""}

              <div class="footer-note">North Luxe Travel Plan Document</div>
            </div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 350);
  };

  return (
    <div className="mx-auto max-w-[1480px] space-y-4">
      <section className="admin-soft-panel rounded-[1.5rem] p-5 md:p-6">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_390px]">
          <div className="space-y-4">
            <Link to="/admin/bookings" className="admin-soft-button-ghost inline-flex w-fit items-center gap-2 px-4 py-2.5 text-[11px] font-black tracking-[0.01em]">
              <ArrowLeft size={14} />
              Back to Bookings
            </Link>
            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#7184a0]">Booking Details</p>
              <h1 className="text-[2.15rem] font-black tracking-[-0.04em] text-[#132847]">Booking #{booking.bookingCode}</h1>
              <p className="max-w-3xl text-[15px] leading-7 text-[#7184a0]">
                {isCustomBooking
                  ? "Review customer request, travel setup, payment progress, and itinerary actions from one organized workspace."
                  : "Review customer information, tour setup, payment progress, and booking actions from one organized workspace."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${statusStyles[booking.status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                {prettifyValue(booking.status, "Pending")}
              </span>
              {!isCustomBooking ? (
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${paymentStyles[booking.payment] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                  {booking.payment || "Pending"}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2 rounded-full border border-[#dbe5f0] bg-[#eef4fb] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#7184a0]">
                {booking.date ? new Date(booking.date).toLocaleDateString() : "Date Pending"}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoChip label="Customer" value={booking.customer || "Not provided"} accent />
            <InfoChip label="Tour" value={isCustomBooking ? request.preferredDestinations : booking.tour || "Not provided"} accent />
            <InfoChip label="Advance Paid" value={`${booking.currency || "PKR"} ${booking.advanceAmount || 0}`} />
            <InfoChip label="Balance Left" value={`${booking.currency || "PKR"} ${booking.remainingAmount || Math.max(totalAmount - paidAmount, 0)}`} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.95fr)]">
        <section className="admin-soft-panel rounded-[1.35rem] p-5">
          <div className="space-y-4">
            <div>
              <h2 className="text-[16px] font-black text-[#132847]">Booking Progress</h2>
            </div>
            <div className="relative grid gap-4 sm:grid-cols-4">
              <div className="absolute left-5 right-5 top-4 hidden h-[3px] rounded-full bg-[#23ad67] sm:block" />
              {bookingStages.map((stage, index) => (
                <div key={stage.key} className="relative z-[1] flex flex-col items-start gap-3 sm:items-center">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-black ${
                    stage.done || stage.active
                      ? "border-[#23ad67] bg-[#23ad67] text-white"
                      : "border-[#dce6ef] bg-white text-[#90a0b5]"
                  }`}>
                    {stage.done ? <Check size={14} /> : index + 1}
                  </span>
                  <p className={`text-[13px] font-bold ${stage.done || stage.active ? "text-[#132847]" : "text-[#8091a7]"}`}>
                    {stage.title.replace("Payment Verification", "Payment Review")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-soft-panel rounded-[1.35rem] p-5">
          <div className="space-y-4">
            <div>
              <h2 className="text-[16px] font-black text-[#132847]">Payment Progress</h2>
              <p className="mt-2 text-[14px] font-semibold text-[#7184a0]">{`${booking.currency || "PKR"} ${paidAmount || 0} paid of ${booking.currency || "PKR"} ${totalAmount || 0}`}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#e8eef4]">
                <div className="h-full rounded-full bg-[#23ad67]" style={{ width: `${paymentPercent}%` }} />
              </div>
              <span className="text-[14px] font-black text-[#132847]">{paymentPercent}%</span>
            </div>
          </div>
        </section>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard icon={UserRound} title="Customer Information">
          <DetailRow label="Name" value={booking.customer || "Not provided"} accent />
          <DetailRow label="Email" value={booking.email || "Not provided"} />
          <DetailRow label="Phone" value={booking.phone || "Not provided"} />
          <DetailRow label="Group Size" value={booking.groupSize || booking.adults || request.persons || "Not provided"} />
        </SectionCard>

        <SectionCard icon={MapPinned} title="Tour & Payment">
          <DetailRow label="Tour" value={isCustomBooking ? request.preferredDestinations : booking.tour || "Not provided"} accent />
          <DetailRow label="Travel Date" value={isCustomBooking ? (travelWindow || "Flexible") : (booking.date ? new Date(booking.date).toLocaleDateString() : "Not provided")} />
          <DetailRow label="Payment Method" value={prettifyValue(booking.paymentMethod, "Not provided")} />
          <DetailRow label="Payment Verified" value={booking.paymentVerified ? "Yes" : "No"} />
          <DetailRow label="Paid Amount" value={`${booking.currency || "PKR"} ${booking.paidAmount || 0}`} />
          <DetailRow label="Remaining Amount" value={`${booking.currency || "PKR"} ${booking.remainingAmount || 0}`} />
        </SectionCard>

        <SectionCard icon={Wallet} title="Booking Actions">
          <div className="space-y-3">
            {!isCustomBooking && booking.status === "pending" ? (
              <button
                onClick={() =>
                  toast.confirm(
                    "Confirm Booking?",
                    `This will mark ${booking.customer}'s booking as confirmed.`,
                    () => updateStatus("confirmed"),
                    { confirmLabel: "Confirm" },
                  )
                }
                className="admin-soft-button inline-flex w-full min-h-12 items-center justify-center gap-2 text-[15px] font-bold"
              >
                <BadgeCheck size={15} />
                Confirm Booking
              </button>
            ) : null}
            <button onClick={handleOpenItineraryEditor} className={`${bookingActionGhostClass} text-[#132847]`}>
              <PencilLine size={14} />
              Edit Itinerary
            </button>
            {!isCustomBooking && !booking.paymentVerified && booking.paymentMethod !== "pay_on_arrival" ? (
              <button
                onClick={() =>
                  toast.confirm(
                    "Verify Advance Payment?",
                    `This will verify the advance payment for ${booking.customer}'s booking.`,
                    verifyAdvancePayment,
                    { confirmLabel: "Verify" },
                  )
                }
                className={bookingActionSuccessClass}
              >
                Verify Advance Payment
              </button>
            ) : null}
            {!isCustomBooking && booking.status !== "cancelled" ? (
              <button
                onClick={() =>
                  toast.confirm(
                    "Cancel Booking?",
                    `This will change ${booking.customer}'s booking status to cancelled.`,
                    () => updateStatus("cancelled"),
                    { confirmLabel: "Cancel", tone: "danger" },
                  )
                }
                className={bookingActionDangerClass}
              >
                Cancel Booking
              </button>
            ) : null}
            <Link to="/admin/bookings" className={bookingActionGhostClass}>
              <ArrowLeft size={14} />
              Back to List
            </Link>
          </div>
        </SectionCard>

        {!isCustomBooking ? (
          <section className="admin-soft-panel rounded-[1.35rem] p-4 md:p-5 xl:col-span-2">
            <div className="flex items-center gap-3 border-b border-white/30 pb-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-[0.9rem] border border-white/45 bg-white/72 text-[var(--admin-accent)] shadow-[0_6px_14px_rgba(15,23,42,0.04)]">
                <CreditCard size={15} />
              </span>
              <h2 className="text-[15px] font-black tracking-tight text-[var(--admin-text)]">Client Payment Details</h2>
            </div>
            <div className="grid gap-x-8 gap-y-0 pt-3 md:grid-cols-2">
              <DetailRow label="Sender Name" value={booking.manualPayment?.senderName || "Not provided"} />
              <DetailRow label="Sender Number / Account" value={booking.manualPayment?.senderNumber || "Not provided"} />
              <DetailRow label="Amount Sent" value={booking.manualPayment?.sentAmount ? `${booking.currency} ${booking.manualPayment.sentAmount}` : "Not provided"} />
              <DetailRow label="Payment Date" value={booking.manualPayment?.sentAt ? new Date(booking.manualPayment.sentAt).toLocaleString() : "Not provided"} />
              <DetailRow label="Reference" value={booking.transactionReference || "Not provided"} />
              <DetailRow label="Reference Slip" value={booking.manualPayment?.slipName || (booking.manualPayment?.slip ? "Uploaded" : "Not uploaded")} />
            </div>
          </section>
        ) : null}

        {!isCustomBooking ? (
          <SectionCard icon={FileText} title="Reference Slip">
            <div className="space-y-3">
              <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[1.15rem] border border-[#dbe5f0] bg-[#fbfdff] px-4 text-center">
                {booking.manualPayment?.slip ? (
                  <a
                    href={booking.manualPayment.slip}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-col items-center gap-3 text-[#129655]"
                  >
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#e5f5ec] text-[#129655]">
                      <Upload size={22} />
                    </span>
                    <span className="text-[15px] font-bold">Preview uploaded slip</span>
                    <span className="text-[13px] text-[#7184a0]">{booking.manualPayment?.slipName || "View payment proof"}</span>
                  </a>
                ) : (
                  <>
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#e5f5ec] text-[#129655]">
                      <Upload size={22} />
                    </span>
                    <p className="mt-4 text-[15px] font-bold text-[#7184a0]">No slip uploaded</p>
                    <p className="mt-1 text-[13px] text-[#94a3b8]">Customer-uploaded payment proof will appear here automatically.</p>
                  </>
                )}
              </div>
            </div>
          </SectionCard>
        ) : null}

        <SectionCard icon={ShieldCheck} title="Identity Details">
          {!isCustomBooking ? (
            <>
              <DetailRow label="Traveler Type" value={prettifyValue(booking.identity?.travelerType, "Not provided")} />
              <DetailRow label="Local ID" value={[prettifyValue(booking.identity?.local?.type, ""), booking.identity?.local?.value].filter(Boolean).join(" / ") || "Not provided"} />
              <DetailRow label="Country" value={booking.identity?.international?.country || "Not provided"} />
              <DetailRow label="Passport" value={booking.identity?.international?.passportNumber || "Not provided"} />
            </>
          ) : (
            <>
              <DetailRow label="Persons" value={request.persons || "Not provided"} />
              <DetailRow label="Children Below 3" value={request.childrenBelowThree} />
              <DetailRow label="Budget" value={request.budget || "Not provided"} />
              <DetailRow label="Budget Mode" value={prettifyValue(request.budgetMode, "Not provided")} />
            </>
          )}
        </SectionCard>

        <SectionCard icon={CalendarDays} title="Facilities & Add-ons">
          <DetailRow label="Hotel" value={prettifyValue(isCustomBooking ? request.hotelPreference : booking.facilities?.hotelType, "Not selected")} />
          <DetailRow label="Vehicle" value={prettifyValue(isCustomBooking ? request.vehiclePreference : booking.facilities?.vehicleType, "Not selected")} />
          {!isCustomBooking ? <DetailRow label="Meals" value={prettifyValue(booking.facilities?.meals, "Not selected")} /> : null}
          {!isCustomBooking ? <DetailRow label="Add-ons" value={booking.facilities?.addOns?.length ? booking.facilities.addOns.map((item) => prettifyValue(item, item)).join(", ") : "None"} multiline /> : null}
          {isCustomBooking ? <DetailRow label="Requirements" value={request.requirements || "Not provided"} multiline /> : null}
        </SectionCard>

        <SectionCard icon={FileText} title="Admin Notes">
          <div className="rounded-[1rem] border border-white/35 bg-white/74 px-4 py-3.5 text-[13.5px] leading-6 text-slate-600 dark:text-slate-300">
            {booking.notes || booking.specialRequirements || "No admin notes added yet."}
          </div>
        </SectionCard>

        {(isCustomBooking || hasSavedItinerary || isItineraryFormOpen) ? (
          <section className="xl:col-span-2">
            <SectionCard icon={FileText} title="Created Tour Plan">
              {hasSavedItinerary ? (
                <>
                  <DetailRow label="Itinerary Title" value={savedItinerary.title} accent />
                  <DetailRow label="Route" value={savedItinerary.route || request.preferredDestinations || "Not provided"} />
                  <DetailRow label="Duration" value={savedItinerary.durationLabel || travelWindow || "Custom Duration"} />
                  <DetailRow label="Final Budget" value={`${savedItinerary.currency || booking.currency || "PKR"} ${savedItinerary.finalBudget || 0}`} />
                  <DetailRow label="Hotel Plan" value={savedItinerary.hotelPlan || prettifyValue(request.hotelPreference, "Not selected")} />
                  <DetailRow label="Vehicle Plan" value={savedItinerary.vehiclePlan || prettifyValue(request.vehiclePreference, "Not selected")} />
                  <DetailRow label="Status" value={prettifyValue(savedItinerary.status, "Draft")} />
                  <DetailRow label="Saved At" value={savedItinerary.savedAt ? new Date(savedItinerary.savedAt).toLocaleString() : "Just now"} />
                  {itineraryDays.length ? (
                    <div className="space-y-3.5 border-b border-white/30 py-3.5 last:border-b-0">
                      <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--admin-muted)]">Day-wise Plan</span>
                      <div className="space-y-3">
                        {itineraryDays.map((item, index) => (
                          <div key={`saved-day-${index}`} className="rounded-[1rem] border border-white/35 bg-white/72 px-4 py-3.5 shadow-[0_8px_18px_rgba(15,23,42,0.03)]">
                            <p className="text-[14px] font-black text-[var(--admin-text)]">{`Day ${index + 1}${item.title ? `: ${item.title}` : ""}`}</p>
                            <p className="mt-1.5 whitespace-pre-line text-[13.5px] font-medium leading-6 text-slate-600 dark:text-slate-300">{item.plan || "No plan added yet."}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {extraNotes ? <DetailRow label="Extra Notes" value={extraNotes} multiline /> : null}
                </>
              ) : (
                <p className="text-sm text-[var(--admin-muted)]">No itinerary has been created yet for this booking.</p>
              )}
            </SectionCard>
          </section>
        ) : null}

          {isItineraryFormOpen ? (
            <section className="admin-soft-form rounded-[1.35rem] p-4 md:p-5 xl:col-span-2">
              <div className="border-b border-white/30 pb-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Edit Itinerary</p>
                <h2 className="mt-1.5 text-[15px] font-bold tracking-tight text-slate-950">Tour Plan Builder</h2>
                <p className="mt-1 text-[13px] text-slate-500">The selected tour data is prefilled here. Update the itinerary and save it for this booking.</p>
              </div>
              <form onSubmit={handleSaveItinerary} className="mt-4 grid gap-3.5 md:grid-cols-2">
                <label className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Itinerary Title</span>
                  <input className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.title} onChange={(e) => setItineraryForm((prev) => ({ ...prev, title: e.target.value }))} />
                </label>
                <label className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Route</span>
                  <input className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.route} onChange={(e) => setItineraryForm((prev) => ({ ...prev, route: e.target.value }))} />
                </label>
                <label className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Duration</span>
                  <input className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.durationLabel} onChange={(e) => setItineraryForm((prev) => ({ ...prev, durationLabel: e.target.value }))} />
                </label>
                <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-3">
                  <label className="space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Currency</span>
                    <input className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.currency} onChange={(e) => setItineraryForm((prev) => ({ ...prev, currency: e.target.value }))} />
                  </label>
                  <label className="space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Final Budget</span>
                    <input type="number" min="0" className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.finalBudget} onChange={(e) => setItineraryForm((prev) => ({ ...prev, finalBudget: Number(e.target.value || 0) }))} />
                  </label>
                </div>
                <label className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Hotel Plan</span>
                  <input className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.hotelPlan} onChange={(e) => setItineraryForm((prev) => ({ ...prev, hotelPlan: e.target.value }))} />
                </label>
                <label className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Vehicle Plan</span>
                  <input className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.vehiclePlan} onChange={(e) => setItineraryForm((prev) => ({ ...prev, vehiclePlan: e.target.value }))} />
                </label>
                <label className="space-y-3 md:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Day-wise Itinerary</span>
                    <button
                      type="button"
                      onClick={() => {
                        setItineraryForm((prev) => ({
                          ...prev,
                          planDays: [...prev.planDays, { title: "", plan: "" }],
                        }));
                        setOpenPlanDay(itineraryForm.planDays.length);
                      }}
                      className="admin-soft-button-ghost inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--c-brand)]"
                    >
                      <PlusSquare size={13} />
                      Add Day
                    </button>
                  </div>
                  <div className="space-y-3">
                    {itineraryForm.planDays.map((item, index) => (
                      <div key={`itinerary-day-${index}`} className="overflow-hidden rounded-[1rem] border border-slate-200 bg-slate-50">
                        <button
                          type="button"
                          onClick={() => setOpenPlanDay((prev) => (prev === index ? -1 : index))}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                        >
                          <p className="text-sm font-medium text-slate-900">{`Day ${index + 1}${item.title ? `: ${item.title}` : ""}`}</p>
                          <div className="flex items-center gap-2">
                            <ChevronDown size={15} className={`text-slate-500 transition-transform ${openPlanDay === index ? "rotate-180" : ""}`} />
                          </div>
                        </button>

                        {openPlanDay === index ? (
                          <div className="space-y-3 border-t border-slate-200 px-4 py-4">
                            <input
                              className="w-full rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none"
                              value={item.title}
                              onChange={(e) =>
                                setItineraryForm((prev) => ({
                                  ...prev,
                                  planDays: prev.planDays.map((dayItem, dayIndex) =>
                                    dayIndex === index ? { ...dayItem, title: e.target.value } : dayItem,
                                  ),
                                }))
                              }
                              placeholder="Day title"
                            />
                            <textarea
                              rows={4}
                              className="w-full rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none"
                              value={item.plan}
                              onChange={(e) =>
                                setItineraryForm((prev) => ({
                                  ...prev,
                                  planDays: prev.planDays.map((dayItem, dayIndex) =>
                                    dayIndex === index ? { ...dayItem, plan: e.target.value } : dayItem,
                                  ),
                                }))
                              }
                              placeholder="Short day plan"
                            />
                            {itineraryForm.planDays.length > 1 ? (
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setItineraryForm((prev) => ({
                                      ...prev,
                                      planDays: prev.planDays.filter((_, dayIndex) => dayIndex !== index),
                                    }));
                                    setOpenPlanDay((prev) => {
                                      if (prev === index) return Math.max(0, index - 1);
                                      if (prev > index) return prev - 1;
                                      return prev;
                                    });
                                  }}
                                  className="admin-soft-button-ghost inline-flex items-center gap-1.5 text-rose-600"
                                >
                                  <Trash2 size={12} />
                                  Remove Day
                                </button>
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </label>
                <label className="space-y-2.5 md:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Extra Notes</span>
                  <textarea rows={4} className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.planDetails} onChange={(e) => setItineraryForm((prev) => ({ ...prev, planDetails: e.target.value }))} placeholder="Extra notes" />
                </label>
                <label className="space-y-2.5 md:col-span-2 max-w-[240px]">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Plan Status</span>
                  <select className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.status} onChange={(e) => setItineraryForm((prev) => ({ ...prev, status: e.target.value }))}>
                    <option value="draft">Draft</option>
                    <option value="final">Final</option>
                  </select>
                </label>
                <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                  <button type="submit" className="admin-soft-button inline-flex items-center gap-2"><FileText size={14} />Save Itinerary</button>
                  <button type="button" onClick={handlePrintTourPlan} className="admin-soft-button-ghost inline-flex items-center gap-2 text-[var(--c-brand)]"><Printer size={14} />Print Final Itinerary</button>
                  <button type="button" onClick={() => setIsItineraryFormOpen(false)} className="admin-soft-button-ghost inline-flex items-center gap-2">Close</button>
                </div>
              </form>
            </section>
          ) : null}
      </div>
    </div>
  );
};

export default BookingDetails;
