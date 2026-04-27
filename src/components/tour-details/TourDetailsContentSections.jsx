import { Link } from "react-router-dom";
import { displayCurrency } from "../../utils/currency";
import { ChevronDown, Star } from "lucide-react";

const formatListLabel = (value) =>
  String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const TourBookingSidebar = ({ tour, ratingValue, reviewCount, className = "", compact = false }) => (
  <aside className={`rounded-2xl border-[0.5px] border-[rgba(15,23,42,0.08)] bg-theme-surface shadow-[0_6px_20px_rgba(15,23,42,0.025)] ${compact ? "px-4 py-3" : "px-4 py-3.5"} ${className}`}>
    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-muted">Rating</p>
    <div className={`${compact ? "mt-1" : "mt-1.5"} flex items-center gap-1.5`}>
      <span className={`${compact ? "text-[1.55rem]" : "text-[1.75rem]"} font-extrabold leading-none text-theme`}>{ratingValue.toFixed(1)}</span>
      <div className="flex items-center gap-0.5 text-[var(--c-brand)]">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star key={idx} size={compact ? 11 : 12} className={idx < Math.round(ratingValue) ? "fill-current" : "opacity-25"} />
        ))}
      </div>
    </div>
    <p className={`${compact ? "mt-1" : "mt-1.5"} text-[11px] text-muted`}>{reviewCount} reviews</p>
  </aside>
);

