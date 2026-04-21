const SearchButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-secondary text-white font-semibold px-4 py-2 rounded transition hover:bg-[var(--c-brand-dark)]"
    >
      Search
    </button>
  );
};

export default SearchButton;
