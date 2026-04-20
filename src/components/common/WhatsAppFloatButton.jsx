import { useLocation } from "react-router-dom";
import { FaFacebookMessenger, FaWhatsapp } from "react-icons/fa";
import { useSettings } from "../../hooks/useCms";

const normalizePhone = (value) => String(value || "").replace(/[^\d]/g, "");
const buildWhatsAppLink = (settings) => {
  const configured = settings?.socialLinks?.whatsapp || "";
  if (/^https?:\/\//i.test(configured)) return configured;

  const phone = normalizePhone(settings?.whatsappNumber || settings?.sitePhone || "923001234567");
  const message = encodeURIComponent(`Hello ${settings?.siteName || "North Luxe"}, I need help with a tour booking.`);
  return `https://wa.me/${phone}?text=${message}`;
};

const WhatsAppFloatButton = () => {
  const { data: settings } = useSettings(true);
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;

  const messengerLink = settings?.socialLinks?.facebook || "";
  const whatsappLink = buildWhatsAppLink(settings);

  return (
    <div className="fixed bottom-6 right-6 z-[120] flex flex-col items-end gap-2.5">
      {messengerLink ? (
        <a
          href={messengerLink}
          target="_blank"
          rel="noreferrer"
          aria-label="Message us on Messenger"
          title="Message Us"
          className="inline-flex items-center justify-center h-10 w-10 rounded-full shadow-xl bg-[#0084ff] text-white hover:scale-105 transition-transform"
        >
          <FaFacebookMessenger className="h-4 w-4" aria-hidden="true" />
        </a>
      ) : null}

      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        title="WhatsApp"
        className="inline-flex items-center justify-center h-10 w-10 rounded-full shadow-xl bg-[#0da746] text-white hover:scale-105 transition-transform"
      >
        <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
};

export default WhatsAppFloatButton;
