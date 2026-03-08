import { useMemo, useState } from "react";
import { useGallery } from "../hooks/useCms";
import { X, Maximize2 } from "lucide-react";

const GalleryPage = () => {
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

  return (
    <section className="py-12 lg:py-14 bg-theme-bg min-h-[60vh]">
      <div className="max-w-[1600px] mx-auto px-8 sm:px-10 lg:px-14 xl:px-16">
        <div className="mb-10 lg:mb-12">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--c-brand)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--c-brand)]">
                Visual Journal
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-theme tracking-tight">
              Gallery <span className="text-[var(--c-brand)]">Collection</span>
            </h1>
            <p className="text-muted text-sm md:text-base max-w-xl leading-relaxed">
              Explore all journey highlights and guest moments from our routes.
            </p>
          </div>
        </div>

        {galleryItems.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-3.5">
            {galleryItems.map((img, idx) => (
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

export default GalleryPage;
