import { CheckCircle2, Play } from "lucide-react";
import { Link } from "react-router-dom";

const focusPoints = [
  "Curated cultural, experiential, and faith-based journeys",
  "Responsible travel with ethical local partnerships",
  "Dedicated support for international travelers",
  "Real community connection through local hosts and guides",
  "Family-friendly tours with safety-first planning",
];

const youtubeVideoUrl = "https://www.youtube.com/watch?v=Uf4iDJ8LJx0";
const youtubePreviewImage = "/gb.jpg";

const WhyChooseUs = () => {
  return (
    <section className="py-12 lg:py-14 bg-theme-bg w-full">
      <div className="w-full border-y border-theme bg-theme-surface">
        <div className="w-full px-8 sm:px-10 lg:px-14 xl:px-16 py-6 md:py-8 lg:py-10">
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
                className="mt-7 inline-flex items-center justify-center rounded-xl border border-theme px-6 py-2.5 text-sm font-semibold text-theme hover:border-[var(--c-brand)] hover:text-[var(--c-brand)] transition"
              >
                Learn More
              </Link>
            </div>

            <div className="w-full">
              <div className="relative w-full overflow-hidden rounded-xl border border-theme shadow-[0_20px_35px_rgba(15,23,42,0.12)]">
                <img
                  src={youtubePreviewImage}
                  alt="Travel video preview"
                  className="w-full h-[280px] sm:h-[320px] md:h-[360px] object-cover"
                />
                <div className="absolute inset-0 bg-black/25" />

                <a
                  href={youtubeVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Watch video on YouTube"
                  className="absolute inset-0 m-auto h-8 w-8 text-white inline-flex items-center justify-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)] hover:scale-105 transition-transform"
                >
                  <Play size={12} className="ml-0.5 fill-current" />
                </a>

                <div className="absolute left-3 bottom-3 rounded-md bg-black/60 px-3 py-1.5 text-xs font-semibold text-white">
                  Watch on YouTube
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
