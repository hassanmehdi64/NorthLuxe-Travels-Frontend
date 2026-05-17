import { Link } from "react-router-dom";
import { Clock3, MapPin, Star } from "lucide-react";
import { formatCurrencyAmount } from "../../utils/currency";

const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="space-y-2">
    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--c-brand)]">
      {eyebrow}
    </p>
    <h2 className="text-[1.45rem] font-semibold leading-tight tracking-[-0.03em] text-theme md:text-[1.75rem]">
      {title}
    </h2>
    {description ? (
      <p className="max-w-4xl text-[14px] leading-6 text-muted md:text-[15px]">
        {description}
      </p>
    ) : null}
  </div>
);

export const ReviewsSection = ({ reviews }) => {
  if (!reviews.length) return null;

  const displayReviews = reviews.slice(0, 3);

  return (
    <section className="w-full py-6">
      <div className="flex flex-col gap-4">
        <SectionHeading
          eyebrow="Guest Feedback"
          title="Reviews"
          description="Recent guest impressions around comfort, planning, and overall travel experience."
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {displayReviews.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-theme bg-theme-surface p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold text-theme">
                  {item.name}
                </p>
                <p className="mt-1 text-[12px] text-muted">
                  {[item.tag, item.date].filter(Boolean).join(" | ")}
                </p>
              </div>

              <div className="inline-flex items-center gap-1 rounded-full bg-[rgba(var(--c-brand-rgb),0.1)] px-2.5 py-1 text-[12px] font-bold text-[var(--c-brand)]">
                <Star size={12} className="fill-current" />
                {item.rating}.0
              </div>
            </div>

            <p className="mt-4 text-[15px] leading-7 text-muted">
              {item.comment}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export const RelatedToursSection = ({ tours }) => {
  if (!tours.length) return null;

  return (
    <section className="w-full py-6">
      <SectionHeading
        eyebrow="Continue Exploring"
        title="Related Tours"
        description="More routes travelers often compare before making a booking decision."
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tours.map((item) => (
          <Link
            key={item.id}
            to={`/tours/${item.slug || item.id}`}
            className="group overflow-hidden rounded-[1.35rem] border border-[rgba(15,23,42,0.08)] bg-theme-surface transition hover:border-[rgba(var(--c-brand-rgb),0.45)] hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
          >
            <div className="overflow-hidden bg-theme-bg">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="h-[140px] w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-[140px] items-center justify-center bg-theme-bg text-sm text-muted">
                  No photo available
                </div>
              )}
            </div>

            <div className="space-y-2.5 p-3.5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--c-brand)]">
                  {item.location || "Tour"}
                </p>
                <h3 className="mt-1.5 line-clamp-2 text-[15px] font-semibold leading-[1.4] text-theme">
                  {item.title}
                </h3>
              </div>

              <div className="space-y-1.5 text-[12px] text-muted">
                <p className="inline-flex items-center gap-2">
                  <MapPin size={13} className="text-[var(--c-brand)]" />
                  {item.location || "Northern Pakistan"}
                </p>
                <p className="inline-flex items-center gap-2">
                  <Clock3 size={13} className="text-[var(--c-brand)]" />
                  {item.durationLabel || `${item.durationDays || 0} Days`}
                </p>
              </div>

              <div className="flex items-end justify-between gap-3 pt-1">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted">
                    From
                  </p>
                  <p className="mt-0.5 text-[14px] font-semibold text-theme">
                    {formatCurrencyAmount(item.price, item.currency)}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1 text-[12px] font-medium text-theme">
                  <Star
                    size={12}
                    className="fill-[var(--c-brand)] text-[var(--c-brand)]"
                  />
                  {Number(item.rating || 4.8).toFixed(1)}
                </div>
              </div>

              <span className="inline-flex h-9 items-center justify-center rounded-xl border border-[rgba(15,23,42,0.1)] px-3 text-[13px] font-semibold text-theme transition group-hover:border-[rgba(var(--c-brand-rgb),0.35)] group-hover:text-[var(--c-brand)]">
                View Tour
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