export const PackageDetailsSection = ({ description, placeName, placesLabel, planLabel, includedServices, placesCovered, packageOverview, vehicleDetails, commonFacts }) => (
  <section className="rounded-2xl border-[0.5px] border-[rgba(15,23,42,0.08)] bg-theme-surface p-4 md:p-5 shadow-[0_8px_24px_rgba(15,23,42,0.02)]">
    <div className="pb-3">
      <p className="text-xl font-black tracking-tight text-[var(--c-brand)] lg:text-2xl">Package Overview</p>
    </div>
    {description ? (
      <div className="mb-4">
        <p className="text-[15px] leading-7 text-muted md:text-[16px]">{description}</p>
      </div>
    ) : null}
    <p className="mt-3 max-w-4xl text-[15px] md:text-[16px] text-muted leading-7">
      This package is arranged as a guided multi-day route through {placeName} with structured sightseeing, hotel stays, and coordinated travel support. It is planned as a {planLabel.toLowerCase()} covering {placesLabel}.
    </p>
    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
      <div className="space-y-3.5">
        <div className="rounded-xl bg-theme-bg/35 p-3">
          <p className="text-[13px] font-black uppercase tracking-[0.18em] text-[var(--c-brand)]">Services We Provide</p>
          <ul className="mt-2.5 space-y-2 sm:columns-2 sm:gap-x-6 sm:space-y-0">
            {includedServices.map((item) => (
              <li key={item} className="mb-2 flex break-inside-avoid items-start gap-2.5 text-[15px] text-muted leading-6">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--c-brand)]" />
                <span>{formatListLabel(item)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-theme-bg/35 p-3">
          <p className="text-[13px] font-black uppercase tracking-[0.18em] text-[var(--c-brand)]">Places of Attraction</p>
          <ul className="mt-2.5 space-y-2 sm:columns-2 sm:gap-x-6 sm:space-y-0">
            {placesCovered.map((item) => (
              <li key={item} className="mb-2 flex break-inside-avoid items-start gap-2.5 text-[15px] text-muted leading-6">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--c-brand)]" />
                <span>{formatListLabel(item)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-theme-bg/35 p-3">
          <p className="text-[13px] font-black uppercase tracking-[0.18em] text-[var(--c-brand)]">Vehicle Options</p>
          <ul className="mt-2.5 space-y-2 sm:columns-2 sm:gap-x-6 sm:space-y-0">
            {vehicleDetails.map((item) => (
              <li key={item} className="mb-2 flex break-inside-avoid items-start gap-2.5 text-[15px] text-muted leading-6">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--c-brand)]" />
                <span>{formatListLabel(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-xl border-[0.5px] border-[rgba(15,23,42,0.06)] bg-theme-bg p-4 shadow-[0_8px_22px_rgba(15,23,42,0.025)]">
        <p className="text-[13px] font-black uppercase tracking-[0.18em] text-[var(--c-brand)]">Quick Package Facts</p>
        <div className="mt-3 space-y-2">
          {packageOverview.map((item) => (
            <div key={item.label} className="rounded-lg border-[0.5px] border-[rgba(15,23,42,0.05)] bg-theme-surface px-3 py-2.5">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">{item.label}</p>
              <p className="mt-1 text-[14px] md:text-[15px] font-semibold leading-6 text-theme">{item.value}</p>
            </div>
          ))}
          {commonFacts?.transportNote ? (
            <div className="rounded-xl border border-[rgba(var(--c-brand-rgb),0.18)] bg-[rgba(var(--c-brand-rgb),0.06)] px-3.5 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">Transport Note</p>
              <p className="mt-1.5 text-[14px] md:text-[15px] leading-6 text-theme">{commonFacts.transportNote}</p>
            </div>
          ) : null}
          {commonFacts?.vehicleStartingPrices?.length ? (
            <div className="overflow-hidden rounded-xl border border-[rgba(15,23,42,0.07)] bg-theme-surface">
              <div className="border-b border-[rgba(15,23,42,0.06)] bg-[rgba(var(--c-brand-rgb),0.06)] px-3.5 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">Available Vehicles & Starting Prices</p>
              </div>
              <ul className="divide-y divide-[rgba(15,23,42,0.06)]">
                {commonFacts.vehicleStartingPrices.map((item) => (
                  <li key={item.label} className="flex items-center justify-between gap-3 px-3.5 py-3">
                    <span className="text-[14px] md:text-[15px] leading-6 text-theme">{item.label}</span>
                    <span className="shrink-0 rounded-full bg-[rgba(var(--c-brand-rgb),0.12)] px-2.5 py-1 text-[12px] font-bold text-[var(--c-brand)]">
                      PKR {item.dailyRate.toLocaleString()}/day
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  </section>
);

export const ItinerarySection = ({ items, openIndex, onToggle }) => (
  <section className="rounded-2xl border-[0.5px] border-[rgba(15,23,42,0.08)] bg-theme-surface p-4 md:p-5 shadow-[0_8px_24px_rgba(15,23,42,0.02)]">
    <h2 className="text-[1.65rem] leading-none md:text-[2.1rem] font-semibold tracking-[-0.02em] text-[var(--c-brand)]">Itinerary</h2>
    {items.length ? (
      <div className="mt-3 space-y-2.5">
        {items.map((item, idx) => (
          <div key={`${item.day}-${idx}`} className="overflow-hidden rounded-xl border-[0.5px] border-[rgba(15,23,42,0.06)] bg-theme-bg">
            <button type="button" onClick={() => onToggle(idx)} className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left">
              <span className="text-[15px] md:text-[16px] font-semibold leading-6 text-theme">Day {item.day || idx + 1}: {item.title || "Route Plan"}</span>
              <ChevronDown size={16} className={`shrink-0 text-[var(--c-brand)] transition-transform duration-200 ${openIndex === idx ? "rotate-180" : ""}`} />
            </button>
            {openIndex === idx ? (
              <div className="px-4 py-2.5">
                <p className="text-[14px] md:text-[15px] font-medium leading-6 text-theme">{item.placesCovered.join(", ")}</p>
                <ul className="mt-1.5 space-y-1">{item.bulletPoints.map((point) => <li key={point} className="text-[14px] md:text-[15px] leading-6 text-muted">- {point}</li>)}</ul>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    ) : <p className="mt-3 text-sm text-muted">Detailed itinerary is shared after booking confirmation.</p>}
  </section>
);

export const FaqSection = ({ items, openIndex, onToggle }) => (
  <section>
    <h2 className="text-[1.6rem] leading-none md:text-[2rem] font-semibold tracking-[-0.02em] text-theme">Pakistan Travel FAQs</h2>
    <div className="mt-3 space-y-2">
      {items.map((faq, idx) => {
        const active = openIndex === idx;
        return (
          <div key={faq.q} className="rounded-xl border-[0.5px] border-[rgba(15,23,42,0.06)] bg-theme-surface shadow-[0_6px_18px_rgba(15,23,42,0.015)] overflow-hidden">
            <button type="button" onClick={() => onToggle(active ? -1 : idx)} className="w-full px-4 py-3 text-left flex items-center justify-between gap-3">
              <span className="text-[15px] md:text-[16px] font-semibold text-theme">{faq.q}</span>
              <ChevronDown size={16} className={`text-muted transition-transform ${active ? "rotate-180" : ""}`} />
            </button>
            {active ? <p className="px-4 pb-4 text-[15px] md:text-[16px] text-muted leading-7">{faq.a}</p> : null}
          </div>
        );
      })}
    </div>
  </section>
);
