import { Link } from "react-router-dom";
import { useMemo } from "react";
import { MoveUpRight } from "lucide-react";
import { usePublicTours } from "../../hooks/useCms";
import DestinationCard from "./DestinationCard";
import destinationsData from "./destinationsData";

const toSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const FeaturedDestinations = () => {
  const { data: tours = [] } = usePublicTours();

  const destinations = useMemo(() => {
    const byLocation = new Map();

    tours.forEach((tour) => {
      const location = tour?.location?.trim();
      if (!location || byLocation.has(location)) return;

      byLocation.set(location, {
        id: tour?.id || location,
        title: location,
        image: tour?.image,
        description: tour?.shortDescription || tour?.title,
        href: `/destinations/${toSlug(location)}`,
      });
    });

    const dynamic = Array.from(byLocation.values()).filter((item) => item.image).slice(0, 4);
    if (dynamic.length) return dynamic;

    return destinationsData.slice(0, 4).map((item) => ({
      ...item,
      href: `/destinations/${toSlug(item.title)}`,
    }));
  }, [tours]);

  return (
    <section className="py-12 lg:py-14 bg-theme-bg overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="mb-10 lg:mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-[var(--c-brand)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--c-brand)]">
                  Signature Regions
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-theme tracking-tight">
                Top <span className="text-[var(--c-brand)]">Destinations</span>
              </h2>
              <p className="text-muted text-sm md:text-base max-w-xl leading-relaxed">
                Explore the most requested regions, curated for scenic beauty, comfort,
                and seamless logistics.
              </p>
            </div>

            <Link
              to="/destinations"
              className="inline-flex items-center justify-center gap-2 self-start md:self-auto rounded-xl border border-theme bg-theme-surface px-5 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-theme hover:text-[var(--c-brand)] hover:border-[var(--c-brand)]/45 hover:bg-white transition-all duration-300 active:scale-[0.98]"
            >
              View All Destinations
              <MoveUpRight size={15} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {destinations.map((destination, index) => (
            <div
              key={destination.id || `${destination.title}-${index}`}
              className="w-full max-w-[280px] mx-auto sm:max-w-none"
            >
              <DestinationCard
                destination={destination}
                index={index}
                compact
              />
            </div>
          ))}
        </div>

        {!destinations.length && (
          <div className="mt-6 rounded-2xl border border-dashed border-light bg-theme-surface py-14 text-center text-muted">
            Destinations will appear here after publishing tours.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDestinations;
