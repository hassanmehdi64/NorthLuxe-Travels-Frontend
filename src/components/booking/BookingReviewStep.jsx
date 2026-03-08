import { CreditCard, ShieldCheck } from "lucide-react";
import BookingDropdown from "./BookingDropdown";

const BookingReviewStep = ({
  quoteData,
  selectedTour,
  form,
  setForm,
  paymentVerified,
  submitting,
  canConfirmBooking,
  onBack,
  onSubmit,
}) => (
  <div className="space-y-4 p-4 sm:p-5 md:p-6">
    <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,rgba(123,231,196,0.1),rgba(255,255,255,0.96))] p-3.5 md:p-4.5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-subheading">
            Quote Summary
          </p>
          <p className="text-base font-semibold text-heading">
            Standard Route Estimate
          </p>
        </div>
        <div className="rounded-xl bg-white/80 px-3 py-2 text-right shadow-[0_6px_16px_rgba(15,23,42,0.05)]">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-textMuted">
            Total Amount
          </p>
          <p className="text-lg font-semibold text-heading">
            {selectedTour?.currency || "USD"} {quoteData?.totalAmount}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Duration", value: `${quoteData?.days ?? 0} day(s)` },
          { label: "Travelers", value: `${quoteData?.guests ?? 0}` },
          {
            label: "Advance Due",
            value: `${selectedTour?.currency || "USD"} ${quoteData?.advanceAmount ?? 0}`,
          },
          {
            label: "Remaining",
            value: `${selectedTour?.currency || "USD"} ${quoteData?.remainingAmount ?? 0}`,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-[rgba(15,23,42,0.06)] bg-white/80 px-3.5 py-3"
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-textMuted">
              {item.label}
            </p>
            <p className="mt-1 text-[13px] font-semibold text-heading">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>

    <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
      <label>
        <span className="ql-label">Payment Method</span>
        <BookingDropdown
          value={form.paymentMethod}
          onChange={(nextValue) =>
            setForm((p) => ({ ...p, paymentMethod: nextValue }))
          }
          options={[
            { value: "visa_card", label: "Visa / Card" },
            { value: "easypaisa", label: "EasyPaisa" },
            { value: "jazzcash", label: "JazzCash" },
            { value: "pay_on_arrival", label: "Pay on Arrival" },
          ]}
        />
      </label>
      <label>
        <span className="ql-label">Payment Plan</span>
        <BookingDropdown
          value={form.paymentPlan}
          disabled={form.paymentMethod === "pay_on_arrival"}
          onChange={(nextValue) =>
            setForm((p) => ({ ...p, paymentPlan: nextValue }))
          }
          options={[
            { value: "advance_10", label: "10% Advance" },
            { value: "full", label: "Full Payment" },
          ]}
        />
      </label>
    </div>

    {form.paymentMethod === "visa_card" ? (
      <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[rgba(123,231,196,0.05)] p-3.5">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-subheading">
          Card Payment
        </p>
        <p className="mt-2 text-[13px] leading-5 text-textMuted">
          Submit your booking first. Our team will share the secure card
          payment link and payment instructions with you after reviewing your
          request.
        </p>
      </div>
    ) : null}

    {form.paymentMethod !== "visa_card" ? (
      <label>
        <span className="ql-label">Transaction Reference (manual methods)</span>
        <input
          className="ql-input"
          value={form.transactionReference}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              transactionReference: e.target.value,
            }))
          }
        />
      </label>
    ) : null}

    {paymentVerified ? (
      <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[rgba(123,231,196,0.06)] p-3.5 text-[13px]">
        <p className="flex items-center gap-2 font-semibold text-heading">
          <ShieldCheck size={16} className="ql-icon" />
          Payment Status
        </p>
        <p className="mt-1.5 leading-5 text-textMuted">
          Payment verified. You can confirm booking.
        </p>
      </div>
    ) : null}

    <div className="flex flex-col gap-3 border-t border-[rgba(15,23,42,0.06)] pt-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        className="ql-btn-secondary w-full sm:w-auto"
        onClick={onBack}
      >
        Back
      </button>
      <div className="flex w-full flex-col justify-end gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
        <button
          type="button"
          className="ql-btn-primary w-full sm:w-auto"
          disabled={submitting || !canConfirmBooking}
          onClick={onSubmit}
        >
          <CreditCard size={16} />
          {submitting ? "Submitting..." : "Submit Booking"}
        </button>
      </div>
    </div>
  </div>
);

export default BookingReviewStep;
