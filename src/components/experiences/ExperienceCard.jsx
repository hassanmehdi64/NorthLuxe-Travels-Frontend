import { Link } from "react-router-dom";
import { MoveUpRight, Calendar } from "lucide-react";

const formatDate = (value) => {
  if (!value) return "Recent Story";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent Story";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const ExperienceCard = ({ blog }) => {
  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-theme bg-theme-surface shadow-[0_14px_30px_rgba(15,23,42,0.12)] transition-all duration-500 hover:-translate-y-1 hover:border-[var(--c-brand)] hover:shadow-[0_28px_52px_rgba(15,23,42,0.22)]"
    >
      <div className="relative h-[180px] sm:h-[200px] lg:h-[210px] overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 rounded-lg border border-white/20 bg-white/90 px-2.5 py-1 backdrop-blur-md shadow-sm">
          <span className="text-[9px] font-black uppercase tracking-wider text-[var(--c-brand)]">
            {blog.category || "Journal"}
          </span>
        </div>
      </div>

      <div className="flex flex-grow flex-col p-3.5 sm:p-4 lg:p-5">
        <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
          <Calendar size={10} />
          <span>{formatDate(blog.date)}</span>
        </div>

        <h3 className="mb-3 line-clamp-2 text-[13px] sm:text-sm lg:text-[15px] font-bold leading-snug text-theme transition-colors group-hover:text-[var(--c-brand)]">
          {blog.title}
        </h3>

        <p className="mb-4 line-clamp-3 text-[10px] sm:text-[11px] leading-relaxed text-muted opacity-80">
          {blog.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-theme pt-4">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-theme">
            Read Story
          </span>
          <MoveUpRight size={16} className="text-[var(--c-brand)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
};

export default ExperienceCard;
