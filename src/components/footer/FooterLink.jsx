import { Link } from "react-router-dom";

const FooterLink = ({ href, children }) => {
  return (
    <Link
      to={href}
      className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--footer-muted)] transition-all duration-300 hover:text-[var(--footer-text)]"
    >
      <span className="h-[1px] w-0 bg-[var(--footer-accent)] transition-all duration-300 group-hover:w-3" />
      <span>{children}</span>
    </Link>
  );
};

export default FooterLink;
