import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowLeftCircle, ArrowRightCircle, CalendarDays, Clock3, Tag } from "lucide-react";
import RelatedBlogs from "../components/blog/RelatedBlogs";
import { usePublicBlog, usePublicBlogs } from "../hooks/useCms";

const estimateReadingTime = (blog) => {
  const source = [blog?.excerpt, blog?.content, blog?.description, blog?.title]
    .filter(Boolean)
    .join(" ")
    .trim();
  const words = source ? source.split(/\s+/).length : 0;
  return Math.max(2, Math.round(words / 180) || 2);
};

const buildParagraphs = (blog) => {
  const rawContent = String(blog?.content || blog?.description || blog?.excerpt || "").trim();

  if (!rawContent) {
    return [
      "Travel in Pakistan's north feels best when route timing, comfort, and local planning work together.",
      "North Luxe Travels focuses on practical journeys that balance scenery, ease, and memorable on-ground experiences.",
      "From iconic valleys to quieter mountain routes, thoughtful planning is what turns a good trip into a smooth one.",
    ];
  }

  const blocks = rawContent
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (blocks.length > 1) return blocks;

  return rawContent
    .split(/(?<=[.!?])\s+/)
    .reduce((acc, sentence) => {
      if (!sentence) return acc;
      const current = acc[acc.length - 1] || "";
      if (!current || current.length > 220) acc.push(sentence.trim());
      else acc[acc.length - 1] = `${current} ${sentence.trim()}`.trim();
      return acc;
    }, []);
};

const BlogDetails = () => {
  const { slug } = useParams();
  const { data: blog, isLoading } = usePublicBlog(slug);
  const { data: blogs = [] } = usePublicBlogs();
  const index = blogs.findIndex((b) => b.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const prev = blogs[index - 1] ?? null;
  const next = blogs[index + 1] ?? null;
  const readingTime = useMemo(() => estimateReadingTime(blog), [blog]);
  const contentParagraphs = useMemo(() => buildParagraphs(blog), [blog]);
  const heroImage = blog?.image || "https://gilgitbaltistan.gov.pk/public/images/river-5688258_1920.jpg";

  if (isLoading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-slate-500">Loading article...</div>;
  }

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 bg-theme-bg">
        <div className="max-w-xl rounded-3xl border border-theme bg-theme-surface px-8 py-14 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
          <h2 className="text-3xl font-bold mb-4 text-theme">Blog not found</h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            The article you are looking for is unavailable or has been moved.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-xl border border-theme bg-white px-5 py-3 text-sm font-semibold text-theme transition hover:border-[var(--c-brand)]/35 hover:text-[var(--c-brand)]"
          >
            <ArrowLeft size={16} />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-theme-bg pb-20">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-12">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-theme bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-theme transition hover:border-[var(--c-brand)]/35 hover:text-[var(--c-brand)]"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            {blog.category ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-theme bg-white px-3 py-1.5 text-theme">
                <Tag size={12} />
                {blog.category}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-theme bg-white px-3 py-1.5">
              <CalendarDays size={12} />
              {blog.date ? new Date(blog.date).toLocaleDateString() : "Latest article"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-theme bg-white px-3 py-1.5">
              <Clock3 size={12} />
              {readingTime} min read
            </span>
          </div>

          <h1 className="max-w-4xl text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] text-theme md:text-[2.7rem]">
            {blog.title}
          </h1>

          <p className="max-w-3xl text-sm leading-7 text-muted md:text-base">
            {blog.excerpt || blog.description || "Curated travel insight, planning notes, and destination stories from North Luxe Travels."}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="overflow-hidden rounded-[1.75rem] border border-theme bg-theme-surface shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
          <img
            src={heroImage}
            alt={blog.title}
            className="h-[260px] w-full object-cover object-center sm:h-[340px] lg:h-[420px]"
          />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
          <article className="min-w-0 rounded-[1.75rem] border border-theme bg-theme-surface p-5 shadow-[0_14px_34px_rgba(15,23,42,0.04)] md:p-7 lg:p-8">
            <div className="space-y-5">
              {contentParagraphs.map((paragraph, index) => (
                <p
                  key={`${paragraph.slice(0, 36)}-${index}`}
                  className="text-[15px] leading-8 text-theme/85 md:text-[16px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <aside className="rounded-[1.5rem] border border-theme bg-theme-surface p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] lg:sticky lg:top-24">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">Quick Note</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              Explore this article for practical travel insight, destination context, and planning ideas from North Luxe Travels.
            </p>
          </aside>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid gap-4 md:grid-cols-2">
          {prev ? (
            <Link
              to={`/blog/${prev.slug}`}
              className="group flex items-center gap-3 rounded-[1.4rem] border border-theme bg-theme-surface px-5 py-4 shadow-[0_12px_24px_rgba(15,23,42,0.03)] transition hover:border-[var(--c-brand)]/35 hover:shadow-[0_16px_30px_rgba(15,23,42,0.06)]"
            >
              <ArrowLeftCircle className="text-[var(--c-brand)]" size={22} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">Previous</p>
                <p className="mt-1 text-sm font-semibold text-theme line-clamp-2 group-hover:text-[var(--c-brand)]">{prev.title}</p>
              </div>
            </Link>
          ) : <div />}

          {next ? (
            <Link
              to={`/blog/${next.slug}`}
              className="group flex items-center justify-between gap-3 rounded-[1.4rem] border border-theme bg-theme-surface px-5 py-4 shadow-[0_12px_24px_rgba(15,23,42,0.03)] transition hover:border-[var(--c-brand)]/35 hover:shadow-[0_16px_30px_rgba(15,23,42,0.06)]"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">Next</p>
                <p className="mt-1 text-sm font-semibold text-theme line-clamp-2 group-hover:text-[var(--c-brand)]">{next.title}</p>
              </div>
              <ArrowRightCircle className="text-[var(--c-brand)]" size={22} />
            </Link>
          ) : <div />}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="rounded-[1.75rem] border border-theme bg-theme-surface p-5 shadow-[0_14px_34px_rgba(15,23,42,0.04)] md:p-6">
          <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-theme md:text-[1.6rem]">Related Articles</h2>
          <RelatedBlogs currentBlog={blog} blogs={blogs} hideHeading className="mt-6" />
        </div>
      </section>
    </main>
  );
};

export default BlogDetails;

