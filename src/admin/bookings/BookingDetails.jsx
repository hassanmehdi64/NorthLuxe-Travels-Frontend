import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  CreditCard,
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

const DetailRow = ({ label, value, accent = false, multiline = false }) => (
  <div className={`gap-3 border-b border-slate-100 py-1.5 last:border-b-0 ${multiline ? "space-y-1" : "flex items-start justify-between"}`}>
    <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">{label}</span>
    {multiline ? (
      <p className="whitespace-pre-line rounded-lg bg-slate-50 px-3 py-2 text-[13px] font-normal leading-5 text-slate-600">
        {value || "-"}
      </p>
    ) : (
      <span
        className={[
          "text-[13px] font-medium leading-5",
          accent ? "text-slate-950" : "text-slate-700",
          "text-right",
        ].join(" ")}
      >
        {value || "-"}
      </span>
    )}
  </div>
);

const SectionCard = ({ icon: Icon, title, children }) => (
  <section className="admin-soft-panel rounded-[1rem] p-3.5">
    <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--c-brand)]/10 text-[var(--c-brand)]">
        <Icon size={14} />
      </span>
      <h2 className="text-[14px] font-semibold tracking-tight text-slate-950">{title}</h2>
    </div>
    <div className="pt-2">{children}</div>
  </section>
);

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
    <div className="mx-auto max-w-6xl space-y-1.5">
      <div className="rounded-[1.1rem] border border-slate-200 bg-white p-3.5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] md:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1.5">
            <Link to="/admin/bookings" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-700 transition hover:border-[var(--c-brand)]/35 hover:text-[var(--c-brand)]">
              <ArrowLeft size={14} />
              Back to Bookings
            </Link>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Booking Details</p>
              <h1 className="mt-0.5 text-[1.35rem] font-semibold tracking-[-0.03em] text-slate-950 md:text-[1.6rem]">Booking #{booking.bookingCode}</h1>
              <p className="mt-1 text-[12px] leading-5 text-slate-500">
                {isCustomBooking
                  ? "Review the submitted custom trip request and create the itinerary inside the same request record."
                  : "Review customer details, payment progress, and booking setup in one place."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${statusStyles[booking.status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
              <BadgeCheck size={14} />
              {prettifyValue(booking.status, "Pending")}
            </span>
            {!isCustomBooking ? (
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${paymentStyles[booking.payment] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                <Wallet size={14} />
                {booking.payment || "Pending"}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-2.5 grid gap-1.5 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Customer</p><p className="mt-0.5 text-[13px] font-medium leading-5 text-slate-900">{booking.customer || "-"}</p></div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{isCustomBooking ? "Destinations" : "Tour"}</p><p className="mt-0.5 text-[13px] font-medium leading-5 text-slate-900">{isCustomBooking ? request.preferredDestinations : booking.tour || "-"}</p></div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{isCustomBooking ? "Travel Window" : "Advance"}</p><p className="mt-0.5 text-[13px] font-medium leading-5 text-slate-900">{isCustomBooking ? travelWindow || "Flexible" : `${booking.currency} ${booking.advanceAmount || 0}`}</p></div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{isCustomBooking ? "Budget" : "Remaining"}</p><p className="mt-0.5 text-[13px] font-medium leading-5 text-slate-900">{isCustomBooking ? request.budget : `${booking.currency} ${booking.remainingAmount || 0}`}</p></div>
        </div>
      </div>

      <div className="grid gap-1.5 xl:grid-cols-2">
        <SectionCard icon={UserRound} title="Customer Info">
          <DetailRow label="Name" value={booking.customer} accent />
          <DetailRow label="Email" value={booking.email} />
          <DetailRow label="Phone" value={booking.phone} />
          <DetailRow label="Group Size" value={booking.groupSize || booking.adults || "-"} />
        </SectionCard>

        <SectionCard icon={MapPinned} title={isCustomBooking ? "Request Details" : "Tour & Payment"}>
          {isCustomBooking ? (
            <>
              <DetailRow label="Preferred Destinations" value={request.preferredDestinations} accent />
              <DetailRow label="Source Tour" value={request.sourceTourTitle} />
              <DetailRow label="Start Date" value={request.startDate} />
              <DetailRow label="End Date" value={request.endDate} />
              <DetailRow label="Budget" value={request.budget} />
              <DetailRow label="Budget Mode" value={prettifyValue(request.budgetMode, "Not specified")} />
            </>
          ) : (
            <>
              <DetailRow label="Tour" value={booking.tour} accent />
              <DetailRow label="Travel Date" value={booking.date ? new Date(booking.date).toLocaleDateString() : "-"} />
              <DetailRow label="Payment Method" value={prettifyValue(booking.paymentMethod)} />
              <DetailRow label="Payment Verified" value={booking.paymentVerified ? "Yes" : "No"} />
              <DetailRow label="Paid Amount" value={`${booking.currency} ${booking.paidAmount || 0}`} />
              <DetailRow label="Remaining Amount" value={`${booking.currency} ${booking.remainingAmount || 0}`} />
            </>
          )}
        </SectionCard>

        <SectionCard icon={ShieldCheck} title={isCustomBooking ? "Trip Preferences" : "Identity"}>
          {isCustomBooking ? (
            <>
              <DetailRow label="Persons" value={request.persons} />
              <DetailRow label="Children Below 3" value={request.childrenBelowThree} />
              <DetailRow label="Requirements" value={request.requirements} multiline />
              <DetailRow label="Submitted Note" value={booking.notes || "-"} />
            </>
          ) : (
            <>
              <DetailRow label="Traveler Type" value={prettifyValue(booking.identity?.travelerType)} />
              <DetailRow label="Local ID" value={[prettifyValue(booking.identity?.local?.type, ""), booking.identity?.local?.value].filter(Boolean).join(" / ") || "-"} />
              <DetailRow label="Country" value={booking.identity?.international?.country || "-"} />
              <DetailRow label="Passport" value={booking.identity?.international?.passportNumber || "-"} />
            </>
          )}
        </SectionCard>

        <SectionCard icon={CalendarDays} title={isCustomBooking ? "Travel Preferences" : "Facilities & Add-ons"}>
          <DetailRow label="Hotel" value={prettifyValue(isCustomBooking ? request.hotelPreference : booking.facilities?.hotelType, "Not selected")} />
          <DetailRow label="Vehicle" value={prettifyValue(isCustomBooking ? request.vehiclePreference : booking.facilities?.vehicleType, "Not selected")} />
          {!isCustomBooking ? <DetailRow label="Meals" value={prettifyValue(booking.facilities?.meals, "Not selected")} /> : null}
          {!isCustomBooking ? <DetailRow label="Add-ons" value={booking.facilities?.addOns?.length ? booking.facilities.addOns.map((item) => prettifyValue(item, item)).join(", ") : "None"} /> : null}
        </SectionCard>
      </div>

      {(isCustomBooking || hasSavedItinerary || isItineraryFormOpen) ? (
        <SectionCard icon={FileText} title="Created Tour Plan">
          {hasSavedItinerary ? (
            <>
              <DetailRow label="Itinerary Title" value={savedItinerary.title} accent />
              <DetailRow label="Route" value={savedItinerary.route || request.preferredDestinations} />
              <DetailRow label="Duration" value={savedItinerary.durationLabel || travelWindow || "Custom Duration"} />
              <DetailRow label="Final Budget" value={`${savedItinerary.currency || booking.currency || "PKR"} ${savedItinerary.finalBudget || 0}`} />
              <DetailRow label="Hotel Plan" value={savedItinerary.hotelPlan || prettifyValue(request.hotelPreference, "Not selected")} />
              <DetailRow label="Vehicle Plan" value={savedItinerary.vehiclePlan || prettifyValue(request.vehiclePreference, "Not selected")} />
              <DetailRow label="Status" value={prettifyValue(savedItinerary.status, "Draft")} />
              <DetailRow label="Saved At" value={savedItinerary.savedAt ? new Date(savedItinerary.savedAt).toLocaleString() : "Just now"} />
              {itineraryDays.length ? (
                <div className="space-y-3 border-b border-slate-100 py-2.5 last:border-b-0">
                  <span className="text-sm font-medium text-slate-500">Day-wise Plan</span>
                  <div className="space-y-3">
                    {itineraryDays.map((item, index) => (
                      <div key={`saved-day-${index}`} className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-950">{`Day ${index + 1}${item.title ? `: ${item.title}` : ""}`}</p>
                        <p className="mt-2 whitespace-pre-line text-sm font-normal leading-7 text-slate-600">{item.plan || "No plan added yet."}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {extraNotes ? <DetailRow label="Extra Notes" value={extraNotes} multiline /> : null}
            </>
          ) : (
            <p className="text-sm text-slate-500">No itinerary has been created yet for this booking.</p>
          )}
        </SectionCard>
      ) : null}

      {isItineraryFormOpen ? (
        <section className="admin-soft-form rounded-[1.4rem] p-4">
          <div className="border-b border-slate-100 pb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Edit Itinerary</p>
            <h2 className="mt-1.5 text-lg font-bold tracking-tight text-slate-950">Tour Plan Builder</h2>
            <p className="mt-1 text-[13px] text-slate-500">The selected tour data is prefilled here. Update the itinerary and save it for this booking.</p>
          </div>
          <form onSubmit={handleSaveItinerary} className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Itinerary Title</span>
              <input className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.title} onChange={(e) => setItineraryForm((prev) => ({ ...prev, title: e.target.value }))} />
            </label>
            <label className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Route</span>
              <input className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.route} onChange={(e) => setItineraryForm((prev) => ({ ...prev, route: e.target.value }))} />
            </label>
            <label className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Duration</span>
              <input className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.durationLabel} onChange={(e) => setItineraryForm((prev) => ({ ...prev, durationLabel: e.target.value }))} />
            </label>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-3">
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Currency</span>
                <input className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.currency} onChange={(e) => setItineraryForm((prev) => ({ ...prev, currency: e.target.value }))} />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Final Budget</span>
                <input type="number" min="0" className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.finalBudget} onChange={(e) => setItineraryForm((prev) => ({ ...prev, finalBudget: Number(e.target.value || 0) }))} />
              </label>
            </div>
            <label className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Hotel Plan</span>
              <input className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.hotelPlan} onChange={(e) => setItineraryForm((prev) => ({ ...prev, hotelPlan: e.target.value }))} />
            </label>
            <label className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Vehicle Plan</span>
              <input className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.vehiclePlan} onChange={(e) => setItineraryForm((prev) => ({ ...prev, vehiclePlan: e.target.value }))} />
            </label>
            <label className="space-y-2 md:col-span-2">
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
              <div className="space-y-2.5">
                {itineraryForm.planDays.map((item, index) => (
                  <div key={`itinerary-day-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setOpenPlanDay((prev) => (prev === index ? -1 : index))}
                      className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
                    >
                      <p className="text-sm font-medium text-slate-900">{`Day ${index + 1}${item.title ? `: ${item.title}` : ""}`}</p>
                      <div className="flex items-center gap-2">
                        <ChevronDown size={15} className={`text-slate-500 transition-transform ${openPlanDay === index ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    {openPlanDay === index ? (
                      <div className="space-y-2 border-t border-slate-200 px-3 py-3">
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
            <label className="space-y-2 md:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Extra Notes</span>
              <textarea rows={4} className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.planDetails} onChange={(e) => setItineraryForm((prev) => ({ ...prev, planDetails: e.target.value }))} placeholder="Extra notes" />
            </label>
            <label className="space-y-2 md:col-span-2 max-w-[220px]">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Plan Status</span>
              <select className="w-full rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" value={itineraryForm.status} onChange={(e) => setItineraryForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option value="draft">Draft</option>
                <option value="final">Final</option>
              </select>
            </label>
            <div className="md:col-span-2 flex flex-wrap gap-2 pt-2">
              <button type="submit" className="admin-soft-button inline-flex items-center gap-2"><FileText size={14} />Save Itinerary</button>
              <button type="button" onClick={handlePrintTourPlan} className="admin-soft-button-ghost inline-flex items-center gap-2 text-[var(--c-brand)]"><Printer size={14} />Print Final Itinerary</button>
              <button type="button" onClick={() => setIsItineraryFormOpen(false)} className="admin-soft-button-ghost inline-flex items-center gap-2">Close</button>
            </div>
          </form>
        </section>
      ) : null}

      {!isCustomBooking && booking.manualPayment && (booking.manualPayment.senderName || booking.manualPayment.senderNumber || booking.manualPayment.sentAmount || booking.transactionReference || booking.manualPayment?.slip) ? (
        <SectionCard icon={CreditCard} title="Client Payment Details">
          <DetailRow label="Sender Name" value={booking.manualPayment.senderName || "-"} />
          <DetailRow label="Sender Number / Account" value={booking.manualPayment.senderNumber || "-"} />
          <DetailRow label="Amount Sent" value={booking.manualPayment.sentAmount ? `${booking.currency} ${booking.manualPayment.sentAmount}` : "-"} />
          <DetailRow label="Payment Date" value={booking.manualPayment.sentAt ? new Date(booking.manualPayment.sentAt).toLocaleString() : "-"} />
          <DetailRow label="Reference" value={booking.transactionReference || "-"} />
          <div className="flex items-start justify-between gap-4 py-2.5">
            <span className="text-sm font-medium text-slate-500">Reference Slip</span>
            {booking.manualPayment?.slip ? (
              <a href={booking.manualPayment.slip} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"><FileText size={14} />{booking.manualPayment?.slipName || "View uploaded slip"}</a>
            ) : (
              <span className="text-sm font-semibold text-slate-700">-</span>
            )}
          </div>
        </SectionCard>
      ) : null}

      <div className="admin-soft-panel rounded-[1rem] p-3">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button onClick={handleOpenItineraryEditor} className="admin-soft-button-ghost inline-flex min-h-9 items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[var(--c-brand)]">
              <PencilLine size={13} />
              Edit Itinerary
            </button>
            {!isCustomBooking ? (
              <>
                {booking.status === "pending" ? (
                  <button
                    onClick={() =>
                      toast.confirm(
                        "Confirm Booking?",
                        `This will mark ${booking.customer}'s booking as confirmed.`,
                        () => updateStatus("confirmed"),
                        {
                          confirmLabel: "Confirm",
                        },
                      )
                    }
                    className="admin-soft-button inline-flex min-h-9 items-center justify-center gap-2 px-3 py-2 text-xs font-medium"
                  >
                    <BadgeCheck size={13} />
                    Confirm Booking
                  </button>
                ) : null}
                {booking.status !== "cancelled" ? (
                  <button
                    onClick={() =>
                      toast.confirm(
                        "Cancel Booking?",
                        `This will change ${booking.customer}'s booking status to cancelled.`,
                        () => updateStatus("cancelled"),
                        {
                          confirmLabel: "Cancel",
                          tone: "danger",
                        },
                      )
                    }
                    className="admin-soft-button-ghost inline-flex min-h-9 items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-600"
                  >
                    <XCircle size={13} />
                    Cancel Booking
                  </button>
                ) : null}
                {!booking.paymentVerified && booking.paymentMethod !== "pay_on_arrival" ? (
                  <button
                    onClick={() =>
                      toast.confirm(
                        "Verify Advance Payment?",
                        `This will verify the advance payment for ${booking.customer}'s booking.`,
                        verifyAdvancePayment,
                        {
                          confirmLabel: "Verify",
                        },
                      )
                    }
                    className="admin-soft-button-ghost inline-flex min-h-9 items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[var(--c-brand)]"
                  >
                    <Wallet size={13} />
                    Verify Advance Payment
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {hasSavedItinerary ? (
              <button onClick={handlePrintTourPlan} className="admin-soft-button-ghost inline-flex min-h-9 items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[var(--c-brand)]"><Printer size={13} />Print Tour Plan</button>
            ) : null}
            <Link to="/admin/bookings" className="admin-soft-button-ghost inline-flex min-h-9 items-center justify-center gap-2 px-3 py-2 text-xs font-medium"><ArrowLeft size={13} />Back to List</Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BookingDetails;
