import { CreditCard, Landmark, ShieldCheck } from "lucide-react";
import BookingDropdown from "./BookingDropdown";

const getPaymentMethodDescription = (method) => {
  if (!method) return "";
  if (method.mode === "card") return "Pay by secure card checkout.";
  if (method.mode === "arrival") return "Reserve now and pay when you arrive.";
  return "Send payment first, then add the reference details.";
};

const PaymentNotice = ({ icon: Icon, title, children, tone = "neutral" }) => {
  const toneClass =
    tone === "success"
      ? "border-[var(--c-brand)]/25 bg-[var(--c-brand)]/8"
      : "border-booking bg-theme-bg";

  return (
    <div className={`rounded-xl border ${toneClass} p-3.5 shadow-sm`}>
      <p className="flex items-center gap-2 text-sm font-semibold text-theme">
        <Icon size={16} className="text-[var(--c-brand-dark)]" />
        {title}
      </p>
      <div className="mt-2 text-[13px] leading-5 text-muted">{children}</div>
    </div>
  );
};

const BookingPreferencesSection = ({
  bookingType,
  form,
  setForm,
  paymentMethods,
  selectedPaymentMethod,
  selectedReceivingAccount,
  isTravelerSectionValid,
  isTravelSectionValid,
  isPreferencesSectionValid,
  onBack,
  onCancel,
  onContinue,
}) => {
  const isCardPayment = selectedPaymentMethod?.mode === "card";
  const isArrivalPayment = selectedPaymentMethod?.mode === "arrival";
  const isManualPayment = selectedPaymentMethod?.mode === "manual";
  const paymentPlanDisabled = !selectedPaymentMethod?.supportsPlan;
  const referenceLabel = selectedPaymentMethod?.referenceLabel || "Transaction Reference";
  const paymentMethodOptions = paymentMethods.map((item) => ({
    value: item.key,
    label: item.label,
    description: getPaymentMethodDescription(item),
  }));

  const paymentPlanOptions = paymentPlanDisabled
    ? [
        {
          value: form.paymentPlan || "advance_10",
          label: isArrivalPayment ? "On Arrival" : "Fixed Plan",
          description: isArrivalPayment
            ? "No online advance is needed."
            : "This payment method uses one fixed plan.",
        },
      ]
    : [
        {
          value: "advance_10",
          label: "10% Advance",
          description: "Pay a small advance now.",
        },
        {
          value: "full",
          label: "Full Amount",
          description: "Pay the full amount now.",
        },
      ];

  const resetManualPaymentFields = (nextValue, previousForm) => ({
    transactionReference: nextValue === previousForm.paymentMethod ? previousForm.transactionReference : "",
    manualSenderName: nextValue === previousForm.paymentMethod ? previousForm.manualSenderName : "",
    manualSenderNumber: nextValue === previousForm.paymentMethod ? previousForm.manualSenderNumber : "",
    manualSentAmount: nextValue === previousForm.paymentMethod ? previousForm.manualSentAmount : "",
    manualSentAt: nextValue === previousForm.paymentMethod ? previousForm.manualSentAt : "",
    manualPaymentSlip: nextValue === previousForm.paymentMethod ? previousForm.manualPaymentSlip : "",
    manualPaymentSlipName: nextValue === previousForm.paymentMethod ? previousForm.manualPaymentSlipName : "",
  });

  return (
    <div className="space-y-4 rounded-xl border border-booking bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
      <div>
        <p className="text-sm font-semibold text-theme">Payment</p>
        <p className="mt-1 text-[13px] leading-5 text-muted">
          Select a method and add payment proof only if required.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <label>
          <span className="ql-label">Payment Method</span>
          <BookingDropdown
            value={form.paymentMethod}
            onChange={(nextValue) =>
              setForm((p) => ({
                ...p,
                paymentMethod: nextValue,
                ...resetManualPaymentFields(nextValue, p),
              }))
            }
            options={paymentMethodOptions}
          />
        </label>

        <label>
          <span className="ql-label">Payment Plan</span>
          <BookingDropdown
            value={paymentPlanDisabled ? paymentPlanOptions[0]?.value : form.paymentPlan}
            disabled={paymentPlanDisabled}
            onChange={(nextValue) => setForm((p) => ({ ...p, paymentPlan: nextValue }))}
            options={paymentPlanOptions}
          />
        </label>
      </div>

      {selectedPaymentMethod?.instructions ? (
        <PaymentNotice icon={ShieldCheck} title="Instructions">
          {selectedPaymentMethod.instructions}
        </PaymentNotice>
      ) : null}

      {isCardPayment ? (
        <PaymentNotice icon={CreditCard} title="Card Checkout" tone="success">
          Continue to create the booking and redirect the client to secure JazzCash card checkout.
        </PaymentNotice>
      ) : null}

      {isArrivalPayment ? (
        <PaymentNotice icon={ShieldCheck} title="Pay On Arrival" tone="success">
          No online payment proof is needed. The booking can continue to review.
        </PaymentNotice>
      ) : null}

      {isManualPayment ? (
        <div className="space-y-3 rounded-xl border border-booking bg-booking-soft p-3.5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-theme">
                <Landmark size={16} className="text-[var(--c-brand-dark)]" />
                Send Payment To
              </p>
              <p className="mt-1 text-[13px] leading-5 text-muted">
                Use this account, then enter the reference below.
              </p>
            </div>
            {selectedReceivingAccount ? (
              <div className="rounded-xl border border-booking bg-white px-3 py-2 text-left shadow-sm sm:min-w-[220px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                  {selectedReceivingAccount.bankName || selectedReceivingAccount.label || "Account"}
                </p>
                <p className="mt-1 text-base font-black text-theme">
                  {selectedReceivingAccount.accountNumber || "Account number missing"}
                </p>
                {selectedReceivingAccount.accountTitle ? (
                  <p className="mt-0.5 text-[12px] text-muted">
                    {selectedReceivingAccount.accountTitle}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          {!selectedReceivingAccount ? (
            <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-700">
              No receiving account is linked to this method yet.
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="ql-label">Sender Name</span>
              <input
                className="ql-input"
                placeholder="Name used for payment"
                value={form.manualSenderName}
                onChange={(e) => setForm((p) => ({ ...p, manualSenderName: e.target.value }))}
              />
            </label>

            <label>
              <span className="ql-label">Amount Paid</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className="ql-input"
                placeholder="Amount sent"
                value={form.manualSentAmount}
                onChange={(e) => setForm((p) => ({ ...p, manualSentAmount: e.target.value }))}
              />
            </label>
          </div>

          <label>
            <span className="ql-label">{referenceLabel}</span>
            <input
              className="ql-input"
              placeholder={`Enter ${referenceLabel.toLowerCase()}`}
              value={form.transactionReference}
              onChange={(e) => setForm((p) => ({ ...p, transactionReference: e.target.value }))}
            />
          </label>

          <details className="rounded-xl border border-booking bg-white px-3.5 py-3">
            <summary className="cursor-pointer text-[12px] font-semibold text-theme">
              Add optional sender number, date, or slip
            </summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label>
                <span className="ql-label">Sender Number</span>
                <input
                  className="ql-input"
                  placeholder="Phone/account used"
                  value={form.manualSenderNumber}
                  onChange={(e) => setForm((p) => ({ ...p, manualSenderNumber: e.target.value }))}
                />
              </label>

              <label>
                <span className="ql-label">Payment Time</span>
                <input
                  type="datetime-local"
                  className="ql-input"
                  value={form.manualSentAt}
                  onChange={(e) => setForm((p) => ({ ...p, manualSentAt: e.target.value }))}
                />
              </label>

              <label className="sm:col-span-2">
                <span className="ql-label">Reference Slip</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="ql-input cursor-pointer file:mr-3 file:rounded-lg file:border-0 file:bg-[rgba(19,221,180,0.12)] file:px-3 file:py-1.5 file:text-[12px] file:font-semibold file:text-heading"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) {
                      setForm((p) => ({ ...p, manualPaymentSlip: "", manualPaymentSlipName: "" }));
                      return;
                    }

                    const reader = new FileReader();
                    reader.onload = () => {
                      setForm((p) => ({
                        ...p,
                        manualPaymentSlip: typeof reader.result === "string" ? reader.result : "",
                        manualPaymentSlipName: file.name,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                {form.manualPaymentSlipName ? (
                  <button
                    type="button"
                    className="mt-2 text-[12px] font-semibold text-rose-600 hover:text-rose-700"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        manualPaymentSlip: "",
                        manualPaymentSlipName: "",
                      }))
                    }
                  >
                    Remove {form.manualPaymentSlipName}
                  </button>
                ) : null}
              </label>
            </div>
          </details>
        </div>
      ) : null}

      {bookingType === "custom" ? (
        <label>
          <span className="ql-label">Custom Requirements</span>
          <textarea
            className="ql-textarea"
            rows={3}
            placeholder="Share route changes, stops, comfort preferences, or special requests."
            value={form.customRequirements}
            onChange={(e) => setForm((p) => ({ ...p, customRequirements: e.target.value }))}
          />
        </label>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-booking pt-4 sm:flex-row sm:justify-between">
        <button type="button" className="ql-btn-secondary w-full sm:w-auto" onClick={onBack}>
          Back
        </button>

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <button type="button" className="ql-btn-secondary w-full sm:w-auto" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="ql-btn-primary w-full sm:w-auto"
            disabled={!isTravelerSectionValid || !isTravelSectionValid || !isPreferencesSectionValid}
            onClick={onContinue}
          >
            {isCardPayment ? "Continue to JazzCash" : "Continue to Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPreferencesSection;
