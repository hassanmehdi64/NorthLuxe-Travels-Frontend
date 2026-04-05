import BlogCard from "./BlogCard";

const RelatedBlogs = ({ currentBlog, blogs, hideHeading = false, className = "mt-20" }) => {
  const related = blogs
    .filter((b) => b.category === currentBlog.category && b.id !== currentBlog.id)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className={className}>
      {!hideHeading ? (
        <h3 className="text-2xl font-extrabold mb-8">
          Related <span className="text-secondary">Articles</span>
        </h3>
      ) : null}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {related.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
};

export default RelatedBlogs;
