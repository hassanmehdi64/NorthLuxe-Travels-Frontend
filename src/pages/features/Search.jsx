import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import TourCard from "../../components/tours/TourCard";
import FeaturePageHeader from "../../components/features/FeaturePageHeader";
import { usePublicTours } from "../../hooks/useCms";

const SearchPage = () => {
  const { data: tours = [] } = usePublicTours();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return tours.slice(0, 12);
    return tours
      .filter((tour) => {
        const values = [
          tour?.title,
          tour?.location,
          tour?.shortDescription,
          tour?.durationDays ? `${tour.durationDays}` : "",
        ]
          .join(" ")
          .toLowerCase();
        return values.includes(term);
      })
      .slice(0, 24);
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
          <div className="relative">
            <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tours by destination, title, duration..."
              className="w-full rounded-xl border border-theme bg-white pl-11 pr-4 py-3 text-sm text-theme placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-[var(--c-brand)]/35"
            />
          </div>
        </div>

        {results.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {results.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
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
