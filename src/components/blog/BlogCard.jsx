import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group block h-full rounded-2xl overflow-hidden bg-theme-surface border border-theme shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      <img
        src={blog.image}
        alt={blog.title}
        className="h-44 sm:h-52 md:h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="p-4 sm:p-5 md:p-6">
        <span className="text-[var(--c-brand)] text-[11px] font-black uppercase tracking-[0.2em]">
          {blog.category}
        </span>

        <h3 className="text-lg sm:text-xl font-bold mt-3 text-theme tracking-tight group-hover:text-[var(--c-brand)] transition-colors line-clamp-2">
          {blog.title}
        </h3>

        <p className="text-muted text-sm mt-3 leading-relaxed line-clamp-3">{blog.excerpt}</p>

        <div className="mt-5 pt-4 border-t border-theme text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {new Date(blog.date).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
