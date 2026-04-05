import { Link, useParams } from "react-router-dom";
import { CalendarDays, ChevronRight, MapPin, MoveUpRight, Route } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { usePublicContentItem, usePublicContentList, usePublicTours } from "../hooks/useCms";
import { normalizeDestinationKey, resolveDestinationMatch } from "../utils/destinations";

const MAX_SLIDER_IMAGES = 6;
const FALLBACK_HERO_IMAGE = "https://gilgitbaltistan.gov.pk/public/images/river-5688258_1920.jpg";

const humanizeDestinationName = (value = "destination") =>
  String(value || "destination")
    .replace(/-/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const DestinationDetails = () => {
  const { slug } = useParams();
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  const destinationKey = normalizeDestinationKey(normalizedSlug);

  const { data: tours = [] } = usePublicTours();
  const { data: destinationItems = [] } = usePublicContentList("destination");
  const { data: exactDestination } = usePublicContentItem("destination", normalizedSlug);

  const destination = exactDestination || resolveDestinationMatch(destinationItems, normalizedSlug);
  const destinationName = destination?.title || humanizeDestinationName(normalizedSlug || "destination");

  const matchedTours = tours.filter((tour) => {
    const locationKey = normalizeDestinationKey(tour?.location || "");
    return locationKey && locationKey === destinationKey;
  });

  const headerDescription =
    destination?.shortDescription ||
    destination?.description ||
    `Explore curated trips, practical itineraries, and verified travel experiences in ${destinationName}.`;

  const overviewText =
    destination?.description ||
    destination?.shortDescription ||
    `${destinationName} is a premium northern destination known for scenic routes, comfortable stays, and practical trip planning support.`;

  const historyText =
    destination?.content ||
    `Travel in ${destinationName} is shaped by mountain landscapes, local communities, and route-based experiences. This page now pulls its description directly from destination content in the admin dashboard, so updates can be managed from one place and reflected across the site.`;

  const historyParagraphs = String(historyText)
    .split("\n\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const highlights = destination?.highlights?.length
    ? destination.highlights
    : ["Scenic viewpoints", "Historic locations", "Nature-driven routes", "Local culture"];

  const features = destination?.features?.length
    ? destination.features
    : ["Flexible itineraries", "Verified support", "Comfort planning", "Transparent pricing"];

  const destinationImages = Array.from(
    new Set(
      [
        destination?.image,
        destination?.coverImage,
        ...(destination?.gallery || []),
        ...matchedTours.flatMap((tour) => [tour?.image, ...(tour?.gallery || [])]),
        FALLBACK_HERO_IMAGE,
      ].filter(Boolean),
    ),
  ).slice(0, MAX_SLIDER_IMAGES);

  const canAutoSlideHero = destinationImages.length > 1;
  const heroBulletCount = destinationImages.length;
  const heroGallery =
    destinationImages.length >= 3
      ? destinationImages
      : Array.from(
          { length: Math.max(3, destinationImages.length || 1) },
          (_, index) => destinationImages[index % Math.max(destinationImages.length, 1)] || FALLBACK_HERO_IMAGE,
        );

  const heroRenderSlides = canAutoSlideHero
    ? Array.from({ length: Math.max(heroGallery.length * 3, 9) }, (_, index) => heroGallery[index % heroGallery.length])
    : heroGallery;

  return (
    <section className="bg-theme-bg py-10 md:py-12 min-h-[60vh]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-6">
        <header className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--c-brand)]">
            {destination?.eyebrow || "Destination Overview"}
          </p>
          <h1 className="max-w-4xl text-[1.72rem] font-semibold leading-[1.05] tracking-[-0.035em] text-theme md:text-[2.35rem] capitalize">
            {destinationName}
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-muted md:text-base">{headerDescription}</p>
          <div className="flex flex-wrap gap-2.5">
            <div className="inline-flex min-w-[165px] items-center gap-2.5 rounded-[1.15rem] border border-[rgba(15,23,42,0.08)] bg-white px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--c-brand)]/10 text-[var(--c-brand)]">
                <MapPin size={15} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Region</p>
                <p className="mt-0.5 text-[0.95rem] font-semibold text-theme capitalize">{destinationName}</p>
              </div>
            </div>
            <div className="inline-flex min-w-[165px] items-center gap-2.5 rounded-[1.15rem] border border-[rgba(15,23,42,0.08)] bg-white px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--c-brand)]/10 text-[var(--c-brand)]">
                <CalendarDays size={15} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Best Time</p>
                <p className="mt-0.5 text-[0.95rem] font-semibold text-theme">{destination?.meta?.bestTime || "May to October"}</p>
              </div>
            </div>
            <div className="inline-flex min-w-[165px] items-center gap-2.5 rounded-[1.15rem] border border-[rgba(15,23,42,0.08)] bg-white px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--c-brand)]/10 text-[var(--c-brand)]">
                <Route size={15} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Published Tours</p>
                <p className="mt-0.5 text-[0.95rem] font-semibold text-theme">{matchedTours.length || 0}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[1.45rem] border border-[rgba(15,23,42,0.08)] bg-theme-surface px-3 py-3 shadow-[0_12px_24px_rgba(15,23,42,0.05)] sm:px-4 sm:py-4">
          <Swiper
            modules={[Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor
            centeredSlides={canAutoSlideHero}
            loop={canAutoSlideHero}
            loopAdditionalSlides={heroGallery.length}
            loopedSlides={heroGallery.length}
            loopPreventsSliding={false}
            speed={1050}
            autoplay={
              canAutoSlideHero
                ? {
                    delay: 1650,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                    stopOnLastSlide: false,
                    waitForTransition: false,
                  }
                : false
            }
            observer
            observeParents
            watchSlidesProgress
            onSwiper={(swiper) => {
              if (canAutoSlideHero && swiper?.autoplay) {
                swiper.autoplay.start();
              }
            }}
            pagination={{
              clickable: true,
              renderBullet: (index, className) =>
                index < heroBulletCount ? `<span class="${className}"></span>` : "",
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 140,
              modifier: 1.2,
              scale: 0.9,
              slideShadows: false,
            }}
            breakpoints={{
              0: { slidesPerView: 1.08, spaceBetween: 10 },
              768: { slidesPerView: 2, spaceBetween: 12 },
              1200: { slidesPerView: Math.min(3, heroGallery.length), spaceBetween: 14 },
            }}
            className="!overflow-visible !pb-10"
          >
            {heroRenderSlides.map((img, idx) => (
              <SwiperSlide key={`${img}-${idx}`} className="!h-auto">
                <div className="overflow-hidden rounded-[1.2rem] border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_10px_20px_rgba(15,23,42,0.06)]">
                  <img
                    src={img}
                    alt={`${destinationName} ${idx + 1}`}
                    className="h-[175px] w-full object-cover object-center sm:h-[210px] lg:h-[235px]"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <section className="rounded-2xl border border-theme bg-theme-surface p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-theme">Detailed Overview</h2>
          <p className="mt-3 text-sm md:text-base text-muted leading-relaxed">{overviewText}</p>
          <h3 className="mt-5 text-sm font-black uppercase tracking-[0.14em] text-theme">History & Background</h3>
          <div className="mt-2 space-y-3">
            {historyParagraphs.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 40)}-${index}`} className="text-sm md:text-base text-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <section className="rounded-2xl border border-theme bg-[#eef9f5] dark:bg-theme-surface p-4 md:p-5 transition-all duration-200 hover:border-[var(--c-brand)]/35 hover:shadow-[0_8px_20px_rgba(2,132,199,0.08)]">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-theme">Top Highlights</h3>
            <ul className="mt-3 space-y-2">
              {highlights.map((item) => (
                <li key={item} className="text-sm text-muted">- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-theme bg-[#eef5fb] dark:bg-theme-surface p-4 md:p-5 transition-all duration-200 hover:border-[var(--c-brand)]/35 hover:shadow-[0_8px_20px_rgba(2,132,199,0.08)]">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-theme">Destination Features</h3>
            <ul className="mt-3 space-y-2">
              {features.map((item) => (
                <li key={item} className="text-sm text-muted">- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-theme bg-[#eef5fb] dark:bg-theme-surface p-4 md:p-5 transition-all duration-200 hover:border-[var(--c-brand)]/35 hover:shadow-[0_8px_20px_rgba(2,132,199,0.08)]">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-theme">Travel Notes</h3>
            <div className="mt-3 space-y-2.5">
              <p className="text-sm text-muted">
                <span className="font-semibold text-theme">Best Time:</span> {destination?.meta?.bestTime || "May to October"}
              </p>
              <p className="text-sm text-muted">
                <span className="font-semibold text-theme">Ideal For:</span> {destination?.meta?.idealFor || "Scenic and comfort-focused travel groups"}
              </p>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-theme bg-theme-surface p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg md:text-xl font-bold text-theme">Available Tours</h2>
            <Link
              to="/tours"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme hover:text-[var(--c-brand)]"
            >
              Browse all tours
              <MoveUpRight size={13} />
            </Link>
          </div>

          {matchedTours.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {matchedTours.map((tour) => (
                <article
                  key={tour.id}
                  className="rounded-xl border border-theme bg-theme-bg overflow-hidden"
                >
                  <div className="flex">
                    {tour.image ? (
                      <img src={tour.image} alt={tour.title} className="w-28 h-24 object-cover shrink-0" />
                    ) : null}
                    <div className="p-3 space-y-1.5 min-w-0">
                      <h3 className="text-sm font-bold text-theme line-clamp-1">{tour.title}</h3>
                      <p className="text-sm text-muted line-clamp-2">
                        {tour.shortDescription || "Premium trip plan with local coordination and verified stays."}
                      </p>
                      <Link
                        to={`/tours/${tour.slug}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-theme hover:text-[var(--c-brand)]"
                      >
                        View Tour
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-theme bg-theme-bg py-12 px-6 text-center text-muted">
              No tours found for this destination.
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default DestinationDetails;


