import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  Images,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { formatCurrencyAmount } from "../../utils/currency";

const HeroFact = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-theme-surface p-4">
    <div className="flex items-center gap-2 text-[var(--c-brand)]">
      <Icon size={16} />
      <span className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
    </div>

    <p className="mt-2 text-[15px] font-semibold leading-6 text-theme">
      {value}
    </p>
  </div>
);

const GalleryImage = ({ src, alt, className = "" }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    decoding="async"
    className={`h-full w-full object-cover object-center ${className}`}
  />
);

const getCustomRequestState = (tour) => ({
  sourceTour: {
    id: tour.id,
    title: tour.title,
    location: tour.location,
    price: tour.price,
    currency: tour.currency,
  },
});

export const TourDetailsBreadcrumbs = ({ tour }) => (
  <nav
    aria-label="Breadcrumb"
    className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
    <Link to="/" className="transition hover:text-theme">
      Home
    </Link>
    <span>/</span>
    <Link to="/tours" className="transition hover:text-theme">
      Tours
    </Link>
    <span>/</span>
    <span className="text-theme">{tour.title}</span>
  </nav>
);

export const TourDetailsHeader = ({
  tour,
  ratingValue,
  reviewCount,
  planLabel,
}) => {
  const durationText = tour.durationLabel || `${tour.durationDays || 0} Days`;
  const locationText = tour.location || tour.destination || "Northern Pakistan";

  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center rounded-full bg-[rgba(var(--c-brand-rgb),0.1)] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">
          {locationText}
        </span>
      </div>

      <div className="space-y-2.5">
        <h1 className="max-w-4xl text-[1.95rem] font-semibold leading-[1.04] tracking-[-0.04em] text-theme md:text-[2.7rem]">
          {tour.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted md:text-[14px]">
          <span className="inline-flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 text-[var(--c-brand)]">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={14}
                  className={
                    idx < Math.round(ratingValue)
                      ? "fill-current"
                      : "opacity-25"
                  }
                />
              ))}
            </div>

            <span className="font-semibold text-theme">
              {ratingValue.toFixed(1)}
            </span>
          </span>

          <span>{reviewCount} reviews</span>

          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} className="text-[var(--c-brand)]" />
            {locationText}
          </span>
        </div>
      </div>

      <p className="max-w-3xl text-[15px] leading-7 text-muted md:text-[16px]">
        {tour.shortDescription ||
          "Thoughtfully planned scenic touring with local support, practical pacing, and comfortable route coordination."}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <HeroFact icon={Clock3} label="Duration" value={durationText} />
        <HeroFact icon={Users} label="Group Size" value={planLabel} />
      </div>
    </header>
  );
};

export const TourDetailsActions = ({
  tour,
  layout = "responsive",
  className = "",
}) => {
  const gridClass =
    layout === "compact"
      ? "grid-cols-2"
      : layout === "stacked"
        ? "grid-cols-1"
        : "grid-cols-1 sm:grid-cols-2";

  const buttonSize =
    layout === "compact"
      ? "h-11 px-2 text-[12px] sm:text-[13px]"
      : "h-11 px-5 text-sm";

  return (
    <div className={`grid w-full gap-2 ${gridClass} ${className}`}>
      <Link
        to={`/book/${tour.id}`}
        className={`ql-btn-primary inline-flex w-full cursor-pointer items-center justify-center rounded-xl font-semibold whitespace-nowrap ${buttonSize}`}>
        Book Now
      </Link>

      <Link
        to="/custom-plan-request"
        state={getCustomRequestState(tour)}
        className={`inline-flex w-full cursor-pointer items-center justify-center rounded-xl border border-[rgba(15,23,42,0.12)] bg-theme-surface font-semibold text-theme transition hover:border-[rgba(var(--c-brand-rgb),0.4)] hover:text-[var(--c-brand)] whitespace-nowrap ${buttonSize}`}>
        Custom Request
      </Link>
    </div>
  );
};

