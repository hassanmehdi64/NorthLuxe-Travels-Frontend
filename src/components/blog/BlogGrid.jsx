import BlogCard from "./BlogCard";

const BlogGrid = ({ blogs }) => {
  if (!blogs.length) {
    return (
      <div className="rounded-2xl border border-dashed border-theme bg-theme-surface px-6 py-14 text-center text-muted">
        No articles match your current filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogGrid;
