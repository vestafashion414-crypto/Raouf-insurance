import { Phone, MessageCircle, Star, ShieldCheck, ChevronDown } from "lucide-react";
import { useLang } from "../lib/LanguageContext";
import { CONTACT } from "../data";

export default function Hero() {
  const { t } = useLang();

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/hero-luxury-car.webp"
          alt="Black luxury SUV in front of Dubai skyline at golden hour"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/60" />
        <div className="absolute inset-0 bg-grid-gold opacity-30" />
      </div>

      <div className="container-lux relative z-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-200 animate-fade-up"
            style={{ animationDelay: "0.05s" }}
          >
            <ShieldCheck className="h-4 w-4 text-gold-400" />
            {t("heroBadge")}
          </div>

          {/* Heading */}
          <h1
            className="font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl animate-fade-up"
            style={{ animationDelay: "0.12s" }}
          >
            {t("heroTitle1")}{" "}
            <span className="shimmer-text">{t("heroTitle2")}</span>
          </h1>

          {/* Subheading */}
          <p
            className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            {t("heroSubtitle")}
          </p>

          {/* Rating */}
          <div
            className="mt-6 flex items-center gap-3 animate-fade-up"
            style={{ animationDelay: "0.28s" }}
          >
            <div className="flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-5 w-5 fill-gold-400 text-gold-400" />
              ))}
            </div>
            <span className="text-sm text-gray-400">
              <span className="font-semibold text-gold-200">4.9/5</span> {t("heroRating")}
            </span>
          </div>

          {/* CTAs */}
          <div
            className="mt-9 flex flex-col gap-4 sm:flex-row animate-fade-up"
            style={{ animationDelay: "0.36s" }}
          >
            <a href="#quote" className="btn-gold text-base">{t("heroBtnQuote")}</a>
            <a href={`tel:${CONTACT.phoneIntl}`} className="btn-outline-gold text-base">
              <Phone className="h-5 w-5" />
              {t("heroBtnCall")} {CONTACT.phone}
            </a>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-base"
            >
              <MessageCircle className="h-5 w-5" />
              {t("heroBtnWhatsapp")}
            </a>
          </div>

          {/* Stats */}
          <div
            className="mt-12 grid grid-cols-3 gap-4 border-t border-gold-500/15 pt-6 animate-fade-up sm:gap-8"
            style={{ animationDelay: "0.44s" }}
          >
            {[
              { value: "30%", label: t("statDiscount") },
              { value: "15+", label: t("statPartners") },
              { value: "24/7", label: t("statSupport") },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-semibold text-gold-300 sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#quote"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-gold-400/70 transition-colors hover:text-gold-300 animate-float"
        aria-label="Scroll to quote form"
      >
        <ChevronDown className="h-7 w-7" />
      </a>
    </section>
  );
}
