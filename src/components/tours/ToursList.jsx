import TourCard from "./TourCard";
import { SearchX } from "lucide-react";

const ToursList = ({ tours = [] }) => {
  return (
    <section className="pb-14 lg:pb-16 pt-8 lg:pt-10 bg-theme-bg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="mb-6 lg:mb-8 rounded-xl border border-theme bg-theme-surface px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-muted">Results</span>
            <span className="h-1 w-1 rounded-full bg-[var(--c-brand)]" />
            <span className="text-sm font-semibold text-theme">{tours.length} tours found</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--c-brand)]">
            Verified listings
          </span>
        </div>

        {tours.length ? (
          <div className="grid gap-4 sm:gap-4.5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-theme bg-theme-surface py-14 px-4 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-theme-bg border border-theme flex items-center justify-center mb-4">
              <SearchX size={22} className="text-muted" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-theme tracking-tight mb-1">
              No matching tours found
            </h3>
            <p className="text-sm text-muted leading-relaxed max-w-md">
              Try changing filters like destination, duration, or sort priority to view more options.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ToursList;
