import { useState } from "react";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { CreditCard, ShieldCheck } from "lucide-react";

const elementOptions = {
  style: {
    base: {
      color: "#2B2B2B",
      fontFamily: '"DM Sans", system-ui, sans-serif',
      fontSize: "14px",
      lineHeight: "20px",
      "::placeholder": {
        color: "#94a3b8",
      },
      iconColor: "#20b77a",
    },
    invalid: {
      color: "#dc2626",
      iconColor: "#dc2626",
    },
  },
};

const FieldShell = ({ label, children }) => (
  <label className="space-y-2">
    <span className="ql-label">{label}</span>
    <div className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-white px-3 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
      {children}
    </div>
  </label>
);

const BookingCardPaymentFields = ({
  customerName,
  email,
  phone,
  amountLabel,
  clientSecret,
  intentLoading,
  intentError,
  confirmedPayment,
  submitting,
  canConfirmBooking,
  onBack,
  onPaymentConfirmed,
  onSubmitPaidBooking,
  backLabel = "Back",
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleCardSubmit = async () => {
    if (confirmedPayment) {
      await onSubmitPaidBooking?.(confirmedPayment);
      return;
    }

    if (!stripe || !elements) {
      setCardError("Secure debit card form is still loading. Please wait a moment and try again.");
      return;
    }

    if (!clientSecret) {
      setCardError("Secure payment session could not be prepared. Please refresh the quote and try again.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setCardError("Card number field is not ready yet.");
      return;
    }

    setCardError("");
    setProcessing(true);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: customerName || undefined,
            email: email || undefined,
            phone: phone || undefined,
          },
        },
      });

      if (result.error) {
        setCardError(result.error.message || "Debit card payment could not be completed.");
        return;
      }

      if (!result.paymentIntent?.id) {
        setCardError("Payment was not completed. Please try again.");
        return;
      }

      await onPaymentConfirmed?.({
        paymentIntentId: result.paymentIntent.id,
        transactionReference: result.paymentIntent.id,
      });
    } finally {
      setProcessing(false);
    }
  };

  const disabled =
    submitting ||
    processing ||
    intentLoading ||
    !canConfirmBooking ||
    (!confirmedPayment && (!stripe || !clientSecret));

  return (
    <div className="min-w-0 space-y-4 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-3.5 sm:p-4 md:p-5">
      <div className="flex flex-col items-stretch gap-3 border-b border-[rgba(15,23,42,0.06)] pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-subheading">
            Debit Card Payment
          </p>
          <p className="mt-1 text-[13px] leading-5 text-textMuted">
            Enter the card details below to pay securely.
          </p>
        </div>
        <div className="rounded-xl bg-[rgba(198,162,75,0.1)] px-3 py-2 text-left sm:text-right">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-textMuted">
            Client Pays Now
          </p>
          <p className="break-words text-sm font-semibold text-heading sm:text-[15px]">{amountLabel}</p>
        </div>
      </div>

      <div className="break-words rounded-xl border border-[rgba(15,23,42,0.08)] bg-slate-50 px-3.5 py-3 text-[13px] leading-5 text-textMuted sm:px-4">
        Card holder: <span className="font-semibold text-heading">{customerName || "Not added yet"}</span>
        {email ? <span> | Receipt: <span className="font-semibold text-heading">{email}</span></span> : null}
        {!email && phone ? <span> | Contact: <span className="font-semibold text-heading">{phone}</span></span> : null}
      </div>

      {confirmedPayment ? (
        <div className="break-words rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[13px] text-emerald-800 sm:px-4">
          Payment has already been confirmed with reference <strong>{confirmedPayment.transactionReference}</strong>. Submit the booking to finish the process.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-[minmax(0,1.5fr)_160px_130px]">
          <FieldShell label="Card Number">
            <CardNumberElement options={elementOptions} onChange={(event) => setCardError(event.error?.message || "")} />
          </FieldShell>
          <FieldShell label="Expiry Date">
            <CardExpiryElement options={elementOptions} onChange={(event) => setCardError(event.error?.message || "")} />
          </FieldShell>
          <FieldShell label="CVC">
            <CardCvcElement options={elementOptions} onChange={(event) => setCardError(event.error?.message || "")} />
          </FieldShell>
        </div>
      )}

      {intentLoading ? (
        <div className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-slate-50 px-4 py-3 text-[13px] text-textMuted">
          Preparing secure debit card payment...
        </div>
      ) : null}

      {intentError || cardError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
          {intentError || cardError}
        </div>
      ) : null}

      <div className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-slate-50 px-4 py-3 text-[13px] text-textMuted">
        <p className="flex items-center gap-2 font-semibold text-heading">
          <ShieldCheck size={16} className="ql-icon" /> Live Stripe Verification
        </p>
        <p className="mt-1.5 leading-5">
          Card number, expiry date, and CVC stay inside secure Stripe fields during payment.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-[rgba(15,23,42,0.06)] pt-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="ql-btn-secondary w-full sm:w-auto"
          onClick={onBack}
        >
          {backLabel}
        </button>
        <button
          type="button"
          className="ql-btn-primary w-full sm:w-auto"
          disabled={disabled}
          onClick={handleCardSubmit}
        >
          <CreditCard size={16} />
          {submitting || processing
            ? confirmedPayment
              ? "Submitting..."
              : "Processing Payment..."
            : confirmedPayment
              ? "Submit Paid Booking"
              : "Pay with Debit Card"}
        </button>
      </div>
    </div>
  );
};

export default BookingCardPaymentFields;
