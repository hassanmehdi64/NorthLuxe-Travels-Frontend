import FooterLink from "./FooterLink";

const FooterSection = ({ title, links, children, className = "" }) => {
  return (
    <div className={`space-y-3 sm:space-y-4 text-left ${className}`}>
      {title && (
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--c-brand)]">
          {title}
        </h4>
      )}

      {links && (
        <nav className="flex flex-col items-start space-y-2 sm:space-y-2.5">
          {links.map((link, idx) => (
            <FooterLink key={idx} href={link.href}>
              {link.name}
            </FooterLink>
          ))}
        </nav>
      )}

      {children}
    </div>
  );
};

export default FooterSection;
