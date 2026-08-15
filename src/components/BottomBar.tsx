import { CONTACT } from "../data";
import { useLang } from "../lib/LanguageContext";
import { Phone, MessageCircle, Sparkles } from "lucide-react";

interface Props {
  onGetQuote: () => void;
}

export default function BottomBar({ onGetQuote }: Props) {
  const { t } = useLang();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-500/15 bg-ink-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-stretch">
        <a
          href={`tel:${CONTACT.phoneIntl}`}
          className="flex flex-1 flex-col items-center gap-1 py-3 text-gray-300 transition-colors hover:text-gold-300"
        >
          <Phone className="h-5 w-5" />
          <span className="text-xs font-medium">{t("callNow")}</span>
        </a>
        <a
          href={`https://wa.me/${CONTACT.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 flex-col items-center gap-1 border-x border-white/5 py-3 text-gray-300 transition-colors hover:text-gold-300"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs font-medium">{t("whatsappBottom")}</span>
        </a>
        <button
          onClick={onGetQuote}
          className="flex flex-1 flex-col items-center gap-1 py-3 font-semibold text-gold-300 transition-colors hover:text-gold-200"
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-medium">{t("getQuoteBottom")}</span>
        </button>
      </div>
    </div>
  );
}
