import FooterSocial from "./FooterSocial";
import FooterSection from "./FooterSection";
import FooterBottom from "./FooterBottom";
import { footerLinks, socialLinks } from "./footerData";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSettings } from "../../hooks/useCms";
import { getFooterColors } from "../../lib/siteTheme";

const normalizePhoneHref = (value) => String(value || "").replace(/[^\d+]/g, "");
const splitBrandName = (name) => {
  const parts = String(name || "North Luxe").trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return { main: parts[0] || "North", accent: "Luxe" };
  return { main: parts.slice(0, -1).join(" "), accent: parts[parts.length - 1] };
};

const Footer = () => {
  const { data: settings } = useSettings(true);
  const siteName = settings?.siteName || "North Luxe";
  const brand = splitBrandName(siteName);
  const tagline =
    settings?.siteTagline ||
    "Premium tours across Gilgit-Baltistan with curated routes, reliable local support, and comfort-first planning for families, couples, and group travelers.";
  const email = settings?.supportEmail || settings?.siteEmail || "info@northluxetravels.com";
  const phone = settings?.sitePhone || "+92 300 1234567";
  const address = settings?.address || "Skardu, Gilgit-Baltistan";
  const footerColors = getFooterColors(settings);
  const configuredSocialLinks = socialLinks.map((item) => ({
    ...item,
    href: settings?.socialLinks?.[item.icon] || item.href,
  }));
  const contactInfo = [
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    { icon: Phone, label: "Phone", value: phone, href: `tel:${normalizePhoneHref(phone)}` },
    { icon: MapPin, label: "Base", value: address },
  ];

  return (
    <footer
      className="relative overflow-hidden border-t border-white/10 text-[var(--footer-text)] pt-10 sm:pt-14 pb-24 sm:pb-8"
      style={{
        "--footer-bg": footerColors.background,
        "--footer-text": footerColors.text,
        "--footer-muted": footerColors.mutedText,
        "--footer-accent": footerColors.accentText,
        background: "var(--footer-bg)",
        color: "var(--footer-text)",
      }}
    >
      <div className="absolute -top-20 -right-12 h-72 w-72 rounded-full bg-[var(--footer-accent)]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[var(--footer-accent)]/8 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-14 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 pb-8 sm:pb-12">
          <div className="lg:col-span-4 space-y-5 sm:space-y-7 py-1 sm:py-2 text-center md:text-left">
            <div>
              {settings?.logoUrl ? (
                <div className="mx-auto inline-flex h-16 max-w-[360px] items-center justify-center rounded-2xl border border-white/80 bg-white px-4 py-1 shadow-[0_18px_45px_rgba(255,255,255,0.18)] ring-1 ring-[var(--footer-accent)]/35 md:mx-0">
                  <img src={settings.logoUrl} alt={siteName} className="h-[5.4rem] max-w-[345px] object-contain" />
                </div>
              ) : (
                <h3 className="inline-flex rounded-[1.5rem] border border-white/20 bg-white/10 px-4 py-3 text-2xl font-black uppercase tracking-tight text-[var(--footer-text)] shadow-[0_16px_38px_rgba(255,255,255,0.12)] md:text-3xl">
                  {brand.main} <span className="text-[var(--footer-accent)]">{brand.accent}</span>
                </h3>
              )}
              <div className="mt-3 h-px w-24 bg-[var(--footer-accent)]/55 mx-auto md:mx-0" />
            </div>

            <p className="max-w-sm mx-auto md:mx-0 text-sm md:text-[15px] leading-relaxed text-[var(--footer-muted)] py-1">
              {tagline}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-3">
              {configuredSocialLinks.map((social, idx) => (
                <FooterSocial key={idx} {...social} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 lg:grid-cols-3 gap-[25px] sm:gap-7 lg:gap-8">
            {footerLinks.map((section, idx) => (
              <FooterSection
                key={idx}
                title={section.title}
                links={section.links}
                className="justify-self-center lg:justify-self-auto w-full max-w-[190px] lg:max-w-none"
              />
            ))}

            <div className="col-span-2 lg:col-span-1 justify-self-center lg:justify-self-auto w-full max-w-[320px] lg:max-w-none space-y-4 py-1 sm:py-2 mt-0 sm:mt-[6px]">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--footer-accent)] text-left">
                Contact
              </h4>

              <ul className="space-y-3">
                {contactInfo.map((item, idx) => (
                  <li key={idx} className="group flex items-center justify-start gap-3.5">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-[var(--footer-accent)]">
                      <item.icon size={15} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[var(--footer-muted)] opacity-65 mb-0.5">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-[13px] font-semibold text-[var(--footer-muted)] transition-colors hover:text-[var(--footer-accent)]"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-[13px] font-semibold text-[var(--footer-muted)]">{item.value}</p>
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
