import FeaturedDestinations from "../components/featured-destinations/FeaturedDestinations";
import PopularTours from "../components/popular-tours/PopularTours";
import WhyChooseUs from "../components/why-choose-us/WhyChooseUs";
import TourMain from "../components/TourBooking/TourMain";
import Testimonials from "../components/testimonials/Testimonials";
import CTASection from "../components/CTASection/CTASection";
import GallerySection from "../components/about/GallerySection";
import { CheckCircle2 } from "lucide-react";

const HeroTrustStrip = () => (
  <section className="bg-theme-bg py-4 md:py-5">
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-14 xl:px-16">
      <div className="overflow-hidden rounded-[1.6rem] border border-[rgba(15,23,42,0.06)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,252,0.96))] p-3 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          "Local expert planning",
          "Flexible custom routes",
          "Transparent pricing",
          "24/7 travel support",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/72 px-4 py-3 text-sm font-semibold text-theme shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--c-brand-rgb),0.1)] text-[var(--c-brand)]">
              <CheckCircle2 size={15} />
            </span>
            <span className="leading-tight">{item}</span>
          </div>
        ))}
        </div>
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
