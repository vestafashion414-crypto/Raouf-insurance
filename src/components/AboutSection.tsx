import { Building2 } from "lucide-react";
import { useLang } from "../lib/LanguageContext";

export default function AboutSection() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-12">
      <div className="absolute inset-0 bg-grid-gold opacity-5" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/40 bg-gradient-to-br from-ink-800 to-ink-900 shadow-gold">
          <Building2 className="h-6 w-6 text-gold-400" />
        </div>
        <h2 className="font-display text-3xl font-semibold text-gold-100 sm:text-4xl">
          {t("aboutTitle")}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-400 sm:text-lg">
          {t("aboutText")}
        </p>
      </div>
    </section>
  );
}
