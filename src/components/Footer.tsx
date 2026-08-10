import { ShieldCheck, Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { useLang } from "../lib/LanguageContext";
import { CONTACT } from "../data";

export default function Footer() {
  const { t, lang } = useLang();

  const links = [
    { label: t("navQuote"), href: "#quote" },
    { label: t("navServices"), href: "#services" },
    { label: t("navWhyUs"), href: "#why-us" },
    { label: t("navReviews"), href: "#reviews" },
  ];

  const coverage = [
    t("svcComprehensive"),
    t("svcThirdParty"),
    t("svcAgency"),
    t("feat2"),
    t("feat4"),
  ];

  return (
    <footer className="relative border-t border-gold-500/20 bg-ink-950 pt-16">
      <div className="container-lux">
        {/* CTA banner */}
        <div className="mb-14 overflow-hidden rounded-3xl border border-gold-500/25 bg-gradient-to-r from-ink-850 to-ink-900 p-8 text-center shadow-gold sm:p-12">
          <h3 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            {t("footerCtaTitle1")} <span className="gold-text">{t("footerCtaTitle2")}</span> {t("footerCtaTitleSuffix")}
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-gray-400">{t("footerCtaBody")}</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#quote" className="btn-gold text-base">{t("navGetQuote")}</a>
            <a href={`tel:${CONTACT.phoneIntl}`} className="btn-outline-gold text-base">
              <Phone className="h-5 w-5" />
              {t("navCall")} {CONTACT.phone}
            </a>
            <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-ghost text-base">
              <MessageCircle className="h-5 w-5" />
              {t("heroBtnWhatsapp")}
            </a>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-500/40 bg-gradient-to-br from-ink-800 to-ink-900">
                <ShieldCheck className="h-6 w-6 text-gold-400" strokeWidth={1.5} />
              </div>
              <div className="leading-tight">
                <p className="font-display text-lg font-semibold tracking-wide text-gold-200">{t("brandName")}</p>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-gray-400">{t("brandTagline")}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">{t("footerAbout")}</p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">{t("footerQuick")}</h4>
            <ul className="space-y-2.5 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-gray-400 transition-colors hover:text-gold-200">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Coverage */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">{t("footerCoverage")}</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {coverage.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">{t("footerContact")}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-gold-400" />
                <a href={`tel:${CONTACT.phoneIntl}`} className="hover:text-gold-200" dir="ltr">{CONTACT.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 flex-shrink-0 text-gold-400" />
                <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold-200" dir="ltr">
                  {t("heroBtnWhatsapp")} {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-gold-400" />
                <span>info@raoufinsurance.ae</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0 text-gold-400" />
                <span>{lang === "ar" ? "دبي، الإمارات العربية المتحدة" : "Dubai, United Arab Emirates"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 flex-shrink-0 text-gold-400" />
                <span>{t("footerHours")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gold-500/15 py-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-start">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} {t("brandName")} {t("brandTagline")}. {t("footerRights")}
            </p>
            <p className="text-xs text-gray-500">{t("footerLicensed")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
