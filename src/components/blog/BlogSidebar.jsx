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
    <aside className="lg:col-span-1">
      <div className="sticky top-24 rounded-2xl border border-theme bg-theme-surface p-6 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted mb-6">
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
