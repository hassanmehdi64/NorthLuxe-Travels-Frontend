import {
  Check,
  ChevronDown,
  CircleDot,
  Info,
  MapPin,
  Truck,
} from "lucide-react";

const formatListLabel = (value) =>
  String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="space-y-2">
    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--c-brand)]">
      {eyebrow}
    </p>

    <h2 className="text-[1.7rem] font-semibold leading-tight tracking-[-0.03em] text-theme md:text-[2.1rem]">
      {title}
    </h2>

    {description ? (
      <p className="max-w-5xl text-[15px] leading-7 text-muted md:text-[16px]">
        {description}
      </p>
    ) : null}
  </div>
);

export const OverviewSection = ({
  description,
  highlights = [],
  bestFor = [],
  packageOverview = [],
}) => (
  <section className="w-full py-8">
    <SectionHeading
      eyebrow="Overview"
      title="Detailed Description"
      description={description}
    />

    <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px_320px]">
      <div>
        <h3 className="text-[13px] font-black uppercase tracking-[0.16em] text-theme">
          Key Highlights
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {highlights.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-theme bg-theme-surface px-4 py-3"
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--c-brand-rgb),0.1)] text-[var(--c-brand)]">
                <Check size={15} />
              </span>

              <span className="text-[14px] leading-6 text-theme">
                {formatListLabel(item)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-theme bg-theme-surface p-5">
        <h3 className="text-[13px] font-black uppercase tracking-[0.16em] text-theme">
          Best For
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {bestFor.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[rgba(var(--c-brand-rgb),0.2)] bg-[rgba(var(--c-brand-rgb),0.06)] px-3 py-1.5 text-[13px] font-medium text-theme"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-theme bg-theme-surface p-5">
        <h3 className="text-[13px] font-black uppercase tracking-[0.16em] text-theme">
          Package Details
        </h3>

        <div className="mt-4 space-y-3">
          {packageOverview.map((item) => (
            <div
              key={item.label}
              className="flex items-start justify-between gap-4 border-b border-[rgba(15,23,42,0.08)] pb-3 last:border-b-0 last:pb-0"
            >
              <span className="text-[13px] text-muted">{item.label}</span>

              <span className="max-w-[62%] text-right text-[14px] font-medium text-theme">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const InclusionsSection = ({ includedServices = [], beforeYouBook = [] }) => (
  <section className="w-full py-8">
    <SectionHeading
      eyebrow="Know Before You Go"
      title="What's Included"
      description="Clear travel inclusions and practical notes before you confirm the booking."
    />

    <div className="mt-5 grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-theme bg-theme-surface p-5">
        <h3 className="text-[13px] font-black uppercase tracking-[0.16em] text-theme">
          Included
        </h3>

        <ul className="mt-4 space-y-3">
          {includedServices.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-[14px] leading-6 text-theme"
            >
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--c-brand-rgb),0.12)] text-[var(--c-brand)]">
                <Check size={14} />
              </span>

              <span>{formatListLabel(item)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-theme bg-theme-surface p-5">
        <h3 className="text-[13px] font-black uppercase tracking-[0.16em] text-theme">
          Before You Book
        </h3>

        <ul className="mt-4 space-y-3">
          {beforeYouBook.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-[14px] leading-6 text-theme"
            >
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-theme-bg text-muted">
                <Info size={14} />
              </span>

              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export const ItinerarySection = ({ items = [], openIndex, onToggle }) => (
  <section className="w-full py-8">
    <SectionHeading
      eyebrow="Plan"
      title="Itinerary"
      description="Day-by-day route flow with sightseeing highlights and travel pacing."
    />

    {items.length ? (
      <div className="mt-5 space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={`${item.day}-${idx}`}
              className="overflow-hidden rounded-2xl border border-theme bg-theme-surface"
            >
              <button
                type="button"
                onClick={() => onToggle(idx)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left md:px-5"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(var(--c-brand-rgb),0.1)] text-[12px] font-black uppercase tracking-[0.08em] text-[var(--c-brand)]">
                    Day {item.day || idx + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-6 text-theme md:text-[16px]">
                      {item.title || `Day ${idx + 1}`}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted">
                      {item.placesCovered?.join(" / ")}
                    </p>
                  </div>
                </div>

                <ChevronDown
                  size={18}
                  className={`shrink-0 text-muted transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-theme px-4 py-4 md:px-5">
                  <ul className="space-y-3">
                    {item.bulletPoints?.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-[14px] leading-6 text-muted"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--c-brand)]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    ) : (
      <p className="mt-4 text-[14px] text-muted">
        Detailed itinerary is shared after booking confirmation.
      </p>
    )}
  </section>
);

export const RouteSection = ({
  placeName,
  placesCovered = [],
  placesLabel,
  planLabel,
  vehicleDetails = [],
}) => (
  <section className="w-full py-8">
    <SectionHeading
      eyebrow="Route"
      title="Places Covered"
      description={`This route is designed around ${placeName} with practical travel flow and sightseeing coverage.`}
    />

    <div className="mt-5 space-y-5">
      <div className="flex flex-wrap gap-2">
        {placesCovered.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[rgba(15,23,42,0.12)] bg-theme-surface px-3 py-1.5 text-[13px] font-medium text-theme"
          >
            {formatListLabel(item)}
          </span>
        ))}
      </div>

      <div className="rounded-2xl border border-theme bg-theme-surface p-5">
        <h3 className="text-[13px] font-black uppercase tracking-[0.16em] text-theme">
          Route Summary
        </h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 text-[14px] text-theme">
            <MapPin size={16} className="text-[var(--c-brand)]" />
            <span>{placesLabel}</span>
          </div>

          <div className="flex items-center gap-3 text-[14px] text-theme">
            <Truck size={16} className="text-[var(--c-brand)]" />
            <span>{planLabel}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {vehicleDetails.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-theme bg-theme-surface p-4"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(var(--c-brand-rgb),0.1)] text-[var(--c-brand)]">
                <Truck size={17} />
              </span>

              <div>
                <p className="text-[14px] font-semibold text-theme">
                  {formatListLabel(item)}
                </p>

                <p className="mt-1 text-[13px] text-muted">
                  Suitable for selected route and trip setup.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const FaqSection = ({ items = [], openIndex, onToggle }) => (
  <section className="w-full py-8">
    <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
      <SectionHeading
        eyebrow="Support"
        title="Frequently Asked Questions"
        description="Helpful details before booking, from customization to transport and payment expectations."
      />

      <div className="space-y-3">
        {items.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={faq.q}
              className="overflow-hidden rounded-2xl border border-theme bg-theme-surface"
            >
              <button
                type="button"
                onClick={() => onToggle(idx)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="text-[15px] font-semibold text-theme md:text-[16px]">
                  {faq.q}
                </span>

                <ChevronDown
                  size={16}
                  className={`shrink-0 text-muted transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-theme px-5 py-4">
                  <p className="text-[15px] leading-7 text-muted">{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export const BookingNoteList = ({ items = [] }) => (
  <div className="space-y-3">
    {items.map((item) => (
      <div
        key={item}
        className="flex items-start gap-3 text-[14px] leading-6 text-muted"
      >
        <CircleDot size={16} className="mt-1 shrink-0 text-[var(--c-brand)]" />
        <span>{item}</span>
      </div>
    ))}
  </div>
);