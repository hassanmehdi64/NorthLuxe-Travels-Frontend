import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const MotionSection = motion.section;
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
      className="rounded-2xl border border-[rgba(15,23,42,0.06)] bg-theme-surface p-4 shadow-[0_10px_30px_rgba(15,23,42,0.03)] md:p-4 lg:p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--c-brand)]">
            Guest Feedback
          </p>
          <h2 className="mt-1 text-[1.28rem] leading-none font-semibold tracking-[-0.02em] text-theme md:text-[1.6rem]">
            Tour Reviews
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Verified guest impressions based on comfort, planning,
            responsiveness, and overall travel experience.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        <MotionDiv variants={cardReveal} className="min-w-0 self-center">
          <div className="reviews-swiper flex min-h-[240px] items-center">
            <Swiper
              modules={[Autoplay, Pagination]}
              loop={reviews.length > 3}
              speed={850}
              autoplay={{
                delay: 3200,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
              spaceBetween={14}
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="w-full">
              {reviews.map((item) => (
                <SwiperSlide key={item.id} className="!h-auto pb-10">
                  <MotionArticle
                    variants={cardReveal}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="flex h-full min-h-[150px] flex-col rounded-[1.4rem] border border-[rgba(15,23,42,0.06)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,250,249,0.94))] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.02)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(15,23,42,0.06)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[15px] font-semibold text-theme md:text-base">
                          {item.name}
                        </p>
                        <p className="mt-1 text-[12px] text-muted">
                          {item.tag} | {item.date}
                        </p>
                      </div>

                      <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--c-brand)]/12 px-2.5 py-1 text-[12px] font-black text-[var(--c-brand)]">
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
      viewport={{ once: true, amount: 0.18 }}>
      <h2 className="text-[1.28rem] leading-none md:text-[1.55rem] font-semibold tracking-[-0.02em] text-theme">
        You Might Also Like
      </h2>

      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tours.map((item) => (
          <MotionLink
            key={item.id}
            to={`/tours/${item.slug || item.id}`}
            variants={cardReveal}
            whileHover={{ y: -6, scale: 1.01 }}
            className="rounded-xl border-[0.5px] border-[rgba(15,23,42,0.06)] bg-theme-surface p-4 shadow-[0_6px_18px_rgba(15,23,42,0.015)] transition hover:border-[var(--btn-ghost-hover-border)] hover:bg-[var(--btn-ghost-hover-bg)]">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--c-brand)]">
              {item.location}
            </p>
            <p className="mt-1 text-[15px] md:text-base font-semibold text-theme line-clamp-2">
              {item.title}
            </p>
          </MotionLink>
        ))}
      </div>
    </MotionSection>
  );
};