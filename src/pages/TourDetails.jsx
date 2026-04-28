import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { usePublicTour, usePublicTours, useSettings } from "../hooks/useCms";
import {
  MobileBookingBar,
  TourBookingCard,
  TourDetailsActions,
  TourDetailsBreadcrumbs,
  TourDetailsHeader,
  TourImageGallery,
} from "../components/tour-details/TourDetailsSections";
import {
  FaqSection,
  InclusionsSection,
  ItinerarySection,
  OverviewSection,
  RouteSection,
} from "../components/tour-details/TourDetailsContentSections";
import {
  RelatedToursSection,
  ReviewsSection,
} from "../components/tour-details/TourDetailsFooterSections";
import {
  buildCommonTourFacts,
  buildDetailedDescription,
  buildDisplayItinerary,
  buildIncludedServices,
  buildPackageOverview,
  buildPlacesCovered,
  buildTourReviews,
  buildVehicleDetails,
  fallbackFaq,
  getTourHeroImages,
  getTourPlaceName,
  getTourPlacesLabel,
  getTourPlanLabel,
} from "../components/tour-details/tourDetailsData";

const MAX_RELATED_TOURS = 4;
const MAX_ITINERARY_DAYS = 10;

const FALLBACK_HIGHLIGHTS = [
  "Scenic routes",
  "Comfort stays",
  "Local support",
  "Flexible pacing",
];

const DEFAULT_BEST_FOR = ["Families", "Couples", "Groups", "Private tours"];

const getRatingValue = (tour, reviews) => {
  if (reviews.length) {
    const totalRating = reviews.reduce(
      (sum, item) => sum + Number(item.rating || 0),
      0,
    );

    return Number((totalRating / reviews.length).toFixed(1));
  }

  const tourRating = Number(tour?.rating);
  return Number.isFinite(tourRating) && tourRating > 0 ? tourRating : 4.8;
};

const buildBeforeYouBookNotes = (transportNote, durationText, planLabel) => {
  const noteParts = String(transportNote || "")
    .split(".")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 2);

  return Array.from(
    new Set([
      ...noteParts,
      `Trip duration: ${durationText}.`,
      `Plan type: ${planLabel}.`,
      "Final route flow and operational details are reconfirmed before departure.",
    ]),
  ).slice(0, 4);
};

const TourDetails = () => {
  const { slug } = useParams();

  const { data: directTour } = usePublicTour(slug);
  const { data: tours = [] } = usePublicTours();
  const { data: settings = {} } = useSettings(true);

  const [openFaq, setOpenFaq] = useState(0);
  const [openItineraryDay, setOpenItineraryDay] = useState(0);

  const tour = useMemo(() => {
    if (directTour) return directTour;
    return tours.find((item) => item.slug === slug || item.id === slug);
  }, [directTour, tours, slug]);

  const relatedTours = useMemo(() => {
    if (!tour) return [];

    return tours
      .filter((item) => item.id !== tour.id && item.slug !== tour.slug)
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
      .slice(0, MAX_RELATED_TOURS);
  }, [tours, tour]);

  const tourData = useMemo(() => {
    if (!tour) return null;

    const displayItinerary = buildDisplayItinerary(tour).slice(
      0,
      MAX_ITINERARY_DAYS,
    );
    const reviews = buildTourReviews(tour);
    const ratingValue = getRatingValue(tour, reviews);
    const reviewCount = reviews.length || Number(tour.reviews || 0);
    const includedServices = buildIncludedServices(tour);
    const vehicleDetails = buildVehicleDetails(tour);
    const planLabel = getTourPlanLabel(tour);
    const placesLabel = getTourPlacesLabel(tour, displayItinerary);
    const commonFacts = buildCommonTourFacts(settings);
    const durationText = tour.durationLabel || `${tour.durationDays || 0} Days`;

    return {
      heroImages: getTourHeroImages(tour),
      displayItinerary,
      reviews,
      ratingValue,
      reviewCount,
      includedServices,
      vehicleDetails,
      planLabel,
      placesLabel,
      commonFacts,
      durationText,
      packageOverview: buildPackageOverview(tour),
      placesCovered: buildPlacesCovered(tour, displayItinerary),
      placeName: getTourPlaceName(tour),
      detailedDescription: buildDetailedDescription(tour),
      highlights: tour.tags?.length ? tour.tags : FALLBACK_HIGHLIGHTS,
      bestFor: DEFAULT_BEST_FOR,
      beforeYouBook: buildBeforeYouBookNotes(
        commonFacts.transportNote,
        durationText,
        planLabel,
      ),
    };
  }, [tour, settings]);

  if (!tour || !tourData) {
    return (
      <section className="bg-theme-bg py-12">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed border-theme bg-theme-surface py-16 text-center text-muted">
            Tour not found or not published.
          </div>
        </div>
      </section>
    );
  }

  const {
    heroImages,
    displayItinerary,
    reviews,
    ratingValue,
    reviewCount,
    includedServices,
    vehicleDetails,
    planLabel,
    placesLabel,
    commonFacts,
    durationText,
    packageOverview,
    placesCovered,
    placeName,
    detailedDescription,
    highlights,
    bestFor,
    beforeYouBook,
  } = tourData;

  return (
    <section className="bg-theme-bg pb-28 pt-8 md:pb-12 md:pt-10">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <TourDetailsBreadcrumbs tour={tour} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <section className="w-full">
            <div className="space-y-6">
              <TourDetailsHeader
                tour={tour}
                ratingValue={ratingValue}
                reviewCount={reviewCount}
                placesLabel={placesLabel}
                planLabel={planLabel}
                vehicleDetails={vehicleDetails}
              />

              <div className="lg:hidden">
                <TourDetailsActions tour={tour} />
              </div>

              <TourImageGallery images={heroImages} title={tour.title} />
            </div>
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TourBookingCard
                tour={tour}
                ratingValue={ratingValue}
                reviewCount={reviewCount}
                planLabel={planLabel}
                durationText={durationText}
              />
            </div>
          </aside>
        </div>

        <div className="mt-10 w-full divide-y divide-[rgba(15,23,42,0.08)]">
          <OverviewSection
            description={detailedDescription}
            highlights={highlights}
            bestFor={bestFor}
            packageOverview={packageOverview}
          />

          <InclusionsSection
            includedServices={includedServices}
            beforeYouBook={beforeYouBook}
          />

          <ItinerarySection
            items={displayItinerary}
            openIndex={openItineraryDay}
            onToggle={(index) =>
              setOpenItineraryDay((current) => (current === index ? -1 : index))
            }
          />

          <RouteSection
            placeName={placeName}
            placesCovered={placesCovered}
            placesLabel={placesLabel}
            planLabel={planLabel}
            vehicleDetails={vehicleDetails}
          />

          <ReviewsSection
            ratingValue={ratingValue}
            reviewCount={reviewCount}
            reviews={reviews}
          />

          <FaqSection
            items={fallbackFaq}
            openIndex={openFaq}
            onToggle={(index) =>
              setOpenFaq((current) => (current === index ? -1 : index))
            }
          />

          <RelatedToursSection tours={relatedTours} />
        </div>
      </div>

      <MobileBookingBar tour={tour} />
    </section>
  );
};

export default TourDetails;