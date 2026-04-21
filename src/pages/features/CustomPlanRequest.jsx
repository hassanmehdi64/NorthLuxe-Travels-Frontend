import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import FeaturePageHeader from "../../components/features/FeaturePageHeader";
import { useCreatePublicBooking } from "../../hooks/useCms";
import { useToast } from "../../context/ToastContext";
import { formatCurrencyAmount } from "../../utils/currency";

const DESTINATION_OPTIONS = [
  "Hunza",
  "Skardu",
  "Fairy Meadows",
  "Nagar",
  "Astore",
  "Khaplu",
  "Shigar",
  "Deosai",
  "Gilgit",
  "Ghizer",
  "Other",
];

const HOTEL_OPTIONS = [
  { value: "no_hotel", label: "No Hotel" },
  { value: "3_star", label: "3 Star" },
  { value: "4_star", label: "4 Star" },
  { value: "5_star", label: "5 Star" },
];

const VEHICLE_OPTIONS = [
  { value: "standard_suv", label: "Standard SUV" },
  { value: "premium_suv", label: "Premium SUV" },
  { value: "hiace", label: "Hiace / Van" },
  { value: "other", label: "Other" },
];

const BUDGET_TYPE_OPTIONS = [
  { value: "total_trip", label: "Total Trip Budget" },
  { value: "per_person", label: "Per Person Budget" },
];

const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const useIsMobile = (breakpoint = 640) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
};

const BookingStyleDropdown = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  multiple = false,
  selectedValues = [],
  onToggleOption,
  renderValue,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const menuRef = useRef(null);
  const selectedOption = options.find((item) => item.value === value);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const rect = menuRef.current?.getBoundingClientRect();
    if (!rect) return;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownNeed = 270;
    setOpenUpward(spaceBelow < dropdownNeed && spaceAbove > spaceBelow);
  }, [open, options.length]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm text-theme transition ${
          open
            ? "border-[#67d7b2] bg-[#f2fff9] shadow-[0_5px_14px_rgba(123,231,196,0.14)]"
            : "border-[var(--c-border)] bg-white hover:border-[#8fdcc1] hover:bg-[#fbfffd]"
        }`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="block truncate">
          {renderValue
            ? renderValue()
            : selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div
          className={`absolute z-[120] w-full overflow-hidden rounded-2xl border border-[#89dfc3] bg-white p-1.5 shadow-[0_16px_32px_rgba(15,23,42,0.16)] ${
            openUpward ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <div className="max-h-60 overflow-auto space-y-1">
            {multiple
              ? options.map((item) => {
                  const active = selectedValues.includes(item.value);
                  return (
                    <label
                      key={item.value}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                        active ? "bg-[#dcf8ed] text-theme" : "bg-[#f8fffc] text-theme hover:bg-[#dcf8ed]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="ql-check"
                        checked={active}
                        onChange={() => onToggleOption?.(item.value)}
                      />
                      <span>{item.label}</span>
                    </label>
                  );
                })
              : options.map((item) => {
                  const active = item.value === value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        onChange?.(item.value);
                        setOpen(false);
                      }}
                      className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        active
                          ? "bg-[#20b77a] font-semibold text-white"
                          : "bg-[#f8fffc] text-theme hover:bg-[#dcf8ed]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
          </div>
          {children ? <div className="mt-2">{children}</div> : null}
        </div>
      ) : null}
    </div>
  );
};

