import { Link } from "react-router-dom";

const DestinationCard = ({ destination, index = 0, compact = false }) => {
  const href = destination?.href || "/destinations";

  return (
    <Link
      to={href}
      className={`group relative block w-full overflow-hidden rounded-2xl border border-theme bg-theme-surface shadow-[0_10px_20px_rgba(15,23,42,0.08)] hover:shadow-[0_18px_34px_rgba(15,23,42,0.14)] transition-all duration-500 ${
        compact ? "h-[170px] sm:h-[190px] lg:h-[210px]" : "h-[250px] sm:h-[280px] lg:h-[300px]"
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <img
        src={destination?.image}
        alt={destination?.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
    </Link>
  );
};

export default DestinationCard;
