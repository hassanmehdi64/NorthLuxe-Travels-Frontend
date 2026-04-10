import { useEffect, useState } from "react";

const HERO_SLIDES = [
  {
    src: "/gb.jpg",
    alt: "Gilgit Baltistan mountain landscape",
    position: "center center",
  },
  {
    src: "https://res.cloudinary.com/www-travelpakistani-com/image/upload/v1670002655/Roundu_Valley_pakistan.jpg",
    alt: "Roundu Valley scenic route",
    position: "center center",
  },
  {
    src: "https://realpakistan.com.pk/wp-content/uploads/2025/04/shangrila-resort.jpg",
    alt: "Shangrila Resort and lakeside scenery",
    position: "center center",
  },
  {
    src: "https://luxushunza.com/wp-content/uploads/slider/cache/da7922896e4ca1abc15bafab13c8151f/DSC_9668-HDR-1-scaled.jpg",
    alt: "Hunza scenic road and valley view",
    position: "center center",
  },
];

const SLIDE_INTERVAL = 4500;

const HeroBackgroundSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
      {HERO_SLIDES.map((slide, index) => (
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

      <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(5,8,12,0.24),rgba(5,8,12,0.56))]" />

   
    </div>
  );
};

export default HeroBackgroundSlider;
