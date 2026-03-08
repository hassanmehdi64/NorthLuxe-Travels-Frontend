const BlogHero = () => {
  return (
    <section
      aria-label="Blog hero"
      className="relative isolate overflow-hidden bg-theme-text flex items-center h-[35svh] min-h-[280px] max-h-[400px]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.04]"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/www-travelpakistani-com/image/upload/v1670002655/Roundu_Valley_pakistan.jpg')",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/35" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-theme-text via-theme-text/45 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-theme-text/85 via-theme-text/25 to-transparent" />

      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--c-brand)]/90" />
              <span className="text-[var(--c-brand)] font-black uppercase tracking-[0.36em] text-[10px] sm:text-[11px]">
                Blog
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.03]">
              Travel <span className="text-[var(--c-brand)]">Journal</span>
            </h1>
            <p className="text-white/85 max-w-[60ch] text-sm md:text-base leading-relaxed">
              Stories, guides, and field insights for planning unforgettable journeys across
              Gilgit-Baltistan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
