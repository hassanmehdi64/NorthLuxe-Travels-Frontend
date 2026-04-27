const BlogPagination = ({ currentPage, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-16 gap-2 flex-wrap">
      {/* Previous */}
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 h-10 text-sm font-semibold
          ${
            currentPage === 1
              ? "ql-btn-secondary text-muted/50"
              : "ql-btn-secondary"
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
            className={`h-10 w-10 rounded-lg px-0 text-sm font-semibold
              ${
                currentPage === page
                  ? "ql-btn-primary"
                  : "ql-btn-secondary"
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
        className={`px-4 h-10 text-sm font-semibold
          ${
            currentPage === totalPages
              ? "ql-btn-secondary text-muted/50"
              : "ql-btn-secondary"
          }`}
      >
        Next
      </button>
    </div>
  );
};

export default BlogPagination;
