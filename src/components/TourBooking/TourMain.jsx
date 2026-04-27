import { createPortal } from "react-dom";
import {
  Search,
  MapPin,
  ShieldCheck,
  BadgeCheck,
  Headphones,
  CalendarDays,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

const parseLocalDate = (value) => {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const useIsMobile = (breakpoint = 640) => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const onResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    onResize();

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
};

const HeroDatePicker = ({ when, setWhen, placeholder = "When" }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 320 });

  const wrapRef = useRef(null);
  const panelRef = useRef(null);

  const isMobile = useIsMobile(640);

  const selectedDate = useMemo(() => parseLocalDate(when), [when]);

  const updatePos = useCallback(() => {
    if (typeof window === "undefined") return;

    const el = wrapRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 16);
    const left = Math.min(
      window.innerWidth - width - 8,
      Math.max(8, rect.left),
    );

    setPos({
      top: rect.bottom + 10 + window.scrollY,
      left: left + window.scrollX,
      width,
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!open || isMobile) return;
    updatePos();
  }, [open, isMobile, updatePos]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const onReposition = () => {
      if (!isMobile) {
        updatePos();
      }
    };

    const onPointerDown = (event) => {
      if (
        wrapRef.current?.contains(event.target) ||
        panelRef.current?.contains(event.target)
      ) {
        return;
      }

      setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, isMobile, updatePos]);

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
      className="relative flex items-center gap-3 border-[color:var(--c-border)] px-4 py-3.5 md:border-b-0 md:border-r md:py-4">
      <CalendarDays size={18} className="shrink-0 text-[var(--c-muted)]" />

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full select-none text-left text-sm"
        style={{ color: "var(--c-text)" }}>
        {when || <span style={{ color: "var(--c-muted)" }}>{placeholder}</span>}
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          isMobile ? (
            <div
              ref={panelRef}
              className="fixed inset-x-3 top-[4.6rem] z-[99999] sm:inset-x-auto sm:right-4">
              <div className="mx-auto w-full max-w-[17.5rem] sm:max-w-[292px]">
                {calendarContent}
              </div>
            </div>
          ) : (
            <div
              ref={panelRef}
              className="absolute z-[99999]"
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width,
              }}>
              {calendarContent}
            </div>
          ),
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
    () => buildPlaceSuggestions({ tours, destinationItems }),
    [tours, destinationItems],
  );

  const onSubmit = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();
    const trimmedWhere = where.trim();

    if (trimmedWhere) {
      params.set("q", trimmedWhere);
    }

    if (when) {
      params.set("date", when);
    }

    const query = params.toString();

    navigate(query ? `/tours?${query}` : "/tours");
  };

  return (
    <section className="relative isolate -mt-[72px] flex min-h-screen items-center justify-center overflow-hidden pt-[72px] sm:-mx-[5px]">
      <HeroBackgroundSlider />

      <div className="relative z-10 w-full max-w-4xl px-4 text-center">
        <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
          Discover Pakistan Beautifully
        </h1>

        <p className="mt-3 text-sm text-white/85 md:mt-4 md:text-lg">
          Luxury tours, verified partners, seamless booking.
        </p>

        <form
          onSubmit={onSubmit}
          className="relative mt-6 overflow-visible rounded-2xl bg-white shadow-lg md:mt-8">
          <div className="grid rounded-2xl md:grid-cols-3">
            <div className="flex items-center gap-3 border-b border-[color:var(--c-border)] px-4 py-3.5 md:border-b-0 md:border-r md:py-4">
              <MapPin size={18} className="shrink-0 text-[var(--c-muted)]" />

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
              className="ql-btn-primary !rounded-none !rounded-br-2xl !rounded-bl-2xl py-3.5 md:!rounded-bl-none md:!rounded-r-2xl md:py-4">
              <Search size={18} />
              Search
            </button>
            
          </div>
          
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-3 md:mt-6 md:gap-4">
          <Link
            to="/custom-plan-request"
            className="ql-btn-primary w-full px-6 py-3 font-semibold sm:w-auto">
            Custom Request
          </Link>

          <Link
            to="/book"
            className="ql-btn-secondary w-full px-6 py-3 text-sm font-semibold sm:w-auto [--btn-ghost-bg:rgba(255,255,255,0.96)] [--btn-ghost-text:var(--c-brand)] [--btn-ghost-border:rgba(255,255,255,0.96)]">
            Book Tour
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 text-white/90">
          {HERO_POINTS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium md:text-sm">
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
