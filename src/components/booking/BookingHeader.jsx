const BookingHeader = ({ isCustomBooking, action }) => (
  <div className="rounded-t-[1.25rem] border-b border-booking bg-[linear-gradient(135deg,#ffffff_0%,#e9fbf4_100%)] px-5 py-5 md:px-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--c-brand-dark)]">
          {isCustomBooking ? "Custom route planner" : "Guided checkout"}
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-theme md:text-2xl">
          {isCustomBooking ? "Custom Tour Booking" : "Standard Tour Booking"}
          {action === "waitlist" ? " (Waitlist)" : ""}
        </h1>
      </div>
      <div className="inline-flex w-fit items-center rounded-full border border-booking bg-white px-3 py-1 text-[11px] font-semibold text-theme shadow-sm">
        Secure booking flow
      </div>
    </div>
  </div>
);

export default BookingHeader;
