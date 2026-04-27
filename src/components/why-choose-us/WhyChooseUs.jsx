import { CheckCircle2, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const focusPoints = [
  "Curated cultural, experiential, and faith-based journeys",
  "Responsible travel with ethical local partnerships",
  "Dedicated support for international travelers",
  "Real community connection through local hosts and guides",
  "Family-friendly tours with safety-first planning",
];

const youtubeEmbedUrl = "https://www.youtube.com/embed/Uf4iDJ8LJx0?autoplay=1&rel=0&modestbranding=1";
const youtubePreviewImage = "/gb.jpg";

const WhyChooseUs = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="py-8 lg:py-10 bg-theme-bg w-full">
      <div className="w-full border-y border-theme bg-theme-surface">
        <div className="w-full px-8 sm:px-10 lg:px-14 xl:px-16 py-6 md:py-7 lg:py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-theme tracking-tight">
                Why Travel With Us?
              </h2>

              <p className="mt-4 text-theme text-sm md:text-[15px] leading-relaxed max-w-2xl">
                We are a cultural and experiential travel company built for explorers who
                want more than a standard itinerary. Our journeys are designed to connect
                travelers with Pakistan's landscapes, heritage, local communities, and
                authentic lifestyle experiences in a safe and meaningful way.
              </p>

              <div className="mt-6 space-y-3.5">
                {focusPoints.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--c-brand)]" />
                    <p className="text-sm md:text-[15px] text-theme leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/about"
                className="ql-btn-secondary mt-7 px-6 py-2.5 text-sm font-semibold"
              >
                Learn More
              </Link>
            </div>

            <div className="w-full">
              <div className="relative w-full overflow-hidden rounded-xl border border-theme bg-theme-surface shadow-[0_20px_35px_rgba(15,23,42,0.12)]">
                {isVideoOpen ? (
                  <iframe
                    src={youtubeEmbedUrl}
                    title="Why Choose Us video"
                    className="h-[280px] w-full sm:h-[320px] md:h-[360px]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsVideoOpen(true)}
                    className="group relative block w-full text-left"
                    aria-label="Play Why Choose Us video"
                  >
                    <img
                      src={youtubePreviewImage}
                      alt="Travel video preview"
                      className="h-[280px] w-full object-cover sm:h-[320px] md:h-[360px]"
                    />
                    <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/20" />
                    <span className="ql-btn-icon absolute inset-0 m-auto h-12 w-12 rounded-full border-white/30 bg-black/35 text-white [--btn-icon-hover-bg:rgba(32,183,122,0.26)] [--btn-icon-hover-border:rgba(255,255,255,0.5)] [--btn-icon-hover-text:#ffffff] shadow-[0_8px_22px_rgba(0,0,0,0.3)]">
                      <Play size={16} className="ml-0.5 fill-current" />
                    </span>
                    <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-3 py-1.5 text-xs font-semibold text-white">
                      Watch Video
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
