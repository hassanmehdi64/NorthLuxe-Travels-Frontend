
const GuestsSelector = ({ guests, setGuests }) => {
  // Common tour group combinations for Gilgit-Baltistan trips
  const options = [
    { adults: 1, children: 0 },
    { adults: 2, children: 0 },
    { adults: 2, children: 1 },
    { adults: 2, children: 2 },
    { adults: 4, children: 0 },
    { adults: 4, children: 2 },
  ];

  const handleSelectChange = (e) => {
    const [adults, children] = e.target.value.split("-").map(Number);
    setGuests({ adults, children });
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <select
          value={`${guests.adults}-${guests.children}`}
          onChange={handleSelectChange}
          className="w-full appearance-none rounded-lg border border-border-light bg-bg-main px-4 py-3 pr-10 text-text-main transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          {options.map((opt, index) => (
            <option key={index} value={`${opt.adults}-${opt.children}`}>
              {opt.adults} Adults{" "}
              {opt.children > 0 ? `• ${opt.children} Children` : ""}
            </option>
          ))}
          <option value="custom">Custom Group Size...</option>
        </select>

        {/* Custom Arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GuestsSelector;
