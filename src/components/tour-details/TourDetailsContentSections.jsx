import { Link } from "react-router-dom";
import { displayCurrency } from "../../utils/currency";
import { ChevronDown, Star } from "lucide-react";

export const TourBookingSidebar = ({ tour, ratingValue, reviewCount }) => (
  <aside className="rounded-2xl border-[0.5px] border-[rgba(15,23,42,0.08)] bg-theme-surface p-4 shadow-[0_6px_20px_rgba(15,23,42,0.025)]">
    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted">Rating</p>
    <div className="mt-1.5 flex items-center gap-1.5">
      <span className="text-2xl font-extrabold text-theme">{ratingValue.toFixed(1)}</span>
      <div className="flex items-center gap-0.5 text-[var(--c-brand)]">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star key={idx} size={12} className={idx < Math.round(ratingValue) ? "fill-current" : "opacity-25"} />
        ))}
      </div>
    </div>
    <p className="mt-1 text-[13px] text-muted">{reviewCount} reviews</p>
    <div className="mt-4 flex items-center gap-2">
      <Link to={`/book/${tour.id}`} className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[12px] font-semibold ql-btn-primary whitespace-nowrap">Book This Tour</Link>
      <Link
        to="/custom-plan-request"
        state={{ sourceTour: { id: tour.id, title: tour.title, location: tour.location, price: tour.price, currency: displayCurrency(tour.currency) } }}
        className="inline-flex items-center justify-center rounded-xl px-3 py-2.5 text-[12px] font-semibold ql-btn-secondary whitespace-nowrap"
      >
        Custom Request
      </Link>
    </div>
  </aside>
);

export const PackageDetailsSection = ({ placeName, placesLabel, planLabel, includedServices, placesCovered, packageOverview, vehicleDetails }) => (
  <section className="rounded-2xl border-[0.5px] border-[rgba(15,23,42,0.08)] bg-theme-surface p-4 md:p-5 shadow-[0_8px_24px_rgba(15,23,42,0.02)]">
    <div className="pb-3">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Package Overview</p>
      <h2 className="mt-1 text-[1.4rem] leading-none md:text-[1.8rem] font-semibold tracking-[-0.025em] text-theme">Package Details</h2>
    </div>
    <p className="mt-3 max-w-4xl text-[15px] md:text-[16px] text-muted leading-7">
      This package is arranged as a guided multi-day route through {placeName} with structured sightseeing, hotel stays, and coordinated travel support. It is planned as a {planLabel.toLowerCase()} covering {placesLabel}.
    </p>
    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
      <div className="space-y-4">
        <div className="rounded-xl border-[0.5px] border-[rgba(15,23,42,0.06)] bg-theme-bg/60 p-3.5">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Services We Provide</p>
          <ul className="mt-2.5 grid gap-x-7 gap-y-2.5 sm:grid-cols-2">
            {includedServices.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[15px] text-muted leading-6">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--c-brand)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border-[0.5px] border-[rgba(15,23,42,0.06)] bg-theme-bg/60 p-3.5">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Places of Attraction</p>
          <ul className="mt-2.5 grid gap-x-7 gap-y-2.5 sm:grid-cols-2">
            {placesCovered.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[15px] text-muted leading-6">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--c-brand)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border-[0.5px] border-[rgba(15,23,42,0.06)] bg-theme-bg/60 p-3.5">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Vehicle Options</p>
          <ul className="mt-2.5 grid gap-y-2">
            {vehicleDetails.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[15px] text-muted leading-6">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--c-brand)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-xl border-[0.5px] border-[rgba(15,23,42,0.06)] bg-theme-bg p-4 shadow-[0_8px_22px_rgba(15,23,42,0.025)]">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Quick Package Facts</p>
        <div className="mt-3 space-y-2">
          {packageOverview.map((item) => (
            <div key={item.label} className="rounded-lg border-[0.5px] border-[rgba(15,23,42,0.05)] bg-theme-surface px-3 py-2.5">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">{item.label}</p>
              <p className="mt-1 text-[14px] md:text-[15px] font-semibold leading-6 text-theme">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const ItinerarySection = ({ items, openIndex, onToggle }) => (
  <section className="rounded-2xl border-[0.5px] border-[rgba(15,23,42,0.08)] bg-theme-surface p-4 md:p-5 shadow-[0_8px_24px_rgba(15,23,42,0.02)]">
    <h2 className="text-[1.35rem] leading-none md:text-[1.65rem] font-semibold tracking-[-0.02em] text-[var(--c-brand)]">Itinerary</h2>
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
    <h2 className="text-[1.28rem] leading-none md:text-[1.55rem] font-semibold tracking-[-0.02em] text-theme">Pakistan Travel FAQs</h2>
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
