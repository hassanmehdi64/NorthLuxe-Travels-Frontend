import { Link } from "react-router-dom";

const FooterLink = ({ href, children }) => {
  return (
    <Link
      to={href}
      className="group inline-flex items-center gap-2 text-sm font-medium text-white/78 transition-all duration-300 hover:text-white"
    >
      <span className="h-[1px] w-0 bg-[var(--c-brand)] transition-all duration-300 group-hover:w-3" />
      <span>{children}</span>
    </Link>
  );
};

export default FooterLink;
