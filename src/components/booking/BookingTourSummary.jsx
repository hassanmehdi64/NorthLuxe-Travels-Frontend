import { formatCurrencyAmount } from "../../utils/currency";

const BookingTourSummary = ({
  selectedTour,
  quoteData,
  quoteLoading,
  paymentPlan,
  paymentCurrency,
  isArrivalPayment = false,
}) => {
  if (!selectedTour) return null;

  const totalAmount = Number(quoteData?.totalAmount || selectedTour.price || 0);
  const advanceAmount = Number(quoteData?.advanceAmount || totalAmount * 0.1 || 0);
  const payableAmount = isArrivalPayment ? 0 : paymentPlan === "full" ? totalAmount : advanceAmount;
  const selectedPlanLabel = isArrivalPayment
    ? "On Arrival"
    : paymentPlan === "full"
      ? "Full Payment"
      : "10% Advance";

  return (
    <div className="rounded-xl border border-booking bg-booking-soft px-4 py-3">
      <p className="text-center text-[9px] font-black uppercase tracking-[0.15em] text-[#4c6472]">
        Booking Summary
      </p>
      <div className="mx-auto mt-3 grid max-w-4xl items-center gap-3 text-center md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_170px]">
        <div className="min-w-0 md:border-r md:border-booking md:px-4">
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
        <div className="rounded-xl border border-[var(--c-brand)]/35 bg-white px-3 py-2 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-[0.13em] text-[var(--c-brand-dark)]">
            {selectedPlanLabel}
          </p>
          <p className={`mt-0.5 text-base font-black text-[#123245] ${!isArrivalPayment && paymentPlan === "advance_10" ? "animate-pulse" : ""}`}>
            {quoteLoading && !quoteData
              ? "Calculating..."
              : formatCurrencyAmount(payableAmount, paymentCurrency || selectedTour.currency)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingTourSummary;
