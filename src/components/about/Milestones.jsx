import { Award, MapPin, Smile, Users } from "lucide-react";

const milestones = [
  { count: "100+", label: "Tours Completed", icon: MapPin },
  { count: "150+", label: "Happy Travelers", icon: Smile },
  { count: "20+", label: "Local Guides", icon: Users },
  { count: "5+", label: "Years of Excellence", icon: Award },
];

const Milestones = () => {
  return (
    <section className="py-12 lg:py-14 bg-theme-bg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[var(--c-brand)]" />
            <span className="text-[var(--c-brand)] font-black uppercase tracking-[0.34em] text-[10px]">
              Milestones
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-theme">
            Our Achievements
          </h2>

          <p className="mt-3 text-sm md:text-base text-muted max-w-2xl leading-relaxed">
            Numbers that reflect consistent service quality and trusted travel execution.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {milestones.map((item) => {
            const IconComponent = item.icon;

            return (
              <article
                key={item.label}
                className="group rounded-2xl border border-theme bg-theme-surface p-4 sm:p-5 shadow-[0_8px_16px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_26px_rgba(15,23,42,0.12)] transition-all duration-300"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-theme-bg border border-theme text-[var(--c-brand)] mb-3">
                  <IconComponent size={18} />
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-theme tracking-tight">
                  {item.count}
                </h3>
                <p className="mt-1 text-muted text-xs sm:text-sm font-semibold">
                  {item.label}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Milestones;
