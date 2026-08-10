import { Star, Quote } from "lucide-react";
import { useLang } from "../lib/LanguageContext";

export default function Testimonials() {
  const { t, lang } = useLang();

  const reviewsEn = [
    { name: "Ahmed Al Mansoori", role: "Range Rover Owner · Dubai", text: "Saved over 1,800 AED on my comprehensive cover compared to my renewal quote. Raouf's team handled everything in under an hour. Highly recommended." },
    { name: "Fatima Al Zaabi", role: "Lexus ES · Abu Dhabi", text: "Professional, quick, and genuinely helpful. They explained every option in Arabic and English. The 30% discount was real, not a gimmick." },
    { name: "Khalid Bin Saeed", role: "BMW X5 · Sharjah", text: "I've insured three family cars through Raouf now. The claims support when I had a minor accident was outstanding — handled end to end." },
  ];

  const reviewsAr = [
    { name: "أحمد المنصوري", role: "مالك رنج روفر · دبي", text: "وفّرت أكثر من 1,800 درهم على تأميني الشامل مقارنة بسعر التجديد. فريق رؤوف إنتهى من كل شيء في أقل من ساعة. أنصح بهم بشدة." },
    { name: "فاطمة الزعابي", role: "لكزس ES · أبوظبي", text: "محترفون وسريعون ومتعاونون حقاً. شرحوا كل خيار بالعربية والإنجليزية. خصم الـ30% حقيقي وليس حيلة تسويقية." },
    { name: "خالد بن سعيد", role: "بي إم دبليو X5 · الشارقة", text: "أمّنت ثلاث سيارات عائلية عبر رؤوف حتى الآن. دعم المطالبات عند تعرّضي لحادث بسيط كان ممتازاً — تماً من البداية للنهاية." },
  ];

  const reviews = lang === "ar" ? reviewsAr : reviewsEn;

  return (
    <section id="reviews" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gold-500/5 blur-[100px]" />
      <div className="container-lux relative">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="section-eyebrow justify-center">
            <span className="h-px w-8 bg-gold-500/50" />
            {t("revEyebrow")}
            <span className="h-px w-8 bg-gold-500/50" />
          </p>
          <h2 className="section-title">
            {t("revTitle1")} <span className="gold-text">{t("revTitle2")}</span>
          </h2>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-5 w-5 fill-gold-400 text-gold-400" />
              ))}
            </div>
            <span className="text-sm text-gray-400">
              <span className="font-semibold text-gold-200">4.9</span> {t("revAverage")} · 2,300+ {t("revReviews")}
            </span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.name} className="card-lux relative p-7 transition-all duration-300 hover:border-gold-500/40 hover:shadow-gold">
              <Quote className="absolute end-6 top-6 h-10 w-10 text-gold-500/15" />
              <div className="mb-4 flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-gray-300">"{r.text}"</p>
              <div className="mt-6 flex items-center gap-3 border-t border-gold-500/10 pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-700 font-display text-lg font-bold text-ink-950">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
