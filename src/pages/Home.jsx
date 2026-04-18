import FeaturedDestinations from "../components/featured-destinations/FeaturedDestinations";
import PopularTours from "../components/popular-tours/PopularTours";
import WhyChooseUs from "../components/why-choose-us/WhyChooseUs";
import TourMain from "../components/TourBooking/TourMain";
import Testimonials from "../components/testimonials/Testimonials";
import CTASection from "../components/CTASection/CTASection";
import GallerySection from "../components/about/GallerySection";
import { CheckCircle2 } from "lucide-react";

const HeroTrustStrip = () => (
  <section className="bg-theme-bg py-3">
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-14 xl:px-16">
      <div className="grid gap-2.5 rounded-2xl border border-theme bg-theme-surface p-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          "Local expert planning",
          "Flexible custom routes",
          "Transparent pricing",
          "24/7 travel support",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-2.5 rounded-xl bg-theme-bg px-3 py-2.5 text-sm font-semibold text-theme"
          >
            <CheckCircle2 size={16} className="shrink-0 text-[var(--c-brand)]" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Home = () => {
  return (
    <>
      <TourMain />
      <HeroTrustStrip />
      <PopularTours />
      <FeaturedDestinations />
      <WhyChooseUs />
      <Testimonials />
      <GallerySection />
      <CTASection />
    </>
  );
};

export default Home;
