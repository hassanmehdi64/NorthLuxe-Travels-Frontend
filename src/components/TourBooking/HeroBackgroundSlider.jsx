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
  const [isFirstSlideReady, setIsFirstSlideReady] = useState(false);
  const firstSlide = slides[0];

  useEffect(() => {
    if (!slides.length) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (activeIndex >= slides.length) {
      setActiveIndex(0);
    }
  }, [slides.length, activeIndex]);

  useEffect(() => {
    setIsFirstSlideReady(false);
  }, [firstSlide?.src]);

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden bg-[var(--c-navy)] bg-cover bg-center bg-no-repeat"
      style={
        firstSlide && !isFirstSlideReady
          ? {
              backgroundImage: `url("${firstSlide.src}")`,
              backgroundPosition: firstSlide.position,
            }
          : undefined
      }>
      {slides.map((slide, index) => (
        <div
          key={`${slide.src}-${index}`}
          className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding={index === 0 ? "sync" : "async"}
            onLoad={index === 0 ? () => setIsFirstSlideReady(true) : undefined}
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-55 animate-[hero-pan_9s_ease-in-out_infinite]"
            style={{ objectPosition: slide.position }}
          />
        </div>
      ))}

      <div
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(180deg, ${colors.homeStart}80, ${colors.homeEnd}80)`,
        }}
      />
    </div>
  );
};

export default HeroBackgroundSlider;
