import { Link } from "react-router-dom";
import { MoveUpRight } from "lucide-react";

const BookingSidebar = ({ popularPlans, selectedTourId, setForm }) => (
  <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
    <div className="rounded-[1.75rem] border border-[#cfe9de] bg-[linear-gradient(180deg,#f9fffc_0%,#f3fbf7_100%)] p-4 shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-center text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#4f6574]">
          Most Popular Tour Plans
        </p>
      </div>
      <div className="mt-4 space-y-3">
        {popularPlans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setForm((p) => ({ ...p, tourId: plan.id }))}
            className={`w-full rounded-[1.35rem] border px-4 py-4 text-left transition-all duration-300 ${
              selectedTourId === plan.id
                ? "border-[#56c9a8] bg-[linear-gradient(180deg,#e7fbf3_0%,#d8f6ea_100%)] shadow-[0_12px_24px_rgba(83,191,158,0.18)]"
                : "border-[#d7e6df] bg-white hover:-translate-y-0.5 hover:border-[#8cdbc1] hover:bg-[#f6fdfa] hover:shadow-[0_10px_18px_rgba(15,23,42,0.08)]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="line-clamp-2 pr-2 text-[0.95rem] font-semibold leading-snug text-[#2e4352]">
                {plan.title}
              </p>
              {plan.featured ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#9fe7cf] bg-[#e7fbf3] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#2b7d63]">
                  Hot
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-[11px] leading-5 text-[#647a8a]">
              {plan.location} |{" "}
              {plan.durationLabel || `${plan.durationDays} Days`}
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6a7f8e]">
                  Starting From
                </p>
                <p className="mt-1 text-[1.05rem] font-bold text-[#345060]">
                  {plan.currency} {Number(plan.price || 0).toLocaleString()}
                </p>
              </div>
              {selectedTourId === plan.id ? (
                <span className="inline-flex items-center rounded-full bg-[#123245] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-white">
                  Selected
                </span>
              ) : null}
            </div>
          </button>
        ))}
      </div>
      <Link
        to="/tours"
        className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#cfe9de] bg-white px-3.5 py-2 text-[10px] font-semibold text-[#4b6271] transition hover:border-[#8cdbc1] hover:bg-[#effcf6] hover:text-[#2b7d63]"
      >
        View all tours
        <MoveUpRight size={12} />
      </Link>
    </div>
  </aside>
);

export default BookingSidebar;
