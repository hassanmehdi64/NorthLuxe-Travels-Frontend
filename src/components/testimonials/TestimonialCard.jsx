import { Quote, Star } from "lucide-react";

const formatReviewDate = (date) => {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const TestimonialCard = ({ name, role, avatar, message, rating = 5, date, location }) => {
  const safeRating = Math.max(1, Math.min(5, Number(rating || 5)));
  const reviewDate = formatReviewDate(date);

  return (
    <article className="group flex h-full min-h-[248px] w-full max-w-full overflow-hidden rounded-2xl border border-theme bg-theme-surface p-4 shadow-[0_8px_16px_rgba(15,23,42,0.08)] transition-all duration-300 hover:border-[var(--c-brand)]/55 hover:shadow-[0_12px_22px_rgba(15,23,42,0.12)] sm:min-h-[260px] sm:max-w-[360px] sm:p-5 lg:p-6">
      <div className="flex w-full flex-col">
        <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="relative">
              <img
                src={avatar || "https://via.placeholder.com/80x80?text=NL"}
                alt={name}
                className="h-12 w-12 rounded-full border-2 border-[var(--c-hover)] object-cover shadow-sm transition-colors duration-500 group-hover:border-[var(--c-brand)] sm:h-14 sm:w-14"
              />
              <div className="absolute inset-0 rounded-full bg-[var(--c-brand)] blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-20" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="mb-1.5 truncate text-sm font-bold leading-tight tracking-tight text-theme sm:text-[15px]">
                {name}
              </h4>
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <span className="max-w-full truncate text-[10px] font-black uppercase tracking-[0.1em] text-[var(--c-brand)]">
                  {location || role}
                </span>
                {reviewDate && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-muted/30" />
                    <span className="shrink-0 text-[10px] font-bold uppercase text-muted">
                      {reviewDate}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <Quote size={20} className="shrink-0 text-[var(--c-brand)] opacity-20 transition-opacity duration-500 group-hover:opacity-100 sm:size-[22px]" />
        </div>

        <div className="mb-4 flex items-center gap-1 sm:mb-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={`${name}-star-${index}`}
              size={12}
              className={index < safeRating ? "fill-current text-[var(--c-brand)]" : "text-muted/20"}
            />
          ))}
        </div>

        <p className="testimonial-message flex-1 overflow-hidden text-[13px] font-medium leading-[1.7] text-theme opacity-90 sm:text-sm">
          &quot;{message}&quot;
        </p>
      </div>
    </article>
  );
};

export default TestimonialCard;
