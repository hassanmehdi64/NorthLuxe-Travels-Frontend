import { Link } from "react-router-dom";

const BlogCard = ({ blog, compact = false }) => {
  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-theme bg-theme-surface shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <img
        src={blog.image}
        alt={blog.title}
        className={`${compact ? "h-32 sm:h-36 md:h-40" : "h-40 sm:h-44 md:h-48"} w-full object-cover transition-transform duration-700 group-hover:scale-105`}
      />

      <div className={`${compact ? "p-4" : "p-4 sm:p-5"} flex flex-1 flex-col`}>
        <span className="text-[var(--c-brand)] text-[11px] font-black uppercase tracking-[0.2em]">
          {blog.category}
        </span>

        <h3 className={`${compact ? "text-base" : "text-lg"} mt-3 font-bold tracking-tight text-theme transition-colors line-clamp-2 group-hover:text-[var(--c-brand)]`}>
          {blog.title}
        </h3>

        <p className={`mt-2 text-sm leading-relaxed text-muted ${compact ? "line-clamp-2" : "line-clamp-2"}`}>{blog.excerpt}</p>

        <div className={`${compact ? "mt-4 pt-3" : "mt-auto pt-4"} border-t border-theme text-xs font-semibold uppercase tracking-[0.14em] text-muted`}>
          {new Date(blog.date).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
