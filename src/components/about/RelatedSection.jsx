import { Link } from "react-router-dom";
import { Compass, Mountain, Briefcase, MessageCircle } from "lucide-react";

const relatedItems = [
  {
    title: "Explore Tours",
    description: "Browse premium routes across Hunza, Skardu, and Fairy Meadows.",
    to: "/tours",
    icon: Compass,
  },
  {
    title: "View Activities",
    description: "Find hiking, trekking, camping, and culture-focused experiences.",
    to: "/activities",
    icon: Mountain,
  },
  {
    title: "Our Services",
    description: "See planning, transport, stay, and on-ground concierge support.",
    to: "/services",
    icon: Briefcase,
  },
  {
    title: "Contact Team",
    description: "Talk with an advisor for a tailored trip recommendation.",
    to: "/contact",
    icon: MessageCircle,
  },
];

const RelatedSection = () => {
  return (
    <section className="py-12 lg:py-14 bg-theme-bg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-[var(--c-brand)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.34em] text-[var(--c-brand)]">
              Related
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-theme">
            Continue Exploring
          </h2>
          <p className="mt-3 max-w-2xl text-sm md:text-base text-muted leading-relaxed">
            Move from our story to practical planning with routes, activities, and direct support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {relatedItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.to}
                className="group rounded-2xl border border-theme bg-theme-surface p-4 sm:p-5 shadow-[0_8px_16px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_26px_rgba(15,23,42,0.12)] transition-all duration-300"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-theme-bg border border-theme text-[var(--c-brand)]">
                  <Icon size={18} />
                </span>
                <h3 className="mt-3 text-base font-bold text-theme tracking-tight group-hover:text-[var(--c-brand)] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedSection;
