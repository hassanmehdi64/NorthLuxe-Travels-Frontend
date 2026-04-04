import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { usePublicTour, usePublicTours } from "../hooks/useCms";
import {
  TourDescriptionAccordion,
  TourDetailsHeader,
  TourDetailsIntro,
} from "../components/tour-details/TourDetailsSections";
import {
  FaqSection,
  ItinerarySection,
  PackageDetailsSection,
  TourBookingSidebar,
} from "../components/tour-details/TourDetailsContentSections";
import {
  RelatedToursSection,
  ReviewsSection,
} from "../components/tour-details/TourDetailsFooterSections";
import {
  buildDetailedDescription,
  buildDisplayItinerary,
  buildIncludedServices,
  buildPackageOverview,
  buildPlacesCovered,
  buildVehicleDetails,
  fallbackFaq,
  fallbackReviews,
  getTourPlaceName,
  getTourPlacesLabel,
  getTourPlanLabel,
} from "../components/tour-details/tourDetailsData";

const TourDetails = () => {
  const { slug } = useParams();
  const { data: directTour } = usePublicTour(slug);
  const { data: tours = [] } = usePublicTours();
  const [openFaq, setOpenFaq] = useState(0);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [openItineraryDay, setOpenItineraryDay] = useState(0);

  const tour = useMemo(() => {
    if (directTour) return directTour;
    return tours.find((item) => item.slug === slug);
  }, [directTour, tours, slug]);

  const relatedTours = useMemo(() => {
    if (!tour) return [];
    return tours
      .filter((item) => item.id !== tour.id)
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
      .slice(0, 4);
  }, [tours, tour]);

  if (!tour) {
    return (
      <section className="py-12 lg:py-14 bg-theme-bg">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="rounded-2xl border border-dashed border-theme bg-theme-surface py-16 text-center text-muted">
            Tour not found or not published.
          </div>
        </div>
      </section>
    );
  }

  const displayItinerary = buildDisplayItinerary(tour).slice(0, 10);
  const highlights = tour.tags?.length
    ? tour.tags
    : ["Scenic routes", "Comfort stays", "Local support", "Flexible pacing"];
  const ratingValue = Number(tour.rating || 4.8);
  const reviewCount = Number(tour.reviews || 24);
  const reviewStats = [5, 4, 3, 2, 1].map((star) => {
    const count = fallbackReviews.filter((item) => Number(item.rating) === star).length;
    const percent = fallbackReviews.length ? (count / fallbackReviews.length) * 100 : 0;
    return { star, count, percent };
  });

  const packageOverview = buildPackageOverview(tour);
  const includedServices = buildIncludedServices(tour);
  const placesCovered = buildPlacesCovered(tour, displayItinerary);
  const vehicleDetails = buildVehicleDetails(tour);
  const placeName = getTourPlaceName(tour);
  const placesLabel = getTourPlacesLabel(tour, displayItinerary);
  const planLabel = getTourPlanLabel(tour);

  const detailedDescription = buildDetailedDescription(tour);

  return (
    <section className="py-10 md:py-12 bg-theme-bg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-6">
        <TourDetailsHeader tour={tour} />

        <div className="rounded-2xl border border-theme bg-theme-surface overflow-hidden">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-[220px] sm:h-[300px] lg:h-[360px] object-cover"
          />
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-4 items-start">
          <div className="space-y-4">
            <TourDetailsIntro shortDescription={tour.shortDescription} highlights={highlights} />
            <TourDescriptionAccordion
              isOpen={isDescriptionOpen}
              onToggle={() => setIsDescriptionOpen((value) => !value)}
              description={detailedDescription}
            />
          </div>

          <TourBookingSidebar
            tour={tour}
            ratingValue={ratingValue}
            reviewCount={reviewCount}
          />
        </div>

        <PackageDetailsSection
          placeName={placeName}
          placesLabel={placesLabel}
          planLabel={planLabel}
          includedServices={includedServices}
          placesCovered={placesCovered}
          packageOverview={packageOverview}
          vehicleDetails={vehicleDetails}
        />

        <ItinerarySection
          items={displayItinerary}
          openIndex={openItineraryDay}
          onToggle={(idx) => setOpenItineraryDay((current) => (current === idx ? -1 : idx))}
        />

        <FaqSection items={fallbackFaq} openIndex={openFaq} onToggle={setOpenFaq} />

        <ReviewsSection
          ratingValue={ratingValue}
          reviewCount={reviewCount}
          reviewStats={reviewStats}
          reviews={fallbackReviews}
        />

        <RelatedToursSection tours={relatedTours} />
      </div>
    </section>
  );
};

export default TourDetails;
