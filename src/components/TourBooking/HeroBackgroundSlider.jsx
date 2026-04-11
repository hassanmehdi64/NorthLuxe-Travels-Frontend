import { useEffect, useState } from "react";
import { useSettings } from "../../hooks/useCms";
import { getHeroColors, getHomeHeroImages } from "../../lib/siteTheme";

const SLIDE_INTERVAL = 4500;

const HeroBackgroundSlider = () => {
  const { data: settings } = useSettings(true);
  const colors = getHeroColors(settings);
  const slides = getHomeHeroImages(settings).map((src, index) => ({
    src,
    alt: `Hero slide ${index + 1}`,
    position: "center center",
  }));
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-55 animate-[hero-pan_9s_ease-in-out_infinite]"
            style={{ objectPosition: slide.position }}
          />
        </div>
      ))}

      <div
        className="absolute inset-0 z-10"
        style={{ background: `linear-gradient(180deg, ${colors.homeStart}, ${colors.homeEnd})` }}
      />

   
    </div>
  );
};

export default HeroBackgroundSlider;
