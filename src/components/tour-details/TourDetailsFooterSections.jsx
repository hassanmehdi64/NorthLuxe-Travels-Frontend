import { Link } from "react-router-dom";

export const ReviewsSection = ({ ratingValue, reviewCount, reviewStats, reviews }) => (
  <section>
    <h2 className="text-[1.28rem] leading-none md:text-[1.55rem] font-semibold tracking-[-0.02em] text-theme">Tour Reviews</h2>
    <div className="mt-4 grid lg:grid-cols-[260px_minmax(0,1fr)] gap-4">
      <aside className="rounded-xl border-[0.5px] border-[rgba(15,23,42,0.06)] bg-theme-surface p-5 shadow-[0_6px_18px_rgba(15,23,42,0.02)]">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted">Average Rating</p>
        <div className="mt-2 flex items-end gap-2">
          <p className="text-4xl font-extrabold text-theme">{ratingValue.toFixed(1)}</p>
          <p className="text-sm font-semibold text-muted pb-1">/5</p>
        </div>
        <p className="mt-1 text-[13px] text-muted">{reviewCount} verified reviews</p>
        <div className="mt-4 space-y-2">
          {reviewStats.map((row) => (
            <div key={row.star} className="grid grid-cols-[20px_1fr_18px] items-center gap-2">
              <span className="text-[11px] font-semibold text-theme">{row.star}</span>
              <div className="h-1.5 rounded-full bg-theme">
                <div className="h-1.5 rounded-full bg-[var(--c-brand)]" style={{ width: `${row.percent}%` }} />
              </div>
              <span className="text-[11px] text-muted">{row.count}</span>
            </div>
          ))}
        </div>
      </aside>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {reviews.map((item) => (
          <article key={item.id} className="rounded-xl border-[0.5px] border-[rgba(15,23,42,0.06)] bg-theme-surface p-5 shadow-[0_6px_18px_rgba(15,23,42,0.015)]">
            <div className="flex items-center justify-between">
              <p className="text-[15px] md:text-base font-semibold text-theme">{item.name}</p>
              <p className="text-sm font-black text-[var(--c-brand)]">{item.rating}.0</p>
            </div>
            <p className="mt-1 text-[13px] text-muted">{item.tag} | {item.date}</p>
            <p className="mt-2 text-[15px] md:text-[16px] text-muted leading-7">{item.comment}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export const RelatedToursSection = ({ tours }) => {
  if (!tours.length) return null;

  return (
    <section>
      <h2 className="text-[1.28rem] leading-none md:text-[1.55rem] font-semibold tracking-[-0.02em] text-theme">You Might Also Like</h2>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tours.map((item) => (
          <Link key={item.id} to={`/tours/${item.slug || item.id}`} className="rounded-xl border-[0.5px] border-[rgba(15,23,42,0.06)] bg-theme-surface p-4 shadow-[0_6px_18px_rgba(15,23,42,0.015)] transition hover:border-[rgba(38,208,170,0.18)] hover:bg-theme-bg">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--c-brand)]">{item.location}</p>
            <p className="mt-1 text-[15px] md:text-base font-semibold text-theme line-clamp-2">{item.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};
