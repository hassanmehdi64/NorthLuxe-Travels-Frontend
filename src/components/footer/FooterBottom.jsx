import { Link } from "react-router-dom";
import { useSettings } from "../../hooks/useCms";

const FooterBottom = () => {
  const { data: settings } = useSettings(true);
  const currentYear = new Date().getFullYear();
  const siteName = settings?.siteName || "North Luxe Travels";

  return (
    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--footer-muted)] opacity-65 text-center md:text-left">
        &copy; {currentYear} {siteName}. All rights reserved.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <Link
          to="/privacy"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--footer-muted)] opacity-65 transition-colors duration-300 hover:text-[var(--footer-accent)] hover:opacity-100"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--footer-muted)] opacity-65 transition-colors duration-300 hover:text-[var(--footer-accent)] hover:opacity-100"
        >
          Terms of Service
        </Link>
      </div>
    </div>
  );
};

export default FooterBottom;
