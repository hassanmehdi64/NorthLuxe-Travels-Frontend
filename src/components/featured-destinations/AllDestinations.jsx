import { useMemo } from "react";
import DestinationCard from "./DestinationCard";
import { usePublicContentList, usePublicTours } from "../../hooks/useCms";

const AllDestinations = () => {
  const { data: tours = [] } = usePublicTours();
  const { data: backendDestinations = [] } = usePublicContentList("destination");

  const tourDestinations = useMemo(() => {
    const map = new Map();
    tours.forEach((tour) => {
      const key = (tour.location || "").trim();
      if (!key) return;
      if (!map.has(key)) {
        const slug = key.toLowerCase().replace(/\s+/g, "-");
        map.set(key, {
          id: slug,
          title: key,
          image: tour.image,
          description: tour.shortDescription || tour.title,
          href: `/destinations/${slug}`,
        });
      }
    });
    return Array.from(map.values());
  }, [tours]);

  const destinations = useMemo(() => {
    if (backendDestinations.length) {
      return backendDestinations.map((item) => ({
        id: item.id || item.slug,
        title: item.title,
        image: item.image || item.coverImage,
        description: item.shortDescription || item.description,
        href: `/destinations/${item.slug}`,
      }));
    }
    return tourDestinations;
  }, [backendDestinations, tourDestinations]);

  return (
    <section className="py-20 bg-theme-bg ql-scroll-reveal" data-ql-reveal>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold ql-section-heading mb-5">
            All Destinations
          </h1>
          <div className="ql-heading-underline mx-auto mb-5" />
          <p className="ql-section-subheading max-w-2xl mx-auto">
            Browse every available destination from our published tours.
          </p>
        </div>

        {destinations.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-light bg-theme-surface py-16 text-center ql-section-subheading">
            No destinations available yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default AllDestinations;
