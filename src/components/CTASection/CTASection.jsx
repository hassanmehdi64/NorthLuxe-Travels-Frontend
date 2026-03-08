import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck2, ShieldCheck, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-12 lg:py-14 bg-theme-bg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-14 xl:px-16">
        <div className="rounded-2xl border border-theme bg-theme-surface overflow-hidden">
          <div className="grid lg:grid-cols-[1.2fr_1fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-theme bg-theme-bg px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-theme">
                <Sparkles size={11} className="text-[var(--c-brand)]" />
                Travel Concierge
              </div>

              <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-theme leading-tight">
                Plan Your Next Northern Pakistan Trip
              </h2>

              <p className="mt-3 max-w-2xl text-sm md:text-base text-muted leading-relaxed">
                Tell us your dates, style, and budget. We will prepare a refined travel plan with verified stays, safe routes, and priority support.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
                <Link
                  to="/custom-booking"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold ql-btn-primary"
                >
                  Start Planning
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/tours"
                  className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold ql-btn-secondary"
                >
                  Explore Tours
                </Link>
              </div>
            </div>

            <div className="border-t lg:border-t-0 lg:border-l border-theme bg-theme-bg/70 p-6 md:p-8 lg:p-10">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-theme mb-4">
                Why Book With Us
              </h3>

              <div className="space-y-3">
                <Point icon={ShieldCheck} label="Verified travel partners" />
                <Point icon={CalendarCheck2} label="Flexible date planning" />
                <Point icon={Sparkles} label="Fast premium support" />
              </div>

              <div className="mt-6 rounded-xl border border-theme bg-theme-surface p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted">Response Window</p>
                <p className="mt-1 text-sm text-theme font-semibold">Usually within 30-60 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Point = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-3 rounded-xl border border-theme bg-theme-surface px-3.5 py-3">
    <Icon size={15} className="text-[var(--c-brand)]" />
    <span className="text-sm font-medium text-theme">{label}</span>
  </div>
);

export default CTASection;
