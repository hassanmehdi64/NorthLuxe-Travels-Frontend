import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { MoveUpRight } from "lucide-react";
import TourCard from "../tours/TourCard";
import { usePublicTours } from "../../hooks/useCms";

const categoryButtons = [
  { id: "all", label: "All Tours", terms: [] },
  { id: "family", label: "Family Trips", terms: ["family", "families", "kids", "kid", "child", "children", "parent"] },
  { id: "group", label: "Group Tours", terms: ["group", "groups", "friends", "friend", "team", "corporate"] },
  { id: "seasonal", label: "Seasonal Deals", terms: ["seasonal", "season", "summer", "winter", "spring", "autumn", "fall", "deal", "deals"] },
];

const normalizeToList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map((item) => String(item).toLowerCase());
  if (typeof value === "string") return [value.toLowerCase()];
  return [];
};

const getSearchableTourText = (tour) => {
  const values = [
    tour?.title,
    tour?.location,
    tour?.shortDescription,
    tour?.description,
    tour?.category,
    tour?.travelStyle,
    tour?.bestSeason,
    tour?.season,
    ...(Array.isArray(tour?.tags) ? tour.tags : []),
    ...(Array.isArray(tour?.themes) ? tour.themes : []),
    ...(Array.isArray(tour?.highlights) ? tour.highlights : []),
    ...normalizeToList(tour?.idealFor),
  ];

  return values
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

const matchesCategory = (tour, category) => {
  if (!category || category.id === "all") return true;

  const searchableText = getSearchableTourText(tour);
  return category.terms.some((term) => searchableText.includes(term));
};

const PopularTours = () => {
  const { data: tours = [] } = usePublicTours();
  const [activeCategory, setActiveCategory] = useState("all");

  const featuredTours = useMemo(
    () => tours.filter((tour) => Boolean(tour?.featured)),
    [tours],
  );

  const categoryCounts = useMemo(() => {
    return categoryButtons.reduce((acc, category) => {
      acc[category.id] = featuredTours.filter((tour) => matchesCategory(tour, category)).length;
      return acc;
    }, {});
  }, [featuredTours]);

  const list = useMemo(() => {
    const selectedCategory = categoryButtons.find((item) => item.id === activeCategory);

    return featuredTours
      .filter((tour) => matchesCategory(tour, selectedCategory))
      .sort((a, b) => {
        const featuredScoreA = Number(Boolean(a?.featured)) * 2 + Number(Number(a?.availableSeats || 0) > 0);
        const featuredScoreB = Number(Boolean(b?.featured)) * 2 + Number(Number(b?.availableSeats || 0) > 0);
        return featuredScoreB - featuredScoreA;
      })
      .slice(0, 4);
  }, [activeCategory, featuredTours]);

  return (
    <section
      className="py-12 lg:py-14 bg-theme-bg ql-scroll-reveal"
      data-ql-reveal>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="mb-10 lg:mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-[var(--c-brand)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--c-brand)]">
                  Featured Collection
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-theme tracking-tight">
                Featured <span className="text-[var(--c-brand)]">Tours</span>
              </h2>

              <p className="text-muted text-sm md:text-base max-w-xl leading-relaxed">
                Most booked experiences with live availability and direct
                booking.
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2">
                {categoryButtons.map((category) => {
                  const isActive = category.id === activeCategory;
                  const count = categoryCounts[category.id] || 0;
                  const isDisabled = category.id !== "all" && count === 0;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => !isDisabled && setActiveCategory(category.id)}
                      disabled={isDisabled}
                      className={`group relative inline-flex cursor-pointer items-center gap-1.5 pb-1 text-[15px] leading-none font-medium transition-all duration-200 ${
                        isDisabled
                          ? "cursor-not-allowed text-muted/55"
                          : isActive
                            ? "text-[var(--c-brand)]"
                            : "text-theme hover:text-[var(--c-brand)] hover:opacity-90"
                      }`}>
                      <span>{category.label}</span>
                      {category.id !== "all" ? <span className="text-[12px] opacity-65">({count})</span> : null}
                      {!isDisabled ? (
                        <span
                          className={`absolute left-0 bottom-0 h-[2px] rounded-full bg-[var(--c-brand)] transition-all duration-200 ${
                            isActive
                              ? "w-full opacity-100"
                              : "w-0 opacity-0 group-hover:w-full group-hover:opacity-70"
                          }`}
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <Link
              to="/tours"
              className="inline-flex items-center justify-center gap-2 self-start md:self-auto rounded-xl border border-theme bg-theme-surface px-5 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-theme hover:text-[var(--c-brand)] hover:border-[var(--c-brand)]/45 hover:bg-white transition-all duration-300 active:scale-[0.98]">
              View All Tours
              <MoveUpRight size={14} />
            </Link>
          </div>
        </div>

        {list.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            {list.map((tour) => (
              <div key={tour.id} className="h-full">
                <TourCard tour={tour} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-light bg-theme-surface py-16 text-center ql-section-subheading">
            {activeCategory === "all"
              ? "Featured tours will appear here after publishing from the dashboard."
              : "No featured tours match this category yet."}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularTours;
