import { useMemo } from "react";
import { MoveUpRight } from "lucide-react";
import { usePublicTours } from "../../hooks/useCms";
import DestinationCard from "./DestinationCard";

const ViewAllDestinations = () => {
  const { data: tours = [] } = usePublicTours();

  const destinations = useMemo(() => {
    const map = new Map();
    tours.forEach((tour) => {
      const key = (tour.location || "").trim();
      if (!key || map.has(key)) return;
      const slug = key.toLowerCase().replace(/\s+/g, "-");
      map.set(key, {
        id: slug,
        title: key,
        image: tour.image,
        description: tour.shortDescription || tour.title,
        href: `/destinations/${slug}`,
      });
    });
    return Array.from(map.values());
  }, [tours]);

  return (
    <section className="py-12 lg:py-14 bg-theme-bg">
      <div className="max-w-[1600px] mx-auto px-8 sm:px-10 lg:px-14 xl:px-16">
        <div className="mb-10 lg:mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-[var(--c-brand)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--c-brand)]">
                  Signature Regions
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-theme tracking-tight">
                All <span className="text-[var(--c-brand)]">Destinations</span>
              </h1>
              <p className="text-muted text-sm md:text-base max-w-xl leading-relaxed">
                Browse every destination from published tours and open details for
                available trips in each region.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start md:self-auto rounded-xl border border-theme bg-theme-surface px-5 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-theme">
              Total {destinations.length}
              <MoveUpRight size={15} />
            </div>
          </div>
        </div>

        {destinations.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-light bg-theme-surface py-16 text-center text-muted">
            No destinations available yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default ViewAllDestinations;

