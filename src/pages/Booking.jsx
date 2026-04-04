import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useCreateJazzCashSession,
  useCreatePaymentIntent,
  useCreatePublicBooking,
  usePublicBookingQuote,
  usePublicTours,
  useSettings,
  useVerifyPaymentIntent,
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
import {
  ensurePaymentConfig,
  getPaymentMethodMeta,
  getReceivingAccountByKey,
} from "../components/booking/paymentConfig";
import { useToast } from "../context/ToastContext";
import { stripePublishableKey } from "../lib/stripe";

const EMPTY_CARD_INTENT = {
  requestKey: "",
  clientSecret: "",
  paymentIntentId: "",
  amount: 0,
  currency: "",
  error: "",
  status: "idle",
};

const submitHostedPaymentForm = ({ actionUrl, fields }) => {
  if (typeof document === "undefined" || !actionUrl || !fields) return;

  const form = document.createElement("form");
  form.method = "POST";
  form.action = actionUrl;
  form.style.display = "none";

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = String(value ?? "");
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

const Booking = () => {
  const { tourId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: tours = [] } = usePublicTours();
  const { data: settings } = useSettings(true);
  const quoteBooking = usePublicBookingQuote();
  const createBooking = useCreatePublicBooking();
  const createJazzCashSession = useCreateJazzCashSession();
  const createPaymentIntent = useCreatePaymentIntent();
  const verifyPaymentIntent = useVerifyPaymentIntent();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [step, setStep] = useState(1);
  const [activeSection, setActiveSection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [quoteData, setQuoteData] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const [cardIntent, setCardIntent] = useState(EMPTY_CARD_INTENT);
  const [confirmedCardPayment, setConfirmedCardPayment] = useState(null);

  const isCustomBooking = location.pathname.startsWith("/custom-booking") || location.state?.bookingType === "custom";
  const isStandardBooking = !isCustomBooking;
  const hasLockedTour = Boolean(tourId);
  const bookingType = isCustomBooking ? "custom" : "standard";
  const action = location.state?.action || "book";

  const paymentConfig = useMemo(() => ensurePaymentConfig(settings || {}), [settings]);
  const paymentMethods = useMemo(
    () => paymentConfig.methods.filter((item) => item.active !== false && item.mode !== "card"),
    [paymentConfig.methods],
  );
  const paymentAccounts = paymentConfig.accounts;
  const selectedPaymentMethod = useMemo(
    () => paymentMethods.find((item) => item.key === form.paymentMethod) || paymentMethods[0] || {
      key: form.paymentMethod,
      label: getPaymentMethodMeta(form.paymentMethod).label,
      mode: getPaymentMethodMeta(form.paymentMethod).mode,
      supportsPlan: getPaymentMethodMeta(form.paymentMethod).supportsPlan,
      referenceLabel: getPaymentMethodMeta(form.paymentMethod).defaultReferenceLabel,
      accountKey: "",
      instructions: "",
    },
    [paymentMethods, form.paymentMethod],
  );
  const selectedReceivingAccount = useMemo(
    () => getReceivingAccountByKey(paymentAccounts, selectedPaymentMethod?.accountKey),
    [paymentAccounts, selectedPaymentMethod],
  );
  const isCardPayment = selectedPaymentMethod?.mode === "card";
  const isManualPayment = selectedPaymentMethod?.mode === "manual";
  const isPayOnArrival = selectedPaymentMethod?.mode === "arrival";

  useEffect(() => {
    if (!paymentMethods.length) return;
    if (!paymentMethods.some((item) => item.key === form.paymentMethod)) {
      setForm((prev) => ({ ...prev, paymentMethod: paymentMethods[0].key, transactionReference: "" }));
    }
  }, [paymentMethods, form.paymentMethod]);

  useEffect(() => {
    if (!selectedPaymentMethod?.supportsPlan && form.paymentPlan !== "advance_10") {
      setForm((prev) => ({ ...prev, paymentPlan: "advance_10" }));
    }
  }, [selectedPaymentMethod, form.paymentPlan]);

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
    () => settings?.bookingPricing?.hotelCategories?.filter((x) => x.active !== false) || FALLBACK_HOTELS,
    [settings],
  );

  const vehicleOptions = useMemo(
    () => settings?.bookingPricing?.vehicleTypes?.filter((x) => x.active !== false) || FALLBACK_VEHICLES,
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

  const paymentCurrency = selectedTour?.currency || settings?.currency || "USD";
  const cardChargeAmount = useMemo(() => {
    if (!quoteData || !isCardPayment) return 0;
    return Number(quoteData.advanceAmount || 0);
  }, [quoteData, isCardPayment]);
  const cardIntentKey = useMemo(() => {
    if (!quoteData || !isCardPayment) return "";
    return [form.paymentMethod, form.paymentPlan, paymentCurrency, cardChargeAmount].join(":");
  }, [quoteData, isCardPayment, form.paymentMethod, form.paymentPlan, paymentCurrency, cardChargeAmount]);

  useEffect(() => {
    setConfirmedCardPayment(null);
    setCardIntent(EMPTY_CARD_INTENT);
  }, [cardIntentKey]);

  useEffect(() => {
    if (!isCardPayment || !quoteData || step !== 2) return;

    if (!stripePublishableKey) {
      setCardIntent({
        ...EMPTY_CARD_INTENT,
        requestKey: cardIntentKey,
        amount: cardChargeAmount,
        currency: paymentCurrency,
        error: "Card payments are not configured yet. Add VITE_STRIPE_PUBLISHABLE_KEY on the frontend and Stripe keys on the server.",
        status: "error",
      });
      return;
    }

    if (!cardChargeAmount) {
      setCardIntent({
        ...EMPTY_CARD_INTENT,
        requestKey: cardIntentKey,
        amount: 0,
        currency: paymentCurrency,
        error: "Card amount must be greater than zero.",
        status: "error",
      });
      return;
    }

    if (cardIntent.requestKey === cardIntentKey && ["loading", "ready"].includes(cardIntent.status)) {
      return;
    }

    let ignore = false;

    const prepareIntent = async () => {
      setCardIntent({
        ...EMPTY_CARD_INTENT,
        requestKey: cardIntentKey,
        amount: cardChargeAmount,
        currency: paymentCurrency,
        status: "loading",
      });

      try {
        const result = await createPaymentIntent.mutateAsync({
          amount: cardChargeAmount,
          currency: paymentCurrency,
          method: form.paymentMethod,
          customerName: form.customerName,
          email: form.email,
          phone: form.phone,
          paymentPlan: form.paymentPlan,
          bookingType,
          tourId: selectedTour?.id,
          tourTitle: selectedTour?.title,
        });

        if (ignore) return;

        setCardIntent({
          requestKey: cardIntentKey,
          clientSecret: result.clientSecret || "",
          paymentIntentId: result.paymentIntentId || "",
          amount: Number(result.amount || cardChargeAmount),
          currency: result.currency || paymentCurrency,
          error: result.clientSecret ? "" : "Secure payment session could not be prepared.",
          status: result.clientSecret ? "ready" : "error",
        });
      } catch (error) {
        if (ignore) return;
        setCardIntent({
          ...EMPTY_CARD_INTENT,
          requestKey: cardIntentKey,
          amount: cardChargeAmount,
          currency: paymentCurrency,
          error: error?.response?.data?.message || error?.message || "Unable to prepare secure card payment.",
          status: "error",
        });
      }
    };

    prepareIntent();

    return () => {
      ignore = true;
    };
  }, [
    isCardPayment,
    quoteData,
    step,
    cardIntent.requestKey,
    cardIntent.status,
    cardIntentKey,
    cardChargeAmount,
    paymentCurrency,
    createPaymentIntent,
    form.paymentMethod,
    form.customerName,
    form.email,
    form.phone,
    form.paymentPlan,
    bookingType,
    selectedTour?.id,
    selectedTour?.title,
  ]);

  const buildBookingPayload = (paymentOverrides = {}) => ({
    ...form,
    paymentMethod: form.paymentMethod,
    bookingType,
    isCustomTour: bookingType === "custom",
    paymentVerified: isPayOnArrival || Boolean(paymentOverrides.paymentVerified),
    paymentIntentId: paymentOverrides.paymentIntentId || "",
    transactionReference: paymentOverrides.transactionReference ?? form.transactionReference,
    manualPayment: isManualPayment
      ? {
          senderName: form.manualSenderName.trim(),
          senderNumber: form.manualSenderNumber.trim(),
          sentAmount: Number(form.manualSentAmount || 0),
          sentAt: form.manualSentAt || "",
        }
      : {
          senderName: "",
          senderNumber: "",
          sentAmount: 0,
          sentAt: "",
        },
    notes: [form.notes, selectedPaymentMethod?.instructions].filter(Boolean).join(" "),
    facilities: {
      ...form.facilities,
      hotelType: form.facilities.hotelEnabled ? form.facilities.hotelType : "no_hotel",
    },
  });

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
    if (isManualPayment && !selectedReceivingAccount) return "No receiving account is configured for this payment method.";
    if (isManualPayment && !form.manualSenderName.trim()) return "Please enter the sender name for manual payment.";
    if (isManualPayment && !(Number(form.manualSentAmount || 0) > 0)) return "Please enter the amount sent for manual payment.";
    if (isManualPayment && !form.transactionReference.trim()) return "Please enter the payment reference for manual payment.";
    return "";
  };

  const isTravelerSectionValid = useMemo(
    () => {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
      const phoneDigits = form.phone.replace(/\D/g, "");
      const phoneValid = phoneDigits.length >= 10;
      const identityValid = form.travelerType === "local"
        ? Boolean(form.localIdType && form.localIdNumber.trim())
        : Boolean(form.country.trim() && form.passportNumber.trim());

      return Boolean(
        form.customerName.trim() &&
        emailValid &&
        phoneValid &&
        form.tourId &&
        identityValid,
      );
    },
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
    const endDateValid = !form.travelDate || !form.endDate || form.endDate >= form.travelDate;
    const guestValid = Number(form.adults) >= 1;
    const vehicleValid = Boolean(form.facilities.vehicleType);
    const hotelValid = !form.facilities.hotelEnabled || Boolean(form.facilities.hotelType);
    return dateValid && endDateValid && guestValid && vehicleValid && hotelValid;
  }, [form.flexibleDates, form.travelDate, form.endDate, form.adults, form.facilities.vehicleType, form.facilities.hotelEnabled, form.facilities.hotelType]);

  const isPreferencesSectionValid = useMemo(() => {
    if (!selectedPaymentMethod) return false;
    if (isManualPayment) {
      return Boolean(
        selectedReceivingAccount &&
        form.transactionReference.trim() &&
        form.manualSenderName.trim() &&
        Number(form.manualSentAmount || 0) > 0,
      );
    }
    if (isCardPayment || isPayOnArrival) {
      return true;
    }
    return Boolean(form.paymentMethod);
  }, [
    selectedPaymentMethod,
    selectedReceivingAccount,
    isManualPayment,
    isCardPayment,
    isPayOnArrival,
    form.transactionReference,
    form.manualSenderName,
    form.manualSentAmount,
    form.paymentMethod,
  ]);

  const openBookingSection = (nextSection) => {
    if (nextSection === 2 && !isTravelerSectionValid) {
      toast.info("Complete guest details", "Fill all required guest details correctly before moving to travel.");
      return;
    }

    if (nextSection === 3 && (!isTravelerSectionValid || !isTravelSectionValid)) {
      toast.info("Complete travel details", "Finish the previous section before opening payment.");
      return;
    }

    setActiveSection(nextSection);
  };

  const requestQuote = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error("Validation failed", validationError);
      return;
    }

    setConfirmedCardPayment(null);
    setCardIntent(EMPTY_CARD_INTENT);

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

      if (isCardPayment) {
        const booking = await createBooking.mutateAsync(buildBookingPayload({ paymentVerified: false }));
        const session = await createJazzCashSession.mutateAsync({ bookingId: booking.id });

        if (!session?.actionUrl || !session?.fields) {
          throw new Error("JazzCash session could not be prepared.");
        }

        submitHostedPaymentForm(session);
        return;
      }

      setStep(2);
    } catch (error) {
      toast.error("Quote failed", error?.response?.data?.message || "Could not calculate quote.");
    }
  };

  const canConfirmBooking = useMemo(() => Boolean(quoteData), [quoteData]);

  const finishBookingSubmission = async (paymentOverrides = {}) => {
    const booking = await createBooking.mutateAsync(buildBookingPayload(paymentOverrides));
    setBookingResult(booking);
    setStep(3);
    toast.success("Booking confirmed", "Confirmation workflow has been triggered.");
  };

  const submitBooking = async (existingPayment = confirmedCardPayment) => {
    if (!quoteData) {
      toast.error("Quote missing", "Please calculate quote first.");
      return;
    }

    setSubmitting(true);
    try {
      if (isCardPayment) {
        if (!existingPayment?.paymentIntentId) {
          toast.error("Payment required", "Complete the card payment first to submit this booking.");
          return;
        }

        await finishBookingSubmission({
          paymentVerified: true,
          paymentIntentId: existingPayment.paymentIntentId,
          transactionReference: existingPayment.transactionReference || existingPayment.paymentIntentId,
        });
        return;
      }

      await finishBookingSubmission({
        paymentVerified: isPayOnArrival,
      });
    } catch (error) {
      toast.error("Booking failed", error?.response?.data?.message || error?.message || "Unable to confirm booking.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardPaymentConfirmed = async ({ paymentIntentId, transactionReference }) => {
    setSubmitting(true);

    try {
      const verification = await verifyPaymentIntent.mutateAsync({
        paymentIntentId,
        method: form.paymentMethod,
        transactionReference,
      });

      if (!verification?.verified) {
        throw new Error("Card payment is not marked as succeeded yet. Please try again in a moment.");
      }

      const paymentRecord = {
        requestKey: cardIntentKey,
        paymentIntentId,
        transactionReference: verification.transactionReference || transactionReference || paymentIntentId,
      };

      setConfirmedCardPayment(paymentRecord);

      try {
        await finishBookingSubmission({
          paymentVerified: true,
          paymentIntentId: paymentRecord.paymentIntentId,
          transactionReference: paymentRecord.transactionReference,
        });
      } catch (_bookingError) {
        toast.error(
          "Booking submit failed",
          "Payment was confirmed. You can press Submit Paid Booking to finish without charging the card again.",
        );
      }
    } catch (error) {
      toast.error("Payment failed", error?.response?.data?.message || error?.message || "Card payment could not be verified.");
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-theme-bg py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ql-form-shell booking-form-shell [&_.ql-label]:text-[10px] [&_.ql-label]:tracking-[0.12em] [&_.ql-input]:text-[13px] [&_.ql-input]:py-2 [&_.ql-input]:px-3 [&_.ql-textarea]:text-[13px] [&_.ql-textarea]:px-3 [&_.ql-textarea]:py-2 [&_.ql-btn-primary]:text-[13px] [&_.ql-btn-secondary]:text-[13px]">
          <BookingHeader isCustomBooking={isCustomBooking} action={action} />

          {step === 1 ? (
            <div className="p-3.5 sm:p-4.5 md:p-5">
              <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-4 md:gap-5 xl:gap-6 items-start">
                <div className="space-y-4">
                  {isStandardBooking ? <BookingTourSummary selectedTour={selectedTour} /> : null}

                  <BookingStepTabs
                    activeSection={activeSection}
                    isTravelerSectionValid={isTravelerSectionValid}
                    isTravelSectionValid={isTravelSectionValid}
                    onStepChange={openBookingSection}
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
                      onNext={() => openBookingSection(2)}
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
                      onNext={() => openBookingSection(3)}
                    />
                  ) : null}

                  {activeSection === 3 ? (
                    <BookingPreferencesSection
                      bookingType={bookingType}
                      form={form}
                      setForm={setForm}
                      paymentMethods={paymentMethods}
                      selectedPaymentMethod={selectedPaymentMethod}
                      selectedReceivingAccount={selectedReceivingAccount}
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
              selectedPaymentMethod={selectedPaymentMethod}
              selectedReceivingAccount={selectedReceivingAccount}
              paymentMethodLabel={selectedPaymentMethod?.label || "Payment"}
              transactionReferenceLabel={selectedPaymentMethod?.referenceLabel || "Transaction Reference"}
              isCardPayment={isCardPayment}
              submitting={submitting}
              canConfirmBooking={canConfirmBooking}
              cardAmountLabel={`${paymentCurrency} ${cardChargeAmount}`}
              cardClientSecret={cardIntent.clientSecret}
              cardIntentLoading={cardIntent.status === "loading"}
              cardIntentError={cardIntent.error}
              cardPaymentReady={Boolean((stripePublishableKey && cardIntent.clientSecret) || confirmedCardPayment)}
              confirmedCardPayment={confirmedCardPayment}
              onBack={() => setStep(1)}
              onSubmit={() => submitBooking()}
              onCardPaymentConfirmed={handleCardPaymentConfirmed}
              onSubmitPaidBooking={submitBooking}
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
                  paymentMethod: paymentMethods[0]?.key || DEFAULT_FORM.paymentMethod,
                });
                setQuoteData(null);
                setBookingResult(null);
                setCardIntent(EMPTY_CARD_INTENT);
                setConfirmedCardPayment(null);
              }}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Booking;







