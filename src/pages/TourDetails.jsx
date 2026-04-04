import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
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
  getTourHeroImages,
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

  const heroImages = useMemo(() => {
    if (!tour) return [];
    return getTourHeroImages(tour);
  }, [tour]);

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
            pagination={{ clickable: true }}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: Math.min(2, heroImages.length || 1) },
            }}
            className="tour-hero-swiper"
          >
            {heroImages.map((image, index) => (
              <SwiperSlide key={`${image}-${index}`}>
                <div className="relative">
                  <img
                    src={image}
                    alt={`${tour.title} ${index + 1}`}
                    className="w-full h-[180px] sm:h-[235px] lg:h-[285px] object-cover object-center"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(8,15,30,0.18)] via-transparent to-transparent" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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
          reviews={fallbackReviews}
        />

        <RelatedToursSection tours={relatedTours} />
      </div>
    </section>
  );
};

export default TourDetails;
