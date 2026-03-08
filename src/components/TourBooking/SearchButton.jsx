const SearchButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-secondary hover-bg-secondary-light text-white font-semibold px-4 py-2 rounded transition"
    >
      Search
    </button>
  );
};

export default SearchButton;
