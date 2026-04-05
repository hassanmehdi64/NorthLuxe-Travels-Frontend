import { CreditCard, Landmark, Send, ShieldCheck } from "lucide-react";
import BookingDropdown from "./BookingDropdown";

const InfoRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="rounded-xl border border-[rgba(15,23,42,0.06)] bg-white/90 px-3.5 py-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-textMuted">{label}</p>
      <p className="mt-1 text-[13px] font-semibold text-heading break-words">{value}</p>
    </div>
  );
};

const PaymentStep = ({ title, detail }) => (
  <div className="rounded-xl border border-[rgba(15,23,42,0.06)] bg-white/90 px-3.5 py-3">
    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-subheading">{title}</p>
    <p className="mt-1.5 text-[13px] leading-5 text-heading">{detail}</p>
  </div>
);

const getPaymentMethodDescription = (method) => {
  if (!method) return "";
  if (method.mode === "card") {
    return "Pay securely with JazzCash debit card checkout.";
  }
  if (method.mode === "arrival") {
    return "Reserve now and settle the amount when you arrive.";
  }
  return "Send money to the linked account and share payment details for verification.";
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

  const manualPaymentSteps = selectedReceivingAccount
    ? [
        {
          title: "1. Send Amount",
          detail: `Transfer to ${selectedReceivingAccount.bankName || selectedReceivingAccount.label || "the selected account"} using the details below.`,
        },
        {
          title: "2. Keep Receipt",
          detail: `Save the ${referenceLabel.toLowerCase()} or receipt after sending the amount.`,
        },
        {
          title: "3. Add Client Details",
          detail: "Enter sender info, amount paid, and payment time so the team can verify it quickly.",
        },
      ]
    : [];

  const paymentMethodOptions = paymentMethods.map((item) => ({
    value: item.key,
    label: item.label,
    description: getPaymentMethodDescription(item),
    badge:
      item.mode === "card"
        ? "Debit Card"
        : item.mode === "manual"
          ? "Send Money"
          : "Arrival",
  }));

  const paymentPlanOptions = paymentPlanDisabled
    ? [
        {
          value: form.paymentPlan || "advance_10",
          label: isArrivalPayment ? "On Arrival" : "Fixed Plan",
          description: isArrivalPayment
            ? "No advance payment is collected online for this method."
            : "This payment method uses one fixed payment plan.",
        },
      ]
    : [
        {
          value: "advance_10",
          label: "10% Advance",
          description: "Pay the advance now and settle the remaining balance later.",
        },
        {
          value: "full",
          label: "Full Amount",
          description: "Pay the full booking amount now in one step.",
        },
      ];

  return (
    <div className="rounded-2xl border border-theme bg-theme-surface p-3.5 md:p-4.5 space-y-4 shadow-[0_8px_16px_rgba(15,23,42,0.06)]">
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <label>
          <span className="ql-label">Payment Method</span>
          <BookingDropdown
            value={form.paymentMethod}
            onChange={(nextValue) =>
              setForm((p) => ({
                ...p,
                paymentMethod: nextValue,
                transactionReference: nextValue === p.paymentMethod ? p.transactionReference : "",
                manualSenderName: nextValue === p.paymentMethod ? p.manualSenderName : "",
                manualSenderNumber: nextValue === p.paymentMethod ? p.manualSenderNumber : "",
                manualSentAmount: nextValue === p.paymentMethod ? p.manualSentAmount : "",
                manualSentAt: nextValue === p.paymentMethod ? p.manualSentAt : "",
                manualPaymentSlip: nextValue === p.paymentMethod ? p.manualPaymentSlip : "",
                manualPaymentSlipName: nextValue === p.paymentMethod ? p.manualPaymentSlipName : "",
              }))
            }
            options={paymentMethodOptions}
          />
          <p className="mt-1.5 px-1 text-[12px] leading-5 text-textMuted">Choose how the client wants to pay for this booking.</p>
        </label>
        <label>
          <span className="ql-label">Payment Plan</span>
          <BookingDropdown
            value={paymentPlanDisabled ? paymentPlanOptions[0]?.value : form.paymentPlan}
            disabled={paymentPlanDisabled}
            onChange={(nextValue) =>
              setForm((p) => ({ ...p, paymentPlan: nextValue }))
            }
            options={paymentPlanOptions}
          />
          <p className="mt-1.5 px-1 text-[12px] leading-5 text-textMuted">Choose how much the client will pay right now.</p>
        </label>
      </div>

      {selectedPaymentMethod?.instructions ? (
        <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-3.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-subheading">Payment Instructions</p>
          <p className="mt-2 text-[13px] leading-5 text-textMuted">{selectedPaymentMethod.instructions}</p>
        </div>
      ) : null}

      {isCardPayment ? (
        <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-4 text-[13px] leading-5 text-textMuted">
          <p className="flex items-center gap-2 font-semibold text-heading">
            <CreditCard size={16} className="ql-icon" /> JazzCash Debit Card Checkout
          </p>
          <p className="mt-2">
            When you continue, a pending booking will be created and the client will be redirected to JazzCash's secure checkout page to pay by debit card.
          </p>
        </div>
      ) : null}

      {isManualPayment ? (
        <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[rgba(123,231,196,0.05)] p-3.5 space-y-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-subheading flex items-center gap-2">
              <Landmark size={14} className="ql-icon" /> Payment Details
            </p>
            <p className="mt-2 text-[13px] leading-5 text-textMuted">
              Send the amount to the account below, then add the client payment details before continuing.
            </p>
          </div>

          {selectedReceivingAccount ? (
            <>
              <div className="grid gap-3 lg:grid-cols-3">
                <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white px-4 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-textMuted">Selected Method</p>
                  <p className="mt-2 text-[15px] font-semibold text-heading">{selectedPaymentMethod?.label}</p>
                </div>
                <div className="rounded-2xl border border-[rgba(19,221,180,0.22)] bg-[rgba(19,221,180,0.08)] px-4 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-textMuted">Send Payment To</p>
                  <p className="mt-2 text-[18px] font-black tracking-tight text-heading">{selectedReceivingAccount.accountNumber || "Add account number in admin"}</p>
                  <p className="mt-1 text-[12px] leading-5 text-textMuted">{selectedReceivingAccount.bankName || selectedReceivingAccount.label}</p>
                </div>
                <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white px-4 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-textMuted">Account Title</p>
                  <p className="mt-2 text-[15px] font-semibold text-heading">{selectedReceivingAccount.accountTitle || "Account title not added yet"}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-textMuted">How To Pay</p>
                <div className="mt-3 grid gap-3 lg:grid-cols-3">
                  {manualPaymentSteps.map((item) => (
                    <PaymentStep key={item.title} title={item.title} detail={item.detail} />
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow label="Account" value={selectedReceivingAccount.label} />
                <InfoRow label="Account Title" value={selectedReceivingAccount.accountTitle} />
                <InfoRow label="Account Number" value={selectedReceivingAccount.accountNumber} />
                <InfoRow label="Bank / Wallet" value={selectedReceivingAccount.bankName} />
                <InfoRow label="Contact Number" value={selectedReceivingAccount.contactNumber} />
                <InfoRow label="Branch Code / Wallet ID" value={selectedReceivingAccount.branchCode} />
                <InfoRow label="IBAN" value={selectedReceivingAccount.iban} />
                <InfoRow label="SWIFT Code" value={selectedReceivingAccount.swiftCode} />
                <InfoRow label="Beneficiary Address" value={selectedReceivingAccount.beneficiaryAddress} />
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-700">
              No payment details are linked to this method yet. Add them from the admin dashboard first.
            </div>
          )}

          {selectedReceivingAccount?.instructions ? (
            <div className="rounded-xl border border-[rgba(15,23,42,0.06)] bg-white/90 px-3.5 py-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-textMuted">Account Instructions</p>
              <p className="mt-2 text-[13px] leading-5 text-heading">{selectedReceivingAccount.instructions}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {isManualPayment ? (
        <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-3.5 space-y-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-subheading flex items-center gap-2">
            <Send size={14} className="ql-icon" /> Client Payment Details
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="ql-label">Sender Name</span>
              <input
                className="ql-input"
                placeholder="Name used to send the payment"
                value={form.manualSenderName}
                onChange={(e) => setForm((p) => ({ ...p, manualSenderName: e.target.value }))}
              />
            </label>
            <label>
              <span className="ql-label">Sender Number / Account</span>
              <input
                className="ql-input"
                placeholder="Phone number or account used"
                value={form.manualSenderNumber}
                onChange={(e) => setForm((p) => ({ ...p, manualSenderNumber: e.target.value }))}
              />
            </label>
            <label>
              <span className="ql-label">Amount Paid By Client</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className="ql-input"
                placeholder="Enter paid amount"
                value={form.manualSentAmount}
                onChange={(e) => setForm((p) => ({ ...p, manualSentAmount: e.target.value }))}
              />
            </label>
            <label>
              <span className="ql-label">Payment Date & Time</span>
              <input
                type="datetime-local"
                className="ql-input"
                value={form.manualSentAt}
                onChange={(e) => setForm((p) => ({ ...p, manualSentAt: e.target.value }))}
              />
            </label>
          </div>

          <label>
            <span className="ql-label">{referenceLabel}</span>
            <input
              className="ql-input"
              placeholder={`Enter ${referenceLabel.toLowerCase()} from the payment receipt`}
              value={form.transactionReference}
              onChange={(e) =>
                setForm((p) => ({ ...p, transactionReference: e.target.value }))
              }
            />
            <p className="mt-1.5 px-1 text-[12px] leading-5 text-textMuted">
              Add the same receipt ID, transfer ID, or bank reference shown after payment.
            </p>
          </label>

          <label>
            <span className="ql-label">Reference Slip</span>
            <input
              type="file"
              accept="image/*,.pdf"
              className="ql-input cursor-pointer file:mr-3 file:rounded-xl file:border-0 file:bg-[rgba(19,221,180,0.12)] file:px-3 file:py-2 file:text-[12px] file:font-semibold file:text-heading"
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
            <p className="mt-1.5 px-1 text-[12px] leading-5 text-textMuted">
              Upload the payment screenshot, bank slip, or receipt after sending the amount.
            </p>
            {form.manualPaymentSlipName ? (
              <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-[rgba(15,23,42,0.06)] bg-slate-50 px-3.5 py-2.5 text-[12px] text-heading">
                <span className="truncate font-medium">{form.manualPaymentSlipName}</span>
                <button
                  type="button"
                  className="cursor-pointer text-rose-600 transition hover:text-rose-700"
                  onClick={() => setForm((p) => ({ ...p, manualPaymentSlip: "", manualPaymentSlipName: "" }))}
                >
                  Remove
                </button>
              </div>
            ) : null}
          </label>
        </div>
      ) : null}

      {isArrivalPayment ? (
        <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[rgba(123,231,196,0.06)] p-3.5 text-[13px]">
          <p className="flex items-center gap-2 font-semibold text-heading">
            <ShieldCheck size={16} className="ql-icon" /> Payment Status
          </p>
          <p className="mt-1.5 leading-5 text-textMuted">
            Pay on arrival selected. No advance payment details are required before review.
          </p>
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
            onChange={(e) =>
              setForm((p) => ({ ...p, customRequirements: e.target.value }))
            }
          />
        </label>
      ) : null}

      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          className="ql-btn-secondary w-full sm:w-auto"
          onClick={onBack}
        >
          Back
        </button>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <button
            type="button"
            className="ql-btn-secondary w-full sm:w-auto"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ql-btn-primary w-full sm:w-auto"
            disabled={
              !isTravelerSectionValid ||
              !isTravelSectionValid ||
              !isPreferencesSectionValid
            }
            onClick={onContinue}
          >
            <CreditCard size={16} /> {isCardPayment ? "Continue to JazzCash" : "Continue to Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPreferencesSection;


