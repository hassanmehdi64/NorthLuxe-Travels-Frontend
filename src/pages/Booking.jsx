import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useCreatePublicBooking,
  usePublicBookingQuote,
  usePublicTours,
  useSettings,
} from "../hooks/useCms";
import BookingHeader from "../components/booking/BookingHeader";
import BookingPreferencesSection from "../components/booking/BookingPreferencesSection";
import BookingReviewStep from "../components/booking/BookingReviewStep";
import BookingSidebar from "../components/booking/BookingSidebar";
import BookingStepTabs from "../components/booking/BookingStepTabs";
import BookingSuccessStep from "../components/booking/BookingSuccessStep";
import BookingTourSummary from "../components/booking/BookingTourSummary";
import BookingTravelerSection from "../components/booking/BookingTravelerSection";
import BookingTravelSection from "../components/booking/BookingTravelSection";
import {
  DEFAULT_FORM,
  FALLBACK_HOTELS,
  FALLBACK_VEHICLES,
} from "../components/booking/bookingConstants";
import { useToast } from "../context/ToastContext";

const Booking = () => {
  const { tourId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: tours = [] } = usePublicTours();
  const { data: settings } = useSettings(true);
  const quoteBooking = usePublicBookingQuote();
  const createBooking = useCreatePublicBooking();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [step, setStep] = useState(1);
  const [activeSection, setActiveSection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [quoteData, setQuoteData] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);

  const isCustomBooking = location.pathname.startsWith("/custom-booking") || location.state?.bookingType === "custom";
  const isStandardBooking = !isCustomBooking;
  const hasLockedTour = Boolean(tourId);
  const bookingType = isCustomBooking ? "custom" : "standard";
  const action = location.state?.action || "book";
  const paymentVerified = form.paymentMethod === "pay_on_arrival";

  useEffect(() => {
    if (!tours.length) return;
    if (hasLockedTour) {
      const selected = tours.find((tour) => tour.id === tourId);
      if (!selected) {
        toast.error("Tour unavailable", "Selected tour could not be loaded.");
        navigate("/tours");
        return;
      }
      setForm((prev) => ({ ...prev, tourId: selected.id }));
    } else {
      setForm((prev) => ({ ...prev, tourId: prev.tourId || tours[0].id }));
    }
  }, [tours, tourId, hasLockedTour, toast, navigate]);

  useEffect(() => {
    const prefill = location.state?.prefill;
    if (!prefill) return;
    setForm((prev) => ({
      ...prev,
      customerName: prefill.customerName || prev.customerName,
      email: prefill.email || prev.email,
      phone: prefill.phone || prev.phone,
      travelDate: prefill.travelDate || prev.travelDate,
      adults: Number(prefill.adults || prev.adults || 1),
      specialRequirements: prefill.specialRequirements || prev.specialRequirements,
    }));
  }, [location.state]);

  const selectedTour = useMemo(
    () => tours.find((tour) => tour.id === form.tourId),
    [tours, form.tourId],
  );
  const popularPlans = useMemo(
    () =>
      [...tours]
        .sort((a, b) => {
          const scoreA = Number(Boolean(a.featured)) * 2 + Number(a.availableSeats || 0);
          const scoreB = Number(Boolean(b.featured)) * 2 + Number(b.availableSeats || 0);
          return scoreB - scoreA;
        })
        .slice(0, 3),
    [tours],
  );

  const hotelOptions = useMemo(
    () =>
      settings?.bookingPricing?.hotelCategories?.filter((x) => x.active !== false) || FALLBACK_HOTELS,
    [settings],
  );
  const vehicleOptions = useMemo(
    () =>
      settings?.bookingPricing?.vehicleTypes?.filter((x) => x.active !== false) || FALLBACK_VEHICLES,
    [settings],
  );

  const visibleHotelOptions = useMemo(() => {
    if (!hasLockedTour || !selectedTour?.availableOptions?.hotelCategories?.length) {
      return hotelOptions;
    }
    const allowed = new Set(selectedTour.availableOptions.hotelCategories);
    return hotelOptions.filter((option) => option.key === "no_hotel" || allowed.has(option.key));
  }, [hasLockedTour, selectedTour, hotelOptions]);

  const visibleVehicleOptions = useMemo(() => {
    if (!hasLockedTour || !selectedTour?.availableOptions?.vehicleTypes?.length) {
      return vehicleOptions;
    }
    const allowed = new Set(selectedTour.availableOptions.vehicleTypes);
    return vehicleOptions.filter((option) => allowed.has(option.key));
  }, [hasLockedTour, selectedTour, vehicleOptions]);

  useEffect(() => {
    if (!form.facilities.vehicleType && visibleVehicleOptions.length) {
      setForm((prev) => ({
        ...prev,
        facilities: { ...prev.facilities, vehicleType: visibleVehicleOptions[0].key },
      }));
    }
  }, [visibleVehicleOptions, form.facilities.vehicleType]);

  const validateForm = () => {
    if (!form.customerName.trim()) return "Full name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!form.tourId) return "Please select a tour.";
    if (!form.flexibleDates && !form.travelDate) return "Please provide a travel date.";
    if (form.travelDate && form.endDate && form.endDate < form.travelDate) return "End date cannot be before travel date.";
    if (Number(form.adults) < 1) return "At least one adult is required.";
    if (form.travelerType === "local" && !form.localIdNumber.trim()) return "CNIC/Passport is required.";
    if (form.travelerType === "international" && (!form.country.trim() || !form.passportNumber.trim())) {
      return "Country and passport number are required.";
    }
    if (!form.facilities.vehicleType) return "Please select a vehicle type.";
    return "";
  };

  const isTravelerSectionValid = useMemo(
    () =>
      Boolean(
        form.customerName.trim() &&
        form.email.trim() &&
        form.phone.trim() &&
        form.tourId &&
        (form.travelerType === "local"
          ? form.localIdNumber.trim()
          : form.country.trim() && form.passportNumber.trim()),
      ),
    [
      form.customerName,
      form.email,
      form.phone,
      form.tourId,
      form.travelerType,
      form.localIdNumber,
      form.country,
      form.passportNumber,
    ],
  );

  const isTravelSectionValid = useMemo(() => {
    const dateValid = form.flexibleDates || Boolean(form.travelDate);
    const endDateValid =
      !form.travelDate || !form.endDate || form.endDate >= form.travelDate;
    const guestValid = Number(form.adults) >= 1;
    return dateValid && endDateValid && guestValid;
  }, [form.flexibleDates, form.travelDate, form.endDate, form.adults]);

  const isPreferencesSectionValid = useMemo(
    () => Boolean(form.facilities.vehicleType),
    [form.facilities.vehicleType],
  );

  const requestQuote = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error("Validation failed", validationError);
      return;
    }

    try {
      const payload = {
        ...form,
        facilities: {
          ...form.facilities,
          hotelType: form.facilities.hotelEnabled ? form.facilities.hotelType : "no_hotel",
        },
      };
      const response = await quoteBooking.mutateAsync(payload);
      setQuoteData(response.quote);
      setStep(2);
    } catch (error) {
      toast.error("Quote failed", error?.response?.data?.message || "Could not calculate quote.");
    }
  };

  const canConfirmBooking = useMemo(() => Boolean(quoteData), [quoteData]);

  const submitBooking = async () => {
    if (!quoteData) {
      toast.error("Quote missing", "Please calculate quote first.");
      return;
    }
    setSubmitting(true);
    try {
      const isCardRequest = form.paymentMethod === "visa_card";
      const payload = {
        ...form,
        paymentMethod: isCardRequest ? "card_request" : form.paymentMethod,
        bookingType,
        isCustomTour: bookingType === "custom",
        paymentVerified: isCardRequest ? false : form.paymentMethod === "pay_on_arrival",
        notes: isCardRequest
          ? [form.notes, "Customer requested a secure card payment link after booking review."]
              .filter(Boolean)
              .join(" ")
          : form.notes,
        facilities: {
          ...form.facilities,
          hotelType: form.facilities.hotelEnabled ? form.facilities.hotelType : "no_hotel",
        },
      };

      const booking = await createBooking.mutateAsync(payload);
      setBookingResult(booking);
      setStep(3);
      toast.success("Booking confirmed", "Confirmation workflow has been triggered.");
    } catch (error) {
      toast.error("Booking failed", error?.response?.data?.message || "Unable to confirm booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-theme-bg py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ql-form-shell booking-form-shell [&_.ql-label]:text-[10px] [&_.ql-label]:tracking-[0.12em] [&_.ql-input]:text-[13px] [&_.ql-input]:py-2.5 [&_.ql-input]:px-3 [&_.ql-textarea]:text-[13px] [&_.ql-textarea]:px-3 [&_.ql-textarea]:py-2.5 [&_.ql-btn-primary]:text-[13px] [&_.ql-btn-secondary]:text-[13px]">
          <BookingHeader
            isCustomBooking={isCustomBooking}
            action={action}
          />

          {step === 1 ? (
            <div className="p-4 sm:p-5 md:p-6">
              <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-4 md:gap-5 xl:gap-6 items-start">
                <div className="space-y-5">
                  {isStandardBooking ? (
                    <BookingTourSummary selectedTour={selectedTour} />
                  ) : null}

                  <BookingStepTabs
                    activeSection={activeSection}
                    isTravelerSectionValid={isTravelerSectionValid}
                    isTravelSectionValid={isTravelSectionValid}
                    onStepChange={setActiveSection}
                    onBlockedStep={() =>
                      toast.info(
                        "Complete previous section",
                        "Please fill previous section first.",
                      )
                    }
                  />

                  {activeSection === 1 ? (
                    <BookingTravelerSection
                      form={form}
                      setForm={setForm}
                      hasLockedTour={hasLockedTour}
                      isCustomBooking={isCustomBooking}
                      tours={tours}
                      isTravelerSectionValid={isTravelerSectionValid}
                      onNext={() => setActiveSection(2)}
                    />
                  ) : null}

                  {activeSection === 2 ? (
                    <BookingTravelSection
                      form={form}
                      setForm={setForm}
                      visibleHotelOptions={visibleHotelOptions}
                      visibleVehicleOptions={visibleVehicleOptions}
                      isTravelSectionValid={isTravelSectionValid}
                      onBack={() => setActiveSection(1)}
                      onNext={() => setActiveSection(3)}
                    />
                  ) : null}

                  {activeSection === 3 ? (
                    <BookingPreferencesSection
                      bookingType={bookingType}
                      form={form}
                      setForm={setForm}
                      isTravelerSectionValid={isTravelerSectionValid}
                      isTravelSectionValid={isTravelSectionValid}
                      isPreferencesSectionValid={isPreferencesSectionValid}
                      onBack={() => setActiveSection(2)}
                      onCancel={() => navigate("/tours")}
                      onContinue={requestQuote}
                    />
                  ) : null}
                </div>

                <BookingSidebar
                  popularPlans={popularPlans}
                  selectedTourId={form.tourId}
                  setForm={setForm}
                />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <BookingReviewStep
              quoteData={quoteData}
              selectedTour={selectedTour}
              form={form}
              setForm={setForm}
              paymentVerified={paymentVerified}
              submitting={submitting}
              canConfirmBooking={canConfirmBooking}
              onBack={() => setStep(1)}
              onSubmit={submitBooking}
            />
          ) : null}

          {step === 3 ? (
            <BookingSuccessStep
              bookingResult={bookingResult}
              onBackToTours={() => navigate("/tours")}
              onReset={() => {
                setStep(1);
                setActiveSection(1);
                setForm({
                  ...DEFAULT_FORM,
                  tourId: isStandardBooking ? tourId : tours[0]?.id || "",
                });
                setQuoteData(null);
                setBookingResult(null);
              }}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Booking;
