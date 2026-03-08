import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import BlogDetailsContent from "../components/blog/BlogDetailsContent";
import RelatedBlogs from "../components/blog/RelatedBlogs";
import BlogNav from "../components/blog/BlogNav";
import { usePublicBlog, usePublicBlogs } from "../hooks/useCms";

const BlogDetails = () => {
  const { slug } = useParams();
  const { data: blog, isLoading } = usePublicBlog(slug);
  const { data: blogs = [] } = usePublicBlogs();
  const index = blogs.findIndex((b) => b.slug === slug);

  // Scroll to top when blog changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Not Found State
  if (isLoading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-slate-500">Loading article...</div>;
  }

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-extrabold mb-4">Blog not found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          The article you are looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/blog"
          className="bg-secondary text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  const prev = blogs[index - 1] ?? null;
  const next = blogs[index + 1] ?? null;

  return (
    <main className="bg-white">
      {/* Blog Content */}
      <BlogDetailsContent blog={blog} />

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-gray-100 my-16"></div>
      </div>

      {/* Navigation & Related */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <BlogNav prev={prev} next={next} />
        <RelatedBlogs currentBlog={blog} blogs={blogs} />
      </section>
    </main>
  );
};

export default BlogDetails;
