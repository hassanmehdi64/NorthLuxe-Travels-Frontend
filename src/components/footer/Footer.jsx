import FooterSocial from "./FooterSocial";
import FooterSection from "./FooterSection";
import FooterBottom from "./FooterBottom";
import { footerLinks, socialLinks } from "./footerData";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSettings } from "../../hooks/useCms";
import { getFooterColors, getLogoUrl } from "../../lib/siteTheme";

const normalizePhoneHref = (value) =>
  String(value || "").replace(/[^\d+]/g, "");

const splitBrandName = (name) => {
  const parts = String(name || "North Luxe")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length < 2) {
    return { main: parts[0] || "North", accent: "Luxe" };
  }

  return {
    main: parts.slice(0, -1).join(" "),
    accent: parts[parts.length - 1],
  };
};

const Footer = () => {
  const { data: settings } = useSettings(true);

  const siteName = settings?.siteName || "North Luxe";
  const brand = splitBrandName(siteName);

  const tagline =
    settings?.siteTagline ||
    "Premium tours across Gilgit-Baltistan with curated routes, reliable local support, and comfort-first planning for families, couples, and group travelers.";

  const email =
    settings?.supportEmail ||
    settings?.siteEmail ||
    "info@northluxetravels.com";

  const phone = settings?.sitePhone || "+92 300 1234567";
  const address = settings?.address || "Skardu, Gilgit-Baltistan";

  const footerColors = getFooterColors(settings);
  const logoUrl = getLogoUrl(settings);

  const configuredSocialLinks = socialLinks.map((item) => ({
    ...item,
    href: settings?.socialLinks?.[item.icon] || item.href,
  }));

  const contactInfo = [
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    {
      icon: Phone,
      label: "Phone",
      value: phone,
      href: `tel:${normalizePhoneHref(phone)}`,
    },
    { icon: MapPin, label: "Base", value: address },
  ];

  return (
    <footer
      className="relative overflow-hidden border-t border-white/10 pt-10 pb-24 text-[var(--footer-text)] sm:pt-14 sm:pb-8"
      style={{
        "--footer-bg": footerColors.background,
        "--footer-text": footerColors.text,
        "--footer-muted": footerColors.mutedText,
        "--footer-accent": footerColors.accentText,
        background: "var(--footer-bg)",
        color: "var(--footer-text)",
      }}>
      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-14 xl:px-16">
        <div className="grid grid-cols-1 gap-10 pb-8 text-center md:grid-cols-2 md:text-left lg:grid-cols-12 lg:gap-12 lg:pb-12">
          <div className="space-y-2.5 lg:col-span-4">
            <div className="flex flex-col items-center md:items-start">
              {logoUrl ? (
                <div className="flex w-full max-w-[520px] items-center justify-center md:justify-start">
                  <img
                    src={logoUrl}
                    alt={siteName}
                    className="h-24 max-w-full object-contain drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)]"
                  />
                </div>
              ) : (
                <h3 className="inline-flex rounded-[1.5rem] border border-white/20 bg-white/10 px-4 py-3 text-2xl font-black uppercase tracking-tight text-[var(--footer-text)] shadow-[0_16px_38px_rgba(255,255,255,0.12)] md:text-3xl">
                  {brand.main}{" "}
                  <span className="text-[var(--footer-accent)]">
                    {brand.accent}
                  </span>
                </h3>
              )}
            </div>

            <p className="mx-auto max-w-sm text-sm leading-relaxed text-[var(--footer-muted)] md:mx-0 md:text-[15px]">
              {tagline}
            </p>

            <div className="flex items-center justify-center gap-3 pt-0 md:justify-start">
              {configuredSocialLinks.map((social, index) => (
                <FooterSocial key={index} {...social} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3 lg:gap-10">
            {footerLinks.map((section, index) => (
              <div key={index} className="flex justify-center sm:justify-start">
                <FooterSection
                  title={section.title}
                  links={section.links}
                  className="w-full max-w-[240px] text-center sm:text-left"
                />
              </div>
            ))}

            <div className="mx-auto w-full max-w-[240px] space-y-4 text-center sm:mx-0 sm:text-left">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--footer-accent)]">
                Contact
              </h4>

              <ul className="space-y-3">
                {contactInfo.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start justify-center gap-4 sm:justify-start">
                    <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center pt-0.5 text-[var(--footer-accent)]">
                      <item.icon size={18} />
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                      <p className="mb-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-[var(--footer-muted)] opacity-65">
                        {item.label}
                      </p>

                      {item.href ? (
                        <a
                          href={item.href}
                          className="break-words text-[13px] font-semibold text-[var(--footer-muted)] transition-colors hover:text-[var(--footer-accent)]">
                          {item.value}
                        </a>
                      ) : (
                        <p className="break-words text-[13px] font-semibold text-[var(--footer-muted)]">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
