import { Link } from "react-router-dom";
import { MoveUpRight } from "lucide-react";
import { useMemo } from "react";
import { usePublicBlogs } from "../../hooks/useCms";
import ExperienceCard from "./ExperienceCard";

const Experiences = () => {
  const { data: blogs = [] } = usePublicBlogs();
  const featuredPosts = useMemo(() => blogs.slice(0, 4), [blogs]);

  return (
    <section className="py-12 lg:py-14 bg-theme-bg">
      <div className="max-w-[1600px] mx-auto px-8 sm:px-10 lg:px-14 xl:px-16">
        <div className="mb-10 lg:mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-[var(--c-brand)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--c-brand)]">
                  Unique Experiences
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-theme tracking-tight">
                Unique <span className="text-[var(--c-brand)]">Experiences</span>
              </h2>

              <p className="text-muted text-sm md:text-base max-w-xl leading-relaxed">
                Editorial stories from our journeys, crafted to inspire your next great adventure.
              </p>
            </div>

            <Link
              to="/blog"
              className="inline-flex items-center justify-center gap-2 self-start md:self-auto rounded-xl border border-theme bg-theme-surface px-5 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-theme hover:text-[var(--c-brand)] hover:border-[var(--c-brand)]/45 hover:bg-white transition-all duration-300 active:scale-[0.98]"
            >
              View All Stories
              <MoveUpRight size={15} />
            </Link>
          </div>
        </div>

        {featuredPosts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {featuredPosts.map((blog) => (
              <ExperienceCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-theme bg-theme-surface py-14 text-center text-muted">
            Unique experiences will appear here after publishing stories.
          </div>
        )}
      </div>
    </section>
  );
};

export default Experiences;
