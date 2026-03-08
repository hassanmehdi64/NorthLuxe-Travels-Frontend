import { useParams, Link } from "react-router-dom";
import { useBooking, useConfirmBookingPayment, useUpdateBooking } from "../../hooks/useCms";

const BookingDetails = () => {
  const { id } = useParams();
  const { data: booking } = useBooking(id);
  const updateBooking = useUpdateBooking();
  const confirmBookingPayment = useConfirmBookingPayment();

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-600",
    confirmed: "bg-blue-100 text-blue-600",
    completed: "bg-green-100 text-green-600",
    cancelled: "bg-red-100 text-red-600",
  };

  // 2. Action Handlers
  const updateStatus = (newStatus) => {
    updateBooking.mutate({ id, status: newStatus });
  };

  const verifyAdvancePayment = () => {
    const suggestedAdvance = booking.advanceAmount || Math.round(Number(booking.amount || 0) * 0.1);
    confirmBookingPayment.mutate({
      bookingId: id,
      paidAmount: suggestedAdvance,
      paymentMethod: booking.paymentMethod || "bank_transfer",
      transactionReference: booking.transactionReference || `admin_verify_${Date.now()}`,
    });
  };

  if (!booking) return <div className="p-6 text-slate-500">Loading booking...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Booking # {booking.bookingCode}
        </h1>
        <span
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${statusColor[booking.status]}`}
        >
          {booking.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">Customer Info</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p>
              <span className="text-gray-500">Name:</span> {booking.customer}
            </p>
            <p>
              <span className="text-gray-500">Email:</span> {booking.email}
            </p>
            <p>
              <span className="text-gray-500">Phone:</span> {booking.phone}
            </p>
          </div>
        </div>

        {/* Tour Details */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">Tour Details</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p>
              <span className="text-gray-500">Tour:</span> {booking.tour}
            </p>
            <p>
              <span className="text-gray-500">Date:</span> {booking.date ? new Date(booking.date).toLocaleDateString() : "-"}
            </p>
            <p>
              <span className="text-gray-500">Payment:</span>
              <span className="ml-2 text-green-600 font-medium">
                {booking.payment}
              </span>
            </p>
            <p>
              <span className="text-gray-500">Method:</span> {booking.paymentMethod || "-"}
            </p>
            <p>
              <span className="text-gray-500">Verified:</span> {booking.paymentVerified ? "Yes" : "No"}
            </p>
            <p>
              <span className="text-gray-500">Advance:</span> {booking.currency} {booking.advanceAmount || 0}
            </p>
            <p>
              <span className="text-gray-500">Paid:</span> {booking.currency} {booking.paidAmount || 0}
            </p>
            <p>
              <span className="text-gray-500">Remaining:</span> {booking.currency} {booking.remainingAmount || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">Identity</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p>
              <span className="text-gray-500">Traveler Type:</span> {booking.identity?.travelerType || "-"}
            </p>
            <p>
              <span className="text-gray-500">Local ID:</span> {booking.identity?.local?.type || "-"} {booking.identity?.local?.value || ""}
            </p>
            <p>
              <span className="text-gray-500">Country:</span> {booking.identity?.international?.country || "-"}
            </p>
            <p>
              <span className="text-gray-500">Passport:</span> {booking.identity?.international?.passportNumber || "-"}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">Facilities & Add-ons</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p>
              <span className="text-gray-500">Hotel:</span> {booking.facilities?.hotelType || "-"}
            </p>
            <p>
              <span className="text-gray-500">Meals:</span> {booking.facilities?.meals || "-"}
            </p>
            <p>
              <span className="text-gray-500">Vehicle:</span> {booking.facilities?.vehicleType || "-"}
            </p>
            <p>
              <span className="text-gray-500">Add-ons:</span> {booking.facilities?.addOns?.length ? booking.facilities.addOns.join(", ") : "None"}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-6 border-t">
        {booking.status === "pending" && (
          <button
            onClick={() => updateStatus("confirmed")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
          >
            Confirm Booking
          </button>
        )}

        {booking.status !== "cancelled" && (
          <button
            onClick={() => updateStatus("cancelled")}
            className="border border-red-200 text-red-600 px-6 py-2 rounded-lg font-medium hover:bg-red-50 transition"
          >
            Cancel Booking
          </button>
        )}

        {!booking.paymentVerified && booking.paymentMethod !== "pay_on_arrival" && (
          <button
            onClick={verifyAdvancePayment}
            className="border border-emerald-200 text-emerald-700 px-6 py-2 rounded-lg font-medium hover:bg-emerald-50 transition"
          >
            Verify Advance Payment
          </button>
        )}

        <Link
          to="/admin/bookings"
          className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition ml-auto"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default BookingDetails;
