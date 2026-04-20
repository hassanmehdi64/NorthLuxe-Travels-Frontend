import { Link, useParams } from "react-router-dom";
import { Check, Clock3, MapPin, Mountain, MoveUpRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { usePublicContentItem, usePublicContentList } from "../hooks/useCms";

const MAX_SLIDER_IMAGES = 6;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80";
const HERO_SLIDE_DELAY = 3000;
const HERO_SLIDE_SPEED = 900;

const DetailPill = ({ icon: Icon, label, value }) => (
  <div className="flex min-w-0 items-center gap-3 rounded-lg border border-theme bg-white px-4 py-3 shadow-[0_10px_22px_rgba(15,23,42,0.05)]">
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--c-brand)]/10 text-[var(--c-brand)]">
      <Icon size={16} />
    </span>
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="mt-0.5 truncate text-[14px] font-bold leading-5 text-theme">
        {value || "Flexible"}
      </p>
    </div>
  </div>
);

const ActivityDetails = () => {
  const { slug } = useParams();
  const { data: backendActivity, isLoading } = usePublicContentItem("activity", slug);
  const { data: backendActivities = [] } = usePublicContentList("activity");

  const activity = backendActivity || null;

  if (isLoading) {
    return (
      <section className="bg-theme-bg py-12 lg:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-theme bg-theme-surface py-16 text-center text-sm font-semibold text-muted">
            Loading activity details...
          </div>
        </div>
      </section>
    );
  }

  if (!activity && !isLoading) {
    return (
      <section className="py-12 lg:py-14 bg-theme-bg">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="rounded-2xl border border-dashed border-theme bg-theme-surface py-16 text-center text-muted">
            Activity not found.
          </div>
        </div>
      </section>
    );
  }

  if (!activity) return null;

  const related = backendActivities
    .filter((item) => (item.id || item.slug) !== (activity.id || activity.slug))
    .slice(0, 3);
  const baseGallery = activity.gallery?.length
    ? activity.gallery
    : [activity.image || activity.coverImage || FALLBACK_IMAGE].filter(Boolean);
  const heroImages = (
    activity.meta?.heroSliderImages?.length
      ? activity.meta.heroSliderImages.filter(Boolean)
      : baseGallery
  ).slice(0, MAX_SLIDER_IMAGES);
  const includes = activity.includes?.length ? activity.includes : [];
  const canAutoSlideHero = heroImages.length > 1;
  const heroBulletCount = heroImages.length;
  const safeHeroImages = heroImages.length ? heroImages : [FALLBACK_IMAGE];
  const heroGallery =
    safeHeroImages.length >= 3
      ? safeHeroImages
      : Array.from({ length: Math.max(3, safeHeroImages.length) }, (_, index) => safeHeroImages[index % safeHeroImages.length]);
  const heroRenderSlides = canAutoSlideHero
    ? Array.from({ length: Math.max(heroGallery.length * 3, 9) }, (_, index) => heroGallery[index % heroGallery.length])
    : heroGallery;
  const detailedDescriptionSource = String(
    activity.content ||
      activity.meta?.detailedDescription ||
      activity.description ||
      activity.shortDescription ||
      "",
  ).trim();
  const detailedDescription = detailedDescriptionSource
    ? detailedDescriptionSource
        .split(/\n\s*\n/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
  const detailParagraphs = detailedDescription.length
    ? detailedDescription
    : [
        activity.description ||
          activity.shortDescription ||
          "This activity is planned with local coordination and guest comfort in mind.",
        `The experience is arranged around ${String(activity.location || "selected northern routes").toLowerCase()}, with ${String(activity.duration || "flexible timing").toLowerCase()} and a ${String(activity.level || "comfortable").toLowerCase()} pace so the trip stays practical and enjoyable.`,
      ];
  const overviewText =
    activity.description ||
    activity.shortDescription ||
    "This activity is planned with local coordination, guest comfort, and practical pacing in mind.";

  return (
    <section className="bg-theme-bg py-10 md:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl space-y-7 px-4 sm:px-6 lg:px-8">
        <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-4xl space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--c-brand)]">
              Activity Details
            </p>
            <h1 className="text-[30px] font-black leading-[1.08] text-theme sm:text-[38px] lg:text-[46px]">
              {activity.title}
            </h1>
            <p className="max-w-3xl text-[15px] leading-7 text-muted md:text-[16px] md:leading-8">
              {activity.shortDescription || activity.description}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <DetailPill
              icon={MapPin}
              label="Location"
              value={activity.location}
            />
            <DetailPill
              icon={Clock3}
              label="Duration"
              value={activity.duration}
            />
            <DetailPill icon={Mountain} label="Level" value={activity.level} />
          </div>
        </header>

        <div className="mx-auto max-w-[1180px] overflow-hidden rounded-lg border border-theme bg-theme-surface px-3 py-4 shadow-[0_14px_28px_rgba(15,23,42,0.06)] sm:px-5 sm:py-5">
          <Swiper
            modules={[Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor
            centeredSlides={canAutoSlideHero}
            loop={canAutoSlideHero}
            loopAdditionalSlides={heroGallery.length}
            loopedSlides={heroGallery.length}
            loopPreventsSliding={false}
            speed={HERO_SLIDE_SPEED}
            autoplay={
              canAutoSlideHero
                ? {
                    delay: HERO_SLIDE_DELAY,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                    stopOnLastSlide: false,
                    waitForTransition: true,
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
                index < heroBulletCount
                  ? `<span class="${className}"></span>`
                  : "",
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 18,
              depth: 90,
              modifier: 1,
              scale: 0.92,
              slideShadows: false,
            }}
            breakpoints={{
              0: { slidesPerView: 1.02, spaceBetween: 12 },
              640: { slidesPerView: 1.35, spaceBetween: 14 },
              900: { slidesPerView: 2.05, spaceBetween: 16 },
              1280: {
                slidesPerView: Math.min(2.45, heroGallery.length),
                spaceBetween: 18,
              },
            }}
            className="!overflow-visible !px-1 !pb-11">
            {heroRenderSlides.map((img, idx) => (
              <SwiperSlide key={`${img}-${idx}`} className="!h-auto">
                <div className="overflow-hidden rounded-lg border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_12px_24px_rgba(15,23,42,0.07)]">
                  <img
                    src={img}
                    alt={`${activity.title} ${idx + 1}`}
                    className="aspect-[16/10] w-full object-cover object-center sm:aspect-[16/9]"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <article className="space-y-6 rounded-lg border border-theme bg-theme-surface p-5 md:p-6">
            <div className="space-y-3">
              <h2 className="text-[22px] font-black leading-7 text-theme">
                Overview
              </h2>
              <p className="max-w-4xl text-[15px] leading-7 text-muted md:text-[16px] md:leading-8">
                {overviewText}
              </p>
            </div>

            {includes.length ? (
              <div className="space-y-3 border-t border-theme pt-5">
                <h3 className="text-[12px] font-black uppercase tracking-[0.16em] text-theme">
                  What is Included
                </h3>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[14px] leading-6 text-theme">
                      <Check
                        size={16}
                        className="mt-1 shrink-0 text-[var(--c-brand)]"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>

          <aside className="h-fit rounded-lg border border-theme bg-theme-surface p-5 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">
              Need a Custom Plan?
            </p>
            <h2 className="mt-2 text-[20px] font-black leading-7 text-theme">
              Build this around your group
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-muted">
              Share your travel window, budget, and group details. We will
              suggest the best activity combination.
            </p>
            <Link
              to="/custom-plan-request"
              className="ql-btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-[14px] font-bold">
              Request Custom Plan
              <MoveUpRight size={14} />
            </Link>
          </aside>
        </div>

        <section className="rounded-lg border border-theme bg-theme-surface p-5 md:p-6">
          <h2 className="text-[22px] font-black leading-7 text-theme">
            Detailed Description
          </h2>
          <div className="mt-4 max-w-5xl space-y-4">
            {detailParagraphs.map((paragraph, index) => (
              <p
                key={`${paragraph.slice(0, 36)}-${index}`}
                className="text-[15px] leading-7 text-muted md:text-[16px] md:leading-8">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {related.length ? (
          <section>
            <h2 className="text-[22px] font-black leading-7 text-theme">
              Related Activities
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id || item.slug}
                  to={`/activities/${item.slug || item.id}`}
                  className="rounded-lg border border-theme bg-theme-surface p-4 transition hover:border-[var(--c-brand)]/45 hover:shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--c-brand)]">
                    {item.location}
                  </p>
                  <p className="mt-2 text-[15px] font-bold leading-6 text-theme">
                    {item.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
};

export default ActivityDetails;
