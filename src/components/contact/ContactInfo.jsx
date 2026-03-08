import { Mail, MapPin, Phone } from "lucide-react";
import { useSettings } from "../../hooks/useCms";

const ContactInfo = () => {
  const { data: settings } = useSettings(true);

  return (
    <div className="rounded-2xl border border-theme bg-theme-surface p-5 sm:p-6 lg:p-7 shadow-[0_10px_18px_rgba(15,23,42,0.06)] space-y-6">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--c-brand)] mb-2">
          Concierge Desk
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-theme tracking-tight">
          Contact Details
        </h2>
      </div>

      <p className="text-sm md:text-base text-muted leading-relaxed">
        Reach out for bookings, route planning, and custom trip support across the Northern regions.
      </p>

      <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-xl border border-theme bg-theme-bg p-3.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--c-brand)]/10">
            <MapPin className="text-[var(--c-brand)]" size={16} />
          </span>
          <p className="text-theme text-sm md:text-base leading-snug">
            {settings?.address || "Main Chowk Danyore, Gilgit-Baltistan"}
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-theme bg-theme-bg p-3.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--c-brand)]/10">
            <Phone className="text-[var(--c-brand)]" size={16} />
          </span>
          <p className="text-theme text-sm md:text-base leading-snug">
            {settings?.sitePhone || "+92 3XX XXX XXXX"}
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-theme bg-theme-bg p-3.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--c-brand)]/10">
            <Mail className="text-[var(--c-brand)]" size={16} />
          </span>
          <p className="text-theme text-sm md:text-base leading-snug">
            {settings?.siteEmail || "info@northluxetravels.com"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
