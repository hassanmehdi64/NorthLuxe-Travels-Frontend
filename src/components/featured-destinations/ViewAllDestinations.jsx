import { useMemo } from "react";
import { usePublicContentList, usePublicTours } from "../../hooks/useCms";
import DestinationCard from "./DestinationCard";
import FeaturePageHeader from "../features/FeaturePageHeader";
import { buildTourDestinationFallback, mapContentDestination } from "../../utils/destinations";

const ViewAllDestinations = () => {
  const { data: tours = [] } = usePublicTours();
  const { data: backendDestinations = [] } = usePublicContentList("destination");

  const destinations = useMemo(() => {
    if (backendDestinations.length) {
      return backendDestinations.map(mapContentDestination);
    }

    return buildTourDestinationFallback(tours);
  }, [backendDestinations, tours]);

  return (
    <section className="bg-theme-bg py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturePageHeader
          eyebrow="Explore"
          title="All"
          highlight="Destinations"
          description="Browse every published destination with direct access to detailed pages and available tours in each region."
        />

        {destinations.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {destinations.map((destination, index) => (
              <DestinationCard
                key={destination.id || destination.slug || `${destination.title}-${index}`}
                destination={destination}
                index={index}
                small
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
