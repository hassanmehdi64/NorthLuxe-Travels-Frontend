import { Link } from "react-router-dom";
import { useSettings } from "../../hooks/useCms";

const normalizePhoneHref = (value) => String(value || "").replace(/[^\d+]/g, "");

const PublicTopStrip = () => {
  const { data: settings } = useSettings(true);

  const phone = settings?.sitePhone || "+92 300 1234567";
  const email = settings?.supportEmail || settings?.siteEmail || "info@northluxetravels.com";
  const tagline = settings?.siteTagline || "Premium tours across Gilgit-Baltistan.";

  return (
    <div className="mb-3 flex flex-col gap-2 rounded-xl border border-theme bg-theme-surface px-3 py-2.5 text-center text-sm font-bold text-muted max-sm:ml-[27px] max-sm:mr-3 sm:mx-0 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:text-left">
      <p className="hidden sm:block font-semibold">
        {tagline}
      </p>
      <div className="flex items-center justify-center gap-5 overflow-x-auto whitespace-nowrap text-[11px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-start sm:gap-4 sm:overflow-visible sm:text-sm">
        <a
          href={`tel:${normalizePhoneHref(phone)}`}
          className="shrink-0 whitespace-nowrap leading-none transition-colors hover:text-theme"
        >
          {phone}
        </a>
        <a
          href={`mailto:${email}`}
          className="shrink-0 whitespace-nowrap leading-none transition-colors hover:text-theme"
        >
          {email}
        </a>{" "}
        <Link
          to="/contact"
          className="hidden font-semibold text-[var(--c-brand)] hover:opacity-80 sm:inline-flex">
          Talk to an advisor
        </Link>
      </div>
    </div>
  );
};

export default PublicTopStrip;
