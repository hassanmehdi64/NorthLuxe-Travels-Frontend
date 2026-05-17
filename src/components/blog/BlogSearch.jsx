import { Search } from "lucide-react";

const BlogSearch = ({ value, onChange }) => {
  return (
    <div className="mb-6">
      <div>
        <input
          type="text"
          placeholder="Search articles..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-theme 
            focus:outline-none focus:ring-2 focus:ring-[var(--c-brand)]/35 focus:border-[var(--c-brand)]"
        />
      </div>
    </div>
  );
};

export default BlogSearch;
