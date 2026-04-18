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
  <div className="rounded-xl border border-booking bg-booking-soft p-1.5">
    <div className="grid grid-cols-3 gap-1.5">
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
            className={`rounded-lg border px-2 py-2 text-center transition sm:px-3 sm:text-left ${
              activeSection === item.id
                ? "border-booking bg-white text-theme shadow-sm"
                : canOpen
                  ? "cursor-pointer border-booking-soft bg-white/70 text-heading hover:border-booking hover:bg-white"
                  : "cursor-not-allowed border-slate-200 bg-slate-50 text-muted opacity-70"
            }`}
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.08em] sm:text-[10px] sm:tracking-[0.12em]">Step {item.id}</p>
            <p className="mt-1 text-[11px] font-semibold leading-4 sm:hidden">{item.short}</p>
            <p className="mt-1 hidden text-[13px] font-semibold leading-5 sm:block">{item.label}</p>
          </button>
        );
      })}
    </div>
  </div>
);

export default BookingStepTabs;
