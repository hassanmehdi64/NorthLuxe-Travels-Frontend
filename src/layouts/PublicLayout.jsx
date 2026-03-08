import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import PublicTopStrip from "../components/common/PublicTopStrip";
import WhatsAppFloatButton from "../components/common/WhatsAppFloatButton";
import { useSettings } from "../hooks/useCms";

const PublicLayout = () => {
  const { data: settings } = useSettings(true);

  useEffect(() => {
    if (!settings) return;

    const siteName = settings.siteName || "North Luxe";
    document.title = siteName;

    if (settings.primaryColor) {
      document.documentElement.style.setProperty("--c-brand", settings.primaryColor);
    }

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
      <div className="pt-[72px] px-0 sm:px-[5px]">
        <PublicTopStrip />
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
