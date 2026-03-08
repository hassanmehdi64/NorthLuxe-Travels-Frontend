const FeatureCard = ({ Icon, title, description, index }) => {
  return (
    <article className="group relative rounded-3xl border border-theme bg-theme-surface p-6 md:p-7 shadow-sm hover:shadow-[0_20px_55px_-40px_rgba(15,23,42,0.5)] hover:-translate-y-1 transition-all duration-500">
      <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[var(--c-brand)]/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />

      <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-theme-bg border border-theme text-[var(--c-brand)] transition-all duration-300 group-hover:bg-[var(--c-brand)] group-hover:text-[var(--c-text)]">
        {Icon && <Icon size={22} strokeWidth={2.3} />}
      </div>

      <div className="relative mt-5 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted">
          0{index + 1}
        </p>
        <h3 className="text-lg font-bold text-theme tracking-tight">
          {title}
        </h3>
        <p className="text-muted text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  );
};

export default FeatureCard;
