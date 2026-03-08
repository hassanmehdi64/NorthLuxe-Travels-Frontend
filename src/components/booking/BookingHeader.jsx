const BookingHeader = ({ isCustomBooking, action }) => (
  <div className="ql-form-header !px-5 !py-4 md:!px-6 md:!py-4.5">
    <p className="ql-form-subtitle !text-[9px] !tracking-[0.18em]">
      {isCustomBooking ? "Custom Booking Route" : "Standard Booking Route"}
    </p>
    <h1 className="ql-form-title mt-1 !text-lg md:!text-[1.65rem] !font-semibold !text-white">
      {isCustomBooking ? "Custom Tour Booking" : "Standard Tour Booking"}
      {action === "waitlist" ? " (Waitlist)" : ""}
    </h1>
  </div>
);

export default BookingHeader;
