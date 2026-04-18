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

const DetailPill = ({ icon: Icon, label, value }) => (
  <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-theme bg-white px-4 py-3 shadow-[0_10px_22px_rgba(15,23,42,0.05)]">
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--c-brand)]/10 text-[var(--c-brand)]">
      <Icon size={16} />
    </span>
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-0.5 truncate text-sm font-bold text-theme">{value || "Flexible"}</p>
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

  return (
    <section className="bg-theme-bg py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--c-brand)]">Activity Details</p>
            <h1 className="max-w-4xl text-[1.9rem] font-bold leading-[1.05] tracking-tight text-theme md:text-[2.6rem]">
              {activity.title}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-muted md:text-base">
              {activity.shortDescription || activity.description}
            </p>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1">
            <DetailPill icon={MapPin} label="Location" value={activity.location} />
            <DetailPill icon={Clock3} label="Duration" value={activity.duration} />
            <DetailPill icon={Mountain} label="Level" value={activity.level} />
          </div>
        </header>

        <div className="mx-auto overflow-hidden rounded-2xl border border-theme bg-theme-surface px-3 py-3 shadow-[0_14px_28px_rgba(15,23,42,0.06)] sm:px-4 sm:py-4">
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
