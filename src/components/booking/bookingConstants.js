export const DEFAULT_FORM = {
  customerName: "",
  email: "",
  phone: "",
  tourId: "",
  travelDate: "",
  endDate: "",
  travelTime: "",
  adults: 2,
  children: 0,
  flexibleDates: false,
  travelerType: "local",
  localIdType: "cnic",
  localIdNumber: "",
  country: "",
  passportNumber: "",
  paymentMethod: "visa_card",
  paymentPlan: "advance_10",
  transactionReference: "",
  manualPaymentSlip: "",
  manualPaymentSlipName: "",
  manualSenderName: "",
  manualSenderNumber: "",
  manualSentAmount: "",
  manualSentAt: "",
  facilities: {
    hotelEnabled: false,
    hotelType: "no_hotel",
    meals: "no",
    vehicleType: "",
    addOns: [],
  },
  customRequirements: "",
  specialRequirements: "",
  notes: "",
};

export const FALLBACK_HOTELS = [
  { key: "no_hotel", label: "No Hotel" },
  { key: "standard", label: "Standard" },
  { key: "3_star", label: "3-Star" },
  { key: "4_star", label: "4-Star" },
];

export const FALLBACK_VEHICLES = [
  { key: "standard_suv", label: "Standard SUV" },
  { key: "premium_suv", label: "Premium SUV" },
];

