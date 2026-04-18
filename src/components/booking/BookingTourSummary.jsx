const BookingTourSummary = ({ selectedTour }) => {
  if (!selectedTour) return null;

  return (
    <div className="rounded-xl border border-booking bg-booking-soft p-3.5">
      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#4c6472]">
        Booking Summary
      </p>
      <div className="mt-3 grid items-start gap-3 sm:grid-cols-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center md:gap-4">
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#6a7f8e]">
            Selected Tour
          </p>
          <p className="mt-1 line-clamp-1 text-base font-semibold leading-tight text-[#1f3342] md:text-[1.05rem]">
            {selectedTour.title}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#6a7f8e]">
            Route & Duration
          </p>
          <p className="mt-1 line-clamp-1 text-[13px] font-medium text-[#3b5568]">
            {selectedTour.location} |{" "}
            {selectedTour.durationLabel || `${selectedTour.durationDays} Days`}
          </p>
        </div>
        <p className="inline-flex items-center justify-self-start rounded-full border border-[#8fdcc2] bg-[#e7faf2] px-3 py-1 text-sm font-bold text-[#123245] sm:col-span-2 md:col-span-1 md:justify-self-end">
          {selectedTour.currency}{" "}
          {Number(selectedTour.price || 0).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default BookingTourSummary;
