import { useEffect, useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import TourCard from "../../components/tours/TourCard";
import FeaturePageHeader from "../../components/features/FeaturePageHeader";
import PlaceSearchInput from "../../components/search/PlaceSearchInput";
import { usePublicContentList, usePublicTours } from "../../hooks/useCms";
import { buildPlaceSuggestions, getTourSearchScore } from "../../utils/tourSearch";

const SearchPage = () => {
  const { data: tours = [] } = usePublicTours();
  const { data: destinationItems = [] } = usePublicContentList("destination");
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const placeSuggestions = useMemo(
    () =>
      buildPlaceSuggestions({ tours, destinationItems }),
    [tours, destinationItems],
  );

  const results = useMemo(() => {
    if (!query.trim()) return tours.slice(0, 12);

    return tours
      .map((tour) => ({ tour, meta: getTourSearchScore(tour, query) }))
      .filter((item) => item.meta.matchesQuery)
      .sort((a, b) => (b.meta.score || 0) - (a.meta.score || 0))
      .slice(0, 24)
      .map((item) => item.tour);
  }, [tours, query]);

  return (
    <section className="py-20 bg-theme-bg min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturePageHeader
          eyebrow="Quick Search"
          title="Find Your"
          highlight="Perfect Tour"
          description="Search by destination, route style, or duration and jump directly to available experiences."
        />

        <div className="rounded-2xl border border-theme bg-theme-surface p-4 mb-8">
          <div className="relative flex items-center gap-3 rounded-xl border border-theme bg-white px-4 py-3">
            <SearchIcon size={18} className="shrink-0 text-muted" />
            <PlaceSearchInput
              value={query}
              onChange={setQuery}
              suggestions={placeSuggestions}
              placeholder="Search tours by place, title, duration..."
              inputClassName="w-full bg-transparent text-sm text-theme placeholder:text-muted/70 focus:outline-none"
            />
          </div>
        </div>

        {results.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {results.map((tour, index) => (
              <TourCard key={tour.id} tour={tour} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-theme bg-theme-surface py-16 text-center text-muted">
            No tours matched your search.
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchPage;