const BookingStyleDateField = ({ value, onChange, placeholder = "Select date" }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const isMobile = useIsMobile(640);
  const selectedDate = useMemo(() => (value ? new Date(value) : undefined), [value]);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 360 });

  const updatePos = () => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = Math.min(360, window.innerWidth - 16);
    const left = Math.min(window.innerWidth - width - 8, Math.max(8, rect.left));
    setPos({
      top: rect.bottom + 10 + window.scrollY,
      left: left + window.scrollX,
      width,
    });
  };

  useLayoutEffect(() => {
    if (!open || isMobile) return;
    updatePos();
  }, [open, isMobile]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    const onResize = () => !isMobile && updatePos();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, isMobile]);

  const calendarUi = (
    <div>
      <style>{`
        .rdp {
          --rdp-accent-color: var(--c-brand);
          --rdp-background-color: var(--c-hover);
        }
        .rdp-caption_label { color: var(--c-text); font-weight: 600; }
        .rdp-day_selected, .rdp-day_selected:hover { background: var(--c-brand); color: var(--c-text); }
        .rdp-day:hover:not(.rdp-day_selected) { background: var(--c-hover); }
      `}</style>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          if (!date) return;
          onChange(formatDate(date));
          setOpen(false);
        }}
        showOutsideDays
      />
    </div>
  );

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] px-3.5 py-2.5 text-left text-sm text-[var(--c-text)] outline-none transition-all hover:border-[var(--c-brand)]/50"
      >
        <span className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[var(--c-muted)]" />
          {value || <span className="text-[var(--c-muted)]">{placeholder}</span>}
        </span>
      </button>

      {open &&
        createPortal(
          <>
            <div
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[99998]"
              style={{ background: "rgba(15, 23, 42, 0.35)" }}
            />
            {isMobile ? (
              <div
                className="fixed left-0 right-0 bottom-0 z-[99999] rounded-t-2xl p-3"
                style={{
                  background: "var(--c-surface)",
                  borderTop: "1px solid var(--c-border)",
                  boxShadow: "0 -18px 40px rgba(0,0,0,0.18)",
                }}
              >
                <div className="flex items-center justify-between px-2 pb-2">
                  <div className="text-sm font-semibold" style={{ color: "var(--c-text)" }}>
                    Select date
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-sm font-semibold"
                    style={{ color: "var(--c-muted)" }}
                  >
                    Close
                  </button>
                </div>
                {calendarUi}
              </div>
            ) : (
              <div
                className="absolute z-[99999] rounded-2xl p-3"
                style={{
                  top: pos.top,
                  left: pos.left,
                  width: pos.width,
                  background: "var(--c-surface)",
                  border: "1px solid var(--c-border)",
                  boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
                }}
              >
                {calendarUi}
              </div>
            )}
          </>,
          document.body,
        )}
    </div>
  );
};

const createInitialForm = (sourceTour = null) => ({
  name: "",
  email: "",
  phone: "",
  destinations: sourceTour?.location ? [sourceTour.location] : [],
  otherDestination: "",
  customDestinations: [],
  startDate: "",
  endDate: "",
  persons: 2,
  childrenBelowThree: 0,
  budget: "",
  budgetMode: "total_trip",
  hotelPreference: "4_star",
  vehiclePreference: "premium_suv",
  customVehicle: "",
  requirements: "",
});

const CustomPlanRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const createBooking = useCreatePublicBooking();
  const toast = useToast();
  const sourceTour = location.state?.sourceTour || null;
  const [form, setForm] = useState(() => ({
    ...createInitialForm(sourceTour),
    budget:
      sourceTour?.price && sourceTour?.currency
        ? formatCurrencyAmount(sourceTour.price, sourceTour.currency)
        : "",
  }));
  const [submitting, setSubmitting] = useState(false);
  const [submissionNotice, setSubmissionNotice] = useState(null);
  const noticeRef = useRef(null);

  const subject = useMemo(
    () =>
      sourceTour?.title
        ? `Custom Tour Plan Request - Based on ${sourceTour.title}`
        : "Custom Tour Plan Request",
    [sourceTour?.title],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Missing details", "Please fill name, email, and phone.");
      return;
    }

    const selectedDestinations = form.destinations.includes("Other")
      ? [
          ...form.destinations.filter((item) => item !== "Other"),
          ...form.customDestinations,
          form.otherDestination.trim(),
        ].filter(Boolean)
      : form.destinations;

    const customSummary = [
      `Source Tour: ${sourceTour?.title || "N/A"}`,
      `Preferred Destinations: ${selectedDestinations.length ? selectedDestinations.join(", ") : "Flexible"}`,
      `Start Date: ${form.startDate || "Flexible"}`,
      `End Date: ${form.endDate || "Flexible"}`,
      `Persons: ${Number(form.persons || 1)}`,
      `Children below 3 years: ${Number(form.childrenBelowThree || 0)}`,
      `Budget: ${form.budget || "Not specified"}`,
      `Budget Mode: ${form.budgetMode}`,
      `Hotel Preference: ${form.hotelPreference}`,
      `Vehicle Preference: ${form.vehiclePreference === "other" ? form.customVehicle || "Other" : form.vehiclePreference}`,
      `Requirements: ${form.requirements || "None"}`,
    ].join("\n");

    setSubmitting(true);
    try {
      await createBooking.mutateAsync({
        customerName: form.name,
        email: form.email,
        phone: form.phone,
        ...(sourceTour?.id ? { tourId: sourceTour.id } : {}),
        bookingType: "custom",
        isCustomTour: true,
        source: "website",
        travelDate: form.startDate || "",
        endDate: form.endDate || "",
        flexibleDates: !form.startDate,
        adults: Number(form.persons || 1),
        children: Number(form.childrenBelowThree || 0),
        groupSize: Number(form.persons || 1) + Number(form.childrenBelowThree || 0),
        paymentMethod: "pay_on_arrival",
        facilities: {
          hotelType: form.hotelPreference,
          vehicleType: form.vehiclePreference === "other" ? form.customVehicle || "other" : form.vehiclePreference,
          meals: "",
          addOns: [],
        },
        customRequest: {
          preferredDestinations: selectedDestinations,
          sourceTourTitle: sourceTour?.title || "",
          startDate: form.startDate || "",
          endDate: form.endDate || "",
          persons: Number(form.persons || 1),
          childrenBelowThree: Number(form.childrenBelowThree || 0),
          budget: form.budget || "",
          budgetMode: form.budgetMode || "",
          hotelPreference: form.hotelPreference || "",
          vehiclePreference: form.vehiclePreference === "other" ? form.customVehicle || "other" : form.vehiclePreference,
          requirements: form.requirements || "",
        },
        customRequirements: customSummary,
        specialRequirements: form.requirements || "",
        notes: subject,
      });
      toast.success("Request submitted", "Your custom booking request is now saved in bookings.");
      setSubmissionNotice({
        title: "Custom Plan Request Sent",
        message:
          "Your request has been received and a confirmation email has been sent to your inbox. Our team will review your preferences and contact you shortly with the next steps.",
      });
      setForm({
        ...createInitialForm(sourceTour),
        budget:
          sourceTour?.price && sourceTour?.currency
            ? formatCurrencyAmount(sourceTour.price, sourceTour.currency)
            : "",
      });
    } catch (error) {
      toast.error(
        "Submission failed",
        error?.response?.data?.message || "Please try again in a moment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!submissionNotice) return;

    window.requestAnimationFrame(() => {
      const top = noticeRef.current
        ? noticeRef.current.getBoundingClientRect().top + window.scrollY - 96
        : 0;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  }, [submissionNotice]);

  const toggleDestination = (value) => {
    setForm((prev) => {
      const exists = prev.destinations.includes(value);
      return {
        ...prev,
        destinations: exists
          ? prev.destinations.filter((item) => item !== value)
          : [...prev.destinations, value],
        otherDestination: value === "Other" && exists ? "" : prev.otherDestination,
        customDestinations: value === "Other" && exists ? [] : prev.customDestinations,
      };
    });
  };

  const selectedDestinationLabel = (() => {
    const destinations = form.destinations.includes("Other")
      ? [
          ...form.destinations.filter((item) => item !== "Other"),
          ...form.customDestinations,
          ...(form.otherDestination.trim() ? [form.otherDestination.trim()] : []),
        ].filter(Boolean)
      : form.destinations;

    const count = destinations.length;
    if (!count) return "Select destinations";
    if (count <= 2) return destinations.join(", ");
    return `${destinations[0]}, ${destinations[1]} +${count - 2} more`;
  })();

  return (
    <section className="py-20 bg-theme-bg min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturePageHeader
          eyebrow="Tailored Planning"
          title="Custom Tour"
          highlight="Plan Request"
          description="Share your budget and preferences to receive a tour plan tailored to your comfort and spending level."
        />

        {submissionNotice ? (
          <div ref={noticeRef} className="ql-form-shell px-6 py-8 text-center">
            <div className="mx-auto max-w-2xl rounded-[24px] border border-[rgba(123,231,196,0.34)] bg-[linear-gradient(180deg,rgba(234,253,245,0.96),rgba(255,255,255,0.98))] px-6 py-7 shadow-[0_14px_34px_rgba(123,231,196,0.16)]">
              <p className="text-lg font-semibold text-theme">{submissionNotice.title}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{submissionNotice.message}</p>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  className="ql-btn-secondary px-5 py-2.5"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="ql-form-shell p-7 grid md:grid-cols-2 gap-4">
          <label>
            <span className="ql-label">Full Name</span>
            <input
              className="ql-input"
              placeholder="Your Full Name"
              value={form.name}
              onChange={(e) => {
                setSubmissionNotice(null);
                setForm((prev) => ({ ...prev, name: e.target.value }));
              }}
            />
          </label>
          <label>
            <span className="ql-label">Email</span>
            <input
              type="email"
              placeholder="Email"
              className="ql-input"
              value={form.email}
              onChange={(e) => {
                setSubmissionNotice(null);
                setForm((prev) => ({ ...prev, email: e.target.value }));
              }}
            />
          </label>
          <div className="md:col-span-2 grid gap-4 md:grid-cols-3">
            <label>
              <span className="ql-label">Phone</span>
              <input
                className="ql-input"
                placeholder="Enter a contact Number"
                value={form.phone}
                onChange={(e) => {
                  setSubmissionNotice(null);
                  setForm((prev) => ({ ...prev, phone: e.target.value }));
                }}
              />
            </label>
            <label>
              <span className="ql-label">Start Date</span>
              <BookingStyleDateField
                value={form.startDate}
                onChange={(date) => setForm((prev) => ({ ...prev, startDate: date }))}
                placeholder="Select start date"
              />
            </label>
            <label>
              <span className="ql-label">End Date</span>
              <BookingStyleDateField
                value={form.endDate}
                onChange={(date) => setForm((prev) => ({ ...prev, endDate: date }))}
                placeholder="Select end date"
              />
            </label>
          </div>
          <div className="md:col-span-2 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-1">
              <span className="ql-label">Preferred Destinations</span>
              <BookingStyleDropdown
                multiple
                options={DESTINATION_OPTIONS.map((item) => ({ value: item, label: item }))}
                selectedValues={form.destinations}
                onToggleOption={toggleDestination}
                renderValue={() => selectedDestinationLabel}
              >
                {form.destinations.includes("Other") ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        className="ql-input"
                        placeholder="Enter custom destination"
                        value={form.otherDestination}
                        onChange={(e) => setForm((prev) => ({ ...prev, otherDestination: e.target.value }))}
                      />
                      <button
                        type="button"
                        className="ql-btn-primary shrink-0 px-4 py-2.5"
                        onClick={() => {
                          const nextValue = form.otherDestination.trim();
                          if (!nextValue) {
                            toast.info("Add destination", "Enter a custom destination first.");
                            return;
                          }
                          setForm((prev) => {
                            const existsInSelected = prev.destinations.some(
                              (item) => item.toLowerCase() === nextValue.toLowerCase(),
                            );
                            const existsInCustom = prev.customDestinations.some(
                              (item) => item.toLowerCase() === nextValue.toLowerCase(),
                            );

                            if (existsInSelected || existsInCustom) {
                              return { ...prev, otherDestination: "" };
                            }

                            return {
                              ...prev,
                              customDestinations: [...prev.customDestinations, nextValue],
                              otherDestination: "",
                            };
                          });
                        }}
                      >
                        Add
                      </button>
                    </div>
                    {form.customDestinations.length ? (
                      <div className="flex flex-wrap gap-2">
                        {form.customDestinations.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center gap-2 rounded-full border border-[#9fe7cf] bg-[#e9fbf4] px-3 py-1 text-[11px] font-medium text-theme"
                          >
                            {item}
                            <button
                              type="button"
                              className="text-muted transition hover:text-theme"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  customDestinations: prev.customDestinations.filter(
                                    (destination) => destination !== item,
                                  ),
                                }))
                              }
                            >
                              x
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </BookingStyleDropdown>
            </div>
            <label>
              <span className="ql-label">Persons</span>
              <input
                type="number"
                min={1}
                className="ql-input"
                value={form.persons}
                onChange={(e) => setForm((prev) => ({ ...prev, persons: Number(e.target.value || 1) }))}
              />
            </label>
            <label>
              <span className="ql-label">Children below 3 years</span>
              <input
                className="ql-input"
                type="number"
                min={0}
                value={form.childrenBelowThree}
                onChange={(e) => setForm((prev) => ({ ...prev, childrenBelowThree: Number(e.target.value || 0) }))}
              />
            </label>
          </div>
          <label>
            <span className="ql-label">Budget Type</span>
            <BookingStyleDropdown
              value={form.budgetMode}
              onChange={(value) => setForm((prev) => ({ ...prev, budgetMode: value }))}
              options={BUDGET_TYPE_OPTIONS}
            />
          </label>
          <label>
            <span className="ql-label">Estimated Budget</span>
            <input
              className="ql-input"
              placeholder="e.g. PKR 350,000"
              value={form.budget}
              onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
            />
          </label>
          <label>
            <span className="ql-label">Hotel Preference</span>
            <BookingStyleDropdown
              value={form.hotelPreference}
              onChange={(value) => setForm((prev) => ({ ...prev, hotelPreference: value }))}
              options={HOTEL_OPTIONS}
            />
          </label>
          <label>
            <span className="ql-label">Vehicle Preference</span>
            <BookingStyleDropdown
              value={form.vehiclePreference}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  vehiclePreference: value,
                  customVehicle: value === "other" ? prev.customVehicle : "",
                }))
              }
              options={VEHICLE_OPTIONS}
            />
          </label>
          {form.vehiclePreference === "other" ? (
            <label>
              <span className="ql-label">Custom Vehicle</span>
              <input
                className="ql-input"
                placeholder="Enter your preferred vehicle"
                value={form.customVehicle}
                onChange={(e) => setForm((prev) => ({ ...prev, customVehicle: e.target.value }))}
              />
            </label>
          ) : null}
          <label className="md:col-span-2">
            <span className="ql-label">Special Requirements</span>
            <textarea
              rows={4}
              className="ql-textarea"
              placeholder="Tell us your travel style, activities, comfort needs, or route requests."
              value={form.requirements}
              onChange={(e) => setForm((prev) => ({ ...prev, requirements: e.target.value }))}
            />
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="ql-btn-primary w-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Custom Plan Request"}
            </button>
          </div>
        </form>
        )}
      </div>
    </section>
  );
};

export default CustomPlanRequest;


