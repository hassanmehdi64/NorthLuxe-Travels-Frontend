const FeaturePageHeader = ({ eyebrow, title, highlight, description }) => {
  return (
    <header className="mb-10 lg:mb-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--c-brand)]" />
            <span className="text-[var(--c-brand)] font-black uppercase tracking-[0.34em] text-[10px]">
              {eyebrow}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-theme tracking-tight">
            {title} {highlight ? <span className="text-[var(--c-brand)]">{highlight}</span> : null}
          </h1>
        </div>

        {description ? (
          <p className="text-muted text-sm md:text-base max-w-md leading-relaxed md:border-l md:border-theme md:pl-6">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
};

export default FeaturePageHeader;
