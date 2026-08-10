import { ShieldCheck, Zap, Wrench, FileText, Headphones, Star } from "lucide-react";
import { useLang } from "../lib/LanguageContext";

export default function Services() {
  const { t } = useLang();

  const services = [
    { icon: <ShieldCheck className="h-7 w-7" />, title: t("svcComprehensive"), desc: t("svcComprehensiveDesc") },
    { icon: <FileText className="h-7 w-7" />, title: t("svcThirdParty"), desc: t("svcThirdPartyDesc") },
    { icon: <Wrench className="h-7 w-7" />, title: t("svcAgency"), desc: t("svcAgencyDesc") },
    { icon: <Zap className="h-7 w-7" />, title: t("svcInstant"), desc: t("svcInstantDesc") },
    { icon: <Headphones className="h-7 w-7" />, title: t("svcClaims"), desc: t("svcClaimsDesc") },
    { icon: <Star className="h-7 w-7" />, title: t("svcDiscount"), desc: t("svcDiscountDesc") },
  ];

  return (
    <section id="services" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="container-lux">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="section-eyebrow justify-center">
            <span className="h-px w-8 bg-gold-500/50" />
            {t("servicesEyebrow")}
            <span className="h-px w-8 bg-gold-500/50" />
          </p>
          <h2 className="section-title">
            {t("servicesTitle1")} <span className="gold-text">{t("servicesTitle2")}</span>
          </h2>
          <p className="mt-4 text-gray-400">{t("servicesSubtitle")}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="group card-lux p-7 transition-all duration-300 hover:border-gold-500/40 hover:shadow-gold"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-300 transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-500/20">
                {s.icon}
              </div>
              <h3 className="font-display text-xl font-semibold text-white">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
