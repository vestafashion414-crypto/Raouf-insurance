import { Check, Award, Clock, Users, TrendingDown } from "lucide-react";
import { useLang } from "../lib/LanguageContext";

export default function WhyChooseUs() {
  const { t } = useLang();

  const reasons = [
    { icon: <Award className="h-6 w-6" />, title: t("whyPartner1"), desc: t("whyPartner1Desc") },
    { icon: <TrendingDown className="h-6 w-6" />, title: t("whyPartner2"), desc: t("whyPartner2Desc") },
    { icon: <Clock className="h-6 w-6" />, title: t("whyPartner3"), desc: t("whyPartner3Desc") },
    { icon: <Users className="h-6 w-6" />, title: t("whyPartner4"), desc: t("whyPartner4Desc") },
  ];

  const points = [t("feat1"), t("feat2"), t("feat3"), t("feat4"), t("feat5"), t("feat6")];

  return (
    <section id="why-us" className="relative scroll-mt-20 overflow-hidden py-20 sm:py-28">
      <div className="container-lux">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Emirati character image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-gold-500/25 shadow-gold-lg">
              <img
                src="/emirati-character.webp"
                alt="Emirati insurance advisor character"
                className="h-[420px] w-full object-cover sm:h-[520px]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
            </div>
            <div className="absolute -bottom-6 end-2 rounded-2xl border border-gold-500/30 bg-ink-900/95 p-5 shadow-gold backdrop-blur sm:end-6">
              <p className="font-display text-3xl font-bold gold-text">30%</p>
              <p className="text-xs uppercase tracking-wider text-gray-400">{t("whySaving")}</p>
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="section-eyebrow">
              <span className="h-px w-8 bg-gold-500/50" />
              {t("whyEyebrow")}
            </p>
            <h2 className="section-title">
              {t("whyTitle1")} <span className="gold-text">{t("whyTitle2")}</span>
            </h2>
            <p className="mt-4 text-gray-400">{t("whyBody")}</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {reasons.map((r) => (
                <div key={r.title} className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
                    {r.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gold-100">{r.title}</h3>
                    <p className="mt-1 text-sm text-gray-400">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {points.map((p) => (
                <div key={p} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <Check className="h-4 w-4 flex-shrink-0 text-gold-400" />
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
