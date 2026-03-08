import { ReceiptText, RotateCcw, ShieldCheck } from "lucide-react";

const BookingSuccessStep = ({
  bookingResult,
  onBackToTours,
  onReset,
}) => (
  <div className="space-y-4 p-4 sm:p-5 md:p-7 md:space-y-5">
    <div className="rounded-[1.75rem] border border-[rgba(34,197,94,0.18)] bg-[linear-gradient(180deg,rgba(236,253,245,0.98),rgba(255,255,255,0.98))] p-4 text-center shadow-[0_18px_40px_rgba(16,185,129,0.12)] sm:p-5 md:p-6">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <ShieldCheck size={24} />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-emerald-800 sm:text-2xl">
        Booking Submitted Successfully
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-6 text-emerald-700 sm:text-sm">
        Your booking request has been submitted successfully. Our team will
        review the details and confirm your booking within 2 hours.
      </p>

      <div className="mx-auto mt-5 grid max-w-3xl gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-[rgba(34,197,94,0.14)] bg-white/85 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700/80">
            Booking Code
          </p>
          <p className="mt-1 text-sm font-semibold text-heading">
            {bookingResult?.bookingCode || "Pending"}
          </p>
        </div>
        <div className="rounded-2xl border border-[rgba(34,197,94,0.14)] bg-white/85 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700/80">
            Payment Status
          </p>
          <p className="mt-1 text-sm font-semibold text-heading">
            {bookingResult?.payment || "Submitted"}
          </p>
        </div>
        <div className="rounded-2xl border border-[rgba(34,197,94,0.14)] bg-white/85 px-4 py-3 sm:col-span-2 lg:col-span-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700/80">
            Confirmation Time
          </p>
          <p className="mt-1 text-sm font-semibold text-heading">
            Within 2 Hours
          </p>
        </div>
      </div>
    </div>

    <div className="ql-soft-card space-y-1.5 text-sm">
      <p className="flex items-center gap-2 font-semibold text-heading">
        <ReceiptText size={16} className="ql-icon" /> Booking Summary
      </p>
      <p>
        Total: {bookingResult?.currency || "USD"} {bookingResult?.amount || 0}
      </p>
      <p>
        Advance: {bookingResult?.currency || "USD"}{" "}
        {bookingResult?.advanceAmount || 0}
      </p>
      <p>
        Remaining: {bookingResult?.currency || "USD"}{" "}
        {bookingResult?.remainingAmount || 0}
      </p>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
      <button
        type="button"
        className="ql-btn-secondary w-full sm:w-auto"
        onClick={onBackToTours}
      >
        Back to Tours
      </button>
      <button
        type="button"
        className="ql-btn-primary w-full sm:w-auto"
        onClick={onReset}
      >
        <RotateCcw size={16} />
        Revert Back to Form
      </button>
    </div>
  </div>
);

export default BookingSuccessStep;
