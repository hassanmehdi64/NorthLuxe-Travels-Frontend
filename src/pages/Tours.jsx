import ToursHero from "../components/tours/ToursHero";
import ToursFilter from "../components/tours/ToursFilter";
import ToursList from "../components/tours/ToursList";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usePublicTours } from "../hooks/useCms";

const Tours = () => {
  const { data: tours = [] } = usePublicTours();
  const [searchParams] = useSearchParams();
  const seasonFilter = (searchParams.get("season") || "").toLowerCase();

  const [filters, setFilters] = useState({
    destination: "all",
    duration: "all",
    sortBy: "popular",
  });

  const destinations = useMemo(
    () => ["all", ...new Set(tours.map((tour) => tour.location))],
    [tours],
  );

  const filteredTours = useMemo(() => {
    const fitsDuration = (days) => {
      if (filters.duration === "all") return true;
      if (filters.duration === "1-3") return days >= 1 && days <= 3;
      if (filters.duration === "4-7") return days >= 4 && days <= 7;
      return days >= 8;
    };

    const matches = tours.filter((tour) => {
      const destinationOk = filters.destination === "all" || tour.location === filters.destination;
      const durationOk = fitsDuration(Number(tour.durationDays || 0));
      const seasonText = [
        tour?.title,
        tour?.location,
        tour?.shortDescription,
        ...(Array.isArray(tour?.tags) ? tour.tags : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const seasonOk = !seasonFilter || seasonText.includes(seasonFilter);
      return destinationOk && durationOk && seasonOk;
    });

    return matches.sort((a, b) => {
      if (filters.sortBy === "price_low") return Number(a.price || 0) - Number(b.price || 0);
      if (filters.sortBy === "price_high") return Number(b.price || 0) - Number(a.price || 0);
      if (filters.sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      const popularityA = Number(a.reviews || 0) + (a.featured ? 100 : 0);
      const popularityB = Number(b.reviews || 0) + (b.featured ? 100 : 0);
      return popularityB - popularityA;
    });
  }, [tours, filters, seasonFilter]);

  return (
    <main className="bg-theme-bg text-theme">
      <ToursHero />
      <ToursFilter
        filters={filters}
        setFilters={setFilters}
        destinations={destinations}
      />
      <ToursList tours={filteredTours} />
    </main>
  );
};

export default Tours;
