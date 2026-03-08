import FeaturedDestinations from "../components/featured-destinations/FeaturedDestinations";
import PopularTours from "../components/popular-tours/PopularTours";
import SeasonalJourneys from "../components/seasonal-journeys/SeasonalJourneys";
import WhyChooseUs from "../components/why-choose-us/WhyChooseUs";
import TourMain from "../components/TourBooking/TourMain";
import Experiences from "../components/experiences/Experiences";
import Testimonials from "../components/testimonials/Testimonials";
import CTASection from "../components/CTASection/CTASection";
import GallerySection from "../components/about/GallerySection";
import OurAchievements from "../components/achievements/OurAchievements";
import { CheckCircle2 } from "lucide-react";

const HomeHighlights = () => (
  <section className="bg-theme-bg pb-12 lg:pb-14">
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-14 xl:px-16">
      <article className="rounded-2xl border border-theme bg-theme-surface p-6 md:p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--c-brand)] mb-3">
          Highlights
        </p>
        <h3 className="text-2xl md:text-3xl font-bold text-theme mb-2">Travel Highlights</h3>
        <p className="text-muted text-sm md:text-base mb-6">
          Everything you can expect from our premium Pakistan journeys.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "Verified local partners",
            "Premium stays and transport",
            "Flexible custom itineraries",
            "Transparent pricing",
            "24/7 travel support",
            "Cultural and scenic experiences",
          ].map((item) => (
            <div
              key={item}
              className="group inline-flex items-center gap-2.5 rounded-xl border border-theme bg-theme-bg px-3.5 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--c-brand)]/45 hover:bg-white hover:shadow-[0_10px_20px_rgba(15,23,42,0.08)]"
            >
              <CheckCircle2
                size={16}
                className="text-[var(--c-brand)] shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
              />
              <span className="text-sm font-medium text-theme">{item}</span>
            </div>
          ))}
        </div>
      </article>
    </div>
  </section>
);

const Home = () => {
  return (
    <>
      <TourMain />
      <PopularTours />
      <SeasonalJourneys />
      <FeaturedDestinations />
      <OurAchievements />
      <HomeHighlights />
      <WhyChooseUs />
      <Experiences />
      <Testimonials />
      <GallerySection />
      <CTASection />
    </>
  );
};

export default Home;