export const TourImageGallery = ({ images, title }) => {
  const [showAll, setShowAll] = useState(false);

  const displayImages = useMemo(
    () => images.filter(Boolean).slice(0, showAll ? 5 : 3),
    [images, showAll],
  );

  if (!displayImages.length) return null;

  const mainImage = displayImages[0];
  const sideImages = displayImages.slice(1, 3);
  const hasSingleSideImage = sideImages.length === 1;

  return (
    <div className="space-y-2.5">
      <div className="hidden gap-3 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(260px,0.85fr)]">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-theme-bg shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
          <GalleryImage
            src={mainImage}
            alt={`${title} main`}
            className="h-[340px] lg:h-[380px]"
          />

          {images.length > 1 ? (
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="absolute bottom-4 right-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/96 px-4 py-2 text-[13px] font-semibold text-theme shadow-[0_10px_20px_rgba(15,23,42,0.12)] transition hover:bg-theme-bg">
              <Images size={15} className="text-[var(--c-brand)]" />
              {showAll ? "Show less" : `View all photos (${images.length})`}
            </button>
          ) : null}
        </div>

        {sideImages.length ? (
          <div className="grid gap-3 grid-rows-2">
            {sideImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className={`overflow-hidden rounded-[1.5rem] bg-theme-bg shadow-[0_12px_28px_rgba(15,23,42,0.06)] ${
                  hasSingleSideImage ? "row-span-2" : ""
                }`}>
                <GalleryImage
                  src={image}
                  alt={`${title} gallery ${index + 2}`}
                  className={`w-full object-cover ${
                    hasSingleSideImage
                      ? "h-[340px] lg:h-[380px]"
                      : "h-[164px] lg:h-[184px]"
                  }`}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-3 md:hidden">
        <div className="relative overflow-hidden rounded-[1.35rem] bg-theme-bg shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
          <GalleryImage
            src={mainImage}
            alt={`${title} main`}
            className="h-[250px]"
          />

          {images.length > 1 ? (
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="absolute bottom-3 right-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/96 px-3.5 py-2 text-[12px] font-semibold text-theme shadow-[0_10px_20px_rgba(15,23,42,0.12)] transition hover:bg-theme-bg">
              <Images size={14} className="text-[var(--c-brand)]" />
              {showAll ? "Show less" : `View all photos (${images.length})`}
            </button>
          ) : null}
        </div>

        {sideImages.length ? (
          <div className="grid gap-3">
            {sideImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="overflow-hidden rounded-[1.15rem] bg-theme-bg shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                <GalleryImage
                  src={image}
                  alt={`${title} gallery ${index + 2}`}
                  className="h-[150px]"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {showAll && images.length > 3 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.slice(3).map((image, index) => (
            <div
              key={`${image}-extra-${index}`}
              className="overflow-hidden rounded-[1.25rem] bg-theme-bg shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
              <GalleryImage
                src={image}
                alt={`${title} extra ${index + 4}`}
                className="h-[200px]"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const TourBookingCard = ({ tour }) => (
  <aside className="rounded-[1.75rem] border border-[rgba(15,23,42,0.08)] bg-theme-surface p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted">
          Starting from
        </p>

        <div className="mt-2 flex items-end gap-2">
          <span className="text-[2rem] font-semibold leading-none text-theme">
            {formatCurrencyAmount(tour.price, tour.currency)}
          </span>
        </div>

        <p className="mt-1 text-[13px] text-muted">
          Per trip, based on selected plan
        </p>
      </div>

      <TourDetailsActions tour={tour} layout="compact" />

      <div className="space-y-3 border-t border-theme pt-4 text-[14px] text-muted">
        <p className="inline-flex items-center gap-2">
          <ShieldCheck size={15} className="text-[var(--c-brand)]" />
          Free consultation
        </p>

        <p className="inline-flex items-center gap-2">
          <ShieldCheck size={15} className="text-[var(--c-brand)]" />
          Local expert support
        </p>

        <p className="inline-flex items-center gap-2">
          <ShieldCheck size={15} className="text-[var(--c-brand)]" />
          Transparent pricing
        </p>

        <p className="inline-flex items-center gap-2">
          <ShieldCheck size={15} className="text-[var(--c-brand)]" />
          Flexible planning
        </p>
      </div>
    </div>
  </aside>
);

export const MobileBookingBar = ({ tour }) => (
  <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[rgba(15,23,42,0.08)] bg-white/96 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
    <div className="mx-auto flex max-w-[1600px] items-center gap-3">
      <Link
        to="/tours"
        className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[rgba(15,23,42,0.12)] text-theme transition hover:border-[rgba(var(--c-brand-rgb),0.4)] hover:text-[var(--c-brand)]"
        aria-label="Back to tours">
        <ArrowLeft size={18} />
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted">
          Starting from
        </p>

        <p className="truncate text-[15px] font-semibold text-theme">
          {formatCurrencyAmount(tour.price, tour.currency)}
        </p>
      </div>

      <Link
        to={`/book/${tour.id}`}
        className="ql-btn-primary inline-flex h-11 min-w-[132px] shrink-0 cursor-pointer items-center justify-center rounded-xl px-4 text-sm font-semibold whitespace-nowrap">
        Book Now
      </Link>
    </div>
  </div>
);
