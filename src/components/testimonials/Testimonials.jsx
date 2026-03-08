import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import TestimonialCard from "./TestimonialCard";
import { usePublicTestimonials } from "../../hooks/useCms";
import { Sparkles, Star } from "lucide-react";

const fallbackStories = [
  {
    id: "fallback-1",
    name: "Areeba Malik",
    role: "Family Traveler",
    avatar: "https://i.pravatar.cc/160?img=32",
    message:
      "Everything felt well-managed from pickup to hotel stays. The route pacing was calm, the views were unforgettable, and our family stayed comfortable throughout the trip.",
    rating: 5,
    date: "March 2026",
    locationLabel: "Hunza Valley",
  },
  {
    id: "fallback-2",
    name: "Hassan Raza",
    role: "Adventure Guest",
    avatar: "https://i.pravatar.cc/160?img=12",
    message:
      "Our Skardu journey had the right mix of sightseeing and downtime. Transport was reliable, timings were practical, and the support team stayed responsive the whole way.",
    rating: 5,
    date: "February 2026",
    locationLabel: "Skardu",
  },
  {
    id: "fallback-3",
    name: "Maham Iqbal",
    role: "Couple Tour",
    avatar: "https://i.pravatar.cc/160?img=47",
    message:
      "The itinerary felt polished and premium without being rushed. We especially liked the hotel selection, scenic stops, and how smooth the full experience was from start to finish.",
    rating: 4,
    date: "January 2026",
    locationLabel: "Nagar Valley",
  },
];

const Testimonials = () => {
  const { data: testimonials = [] } = usePublicTestimonials();
  const stories = testimonials.length >= 4
    ? testimonials
    : [...testimonials, ...fallbackStories.slice(0, Math.max(0, 4 - testimonials.length))];

  const avgRating = stories.length
    ? (
        stories.reduce((sum, item) => sum + Number(item?.rating || 5), 0) /
        stories.length
      ).toFixed(1)
    : "5.0";

  return (
    <section className="relative py-12 lg:py-14 bg-theme-bg overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-[var(--c-brand)]/12 blur-3xl" />
        <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-[var(--c-brand)]/8 blur-3xl" />
      </div>

      <div className="relative w-full px-8 sm:px-10 lg:px-14 xl:px-16">
        <div className="mb-10 lg:mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-[var(--c-brand)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--c-brand)]">
                  Guest Reviews
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-theme tracking-tight">
                Moments That <span className="text-[var(--c-brand)]">Inspire</span>
              </h2>

              <p className="text-muted text-sm md:text-base max-w-xl leading-relaxed">
                Verified feedback from travelers who explored our premium routes across the North.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-surface px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-theme">
                <Sparkles size={11} className="text-[var(--c-brand)]" />
                {stories.length} Stories
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-surface px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-theme">
                <Star size={11} className="text-[var(--c-brand)] fill-[var(--c-brand)]" />
                {avgRating} Avg
              </span>
            </div>
          </div>
        </div>

        {stories.length ? (
          <div className="w-full rounded-2xl border border-theme bg-theme-surface p-4 md:p-5 lg:p-6 pb-9 testimonial-swiper-container">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              loop={stories.length > 3}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              pagination={{ clickable: true, dynamicBullets: true }}
              grabCursor
              breakpoints={{
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="!pb-10"
            >
              {stories.map((testimonial) => (
                <SwiperSlide key={testimonial.id} className="h-auto flex justify-center">
                  <TestimonialCard
                    name={testimonial.name}
                    role={testimonial.role}
                    avatar={testimonial.avatar}
                    message={testimonial.message}
                    rating={testimonial.rating}
                    date={testimonial.date}
                    location={testimonial.locationLabel}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-theme py-16 text-center text-muted bg-theme-surface">
            <p className="text-sm font-medium tracking-wide">Guest stories arriving soon...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .testimonial-swiper-container .swiper-pagination-bullet {
          background: var(--c-brand);
          opacity: 0.35;
        }
        .testimonial-swiper-container .swiper-pagination-bullet-active {
          background: var(--c-brand);
          opacity: 1;
          width: 16px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
