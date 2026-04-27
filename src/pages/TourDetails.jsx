import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { usePublicTour, usePublicTours, useSettings } from "../hooks/useCms";
import {
  TourDetailsActions,
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
  buildCommonTourFacts,
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

    const heroImages = getTourHeroImages(tour);
    const highlights = tour.tags?.length ? tour.tags : FALLBACK_HIGHLIGHTS;

    return {
      heroImages,
      highlights,
      displayItinerary,
      reviews,
      ratingValue,
      reviewCount,
      packageOverview: buildPackageOverview(tour),
      includedServices: buildIncludedServices(tour),
      placesCovered: buildPlacesCovered(tour, displayItinerary),
      vehicleDetails: buildVehicleDetails(tour),
      placeName: getTourPlaceName(tour),
      placesLabel: getTourPlacesLabel(tour, displayItinerary),
      planLabel: getTourPlanLabel(tour),
      commonFacts: buildCommonTourFacts(settings),
      detailedDescription: buildDetailedDescription(tour),
    };
  }, [tour, settings]);

  if (!tour || !tourData) {
    return (
      <section className="bg-theme-bg py-12 lg:py-14">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="rounded-2xl border border-dashed border-theme bg-theme-surface py-16 text-center text-muted">
            Tour not found or not published.
          </div>
        </div>
      </section>
    );
  }

  const {
    heroImages,
    highlights,
    displayItinerary,
    reviews,
    ratingValue,
    reviewCount,
    packageOverview,
    includedServices,
    placesCovered,
    vehicleDetails,
    placeName,
    placesLabel,
    planLabel,
    commonFacts,
    detailedDescription,
  } = tourData;

  return (
    <section className="bg-theme-bg py-10 md:py-12">
      <div className="mx-auto max-w-[1600px] space-y-6 px-4 sm:px-6 lg:px-10 xl:px-14">
        <TourDetailsHeader
          tour={tour}
          ratingValue={ratingValue}
          reviewCount={reviewCount}
        />

        {heroImages.length > 0 && (
          <div className="mx-auto max-w-[1240px] overflow-hidden rounded-[1.45rem] border border-[rgba(15,23,42,0.08)] bg-theme-surface shadow-[0_12px_24px_rgba(15,23,42,0.05)]">
            <Swiper
              modules={[Autoplay, Pagination]}
              loop={heroImages.length > 1}
              speed={800}
              spaceBetween={12}
              autoplay={
                heroImages.length > 1
                  ? {
                      delay: 3200,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }
                  : false
              }
              pagination={{ clickable: heroImages.length > 1 }}
              breakpoints={{
                0: { slidesPerView: 1 },
                768: {
                  slidesPerView: Math.min(2, heroImages.length),
                },
              }}
              className="tour-hero-swiper">
              {heroImages.map((image, index) => (
                <SwiperSlide key={`${image}-${index}`}>
                  <div className="relative">
                    <img
                      src={image}
                      alt={`${tour.title || "Tour"} image ${index + 1}`}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-[180px] w-full object-cover object-center sm:h-[235px] lg:h-[285px]"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(8,15,30,0.18)] via-transparent to-transparent" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div className="space-y-4">
          <TourDetailsIntro
            shortDescription={tour.shortDescription}
          />
          <TourDetailsActions tour={tour} />
        </div>

        <PackageDetailsSection
          description={detailedDescription}
          placeName={placeName}
          placesLabel={placesLabel}
          planLabel={planLabel}
          includedServices={includedServices}
          placesCovered={placesCovered}
          packageOverview={packageOverview}
          vehicleDetails={vehicleDetails}
          commonFacts={commonFacts}
        />

        <ItinerarySection
          items={displayItinerary}
          openIndex={openItineraryDay}
          onToggle={(index) =>
            setOpenItineraryDay((current) => (current === index ? -1 : index))
          }
        />

        <FaqSection
          items={fallbackFaq}
          openIndex={openFaq}
          onToggle={(index) =>
            setOpenFaq((current) => (current === index ? -1 : index))
          }
        />

        <ReviewsSection
          ratingValue={ratingValue}
          reviewCount={reviewCount}
          reviews={reviews}
        />

        <RelatedToursSection tours={relatedTours} />
      </div>
    </section>
  );
};

export default TourDetails;
