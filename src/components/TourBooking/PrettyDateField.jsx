import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

export default function PrettyDateField({
  when,
  setWhen,
  placeholder = "When",
  disabled = false,
  variant = "inline",
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const isMobile = useIsMobile(640);

  const selectedDate = useMemo(() => (when ? new Date(when) : undefined), [when]);

  // Desktop popover position
  const [pos, setPos] = useState({ top: 0, left: 0, width: 360 });

  const updatePos = () => {
    const el = wrapRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const width = Math.min(360, window.innerWidth - 16);
    const left = Math.min(window.innerWidth - width - 8, Math.max(8, r.left));

    setPos({
      top: r.bottom + 10 + window.scrollY,
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

    const onKey = (e) => e.key === "Escape" && setOpen(false);
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

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const CalendarUI = (
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
        onSelect={(d) => {
          if (!d) return;
          setWhen(formatDate(d));
          setOpen(false);
        }}
        showOutsideDays
      />
    </div>
  );

  return (
    <div
      ref={wrapRef}
      className={
        variant === "standalone"
          ? "relative"
          : "relative flex items-center gap-3 px-4 py-3.5 md:py-4 border-b md:border-b-0 md:border-r border-[var(--c-border)]"
      }
    >
      {variant !== "standalone" ? (
        <CalendarDays size={18} className="text-[var(--c-muted)]" />
      ) : null}

      {/* Clickable field */}
      <button
        type="button"
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
        className={
          variant === "standalone"
            ? `ql-input flex items-center gap-2 text-left text-sm select-none ${disabled ? "cursor-not-allowed opacity-60" : ""}`
            : "w-full text-left text-sm select-none"
        }
        style={variant === "standalone" ? undefined : { color: "var(--c-text)" }}
      >
        {variant === "standalone" ? (
          <>
            <CalendarDays size={16} className="text-[var(--c-muted)] shrink-0" />
            {when ? when : <span style={{ color: "var(--c-muted)" }}>{placeholder}</span>}
          </>
        ) : when ? (
          when
        ) : (
          <span style={{ color: "var(--c-muted)" }}>{placeholder}</span>
        )}
      </button>

      {/* Portal rendering (prevents clipping ALWAYS) */}
      {open &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[99998]"
              style={{ background: "rgba(15, 23, 42, 0.35)" }}
            />

            {/* Mobile bottom sheet */}
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
                {CalendarUI}
              </div>
            ) : (
              /* Desktop popover */
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
                {CalendarUI}
              </div>
            )}
          </>,
          document.body
        )}
    </div>
  );
}
