import { useState, useMemo } from "react";
import BlogHero from "../components/blog/BlogHero";
import BlogGrid from "../components/blog/BlogGrid";
import BlogSidebar from "../components/blog/BlogSidebar";
import BlogPagination from "../components/blog/BlogPagination";
import { usePublicBlogs } from "../hooks/useCms";

const POSTS_PER_PAGE = 6;

const BlogPage = () => {
  const { data: blogsData = [] } = usePublicBlogs();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const categories = ["All", ...new Set(blogsData.map((blog) => blog.category).filter(Boolean))];

  /* Filter Blogs (Search + Category) */
  const filteredBlogs = useMemo(() => {
    return blogsData.filter((blog) => {
      const matchSearch = blog.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory = category === "All" || blog.category === category;

      return matchSearch && matchCategory;
    });
  }, [blogsData, search, category]);

  /*  Pagination Logic */
  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);

  const paginatedBlogs = useMemo(() => {
    const start = (page - 1) * POSTS_PER_PAGE;
    return filteredBlogs.slice(start, start + POSTS_PER_PAGE);
  }, [filteredBlogs, page]);

  /*  Reset Page when Filter Changes */
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <main className="bg-theme-bg">
      <BlogHero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16 grid lg:grid-cols-4 gap-6 lg:gap-10">
        {/* Blog List */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8 pb-5 border-b border-theme">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-muted">
              Articles
            </p>
            <p className="text-sm text-muted">
              {filteredBlogs.length} published
            </p>
          </div>
          <BlogGrid blogs={paginatedBlogs} />

          <BlogPagination
            currentPage={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>

        {/* Sidebar */}
        <BlogSidebar
          search={search}
          onSearch={handleSearch}
          categories={categories}
          activeCategory={category}
          onCategoryChange={handleCategoryChange}
        />
      </section>
    </main>
  );
};

export default BlogPage;
