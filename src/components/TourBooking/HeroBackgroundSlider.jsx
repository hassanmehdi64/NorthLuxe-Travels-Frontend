import { useEffect, useState } from "react";
import { useSettings } from "../../hooks/useCms";
import { getHeroColors, getHomeHeroImages } from "../../lib/siteTheme";

const SLIDE_INTERVAL = 5200;

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
          className={`absolute inset-0 transition-opacity duration-[1800ms] ease-out ${
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
            className="absolute inset-0 h-full w-full scale-[1.08] object-cover opacity-70 animate-[hero-pan_12s_ease-in-out_infinite]"
            style={{ objectPosition: slide.position }}
          />
        </div>
      ))}

      <div className="absolute inset-0 z-[5] bg-[radial-gradient(circle_at_top_right,rgba(36,179,126,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />

      <div
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(180deg, ${colors.homeStart}5e 0%, ${colors.homeStart}72 30%, ${colors.homeEnd}86 68%, ${colors.homeEnd}a8 100%)`,
        }}
      />

      <div className="absolute inset-0 z-[11] bg-[linear-gradient(90deg,rgba(6,27,58,0.42)_0%,rgba(6,27,58,0.16)_38%,rgba(6,27,58,0.16)_62%,rgba(6,27,58,0.5)_100%)]" />

      <div className="absolute inset-x-0 bottom-0 z-[12] h-32 bg-[linear-gradient(180deg,transparent_0%,rgba(6,27,58,0.22)_45%,rgba(6,27,58,0.52)_100%)]" />

      {slides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-8 z-[13] hidden justify-center sm:flex">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/8 px-3 py-2 backdrop-blur-md">
            {slides.map((slide, index) => (
              <span
                key={`${slide.src}-dot-${index}`}
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  index === activeIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/45"
                }`}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HeroBackgroundSlider;
