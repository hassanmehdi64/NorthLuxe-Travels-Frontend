import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const icons = {
  facebook: <Facebook size={18} />,
  instagram: <Instagram size={18} />,
  twitter: <Twitter size={18} />,
  linkedin: <Linkedin size={18} />,
};

const FooterSocial = ({ href, icon, name }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="ql-btn-icon group relative h-10 w-10 border-white/20 bg-white/5 text-[var(--footer-muted)] shadow-none [--btn-icon-hover-bg:color-mix(in_srgb,var(--footer-accent)_20%,transparent)] [--btn-icon-hover-border:color-mix(in_srgb,var(--footer-accent)_70%,transparent)] [--btn-icon-hover-text:var(--footer-text)]"
      aria-label={name}
    >
      <span className="absolute inset-0 rounded-full bg-[var(--footer-accent)] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-20" />
      <span className="relative z-10">{icons[icon]}</span>
    </a>
  );
};

export default FooterSocial;
