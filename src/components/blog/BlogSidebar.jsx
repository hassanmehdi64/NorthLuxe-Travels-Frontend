import BlogSearch from "./BlogSearch";
import BlogCategories from "./BlogCategories";

const BlogSidebar = ({
  search,
  onSearch,
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <aside>
      <div className="sticky top-24 rounded-2xl border border-theme bg-theme-surface p-5 shadow-sm">
        <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-muted">
          Filter Articles
        </p>
        <BlogSearch value={search} onChange={onSearch} />
        <BlogCategories
          categories={categories}
          active={activeCategory}
          onChange={onCategoryChange}
        />
      </div>
    </aside>
  );
};

export default BlogSidebar;
