const SearchButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="ql-btn-primary px-4 py-2"
    >
      Search
    </button>
  );
};

export default SearchButton;
