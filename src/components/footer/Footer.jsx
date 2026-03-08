import FooterSocial from "./FooterSocial";
import FooterSection from "./FooterSection";
import FooterBottom from "./FooterBottom";
import { footerLinks, socialLinks } from "./footerData";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const contactInfo = [
    { icon: Mail, label: "Email", value: "info@northluxetravels.com", href: "mailto:info@northluxetravels.com" },
    { icon: Phone, label: "Phone", value: "+92 300 1234567", href: "tel:+923001234567" },
    { icon: MapPin, label: "Base", value: "Skardu, GB" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[var(--c-text)] text-white pt-10 sm:pt-14 pb-24 sm:pb-8">
      <div className="absolute -top-20 -right-12 h-72 w-72 rounded-full bg-[var(--c-brand)]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[var(--c-brand)]/8 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-14 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 pb-8 sm:pb-12">
          <div className="lg:col-span-4 space-y-5 sm:space-y-7 py-1 sm:py-2 text-center md:text-left">
            <div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
                North <span className="text-[var(--c-brand)]">Luxe</span>
              </h3>
              <div className="mt-3 h-px w-24 bg-[var(--c-brand)]/55 mx-auto md:mx-0" />
            </div>

            <p className="max-w-sm mx-auto md:mx-0 text-sm md:text-[15px] leading-relaxed text-white/80 py-1">
              Premium tours across Gilgit-Baltistan with curated routes, reliable local support,
              and comfort-first planning for families, couples, and group travelers.
            </p>

            <div className="flex items-center justify-center md:justify-start gap-3">
              {socialLinks.map((social, idx) => (
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
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--c-brand)] text-left">
                Contact
              </h4>

              <ul className="space-y-3">
                {contactInfo.map((item, idx) => (
                  <li key={idx} className="group flex items-center justify-start gap-3.5">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-[var(--c-brand)]">
                      <item.icon size={15} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/45 mb-0.5">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-[13px] font-semibold text-white/85 hover:text-[var(--c-brand)] transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-[13px] font-semibold text-white/85">{item.value}</p>
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
