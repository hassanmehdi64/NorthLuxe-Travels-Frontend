import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGallery } from "../../hooks/useCms";
import { X, Maximize2, MoveUpRight, Sparkles } from "lucide-react";

const GallerySection = () => {
  const { data: items = [] } = useGallery(true);
  const [selectedImg, setSelectedImg] = useState(null);

  const galleryItems = useMemo(
    () =>
      items.map((item) => ({
        src: item.url,
        title: item.title,
        category: item.category,
      })),
    [items],
  );
  const homeGalleryItems = galleryItems.slice(0, 6);

  return (
    <section className="py-12 lg:py-14 bg-theme-bg overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="mb-10 lg:mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-[var(--c-brand)]" />
                <span className="text-[var(--c-brand)] font-black uppercase tracking-[0.35em] text-[10px]">
                  Visual Journal
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-theme tracking-tight">
                Gallery <span className="text-[var(--c-brand)]">Highlights</span>
              </h2>
              <p className="text-muted text-sm md:text-base max-w-xl leading-relaxed">
                A curated look at routes, landscapes, and guest moments from our journeys across the North.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              {!!galleryItems.length && (
                <span className="inline-flex items-center rounded-xl border border-theme bg-theme-surface px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-theme">
                  <Sparkles size={11} className="mr-1.5 text-[var(--c-brand)]" />
                  {homeGalleryItems.length} of {galleryItems.length} Photos
                </span>
              )}
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-theme bg-theme-surface px-5 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-theme hover:text-[var(--c-brand)] hover:border-[var(--c-brand)]/45 hover:bg-white transition-all duration-300 active:scale-[0.98]"
              >
                View All Gallery
                <MoveUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {galleryItems.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-3.5">
            {homeGalleryItems.map((img, idx) => (
              <button
                key={`${img.src}-${idx}`}
                type="button"
                onClick={() => setSelectedImg(img)}
                className="relative group h-[170px] sm:h-[180px] lg:h-[190px] overflow-hidden rounded-xl bg-theme-surface border border-theme shadow-[0_8px_16px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(15,23,42,0.14)]"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute inset-0 p-3 flex flex-col justify-end transform translate-y-2.5 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 text-left">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--c-brand)] mb-1">
                    {img.category || "Journey"}
                  </p>
                  <p className="text-white font-bold text-[12px] leading-tight line-clamp-2">{img.title}</p>

                  <div className="mt-2 flex items-center gap-1.5 text-white/60 text-[8px] font-bold uppercase tracking-widest">
                    <Maximize2 size={10} />
                    Expand
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-theme bg-theme-surface py-16 text-center text-muted">
            <p className="text-xs font-medium tracking-widest uppercase">Curating Gallery...</p>
          </div>
        )}
      </div>
      
      {/* Lightbox */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-theme-text/96 backdrop-blur-lg p-6"
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-8 right-8 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white/75 hover:text-[var(--c-brand)] transition-colors">
            <X size={20} />
          </button>
          <div className="relative max-w-5xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImg.src} alt={selectedImg.title} className="max-h-[80vh] w-auto rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
