import { Link, useParams } from "react-router-dom";
import { Check, MoveUpRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { activitiesData, getActivityById } from "../data/activitiesData";
import { usePublicContentItem, usePublicContentList } from "../hooks/useCms";

const ActivityDetails = () => {
  const { slug } = useParams();
  const { data: backendActivity, isLoading } = usePublicContentItem("activity", slug);
  const { data: backendActivities = [] } = usePublicContentList("activity");

  const activity = backendActivity || getActivityById(slug);

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

  const allActivities = backendActivities.length ? backendActivities : activitiesData;
  const related = allActivities
    .filter((item) => (item.id || item.slug) !== (activity.id || activity.slug))
    .slice(0, 3);
  const gallery = activity.gallery?.length ? activity.gallery : [activity.image || activity.coverImage].filter(Boolean);
  const includes = activity.includes?.length ? activity.includes : [];

  return (
    <section className="py-10 md:py-12 bg-theme-bg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-7">
        <header className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--c-brand)]">Activity Details</p>
          <h1 className="text-2xl md:text-4xl font-bold text-theme tracking-tight">{activity.title}</h1>
          <p className="text-sm md:text-base text-muted">{activity.location} | {activity.duration} | {activity.level}</p>
        </header>

        <div className="rounded-2xl overflow-hidden border border-theme bg-theme-surface">
          <img src={activity.image || activity.coverImage} alt={activity.title} className="w-full h-[220px] sm:h-[300px] lg:h-[360px] object-cover" />
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6">
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

          <aside className="rounded-2xl border border-theme bg-theme-surface p-4 h-fit">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">Need a Custom Plan?</p>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Share your travel window, budget, and group details. We will suggest the best activity combination.
            </p>
            <Link
              to="/custom-plan-request"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ql-btn-primary"
            >
              Request Custom Plan
              <MoveUpRight size={14} />
            </Link>
          </aside>
        </div>

        <section>
          <h2 className="text-lg md:text-xl font-bold text-theme mb-3">Activity Highlights</h2>
          <div className="rounded-2xl border border-theme bg-theme-surface p-3 sm:p-4">
            <Swiper
              modules={[Pagination, Autoplay]}
              slidesPerView={1}
              spaceBetween={12}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 12 },
                1024: { slidesPerView: 3, spaceBetween: 14 },
              }}
              className="!pb-8"
            >
              {gallery.map((img, idx) => (
                <SwiperSlide key={`${img}-${idx}`}>
                  <img
                    src={img}
                    alt={`${activity.title} ${idx + 1}`}
                    className="w-full h-[170px] sm:h-[180px] object-cover rounded-xl border border-theme"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {related.length ? (
          <section>
            <h2 className="text-lg md:text-xl font-bold text-theme">Related Activities</h2>
            <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {related.map((item) => (
                <Link
                  key={item.id || item.slug}
                  to={`/activities/${item.slug || item.id}`}
                  className="rounded-xl border border-theme bg-theme-surface p-4 hover:border-[var(--c-brand)]/45 transition"
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
