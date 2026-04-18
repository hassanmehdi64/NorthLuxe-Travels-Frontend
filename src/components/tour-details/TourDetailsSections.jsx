import { ChevronDown, Clock3, MapPin, Wallet } from "lucide-react";
import { formatCurrencyAmount } from "../../utils/currency";

const InfoCard = ({ icon: Icon, label, value, className = "" }) => (
  <div
    className={`flex min-h-[76px] min-w-0 items-center gap-2.5 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white px-3 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.03)] sm:min-h-[84px] sm:gap-3 sm:px-3.5 ${className}`}
  >
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--c-brand)]/10 text-[var(--c-brand)] sm:h-9 sm:w-9">
      <Icon size={15} />
    </span>
    <div className="min-w-0">
      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted sm:text-[10px]">
        {label}
      </p>
      <p className="mt-1 truncate text-[0.88rem] font-semibold leading-tight text-theme sm:text-[0.95rem]">
        {value}
      </p>
    </div>
  </div>
);

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

      <div className="grid max-w-3xl grid-cols-2 gap-2.5 sm:grid-cols-3">
        <InfoCard
          icon={Wallet}
          label="Starting From"
          value={formatCurrencyAmount(tour.price, tour.currency)}
        />
        <InfoCard icon={Clock3} label="Duration" value={durationText} />
        <InfoCard icon={MapPin} label="Route" value={routeText} className="col-span-2 sm:col-span-1" />
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
