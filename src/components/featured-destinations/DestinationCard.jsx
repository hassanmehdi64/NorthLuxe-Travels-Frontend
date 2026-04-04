import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

const DestinationCard = ({ destination, index = 0, compact = false }) => {
  const href = destination?.href || "/destinations";
  const cardDelay = Math.min(index * 0.08, 0.36);

  return (
    <MotionLink
      to={href}
      initial={{ opacity: 0, y: 30, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: cardDelay, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative block w-full overflow-hidden rounded-2xl border border-theme bg-theme-surface shadow-[0_10px_20px_rgba(15,23,42,0.08)] hover:shadow-[0_18px_34px_rgba(15,23,42,0.14)] transition-all duration-500 ${
        compact ? "h-[170px] sm:h-[190px] lg:h-[210px]" : "h-[250px] sm:h-[280px] lg:h-[300px]"
      }`}
    >
      <motion.img
        src={destination?.image}
        alt={destination?.title}
        className="absolute inset-0 h-full w-full object-cover"
        whileHover={{ scale: 1.07 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      <div className={`absolute inset-0 flex flex-col justify-end ${compact ? "p-3.5 sm:p-4" : "p-5"}`}>
        <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className={`${compact ? "text-base sm:text-lg" : "text-xl"} font-bold text-white tracking-tight`}>
            {destination?.title}
          </h3>

          <div className="max-h-0 opacity-0 group-hover:max-h-14 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
            <p className={`mt-1 text-white/85 leading-relaxed line-clamp-2 ${compact ? "text-[11px]" : "text-[12px]"}`}>
              {destination?.description}
            </p>
          </div>

          <div className="mt-3 h-0.5 w-8 bg-[var(--c-brand)] group-hover:w-full transition-all duration-500" />
        </div>
      </div>
    </MotionLink>
  );
};

export default DestinationCard;
