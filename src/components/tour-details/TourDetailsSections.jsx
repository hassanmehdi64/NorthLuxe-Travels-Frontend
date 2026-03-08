import { ChevronDown } from "lucide-react";

const formatStartingPrice = (value) => {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount.toLocaleString() : value;
};

export const TourDetailsHeader = ({ tour }) => (
  <header className="space-y-4">
    <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[var(--c-brand)]">
      Tour Profile
    </p>
    <h1 className="max-w-5xl text-[1.85rem] leading-[1.04] md:text-[2.7rem] font-semibold text-theme tracking-[-0.035em]">
      {tour.title}
    </h1>
    <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border-[0.5px] border-[rgba(15,23,42,0.08)] bg-theme-surface px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.02)]">
      <p className="text-[14px] md:text-[0.8rem] font-medium uppercase tracking-[0.08em] text-muted">
        Starting From
      </p>
      <p className="text-[1rem] leading-none md:text-[1rem] font-semibold text-theme tracking-[-0.01em]">
        {tour.currency} {formatStartingPrice(tour.price)}
      </p>
      <span className="hidden h-5 w-px bg-[rgba(15,23,42,0.08)] sm:block" />
      <p className="text-[14px] md:text-[1rem] font-medium text-theme">
        {tour.durationLabel || `${tour.durationDays || 0} Days`}
      </p>
    </div>
  </header>
);

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
