const STEP_ITEMS = [
  { id: 1, label: "Guest Details", short: "Guests" },
  { id: 2, label: "Dates & Stay", short: "Travel" },
  { id: 3, label: "Payment", short: "Payment" },
];

const BookingStepTabs = ({
  activeSection,
  isTravelerSectionValid,
  isTravelSectionValid,
  onStepChange,
}) => (
  <div className="rounded-2xl border border-theme bg-theme-surface p-2 shadow-[0_8px_18px_rgba(15,23,42,0.05)]">
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {STEP_ITEMS.map((item) => {
        const canOpen =
          item.id === 1 ||
          (item.id === 2 && isTravelerSectionValid) ||
          (item.id === 3 && isTravelerSectionValid && isTravelSectionValid);
        return (
          <button
            key={item.id}
            type="button"
            disabled={!canOpen}
            onClick={() => canOpen && onStepChange(item.id)}
            className={`rounded-xl border px-3 py-2.5 text-left transition ${
              activeSection === item.id
                ? "border-[rgba(15,23,42,0.16)] bg-white text-theme shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
                : canOpen
                  ? "cursor-pointer border-theme bg-theme-bg text-heading hover:border-[rgba(15,23,42,0.16)] hover:bg-white"
                  : "cursor-not-allowed border-[#e5eaef] bg-[#f7f8fa] text-muted opacity-70"
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.12em]">Step {item.id}</p>
            <p className="mt-1 text-[13px] font-semibold leading-5 sm:hidden">{item.short}</p>
            <p className="mt-1 hidden text-[13px] font-semibold leading-5 sm:block">{item.label}</p>
          </button>
        );
      })}
    </div>
  </div>
);

export default BookingStepTabs;
