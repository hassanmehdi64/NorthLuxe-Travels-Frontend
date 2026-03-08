import { useNavigate } from "react-router-dom";

const CustomTourBookingButton = ({
  defaultTourId = "",
  label = "Book Now",
  className = "",
  onOpen,
}) => {
  const navigate = useNavigate();
  const action = label.toLowerCase().includes("wait") ? "waitlist" : "book";
  const path = defaultTourId ? `/book/${defaultTourId}` : "/custom-booking";
  const bookingType = defaultTourId ? "standard" : "custom";

  return (
    <button
      type="button"
      onClick={() => {
        navigate(path, { state: { action, bookingType } });
        onOpen?.();
      }}
      className={className}
    >
      {label}
    </button>
  );
};

export default CustomTourBookingButton;
