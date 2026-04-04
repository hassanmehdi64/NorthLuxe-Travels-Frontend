import { Link, useParams } from "react-router-dom";
import { Check, Clock3, MapPin, Mountain, MoveUpRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { usePublicContentItem, usePublicContentList } from "../hooks/useCms";

const MAX_SLIDER_IMAGES = 6;

const ActivityDetails = () => {
  const { slug } = useParams();
  const { data: backendActivity, isLoading } = usePublicContentItem("activity", slug);
  const { data: backendActivities = [] } = usePublicContentList("activity");

  const activity = backendActivity || null;

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
    : [activity.image || activity.coverImage].filter(Boolean);
  const heroImages = (
    activity.meta?.heroSliderImages?.length
      ? activity.meta.heroSliderImages.filter(Boolean)
      : baseGallery
  ).slice(0, MAX_SLIDER_IMAGES);
  const includes = activity.includes?.length ? activity.includes : [];
  const canAutoSlideHero = heroImages.length > 1;
  const heroBulletCount = heroImages.length;
  const heroGallery =
    heroImages.length >= 3
      ? heroImages
      : Array.from({ length: Math.max(3, heroImages.length) }, (_, index) => heroImages[index % heroImages.length]);
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

  return (
    <section className="py-10 md:py-12 bg-theme-bg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-7">
        <header className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--c-brand)]">Activity Details</p>
          <h1 className="max-w-4xl text-[1.72rem] font-semibold leading-[1.05] tracking-[-0.035em] text-theme md:text-[2.35rem]">
            {activity.title}
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-muted md:text-base">
            {activity.shortDescription || activity.description}
          </p>
          <div className="flex flex-wrap gap-2.5">
            <div className="inline-flex min-w-[165px] items-center gap-2.5 rounded-[1.15rem] border border-[rgba(15,23,42,0.08)] bg-white px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--c-brand)]/10 text-[var(--c-brand)]">
                <MapPin size={15} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Location</p>
                <p className="mt-0.5 text-[0.95rem] font-semibold text-theme">{activity.location}</p>
              </div>
            </div>
            <div className="inline-flex min-w-[165px] items-center gap-2.5 rounded-[1.15rem] border border-[rgba(15,23,42,0.08)] bg-white px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--c-brand)]/10 text-[var(--c-brand)]">
                <Clock3 size={15} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Duration</p>
                <p className="mt-0.5 text-[0.95rem] font-semibold text-theme">{activity.duration}</p>
              </div>
            </div>
            <div className="inline-flex min-w-[165px] items-center gap-2.5 rounded-[1.15rem] border border-[rgba(15,23,42,0.08)] bg-white px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--c-brand)]/10 text-[var(--c-brand)]">
                <Mountain size={15} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Level</p>
                <p className="mt-0.5 text-[0.95rem] font-semibold text-theme">{activity.level}</p>
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
                    alt={`${activity.title} ${idx + 1}`}
                    className="h-[175px] w-full object-cover object-center sm:h-[210px] lg:h-[235px]"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-theme">Overview</h2>
            <p className="text-sm md:text-base text-muted leading-relaxed">{activity.description}</p>

            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-theme">What is Included</h3>
            <ul className="space-y-2">
              {includes.map((item) => (
                <li key={item} className="inline-flex items-start gap-2 text-sm text-theme">
                  <Check size={14} className="mt-0.5 text-[var(--c-brand)]" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <aside className="h-fit rounded-2xl border border-theme bg-theme-surface p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">Need a Custom Plan?</p>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Share your travel window, budget, and group details. We will suggest the best activity combination.
            </p>
            <Link
              to="/custom-plan-request"
              className="ql-btn-primary mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              Request Custom Plan
              <MoveUpRight size={14} />
            </Link>
          </aside>
        </div>

        <section className="rounded-2xl border border-theme bg-theme-surface p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-theme">Detailed Description</h2>
          <div className="mt-3 space-y-3">
            {detailParagraphs.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 36)}-${index}`} className="text-sm md:text-base text-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {related.length ? (
          <section>
            <h2 className="text-lg md:text-xl font-bold text-theme">Related Activities</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id || item.slug}
                  to={`/activities/${item.slug || item.id}`}
                  className="rounded-xl border border-theme bg-theme-surface p-4 transition hover:border-[var(--c-brand)]/45"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--c-brand)]">{item.location}</p>
                  <p className="mt-1 text-sm font-semibold text-theme">{item.title}</p>
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
