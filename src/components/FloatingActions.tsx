import { Phone, MessageCircle } from "lucide-react";
import { useLang } from "../lib/LanguageContext";
import { CONTACT } from "../data";

export default function FloatingActions() {
  const { t } = useLang();

  return (
    <div className="fixed bottom-5 end-5 z-50 flex flex-col gap-3">
      <a
        href={`https://wa.me/${CONTACT.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-ink-950 shadow-gold-lg transition-all duration-300 hover:scale-110 animate-pulse-gold"
        aria-label={`WhatsApp ${CONTACT.phone}`}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="pointer-events-none absolute end-16 whitespace-nowrap rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-medium text-gold-200 opacity-0 shadow-gold transition-opacity duration-300 group-hover:opacity-100">
          {t("floatWhatsapp")}
        </span>
      </a>
      <a
        href={`tel:${CONTACT.phoneIntl}`}
        className="group flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/40 bg-ink-900/95 text-gold-300 shadow-gold backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-gold-500/15"
        aria-label={`Call ${CONTACT.phone}`}
      >
        <Phone className="h-6 w-6" />
        <span className="pointer-events-none absolute end-16 whitespace-nowrap rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-medium text-gold-200 opacity-0 shadow-gold transition-opacity duration-300 group-hover:opacity-100">
          {t("floatCall")} {CONTACT.phone}
        </span>
      </a>
    </div>
  );
}
