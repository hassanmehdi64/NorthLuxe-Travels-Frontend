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
    <article className="group w-full max-w-[360px] h-[260px] overflow-hidden rounded-2xl border border-theme bg-theme-surface shadow-[0_8px_16px_rgba(15,23,42,0.08)] p-6 flex flex-col transition-all duration-300 hover:border-[var(--c-brand)]/55 hover:shadow-[0_12px_22px_rgba(15,23,42,0.12)]">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={avatar || "https://via.placeholder.com/80x80?text=NL"}
              alt={name}
              className="h-14 w-14 rounded-full object-cover border-2 border-[var(--c-hover)] shadow-sm transition-colors duration-500 group-hover:border-[var(--c-brand)]"
            />
            <div className="absolute inset-0 rounded-full bg-[var(--c-brand)] blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-20" />
          </div>

          <div className="min-w-0">
            <h4 className="mb-1.5 truncate text-[15px] font-bold leading-none tracking-tight text-theme">
              {name}
            </h4>
            <div className="flex items-center gap-2">
              <span className="truncate text-[10px] font-black uppercase tracking-[0.1em] text-[var(--c-brand)]">
                {location || role}
              </span>
              {reviewDate && (
                <>
                  <span className="h-1 w-1 rounded-full bg-muted/30" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-muted">
                    {reviewDate}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <Quote size={22} className="shrink-0 text-[var(--c-brand)] opacity-20 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="mb-5 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={`${name}-star-${index}`}
            size={12}
            className={index < safeRating ? "fill-current text-[var(--c-brand)]" : "text-muted/20"}
          />
        ))}
      </div>

      <p className="flex-1 text-[13px] leading-[1.7] italic font-medium text-theme opacity-90">
        &quot;{message}&quot;
      </p>
    </article>
  );
};

export default TestimonialCard;
