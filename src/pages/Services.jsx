import FeaturePageHeader from "../components/features/FeaturePageHeader";
import { Link } from "react-router-dom";
import { MoveUpRight } from "lucide-react";
import { usePublicContentList } from "../hooks/useCms";

const Services = () => {
  const { data: backendServices = [], isLoading } = usePublicContentList("service");
  const items = backendServices;

  return (
    <section className="bg-theme-bg py-12 lg:py-14">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        <FeaturePageHeader
          eyebrow="What We Offer"
          title="Premium"
          highlight="Services"
          description="From itinerary planning to on-ground concierge, choose the exact support you need for a smooth and reliable journey."
        />

        {isLoading ? (
          <div className="rounded-2xl border border-theme bg-theme-surface py-12 text-center text-sm text-muted">
            Loading services...
          </div>
        ) : items.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {items.map((service) => (
              <Link
                key={service.id || service.slug}
                to={`/services/${service.slug || service.id}`}
                className="group rounded-2xl border border-theme bg-theme-surface overflow-hidden shadow-[0_8px_16px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_26px_rgba(15,23,42,0.12)] transition-all duration-300"
              >
                <img
                  src={service.image || service.coverImage}
                  alt={service.title}
                  className="w-full h-[190px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">
                    {service.category || "Travel Service"}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-theme">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted line-clamp-2">{service.shortDescription || service.description}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-theme group-hover:text-[var(--c-brand)]">
                    View Details
                    <MoveUpRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-theme bg-theme-surface py-12 text-center text-sm text-muted">
            No services are published yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
