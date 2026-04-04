const FeaturePageHeader = ({ eyebrow, title, highlight, description }) => {
  return (
    <header className="mb-10 lg:mb-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--c-brand)]" />
            <span className="text-[var(--c-brand)] font-black uppercase tracking-[0.34em] text-[10px]">
              {eyebrow}
            </span>
          </div>
          <h1 className="text-[1.85rem] leading-[1.06] font-semibold tracking-[-0.03em] text-theme md:text-[2.25rem]">
            {title} {highlight ? <span className="text-[var(--c-brand)]">{highlight}</span> : null}
          </h1>
        </div>

        {description ? (
          <p className="max-w-md text-sm leading-7 text-muted md:border-l md:border-theme md:pl-6 md:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
};

export default FeaturePageHeader;
