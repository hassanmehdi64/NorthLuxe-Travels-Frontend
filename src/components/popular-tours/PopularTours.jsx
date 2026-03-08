import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { MoveUpRight } from "lucide-react";
import TourCard from "../tours/TourCard";
import { usePublicTours } from "../../hooks/useCms";

const categoryButtons = [
  { id: "all", label: "All Tours", terms: [] },
  { id: "family", label: "Family Trips", terms: ["family", "families", "kids"] },
  { id: "group", label: "Group Tours", terms: ["group", "groups", "friends", "team"] },
  { id: "seasonal", label: "Seasonal Deals", terms: ["seasonal", "season", "summer", "winter", "spring", "autumn", "deal", "deals"] },
];

const getSearchableTourText = (tour) => {
  const values = [
    tour?.title,
    tour?.location,
    tour?.shortDescription,
    ...(Array.isArray(tour?.tags) ? tour.tags : []),
  ];

  return values
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

const PopularTours = () => {
  const { data: tours = [] } = usePublicTours();
  const [activeCategory, setActiveCategory] = useState("all");
  const list = useMemo(() => {
    const selectedCategory = categoryButtons.find((item) => item.id === activeCategory);

    return tours
      .filter((tour) => Boolean(tour?.featured))
      .filter((tour) => {
        if (!selectedCategory || selectedCategory.id === "all") return true;
        const searchableText = getSearchableTourText(tour);
        return selectedCategory.terms.some((term) => searchableText.includes(term));
      })
      .sort((a, b) => {
        const featuredScoreA = Number(Boolean(a?.featured)) * 2 + Number(Number(a?.availableSeats || 0) > 0);
        const featuredScoreB = Number(Boolean(b?.featured)) * 2 + Number(Number(b?.availableSeats || 0) > 0);
        return featuredScoreB - featuredScoreA;
      })
      .slice(0, 4);
  }, [activeCategory, tours]);

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

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveCategory(category.id)}
                      className={`group relative inline-flex cursor-pointer items-center pb-1 text-[15px] leading-none font-medium transition-all duration-200 hover:-translate-y-[1px] ${
                        isActive
                          ? "text-[var(--c-brand)]"
                          : "text-theme hover:text-[var(--c-brand)] hover:opacity-90"
                      }`}>
                      {category.label}
                      <span
                        className={`absolute left-0 bottom-0 h-[2px] rounded-full bg-[var(--c-brand)] transition-all duration-200 ${
                          isActive
                            ? "w-full opacity-100"
                            : "w-0 opacity-0 group-hover:w-full group-hover:opacity-70"
                        }`}
                      />
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
