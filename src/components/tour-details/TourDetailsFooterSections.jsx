import { Link } from "react-router-dom";
import { MessageSquareQuote, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const MotionSection = motion.section;
const MotionAside = motion.aside;
const MotionDiv = motion.div;
const MotionArticle = motion.article;
const MotionLink = motion(Link);

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 26, scale: 0.975 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const ReviewsSection = ({ ratingValue, reviewCount, reviews }) => {
  if (!reviews.length) return null;

  return (
  <MotionSection
    variants={sectionReveal}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.18 }}
    className="rounded-2xl border border-[rgba(15,23,42,0.06)] bg-theme-surface p-4 shadow-[0_10px_30px_rgba(15,23,42,0.03)] md:p-4 lg:p-5"
  >
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--c-brand)]">Guest Feedback</p>
        <h2 className="mt-1 text-[1.28rem] leading-none font-semibold tracking-[-0.02em] text-theme md:text-[1.6rem]">
          Tour Reviews
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Verified guest impressions based on comfort, planning, responsiveness, and overall travel experience.
        </p>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-theme bg-theme-bg px-3 py-1.5 text-[11px] font-semibold text-theme">
        <MessageSquareQuote size={14} className="text-[var(--c-brand)]" />
        {reviewCount} verified reviews
      </div>
    </div>

    <div className="mt-4 grid gap-4 xl:grid-cols-[250px_minmax(0,1fr)] xl:items-center">
      <MotionAside
        variants={cardReveal}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="mx-auto w-full max-w-[260px] rounded-[1.5rem] border border-[rgba(15,23,42,0.06)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,248,246,0.96))] p-4 shadow-[0_14px_28px_rgba(15,23,42,0.04)] xl:mx-0"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted">Average Rating</p>
            <p className="mt-1 text-[13px] text-muted">Guest satisfaction snapshot</p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-[var(--c-brand)]/10 px-2.5 py-1 text-[11px] font-bold text-[var(--c-brand)]">
            <Star size={12} className="fill-current" />
            Excellent
          </div>
        </div>

        <div className="mt-4 rounded-[1.25rem] border border-[rgba(15,23,42,0.05)] bg-[rgba(255,255,255,0.82)] px-3.5 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <div className="flex items-end gap-2">
            <p className="text-[2.7rem] font-extrabold leading-none text-theme">{ratingValue.toFixed(1)}</p>
            <p className="pb-1 text-sm font-semibold text-muted">/ 5</p>
          </div>

          <div className="mt-3 flex items-center gap-1 text-[var(--c-brand)]">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                size={15}
                className={idx < Math.round(ratingValue) ? "fill-current" : "opacity-20"}
              />
            ))}
          </div>

          <p className="mt-3 text-[13px] text-muted">
            Based on {reviewCount} verified guest reviews
          </p>
        </div>

      </MotionAside>

      <MotionDiv variants={cardReveal} className="min-w-0 self-center">
        <div className="reviews-swiper flex min-h-[240px] items-center">
          <Swiper
            modules={[Autoplay, Pagination]}
            loop={reviews.length > 2}
            speed={850}
            autoplay={{
              delay: 3200,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            spaceBetween={14}
            breakpoints={{
              0: { slidesPerView: 1.05 },
              768: { slidesPerView: 1.4 },
              1280: { slidesPerView: 2.2 },
            }}
            className="w-full"
          >
            {reviews.map((item) => (
              <SwiperSlide key={item.id} className="h-auto pb-10">
                <MotionArticle
                  variants={cardReveal}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="h-full rounded-[1.4rem] border border-[rgba(15,23,42,0.06)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,250,249,0.94))] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.02)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold text-theme md:text-base">{item.name}</p>
                      <p className="mt-1 text-[12px] text-muted">{item.tag} | {item.date}</p>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-[var(--c-brand)]/12 px-2.5 py-1 text-[12px] font-black text-[var(--c-brand)]">
                      <Star size={12} className="fill-current" />
                      {item.rating}.0
                    </div>
                  </div>

                  <p className="mt-4 text-[15px] leading-7 text-muted md:text-[16px]">
                    {item.comment}
                  </p>
                </MotionArticle>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </MotionDiv>
    </div>
  </MotionSection>
  );
};

export const RelatedToursSection = ({ tours }) => {
  if (!tours.length) return null;

  return (
    <MotionSection
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
    >
      <h2 className="text-[1.28rem] leading-none md:text-[1.55rem] font-semibold tracking-[-0.02em] text-theme">You Might Also Like</h2>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tours.map((item) => (
          <MotionLink
            key={item.id}
            to={`/tours/${item.slug || item.id}`}
            variants={cardReveal}
            whileHover={{ y: -6, scale: 1.01 }}
            className="rounded-xl border-[0.5px] border-[rgba(15,23,42,0.06)] bg-theme-surface p-4 shadow-[0_6px_18px_rgba(15,23,42,0.015)] transition hover:border-[rgba(38,208,170,0.18)] hover:bg-theme-bg"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--c-brand)]">{item.location}</p>
            <p className="mt-1 text-[15px] md:text-base font-semibold text-theme line-clamp-2">{item.title}</p>
          </MotionLink>
        ))}
      </div>
    </MotionSection>
  );
};

