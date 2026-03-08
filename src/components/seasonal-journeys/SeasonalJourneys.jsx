import { useMemo } from "react";
import { usePublicTours } from "../../hooks/useCms";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import DestinationCard from "../featured-destinations/DestinationCard";
import { getSeasonPackages } from "./seasonalJourneysData";

const SeasonalJourneys = () => {
  const { data: tours = [] } = usePublicTours();
  const seasons = useMemo(() => getSeasonPackages(tours), [tours]);

  return (
    <section className="bg-theme-bg py-12 lg:py-14 ql-scroll-reveal" data-ql-reveal>
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="mb-8 md:mb-10">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--c-brand)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--c-brand)]">
                Seasonal Collection
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-theme md:text-4xl">
              Seasonal <span className="text-[var(--c-brand)]">Journeys</span>
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted md:text-base">
              Discover Gilgit-Baltistan through spring, summer, autumn, and winter travel experiences.
            </p>
          </div>
        </div>

        <div className="seasonal-journeys-swiper">
          <Swiper
            modules={[Autoplay]}
            loop
            speed={1100}
            autoplay={{
              delay: 2400,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            grabCursor
            spaceBetween={16}
            breakpoints={{
              0: { slidesPerView: 1.15 },
              640: { slidesPerView: 2.1 },
              1024: { slidesPerView: 3.1 },
              1280: { slidesPerView: 3.2 },
            }}
          >
            {seasons.map((season, index) => (
              <SwiperSlide key={season.id} className="pb-1">
                <div className="w-full transition-transform duration-300 hover:-translate-y-1">
                  <DestinationCard
                    destination={{
                      id: season.id,
                      title: season.title,
                      image: season.image,
                      description: season.subtitle,
                      href: `/seasons/${season.slug}`,
                    }}
                    index={index}
                    compact
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default SeasonalJourneys;
