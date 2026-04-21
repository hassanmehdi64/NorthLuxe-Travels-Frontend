import { Elements } from "@stripe/react-stripe-js";
import { CreditCard } from "lucide-react";
import BookingCardPaymentFields from "./BookingCardPaymentFields";
import { stripePromise } from "../../lib/stripe";
import { displayCurrency, formatCurrencyAmount } from "../../utils/currency";

const SummaryCard = ({ label, value, detail }) => (
  <div className="rounded-xl border border-[rgba(15,23,42,0.06)] bg-white/80 px-3.5 py-3">
    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-textMuted">
      {label}
    </p>
    <p className="mt-1 text-[13px] font-semibold text-heading break-words">
      {value}
    </p>
    {detail ? (
      <p className="mt-1 text-[12px] leading-5 text-textMuted">{detail}</p>
    ) : null}
  </div>
);

const BookingReviewStep = ({
  quoteData,
  selectedTour,
  form,
  selectedPaymentMethod,
  selectedReceivingAccount,
  paymentMethodLabel,
  transactionReferenceLabel,
  isCardPayment,
  submitting,
  canConfirmBooking,
  cardAmountLabel,
  cardClientSecret,
  cardIntentLoading,
  cardIntentError,
  confirmedCardPayment,
  onBack,
  onSubmit,
  onCardPaymentConfirmed,
  onSubmitPaidBooking,
}) => {
  const isManualPayment = selectedPaymentMethod?.mode === "manual";
  const isArrivalPayment = selectedPaymentMethod?.mode === "arrival";
  const currency = displayCurrency(selectedTour?.currency);

  const paymentPlanLabel = !form.paymentMethod || form.paymentMethod === "pay_on_arrival"
    ? "On Arrival"
    : form.paymentPlan === "full"
      ? "Full Payment"
      : "10% Advance";

  const verificationSummary = isCardPayment
    ? "Card charge must complete before the booking is finalized."
    : isManualPayment
      ? "Your sender details and transfer reference will be reviewed against the linked receiving account."
      : "No online payment proof is needed before booking submission.";

  return (
    <div className="min-w-0 space-y-4 p-3.5 sm:p-5 md:p-6">
      <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,rgba(123,231,196,0.1),rgba(255,255,255,0.96))] p-3.5 md:p-4.5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-subheading">
              Quote Summary
            </p>
            <p className="text-base font-semibold text-heading">
              Standard Route Estimate
            </p>
          </div>
          <div className="rounded-xl bg-white/80 px-3 py-2 text-left shadow-[0_6px_16px_rgba(15,23,42,0.05)] sm:text-right">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-textMuted">
              Total Amount
            </p>
            <p className="break-words text-base font-semibold text-heading sm:text-lg">
              {formatCurrencyAmount(quoteData?.totalAmount, currency)}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Duration", value: `${quoteData?.days ?? 0} day(s)` },
            { label: "Travelers", value: `${quoteData?.guests ?? 0}` },
            {
              label: "Advance Due",
              value: formatCurrencyAmount(quoteData?.advanceAmount ?? 0, currency),
            },
            {
              label: "Remaining",
              value: formatCurrencyAmount(quoteData?.remainingAmount ?? 0, currency),
            },
            {
              label: "Payment Method",
              value: paymentMethodLabel,
            },
            {
              label: "Payment Plan",
              value: paymentPlanLabel,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[rgba(15,23,42,0.06)] bg-white/80 px-3.5 py-3"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-textMuted">
                {item.label}
              </p>
              <p className="mt-1 break-words text-[13px] font-semibold text-heading">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <SummaryCard
          label="Selected Method"
          value={selectedPaymentMethod?.label || paymentMethodLabel}
          detail={selectedPaymentMethod?.instructions || "The booking will use the payment setup shown below."}
        />
        <SummaryCard
          label="Verification"
          value={isCardPayment ? "Instant card verification" : isManualPayment ? "Manual transfer review" : "Arrival payment"}
          detail={verificationSummary}
        />
        <SummaryCard
          label="Receiving Details"
          value={isManualPayment ? (selectedReceivingAccount ? "Configured" : "Missing") : "Not required"}
          detail={
            isManualPayment
              ? selectedReceivingAccount
                ? `${selectedReceivingAccount.bankName || selectedReceivingAccount.label}${selectedReceivingAccount.accountNumber ? `, ${selectedReceivingAccount.accountNumber}` : ""}`
                : "This payment method still needs an active linked receiving account in admin settings."
              : isCardPayment
                ? "Secure debit card fields are shown below."
                : "No transfer details are needed for pay on arrival."
          }
        />
      </div>

      {isManualPayment && selectedReceivingAccount ? (
        <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-3.5 md:p-4 space-y-4">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-subheading">
                Manual Payment Details
              </p>
              <p className="mt-2 text-[13px] leading-5 text-textMuted">
                Double-check the receiving account and the client payment details before submitting the booking.
              </p>
            </div>
            <div className="rounded-xl bg-[rgba(198,162,75,0.1)] px-3 py-2 text-left sm:text-right">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-textMuted">
                Account Number
              </p>
              <p className="mt-1 break-words text-sm font-black tracking-tight text-heading sm:text-[15px]">
                {selectedReceivingAccount.accountNumber || "Add in admin"}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryCard label="Method" value={selectedPaymentMethod?.label || "Manual payment"} />
            <SummaryCard label="Account Holder" value={selectedReceivingAccount.accountTitle || "Not added yet"} />
            <SummaryCard label="Bank / Wallet" value={selectedReceivingAccount.bankName || selectedReceivingAccount.label || "Not added yet"} />
            <SummaryCard label="Contact Number" value={selectedReceivingAccount.contactNumber || "Not added yet"} />
            <SummaryCard label="Branch / Wallet ID" value={selectedReceivingAccount.branchCode || "Not added yet"} />
            <SummaryCard label="IBAN / SWIFT" value={[selectedReceivingAccount.iban, selectedReceivingAccount.swiftCode].filter(Boolean).join(" / ") || "Not added yet"} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="Sender Name" value={form.manualSenderName || "Not added yet"} />
            <SummaryCard label="Sender Number / Account" value={form.manualSenderNumber || "Not added yet"} />
            <SummaryCard label="Amount Sent" value={form.manualSentAmount ? formatCurrencyAmount(form.manualSentAmount, currency) : "Not added yet"} />
            <SummaryCard label="Payment Date" value={form.manualSentAt ? new Date(form.manualSentAt).toLocaleString() : "Not added yet"} />
          </div>

          {form.manualPaymentSlip ? (
            <div className="rounded-xl border border-[rgba(15,23,42,0.06)] bg-slate-50 px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-textMuted">
                Reference Slip
              </p>
              <a
                href={form.manualPaymentSlip}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-[13px] font-medium text-emerald-700 underline"
              >
                {form.manualPaymentSlipName || "View uploaded slip"}
              </a>
            </div>
          ) : null}

          {selectedReceivingAccount.instructions ? (
            <div className="rounded-xl border border-[rgba(15,23,42,0.06)] bg-slate-50 px-4 py-3 text-[13px] leading-5 text-heading">
              {selectedReceivingAccount.instructions}
            </div>
          ) : null}
        </div>
      ) : null}

      {isArrivalPayment ? (
        <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-3.5 text-[13px] leading-5 text-textMuted">
          Pay on arrival is selected. Your booking can be submitted without entering transfer details or card information.
        </div>
      ) : null}

      {!isCardPayment && form.transactionReference ? (
        <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-3.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-textMuted">
            {transactionReferenceLabel}
          </p>
          <p className="mt-2 break-words text-[13px] leading-5 text-heading">{form.transactionReference}</p>
        </div>
      ) : null}

      {form.customRequirements ? (
        <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-3.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-textMuted">
            Custom Requirements
          </p>
          <p className="mt-2 break-words text-[13px] leading-5 text-heading">{form.customRequirements}</p>
        </div>
      ) : null}

      {isCardPayment ? (
        stripePromise ? (
          <Elements stripe={stripePromise}>
            <BookingCardPaymentFields
              customerName={form.customerName}
              email={form.email}
              phone={form.phone}
              amountLabel={cardAmountLabel}
              clientSecret={cardClientSecret}
              intentLoading={cardIntentLoading}
              intentError={cardIntentError}
              confirmedPayment={confirmedCardPayment}
              submitting={submitting}
              canConfirmBooking={canConfirmBooking}
              onBack={onBack}
              onPaymentConfirmed={onCardPaymentConfirmed}
              onSubmitPaidBooking={onSubmitPaidBooking}
            />
          </Elements>
        ) : (
          <div className="space-y-4 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
              {cardIntentError || "Card payments are not available until a Stripe publishable key and payment session are ready."}
            </div>
            <div className="flex justify-start">
              <button
                type="button"
                className="ql-btn-secondary w-full sm:w-auto"
                onClick={onBack}
              >
                Back
              </button>
            </div>
          </div>
        )
      ) : (
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
      )}
    </div>
  );
};

export default BookingReviewStep;


