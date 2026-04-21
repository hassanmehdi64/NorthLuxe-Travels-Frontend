import { createPortal } from "react-dom";
import { Search, MapPin, ShieldCheck, BadgeCheck, Headphones, CalendarDays } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Calendar as UiCalendar } from "@/components/ui/calendar";
import PlaceSearchInput from "../search/PlaceSearchInput";
import { usePublicContentList, usePublicTours } from "../../hooks/useCms";
import { buildPlaceSuggestions } from "../../utils/tourSearch";
import HeroBackgroundSlider from "./HeroBackgroundSlider";

const HERO_POINTS = [
  { icon: ShieldCheck, label: "Trusted partners" },
  { icon: BadgeCheck, label: "Transparent pricing" },
  { icon: Headphones, label: "Fast support" },
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

const HeroDatePicker = ({ when, setWhen, placeholder = "When" }) => {
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
    <div
      ref={wrapRef}
      className="relative flex items-center gap-3 border-[var(--c-border)] px-4 py-3.5 md:border-b-0 md:border-r md:py-4"
    >
      <CalendarDays size={18} className="shrink-0 text-[var(--c-muted)]" />
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left text-sm select-none"
        style={{ color: "var(--c-text)" }}
      >
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

const TourMain = () => {
  const navigate = useNavigate();
  const { data: tours = [] } = usePublicTours();
  const { data: destinationItems = [] } = usePublicContentList("destination");

  const [where, setWhere] = useState("");
  const [when, setWhen] = useState("");

  const placeSuggestions = useMemo(
    () =>
      buildPlaceSuggestions({ tours, destinationItems }),
    [tours, destinationItems],
  );

  const onSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmedWhere = where.trim();

    if (trimmedWhere) params.set("q", trimmedWhere);
    if (when) params.set("date", when);

    navigate(`/tours?${params.toString()}`);
  };

  return (
    <section className="relative -mt-[72px] flex min-h-screen items-center justify-center overflow-hidden pt-[72px] sm:-mx-[5px]">
      <HeroBackgroundSlider />

      <div className="text-center px-4 max-w-4xl w-full">
        <h1 className="text-white text-3xl md:text-5xl font-semibold leading-tight">
          Discover Pakistan Beautifully
        </h1>

        <p className="mt-3 md:mt-4 text-white/85 text-sm md:text-lg">
          Luxury tours, verified partners, seamless booking.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 md:mt-8 bg-white rounded-2xl shadow-lg overflow-visible relative"
        >
          <div className="grid md:grid-cols-3 rounded-2xl">
            <div className="flex items-center gap-3 px-4 py-3.5 md:py-4 border-b md:border-b-0 md:border-r border-[var(--c-border)]">
              <MapPin size={18} className="text-[var(--c-muted)] shrink-0" />
              <PlaceSearchInput
                value={where}
                onChange={setWhere}
                suggestions={placeSuggestions}
                placeholder="Where to?"
                inputClassName="w-full bg-transparent outline-none text-sm text-[var(--c-text)] placeholder:text-[var(--c-muted)]"
              />
            </div>

            <HeroDatePicker when={when} setWhen={setWhen} />

            <button
              type="submit"
              className="flex items-center justify-center gap-2 py-3.5 md:py-4 font-semibold text-white transition rounded-br-2xl rounded-bl-2xl md:rounded-bl-none md:rounded-tr-2xl md:rounded-br-2xl"
              style={{ background: "var(--c-brand)" }}>
              <Search size={18} />
              Search
            </button>
          </div>
        </form>

        <div className="mt-5 md:mt-6 flex flex-wrap justify-center gap-3 md:gap-4">
          <Link
            to="/custom-plan-request"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white transition"
            style={{ background: "var(--c-brand)", color: "#ffffff" }}>
            Custom Request
          </Link>

          <Link
            to="/book"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold border border-white/40 text-white hover:bg-white/10 transition">
            Book Tour
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 text-white/90">
          {HERO_POINTS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium md:text-sm"
            >
              <Icon size={14} className="shrink-0 text-[var(--c-brand)]" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TourMain;








