import { Link } from "react-router-dom";

const FooterBottom = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45 text-center md:text-left">
        &copy; {currentYear} North Luxe Travels. All rights reserved.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <Link
          to="/privacy"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45 hover:text-[var(--c-brand)] transition-colors duration-300"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45 hover:text-[var(--c-brand)] transition-colors duration-300"
        >
          Terms of Service
        </Link>
      </div>
    </div>
  );
};

export default FooterBottom;
