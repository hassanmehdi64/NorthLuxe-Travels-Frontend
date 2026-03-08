
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
        {/* Icon Overlay */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted z-10">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </span>

        <select
          value={`${guests.adults}-${guests.children}`}
          onChange={handleSelectChange}
          className="w-full appearance-none bg-bg-main border border-border-light text-text-main rounded-lg pl-10 pr-10 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
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
