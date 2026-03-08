import HeroSection from "../components/about/HeroSection";
import OurStory from "../components/about/OurStory";
import TeamSection from "../components/about/TeamSection";
import GallerySection from "../components/about/GallerySection";
import RelatedSection from "../components/about/RelatedSection";

const About = () => {
  return (
    <main className="bg-theme-bg text-theme">
      <HeroSection />
      <OurStory />
      <TeamSection />
      <RelatedSection />
      <GallerySection />
    </main>
  );
};

export default About;
