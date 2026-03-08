const BlogPagination = ({ currentPage, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-16 gap-2 flex-wrap">
      {/* Previous */}
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 h-10 rounded-lg text-sm font-semibold transition
          ${
            currentPage === 1
              ? "bg-theme-surface text-muted/50 border border-theme cursor-not-allowed"
              : "bg-theme-surface text-theme border border-theme hover:bg-theme-bg"
          }`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`w-10 h-10 rounded-lg text-sm font-semibold transition
              ${
                currentPage === page
                  ? "bg-[var(--c-brand)] text-theme"
                  : "bg-theme-surface text-theme border border-theme hover:bg-theme-bg"
              }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 h-10 rounded-lg text-sm font-semibold transition
          ${
            currentPage === totalPages
              ? "bg-theme-surface text-muted/50 border border-theme cursor-not-allowed"
              : "bg-theme-surface text-theme border border-theme hover:bg-theme-bg"
          }`}
      >
        Next
      </button>
    </div>
  );
};

export default BlogPagination;
