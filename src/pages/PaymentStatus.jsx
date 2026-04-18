import { AlertCircle, LoaderCircle, ShieldCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { usePaymentSession } from "../hooks/useCms";
import { displayCurrency } from "../utils/currency";

const PaymentStatus = ({ mode = "success" }) => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const isSuccess = mode === "success";

  const { data, isLoading, isError } = usePaymentSession(sessionId, isSuccess);
  const booking = data?.booking;
  const currency = displayCurrency(booking?.currency);
  const isPaid = Boolean(booking?.paymentVerified) || data?.paymentStatus === "paid";

  if (!isSuccess) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-theme-bg py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <AlertCircle size={24} />
            </div>
            <h1 className="mt-4 text-center text-2xl font-semibold text-theme">Payment cancelled</h1>
            <p className="mt-2 text-center text-sm leading-6 text-muted">
              The secure payment was cancelled before completion. Your booking request was not charged.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/tours" className="ql-btn-secondary w-full sm:w-auto text-center">
                Back to Tours
              </Link>
              <Link to="/book" className="ql-btn-primary w-full sm:w-auto text-center">
                Try Again
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-theme-bg py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
          {isLoading ? (
            <div className="py-8 text-center">
              <LoaderCircle size={26} className="mx-auto animate-spin text-[var(--c-brand)]" />
              <p className="mt-4 text-sm text-muted">Confirming your payment with Stripe...</p>
            </div>
          ) : isError || !sessionId ? (
            <div className="py-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-700">
                <AlertCircle size={24} />
              </div>
              <h1 className="mt-4 text-2xl font-semibold text-theme">Payment status unavailable</h1>
              <p className="mt-2 text-sm leading-6 text-muted">
                We could not verify this payment return yet. Please contact support if the amount was charged.
              </p>
            </div>
          ) : (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <ShieldCheck size={24} />
              </div>
              <h1 className="mt-4 text-center text-2xl font-semibold text-theme">
                {isPaid ? "Payment received" : "Payment is processing"}
              </h1>
              <p className="mt-2 text-center text-sm leading-6 text-muted">
                {isPaid
                  ? "Your booking payment was confirmed successfully and the booking has been updated."
                  : "Stripe returned successfully, but the booking is still waiting for confirmation. This page refreshes automatically for a short time."}
              </p>

              {booking ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-theme bg-theme-bg px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">Booking Code</p>
                    <p className="mt-1 text-base font-semibold text-theme">{booking.bookingCode}</p>
                  </div>
                  <div className="rounded-2xl border border-theme bg-theme-bg px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">Payment Status</p>
                    <p className="mt-1 text-base font-semibold text-theme">{booking.paymentStatus}</p>
                  </div>
                  <div className="rounded-2xl border border-theme bg-theme-bg px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">Paid Amount</p>
                    <p className="mt-1 text-base font-semibold text-theme">{currency} {booking.paidAmount}</p>
                  </div>
                  <div className="rounded-2xl border border-theme bg-theme-bg px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">Remaining</p>
                    <p className="mt-1 text-base font-semibold text-theme">{currency} {booking.remainingAmount}</p>
                  </div>
                </div>
              ) : null}
            </>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/tours" className="ql-btn-secondary w-full sm:w-auto text-center">
              Back to Tours
            </Link>
            <Link to="/contact" className="ql-btn-primary w-full sm:w-auto text-center">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentStatus;
