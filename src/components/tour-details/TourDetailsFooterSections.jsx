import { Link } from "react-router-dom";
import { Clock3, MapPin, Star } from "lucide-react";
import { formatCurrencyAmount } from "../../utils/currency";

const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="space-y-2">
    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--c-brand)]">
      {eyebrow}
    </p>
    <h2 className="text-[1.7rem] font-semibold leading-tight tracking-[-0.03em] text-theme md:text-[2.1rem]">
      {title}
    </h2>
    {description ? (
      <p className="max-w-4xl text-[15px] leading-7 text-muted md:text-[16px]">
        {description}
      </p>
    ) : null}
  </div>
);

export const ReviewsSection = ({ ratingValue, reviewCount, reviews }) => {
  if (!reviews.length) return null;

  const displayReviews = reviews.slice(0, 3);

  return (
    <section className="w-full py-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Guest Feedback"
          title="Reviews"
          description="Recent guest impressions around comfort, planning, and overall travel experience."
        />

        <div className="rounded-2xl border border-theme bg-theme-surface px-5 py-4 lg:min-w-[220px]">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">
            Overall Rating
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-[2rem] font-semibold leading-none text-theme">
              {ratingValue.toFixed(1)}
            </span>

            <div className="flex items-center gap-0.5 text-[var(--c-brand)]">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={14}
                  className={
                    idx < Math.round(ratingValue) ? "fill-current" : "opacity-25"
                  }
                />
              ))}
            </div>
          </div>

          <p className="mt-1 text-[13px] text-muted">
            {reviewCount} verified reviews
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
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
    <section className="w-full py-10">
      <SectionHeading
        eyebrow="Continue Exploring"
        title="Related Tours"
        description="More routes travelers often compare before making a booking decision."
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tours.map((item) => (
          <Link
            key={item.id}
            to={`/tours/${item.slug || item.id}`}
            className="group overflow-hidden rounded-[1.5rem] border border-[rgba(15,23,42,0.08)] bg-theme-surface transition hover:border-[rgba(var(--c-brand-rgb),0.45)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
          >
            <div className="overflow-hidden bg-theme-bg">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="h-[180px] w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-[180px] items-center justify-center bg-theme-bg text-sm text-muted">
                  No photo available
                </div>
              )}
            </div>

            <div className="space-y-3 p-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--c-brand)]">
                  {item.location || "Tour"}
                </p>
                <h3 className="mt-2 line-clamp-2 text-[16px] font-semibold leading-6 text-theme">
                  {item.title}
                </h3>
              </div>

              <div className="space-y-2 text-[13px] text-muted">
                <p className="inline-flex items-center gap-2">
                  <MapPin size={14} className="text-[var(--c-brand)]" />
                  {item.location || "Northern Pakistan"}
                </p>
                <p className="inline-flex items-center gap-2">
                  <Clock3 size={14} className="text-[var(--c-brand)]" />
                  {item.durationLabel || `${item.durationDays || 0} Days`}
                </p>
              </div>

              <div className="flex items-end justify-between gap-3 pt-1">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted">
                    From
                  </p>
                  <p className="mt-1 text-[15px] font-semibold text-theme">
                    {formatCurrencyAmount(item.price, item.currency)}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1 text-[13px] font-medium text-theme">
                  <Star
                    size={13}
                    className="fill-[var(--c-brand)] text-[var(--c-brand)]"
                  />
                  {Number(item.rating || 4.8).toFixed(1)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};