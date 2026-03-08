import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BlogDetailsContent = ({ blog }) => {
  return (
    <article className="max-w-4xl mx-auto px-6 py-16">
      {/* Back Button */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-secondary transition mb-8"
      >
        <ArrowLeft size={16} />
        Back to Blogs
      </Link>

      {/* Featured Image */}
      <div className="relative mb-10">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-[420px] object-cover rounded-2xl"
        />

        {/* Category Badge */}
        <span className="absolute bottom-4 left-4 bg-secondary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
          {blog.category}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
        {blog.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-10">
        <span>{new Date(blog.date).toLocaleDateString()}</span>
        <span className="w-1 h-1 rounded-full bg-gray-400"></span>
        <span>North Luxe Travels</span>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none prose-headings:font-extrabold prose-a:text-secondary">
        <p className="text-lg leading-relaxed">{blog.excerpt}</p>

        <p>
          Gilgit-Baltistan is a land of dramatic landscapes, ancient cultures,
          and unforgettable journeys. From snow-capped peaks to serene valleys,
          every destination tells a story of beauty and resilience.
        </p>

        <p>
          At <strong>North Luxe Travels</strong>, we believe travel should be
          immersive, comfortable, and meaningful. Our curated experiences are
          designed to let you explore the North with confidence and ease.
        </p>

        <p>
          Whether you're seeking adventure, cultural depth, or peaceful escapes,
          understanding the region ensures your journey becomes truly memorable.
        </p>
      </div>
    </article>
  );
};

export default BlogDetailsContent;
