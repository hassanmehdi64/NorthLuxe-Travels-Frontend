import { useSettings } from "../../hooks/useCms";
import { getHeroColors, getPageHeroImage } from "../../lib/siteTheme";

const PageHero = ({
  page,
  label,
  tag,
  title,
  accent,
  text,
  image,
}) => {
  const { data: settings } = useSettings(true);
  const colors = getHeroColors(settings);
  const heroImage = getPageHeroImage(settings, page, image);

  return (
    <section aria-label={label} className="relative isolate w-full overflow-hidden bg-theme-text">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${heroImage}')` }}
      />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: colors.overlay }} />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: `linear-gradient(90deg, ${colors.start}, ${colors.middle}, ${colors.end})` }}
      />

      <div className="relative z-10 w-full px-4 pb-12 pt-24 sm:px-6 sm:pb-14 sm:pt-28 lg:px-10 lg:pb-16 lg:pt-32 xl:px-14">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--c-brand)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.34em] text-[var(--c-brand)] sm:text-[11px]">
              {tag}
            </span>
          </div>

          <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
            {title}
            {accent ? <span className="text-[var(--c-brand)]"> {accent}</span> : null}
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
