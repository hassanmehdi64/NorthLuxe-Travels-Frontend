import { useLocation } from "react-router-dom";
import { FaFacebookMessenger, FaWhatsapp } from "react-icons/fa";

const WHATSAPP_LINK =
  "https://wa.me/923110883320?text=Hello%20North%20Luxe%2C%20I%20need%20help%20with%20a%20tour%20booking.";
const MESSENGER_LINK = "https://www.facebook.com/profile.php?id=61576170511504";

const WhatsAppFloatButton = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[120] flex flex-col items-end gap-2.5">
      <a
        href={MESSENGER_LINK}
        target="_blank"
        rel="noreferrer"
        aria-label="Message us on Messenger"
        title="Message Us"
        className="inline-flex items-center justify-center h-10 w-10 rounded-full shadow-xl bg-[#0084ff] text-white hover:scale-105 transition-transform"
      >
        <FaFacebookMessenger className="h-4 w-4" aria-hidden="true" />
      </a>

      <a
        href={WHATSAPP_LINK}
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
