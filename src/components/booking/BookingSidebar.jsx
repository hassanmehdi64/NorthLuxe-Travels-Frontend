import { Link } from "react-router-dom";
import { Check, MoveUpRight } from "lucide-react";

const BookingSidebar = ({ popularPlans, selectedTourId, setForm }) => (
  <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
    <div className="overflow-hidden rounded-2xl border border-booking bg-white shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
      <div className="border-b border-booking bg-booking-soft px-4 py-3.5">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[var(--c-brand-dark)]">
          Suggested tours
        </p>
        <p className="mt-1 text-xs leading-5 text-muted">
          Pick a plan to prefill the booking.
        </p>
      </div>

      <div className="divide-y divide-[var(--c-border)]">
        {popularPlans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setForm((p) => ({ ...p, tourId: plan.id }))}
            className={`group relative w-full px-4 py-3.5 text-left transition-all duration-200 ${
              selectedTourId === plan.id ? "bg-[#e7fbf3]" : "bg-white hover:bg-[#f8fffc]"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute left-0 top-0 h-full w-1 transition ${
                selectedTourId === plan.id ? "bg-[var(--c-brand)]" : "bg-transparent"
              }`}
            />

            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                  selectedTourId === plan.id
                    ? "border-[var(--c-brand)] bg-[var(--c-brand)] text-theme"
                    : "border-booking bg-white text-transparent group-hover:border-[var(--c-brand)]"
                }`}
              >
                <Check size={12} strokeWidth={3} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-[#243746]">
                    {plan.title}
                  </p>
                  {plan.featured ? (
                    <span className="inline-flex shrink-0 items-center rounded-full border border-[#9fe7cf] bg-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#2b7d63]">
                      Hot
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 text-[11px] leading-5 text-[#647a8a]">
                  {plan.location} | {plan.durationLabel || `${plan.durationDays} Days`}
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-[#345060]">
                    {plan.currency} {Number(plan.price || 0).toLocaleString()}
                  </p>
                  {selectedTourId === plan.id ? (
                    <span className="inline-flex items-center rounded-full bg-[#123245] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white">
                      Selected
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-muted transition group-hover:text-[var(--c-brand-dark)]">
                      Select
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="border-t border-booking bg-booking-soft px-4 py-3">
        <Link
          to="/tours"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-booking bg-white px-3 py-2 text-[11px] font-semibold text-[#4b6271] transition hover:border-[#8cdbc1] hover:bg-[#effcf6] hover:text-[#2b7d63]"
        >
          View all tours
          <MoveUpRight size={12} />
        </Link>
      </div>
    </div>
  </aside>
);

export default BookingSidebar;
