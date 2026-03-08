import { createElement, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { getCart, getWishlist } from "../../features/commerce/storage";

const ActionLink = ({ to, icon, label, count = 0 }) => (
  <Link
    to={to}
    className="group relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white/90 transition-all duration-300 hover:border-[var(--c-brand)]/70 hover:text-[var(--c-brand)] hover:bg-white/10"
    aria-label={label}
    title={label}
  >
    {createElement(icon, { size: 17 })}
    {count > 0 && (
      <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-[var(--c-brand)] text-[var(--c-text)] text-[10px] leading-4 font-black text-center">
        {count > 9 ? "9+" : count}
      </span>
    )}
  </Link>
);

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const menuItems = useMemo(
    () => [
      { name: "Home", href: "/" },
      { name: "Tours", href: "/tours" },
      { name: "Destinations", href: "/destinations" },
      { name: "Activities", href: "/activities" },
      { name: "Services", href: "/services" },
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
    [],
  );

  useEffect(() => {
    const syncCounts = () => {
      setWishlistCount(getWishlist().length);
      setCartCount(getCart().length);
    };

    syncCounts();
    window.addEventListener("storage", syncCounts);
    window.addEventListener("ql-cart-updated", syncCounts);
    window.addEventListener("ql-wishlist-updated", syncCounts);

    return () => {
      window.removeEventListener("storage", syncCounts);
      window.removeEventListener("ql-cart-updated", syncCounts);
      window.removeEventListener("ql-wishlist-updated", syncCounts);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-30 border-b transition-all duration-300 ${
        isScrolled
          ? "border-white/20 bg-[rgba(9,20,41,0.92)] backdrop-blur-xl shadow-[0_10px_30px_rgba(2,8,23,0.28)]"
          : "border-white/10 bg-[rgba(9,20,41,0.78)] backdrop-blur-md"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">
          <Link to="/" className="shrink min-w-0 whitespace-nowrap text-base sm:text-lg lg:text-xl font-black tracking-tight text-white">
            North Luxe <span className="text-[var(--c-brand)]">Travels</span>
          </Link>

          <div className="hidden xl:flex items-center gap-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group relative px-3 py-2 text-sm font-semibold transition-colors duration-300 ${
                    isActive ? "text-[var(--c-brand)]" : "text-white/90 hover:text-white"
                  }`
                }
              >
                {item.name}
                <span className="pointer-events-none absolute inset-x-2 -bottom-[1px] h-[2px] origin-left scale-x-0 rounded-full bg-[var(--c-brand)] transition-transform duration-300 group-hover:scale-x-100" />
              </NavLink>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-2">
            <ActionLink to="/search" icon={Search} label="Search Tours" />
            <ActionLink to="/wishlist" icon={Heart} label="Wishlist" count={wishlistCount} />
            <ActionLink to="/cart" icon={ShoppingBag} label="Cart" count={cartCount} />
          </div>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="xl:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 text-white transition-all duration-300 hover:border-[var(--c-brand)]/70 hover:text-[var(--c-brand)] hover:bg-white/10"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`xl:hidden overflow-hidden border-t border-white/10 bg-[rgba(9,20,41,0.97)] transition-all duration-300 ${
          isOpen ? "max-h-[calc(100vh-4rem)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto px-4 sm:px-6 py-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 font-semibold border transition-all duration-300 ${
                  isActive
                    ? "border-[var(--c-brand)]/60 text-[var(--c-brand)] bg-white/5"
                    : "border-white/10 text-white/90 hover:border-[var(--c-brand)]/50 hover:text-[var(--c-brand)] hover:bg-white/5"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <div className="pt-3 mt-2 border-t border-white/10">
            <p className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-3">Quick Actions</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                to="/search"
                onClick={handleLinkClick}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm text-white/90 transition-all duration-300 hover:border-[var(--c-brand)]/50 hover:text-[var(--c-brand)] hover:bg-white/5"
              >
                <Search size={16} />
                Search
              </Link>
              <Link
                to="/wishlist"
                onClick={handleLinkClick}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm text-white/90 transition-all duration-300 hover:border-[var(--c-brand)]/50 hover:text-[var(--c-brand)] hover:bg-white/5"
              >
                <Heart size={16} />
                Wish
              </Link>
              <Link
                to="/cart"
                onClick={handleLinkClick}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm text-white/90 transition-all duration-300 hover:border-[var(--c-brand)]/50 hover:text-[var(--c-brand)] hover:bg-white/5"
              >
                <ShoppingBag size={16} />
                Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
