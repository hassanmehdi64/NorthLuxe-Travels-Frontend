import { createElement, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { getCart, getWishlist } from "../../features/commerce/storage";
import { useSettings } from "../../hooks/useCms";
import { getNavbarColors } from "../../lib/siteTheme";

const splitBrandName = (name) => {
  const parts = String(name || "North Luxe Travels").trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return { main: parts[0] || "North Luxe", accent: "" };
  return { main: parts.slice(0, -1).join(" "), accent: parts[parts.length - 1] };
};

const BrandMark = ({ settings, navColors, compact = false, onClick }) => {
  const siteName = settings?.siteName || "North Luxe Travels";
  const brand = splitBrandName(siteName);

  return (
    <Link
      to="/"
      onClick={onClick}
      className={`flex min-w-0 shrink items-center gap-2 whitespace-nowrap font-black tracking-tight text-[var(--nav-text)] ${
        compact ? "text-[15px]" : "text-[15px] sm:text-lg lg:text-xl"
      }`}
      style={{ color: navColors.text }}
      aria-label={siteName}
    >
      {settings?.logoUrl ? (
        <span
          className={`inline-flex shrink-0 items-center justify-center rounded-xl border border-white/70 bg-white px-2.5 shadow-[0_10px_28px_rgba(255,255,255,0.22)] ring-1 ring-[var(--c-brand)]/35 ${
            compact ? "h-9 max-w-[210px]" : "h-10 max-w-[255px] sm:h-11 lg:h-12 lg:max-w-[330px]"
          }`}
        >
          <img
            src={settings.logoUrl}
            alt={siteName}
            className={`${compact ? "h-12 max-w-[195px]" : "h-14 max-w-[245px] sm:h-16 lg:h-[4.25rem] lg:max-w-[315px]"} object-contain`}
          />
        </span>
      ) : (
        <span className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 shadow-[0_10px_24px_rgba(255,255,255,0.12)] backdrop-blur">
          {brand.main} {brand.accent ? <span className="text-[var(--c-brand)]">{brand.accent}</span> : null}
        </span>
      )}
    </Link>
  );
};

const ActionLink = ({ to, icon, label, count = 0 }) => (
  <Link
    to={to}
    className="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white transition-all duration-300 hover:border-[var(--c-brand)]/70 hover:bg-white/10 hover:text-white sm:h-10 sm:w-10 sm:rounded-xl"
    style={{ background: "var(--nav-bg)" }}
    aria-label={label}
    title={label}
  >
    {createElement(icon, { size: 17 })}
    {count > 0 && (
      <span className="absolute -right-1.5 -top-1.5 h-4 min-w-4 rounded-full bg-[var(--c-brand)] px-1 text-center text-[10px] font-black leading-4 text-[var(--c-text)]">
        {count > 9 ? "9+" : count}
      </span>
    )}
  </Link>
);

const Navbar = () => {
  const { data: settings } = useSettings(true);
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
  const navColors = getNavbarColors(settings);
  const navbarBackground = isScrolled ? navColors.scrolled : navColors.main;
  const navStyleVars = {
    "--nav-bg": navbarBackground,
    "--nav-text": navColors.text,
    "--nav-muted": navColors.mutedText,
    "--nav-active": navColors.activeText,
  };

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-40 border-b transition-all duration-300 ${
          isScrolled
            ? "border-white/15 shadow-[0_10px_30px_rgba(2,8,23,0.2)] backdrop-blur-xl"
            : "border-white/10 backdrop-blur-md"
        }`}
        style={{ ...navStyleVars, background: navbarBackground }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex h-15 items-center justify-between gap-2.5 sm:h-16 sm:gap-4">
            <div className="flex min-w-0 flex-1 items-center">
              <BrandMark settings={settings} navColors={navColors} />
            </div>

            <div className="hidden flex-1 items-center justify-center gap-0.5 xl:flex">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group relative inline-flex h-10 items-center justify-center px-3.5 text-sm font-semibold leading-none transition-colors duration-300 ${
                      isActive ? "text-[var(--nav-active)]" : "text-[var(--nav-text)] hover:text-[var(--nav-active)]"
                    }`
                  }
                  style={({ isActive }) => ({ color: isActive ? navColors.activeText : navColors.text })}
                >
                  {item.name}
                  <span className="pointer-events-none absolute inset-x-2 -bottom-[1px] h-[2px] origin-left scale-x-0 rounded-full bg-[var(--c-brand)] transition-transform duration-300 group-hover:scale-x-100" />
                </NavLink>
              ))}
            </div>

            <div className="hidden flex-1 items-center justify-end gap-2 xl:flex">
              <ActionLink to="/search" icon={Search} label="Search Tours" />
              <ActionLink to="/wishlist" icon={Heart} label="Wishlist" count={wishlistCount} />
              <ActionLink to="/cart" icon={ShoppingBag} label="Cart" count={cartCount} />
            </div>

            <div className="flex items-center gap-2 xl:hidden">
              <ActionLink to="/wishlist" icon={Heart} label="Wishlist" count={wishlistCount} />
              <ActionLink to="/cart" icon={ShoppingBag} label="Cart" count={cartCount} />
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 sm:h-10 sm:w-10 sm:rounded-xl ${
                  isOpen
                    ? "border-[var(--c-brand)]/70 bg-white/10 text-white"
                    : "border-white/20 text-white hover:border-[var(--c-brand)]/70 hover:bg-white/10 hover:text-white"
                }`}
                style={{ background: "var(--nav-bg)" }}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-navbar-drawer"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-30 bg-[rgba(2,8,23,0.45)] backdrop-blur-[2px] transition-opacity duration-150 xl:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div
        id="mobile-navbar-drawer"
        className={`fixed inset-0 z-40 origin-top overflow-hidden transition-[max-height,opacity] duration-200 ease-out sm:left-auto sm:right-6 sm:top-[4.5rem] sm:bottom-auto sm:h-auto sm:max-h-[calc(100vh-6rem)] sm:w-[24rem] sm:rounded-2xl sm:border sm:border-white/12 sm:shadow-[0_20px_50px_rgba(2,8,23,0.32)] xl:hidden ${
          isOpen
            ? "pointer-events-auto max-h-screen opacity-100 sm:max-h-[calc(100vh-6rem)]"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
        style={{ ...navStyleVars, background: navbarBackground }}
      >
        <div className="flex h-screen flex-col overflow-hidden sm:h-auto sm:max-h-[calc(100vh-6rem)]">
          <div className="flex h-15 items-center justify-between gap-3 border-b border-white/10 px-4 sm:hidden">
            <BrandMark settings={settings} navColors={navColors} compact onClick={handleLinkClick} />
            <button
              onClick={() => setIsOpen(false)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--c-brand)]/70 bg-white/10 text-white transition-all duration-300"
              style={{ background: "var(--nav-bg)" }}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-4 sm:py-4">
          <div className="space-y-0.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex min-h-10 items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[var(--c-brand)] text-white"
                      : "text-[var(--nav-text)] hover:bg-white/8 hover:text-[var(--nav-active)]"
                  }`
                }
                style={({ isActive }) => ({ color: isActive ? "#ffffff" : navColors.text })}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--nav-muted)] opacity-70">
              Quick Links
            </p>

            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/search"
                onClick={handleLinkClick}
                className="flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:bg-white/8 hover:text-white"
                style={{ background: "var(--nav-bg)", color: "#ffffff" }}
              >
                <Search size={15} className="shrink-0" />
                <span>Search</span>
              </Link>

              <Link
                to="/custom-plan-request"
                onClick={handleLinkClick}
                className="flex min-h-11 items-center gap-2 rounded-lg border border-[var(--c-brand)]/35 bg-[var(--c-brand)]/8 px-3 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:bg-[var(--c-brand)]/12 hover:text-white"
                style={{ background: "var(--nav-bg)", color: "#ffffff" }}
              >
                <Menu size={15} className="shrink-0" />
                <span>Custom Plan</span>
              </Link>

              <Link
                to="/wishlist"
                onClick={handleLinkClick}
                className="relative flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:bg-white/8 hover:text-white"
                style={{ background: "var(--nav-bg)", color: "#ffffff" }}
              >
                {wishlistCount > 0 && (
                  <span className="absolute right-2.5 top-2.5 min-w-4 rounded-full bg-[var(--c-brand)] px-1 text-center text-[10px] font-black leading-4 text-[var(--c-text)]">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
                <Heart size={15} className="shrink-0" />
                <span>Wishlist</span>
              </Link>

              <Link
                to="/cart"
                onClick={handleLinkClick}
                className="relative flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:bg-white/8 hover:text-white"
                style={{ background: "var(--nav-bg)", color: "#ffffff" }}
              >
                {cartCount > 0 && (
                  <span className="absolute right-2.5 top-2.5 min-w-4 rounded-full bg-[var(--c-brand)] px-1 text-center text-[10px] font-black leading-4 text-[var(--c-text)]">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
                <ShoppingBag size={15} className="shrink-0" />
                <span>Cart</span>
              </Link>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
