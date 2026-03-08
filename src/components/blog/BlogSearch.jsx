import { Search } from "lucide-react";

const BlogSearch = ({ value, onChange }) => {
  return (
    <div className="mb-8">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          placeholder="Search articles..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-theme bg-theme-surface text-theme placeholder:text-muted/70
            focus:outline-none focus:ring-2 focus:ring-[var(--c-brand)]/35 focus:border-[var(--c-brand)]"
        />
      </div>
    </div>
  );
};

export default BlogSearch;
