import { createPortal } from "react-dom";
import { CalendarDays } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Calendar as UiCalendar } from "@/components/ui/calendar";
import BookingDropdown from "./BookingDropdown";

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

const BookingDatePicker = ({
  when,
  setWhen,
  placeholder = "Select date",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const isMobile = useIsMobile(640);
  const selectedDate = useMemo(() => (when ? new Date(when) : undefined), [when]);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 320 });

  const updatePos = () => {
    const el = wrapRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 16);
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
    const onPointerDown = (event) => {
      if (
        wrapRef.current?.contains(event.target) ||
        panelRef.current?.contains(event.target)
      ) {
        return;
      }
      setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    document.addEventListener("mousedown", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open, isMobile]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const calendarContent = (
    <UiCalendar
      mode="single"
      selected={selectedDate}
      onSelect={(date) => {
        if (!date) return;
        setWhen(formatDate(date));
        setOpen(false);
      }}
      className="mx-auto w-full max-w-[17.5rem] rounded-lg border bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] sm:max-w-none"
      fixedWeeks
      captionLayout="dropdown"
    />
  );

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
        className={`ql-input flex items-center gap-2 text-left text-sm select-none ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <CalendarDays size={16} className="shrink-0 text-[var(--c-muted)]" />
        {when ? when : <span style={{ color: "var(--c-muted)" }}>{placeholder}</span>}
      </button>

      {open &&
        createPortal(
          <>
            {isMobile ? (
              <div
                ref={panelRef}
                className="fixed inset-x-3 top-[4.6rem] z-[99999] sm:inset-x-auto sm:right-4"
              >
                <div className="mx-auto w-full max-w-[17.5rem] sm:max-w-[292px]">{calendarContent}</div>
              </div>
            ) : (
              <div
                ref={panelRef}
                className="absolute z-[99999]"
                style={{
                  top: pos.top,
                  left: pos.left,
                  width: pos.width,
                }}
              >
                {calendarContent}
              </div>
            )}
          </>,
          document.body,
        )}
    </div>
  );
};

const BookingTravelSection = ({
  form,
  setForm,
  visibleHotelOptions,
  visibleVehicleOptions,
  isTravelSectionValid,
  onBack,
  onNext,
}) => (
  <div className="rounded-2xl border border-theme bg-theme-surface p-3 md:p-3.5 shadow-[0_6px_14px_rgba(15,23,42,0.05)] space-y-3.5">
    <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-3">
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <label>
          <span className="ql-label">Start Date</span>
          <BookingDatePicker
            placeholder="Select start date"
            when={form.travelDate}
            setWhen={(nextValue) =>
              setForm((p) => ({ ...p, travelDate: nextValue }))
            }
          />
        </label>
        <label>
          <span className="ql-label">End Date</span>
          <BookingDatePicker
            disabled={form.flexibleDates}
            placeholder="Select end date"
            when={form.endDate}
            setWhen={(nextValue) =>
              setForm((p) => ({ ...p, endDate: nextValue }))
            }
          />
          <label className="mt-2 inline-flex items-center gap-2 text-[13px] text-textMuted">
            <input
              type="checkbox"
              className="ql-check"
              checked={form.flexibleDates}
              onChange={(e) =>
                setForm((p) => ({ ...p, flexibleDates: e.target.checked }))
              }
            />
            My dates are flexible
          </label>
          {form.travelDate && form.endDate && form.endDate < form.travelDate ? (
            <span className="mt-1 block text-xs text-red-500">End date cannot be before travel date.</span>
          ) : null}
        </label>
      </div>
    </div>

    <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-2">
          <span className="ql-label mb-0 text-[10px] normal-case tracking-[0.08em]">Departure Time</span>
          <BookingDropdown
            value={form.travelTime}
            placeholder="No Preference"
            onChange={(nextValue) =>
              setForm((p) => ({ ...p, travelTime: nextValue }))
            }
            options={[
              { value: "", label: "No Preference" },
              { value: "early_morning", label: "Early Morning (6am - 9am)" },
              { value: "morning", label: "Morning (9am - 12pm)" },
              { value: "afternoon", label: "Afternoon (12pm - 4pm)" },
              { value: "evening", label: "Evening (4pm - 8pm)" },
            ]}
          />
        </label>

        <label className="space-y-2">
          <span className="ql-label mb-0 text-[10px] normal-case tracking-[0.08em]">Adults</span>
          <input
            type="number"
            min={1}
            className="ql-input"
            value={form.adults}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                adults: Number(e.target.value || 1),
              }))
            }
          />
        </label>

        <label className="space-y-2">
          <span className="ql-label mb-0 text-[10px] normal-case tracking-[0.08em]">Child Below 3</span>
          <input
            type="number"
            min={0}
            className="ql-input"
            value={form.children}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                children: Number(e.target.value || 0),
              }))
            }
          />
        </label>
      </div>
    </div>

    <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-3 space-y-3.5">
      <label className="inline-flex items-center gap-2 text-sm text-textMain">
        <input
          type="checkbox"
          className="ql-check"
          checked={form.facilities.hotelEnabled}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              facilities: {
                ...p.facilities,
                hotelEnabled: e.target.checked,
              },
            }))
          }
        />
        Include Hotel Stay
      </label>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <label>
          <span className="ql-label">Hotel Category</span>
          <BookingDropdown
            value={form.facilities.hotelType}
            disabled={!form.facilities.hotelEnabled}
            onChange={(nextValue) =>
              setForm((p) => ({
                ...p,
                facilities: {
                  ...p.facilities,
                  hotelType: nextValue,
                },
              }))
            }
            options={visibleHotelOptions.map((item) => ({
              value: item.key,
              label: item.label,
            }))}
          />
        </label>

        <label>
          <span className="ql-label">Vehicle Type</span>
          <BookingDropdown
            value={form.facilities.vehicleType}
            onChange={(nextValue) =>
              setForm((p) => ({
                ...p,
                facilities: {
                  ...p.facilities,
                  vehicleType: nextValue,
                },
              }))
            }
            options={visibleVehicleOptions.map((item) => ({
              value: item.key,
              label: item.label,
            }))}
          />
        </label>
      </div>
    </div>

    <label className="block">
      <span className="ql-label">Special Requirements</span>
      <textarea
        className="ql-textarea"
        rows={3}
        placeholder="Dietary preferences, accessibility needs, or trip notes."
        value={form.specialRequirements}
        onChange={(e) =>
          setForm((p) => ({ ...p, specialRequirements: e.target.value }))
        }
      />
    </label>

    <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <button
        type="button"
        className="ql-btn-secondary w-full sm:w-auto"
        onClick={onBack}
      >
        Back
      </button>
      <button
        type="button"
        className="ql-btn-primary w-full sm:w-auto"
        disabled={!isTravelSectionValid}
        onClick={onNext}
      >
        Next: Payment
      </button>
    </div>
  </div>
);

export default BookingTravelSection;
