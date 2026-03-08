const STEP_ITEMS = [
  { id: 1, label: "Guest Details" },
  { id: 2, label: "Dates & Stay" },
  { id: 3, label: "Trip Options" },
];

const BookingStepTabs = ({
  activeSection,
  isTravelerSectionValid,
  isTravelSectionValid,
  onStepChange,
  onBlockedStep,
}) => (
  <div className="rounded-2xl border border-theme bg-theme-surface p-2.5 shadow-[0_10px_20px_rgba(15,23,42,0.06)]">
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
            onClick={() => (canOpen ? onStepChange(item.id) : onBlockedStep())}
            className={`rounded-md border px-2 py-1 text-[6px] font-semibold uppercase tracking-[0.03em] leading-none transition ${
              activeSection === item.id
                ? "border-[var(--c-brand)]/65 bg-[var(--c-brand)]/15 text-theme shadow-[0_8px_18px_rgba(123,231,196,0.28)]"
                : canOpen
                  ? "border-theme bg-theme-bg text-heading hover:border-[var(--c-brand)]/35 hover:bg-white"
                  : "cursor-not-allowed border-theme bg-theme-bg text-muted opacity-60"
            }`}
          >
            {item.id}. {item.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default BookingStepTabs;
