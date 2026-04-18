import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionLink = motion(Link);
const cardReveal = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const DestinationCard = ({ destination, index = 0, compact = false, small = false, seasonal = false }) => {
  const href = destination?.href || "/destinations";
  const cardDelay = Math.min(index * 0.08, 0.36);
  const heightClass = seasonal
    ? "h-[170px] sm:h-[185px] lg:h-[200px]"
    : small
    ? "h-[185px] sm:h-[200px] lg:h-[220px]"
    : compact
      ? "h-[170px] sm:h-[190px] lg:h-[210px]"
      : "h-[250px] sm:h-[280px] lg:h-[300px]";

  return (
    <MotionLink
      to={href}
      variants={cardReveal}
      custom={cardDelay}
      initial="hidden"
      whileInView="visible"
      whileHover={{ y: -5, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
      viewport={{ once: true, amount: 0.2 }}
      className={`group relative block w-full overflow-hidden rounded-2xl border border-theme bg-theme-surface shadow-[0_10px_20px_rgba(15,23,42,0.08)] hover:shadow-[0_18px_34px_rgba(15,23,42,0.14)] transition-[box-shadow,transform] duration-500 will-change-transform ${heightClass}`}
    >
      <motion.img
        src={destination?.image}
        alt={destination?.title}
        className="absolute inset-0 h-full w-full object-cover"
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      <div className={`absolute inset-0 flex flex-col justify-end ${seasonal ? "p-3.5 sm:p-4" : small ? "p-4" : compact ? "p-3.5 sm:p-4" : "p-5"}`}>
        <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <h3 className={`${seasonal || small ? "text-base sm:text-lg" : compact ? "text-base sm:text-lg" : "text-xl"} font-bold text-white tracking-tight`}>
            {destination?.title}
          </h3>

          <div className="max-h-0 opacity-0 group-hover:max-h-14 group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden">
            <p className={`mt-1 text-white/85 leading-relaxed line-clamp-2 ${seasonal || small || compact ? "text-[11px]" : "text-[12px]"}`}>
              {destination?.description}
            </p>
          </div>

          <div className="mt-3 h-0.5 w-8 bg-[var(--c-brand)] group-hover:w-full transition-all duration-500 ease-out" />
        </div>
      </div>
    </MotionLink>
  );
};

export default DestinationCard;

