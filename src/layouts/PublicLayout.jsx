import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import WhatsAppFloatButton from "../components/common/WhatsAppFloatButton";
import { useSettings } from "../hooks/useCms";
import { getFooterColors, getNavbarColors } from "../lib/siteTheme";

const PublicLayout = () => {
  const { data: settings } = useSettings(true);
  const location = useLocation();

  const flushHeroRoutes = ["/tours", "/about", "/blog", "/contact"];
  const shouldFlushTopSpacing = flushHeroRoutes.includes(location.pathname);
  const shouldFlushSideSpacing = flushHeroRoutes.includes(location.pathname);

  useEffect(() => {
    if (!settings) return;

    const siteName = settings.siteName || "North Luxe";
    document.title = siteName;

    if (settings.primaryColor) {
      document.documentElement.style.setProperty("--c-brand", settings.primaryColor);
    }

    const navbarColors = getNavbarColors(settings);
    document.documentElement.style.setProperty("--nav-text", navbarColors.text);
    document.documentElement.style.setProperty("--nav-muted", navbarColors.mutedText);
    document.documentElement.style.setProperty("--nav-active", navbarColors.activeText);

    const footerColors = getFooterColors(settings);
    document.documentElement.style.setProperty("--footer-bg", footerColors.background);
    document.documentElement.style.setProperty("--footer-text", footerColors.text);
    document.documentElement.style.setProperty("--footer-muted", footerColors.mutedText);
    document.documentElement.style.setProperty("--footer-accent", footerColors.accentText);

    const faviconUrl = settings.faviconUrl;
    if (!faviconUrl) return;

    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "icon");
      document.head.appendChild(link);
    }
    link.setAttribute("href", faviconUrl);
  }, [settings]);

  return (
    <>
      <Navbar />
      <div className={`${shouldFlushTopSpacing ? "pt-0" : "pt-[72px]"} ${shouldFlushSideSpacing ? "px-0" : "px-0 sm:px-[5px]"}`}>
        <main>
          <Outlet />
        </main>
      </div>
      <div className="px-0">
        <Footer />
      </div>
      <WhatsAppFloatButton />
    </>
  );
};

export default PublicLayout;
