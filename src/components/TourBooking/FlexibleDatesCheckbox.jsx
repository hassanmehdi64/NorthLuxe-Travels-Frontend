const DateSelection = ({ date, setDate }) => {
  return (
    <div className="w-full">
      <div className="relative">
        {/* Calendar Icon */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted z-10 pointer-events-none">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </span>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          // Setting min to today so users can't book past dates
          min={new Date().toISOString().split("T")[0]}
          className="w-full bg-bg-main border border-border-light text-text-main rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary transition-all cursor-pointer"
        />
      </div>

    
    </div>
  );
};

export default DateSelection;
