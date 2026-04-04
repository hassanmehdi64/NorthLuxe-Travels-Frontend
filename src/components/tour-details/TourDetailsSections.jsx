import { ChevronDown, Clock3, MapPin, Wallet } from "lucide-react";

const formatStartingPrice = (value) => {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount.toLocaleString() : value;
};

export const TourDetailsHeader = ({ tour }) => {
  const durationText = tour.durationLabel || `${tour.durationDays || 0} Days`;
  const routeText = tour.location || tour.destination || "Northern Pakistan";

  return (
    <header className="space-y-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[var(--c-brand)]">
          Tour Profile
        </p>
      </div>

      <h1 className="max-w-4xl text-[1.72rem] font-semibold leading-[1.05] tracking-[-0.035em] text-theme md:text-[2.35rem]">
        {tour.title}
      </h1>

      <div className="flex flex-wrap gap-2.5">
        <div className="inline-flex min-w-[165px] items-center gap-2.5 rounded-[1.15rem] border border-[rgba(15,23,42,0.08)] bg-white px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--c-brand)]/10 text-[var(--c-brand)]">
            <Wallet size={15} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Starting From</p>
            <p className="mt-0.5 text-[0.95rem] font-semibold text-theme">
              {tour.currency} {formatStartingPrice(tour.price)}
            </p>
          </div>
        </div>

        <div className="inline-flex min-w-[165px] items-center gap-2.5 rounded-[1.15rem] border border-[rgba(15,23,42,0.08)] bg-white px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--c-brand)]/10 text-[var(--c-brand)]">
            <Clock3 size={15} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Duration</p>
            <p className="mt-0.5 text-[0.95rem] font-semibold text-theme">{durationText}</p>
          </div>
        </div>

        <div className="inline-flex min-w-[165px] items-center gap-2.5 rounded-[1.15rem] border border-[rgba(15,23,42,0.08)] bg-white px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--c-brand)]/10 text-[var(--c-brand)]">
            <MapPin size={15} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Route</p>
            <p className="mt-0.5 text-[0.95rem] font-semibold text-theme">{routeText}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export const TourDetailsIntro = ({ shortDescription, highlights }) => (
  <article className="space-y-3">
    <p className="max-w-3xl text-[15px] md:text-[16px] text-muted leading-7">{shortDescription || "A refined route designed for scenic views, smooth travel operations, and memorable local experiences."}</p>
    <div className="flex flex-wrap gap-1.5">
      {highlights.map((item) => (
        <span key={item} className="inline-flex items-center rounded-full border border-theme bg-theme-surface px-2.5 py-1 text-[12px] font-medium text-theme">{item}</span>
      ))}
    </div>
  </article>
);

export const TourDescriptionAccordion = ({ isOpen, onToggle, description }) => (
  <section className="rounded-2xl border-[0.5px] border-[rgba(15,23,42,0.08)] bg-theme-surface shadow-[0_6px_20px_rgba(15,23,42,0.02)] overflow-hidden">
    <button type="button" onClick={onToggle} className="w-full px-4 py-3.5 md:px-5 text-left flex items-center justify-between gap-3">
      <span className="text-[1.2rem] leading-none md:text-[1.45rem] font-semibold tracking-[-0.02em] text-theme">Detailed Description</span>
      <ChevronDown size={16} className={`text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
    </button>
    {isOpen ? <div className="px-4 pb-3.5 md:px-5 md:pb-4"><p className="text-[15px] md:text-[16px] text-muted leading-7">{description}</p></div> : null}
  </section>
);
