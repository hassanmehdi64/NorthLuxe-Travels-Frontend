const DateSelection = ({ date, setDate }) => {
  return (
    <div className="w-full">
      <div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          // Setting min to today so users can't book past dates
          min={new Date().toISOString().split("T")[0]}
          className="w-full cursor-pointer rounded-lg border border-border-light bg-bg-main px-4 py-3 text-text-main transition-all focus:outline-none focus:ring-2 focus:ring-secondary"
        />
      </div>

    </div>
  );
};

export default DateSelection;
