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
      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white/80 transition-all duration-300 hover:border-[var(--c-brand)]/70 hover:bg-[var(--c-brand)]/20 hover:text-white"
      aria-label={name}
    >
      <span className="absolute inset-0 rounded-full bg-[var(--c-brand)] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-20" />
      <span className="relative z-10">{icons[icon]}</span>
    </a>
  );
};

export default FooterSocial;
