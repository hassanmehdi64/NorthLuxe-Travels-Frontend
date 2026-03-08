import { Award, Globe2, ShieldCheck, Users2 } from "lucide-react";

const stats = [
  {
    icon: Users2,
    value: "100+",
    label: "Happy Travelers",
    note: "Verified guest experiences across Pakistan",
  },
  {
    icon: Globe2,
    value: "30+",
    label: "Destinations Covered",
    note: "Scenic, cultural, and adventure routes",
  },
  {
    icon: ShieldCheck,
    value: "99%",
    label: "Safe Trip Record",
    note: "Reliable operations and trusted partners",
  },
  {
    icon: Award,
    value: "5+",
    label: "Years Experience",
    note: "Premium planning and ground support",
  },
];

const OurAchievements = () => {
  return (
    <section className="py-12 lg:py-14 bg-theme-bg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-14 xl:px-16">
        <div className="mb-8 lg:mb-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--c-brand)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--c-brand)]">
                Trust Signals
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-theme tracking-tight">
              Our <span className="text-[var(--c-brand)]">Achievements</span>
            </h2>
            <p className="text-muted text-sm md:text-base leading-relaxed max-w-xl">
              Measurable results from our journeys, service quality, and
              traveler satisfaction.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.label}
                className="rounded-2xl border border-theme bg-theme-surface p-4 lg:p-5 shadow-[0_8px_16px_rgba(15,23,42,0.06)]">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-theme-bg border border-theme text-[var(--c-brand)]">
                  <Icon size={16} />
                </div>
                <p className="mt-3 text-2xl lg:text-3xl font-black tracking-tight text-theme">
                  {item.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-theme">
                  {item.label}
                </p>
                <p className="mt-1 text-[11px] text-muted leading-relaxed">
                  {item.note}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurAchievements;
