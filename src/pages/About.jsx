import PageHero from "../components/common/PageHero";
import OurStory from "../components/about/OurStory";
import TeamSection from "../components/about/TeamSection";
import OurAchievements from "../components/achievements/OurAchievements";

const About = () => {
  return (
    <main className="bg-theme-bg text-theme">
      <PageHero
        page="about"
        label="About hero"
        tag="About"
        title="About"
        accent="North Luxe"
        text="We combine local knowledge, practical planning, and reliable on-ground support so every trip feels smooth, safe, and memorable."
      />
      <OurStory />
      <OurAchievements />
      <TeamSection />
    </main>
  );
};

export default About;
