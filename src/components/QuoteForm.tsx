import { useMemo, useState, type ReactNode } from "react";
import {
  CAR_BRANDS,
  CONTACT,
  INITIAL_FORM,
  INSURANCE_TYPE_AR,
  VEHICLE_TYPE_AR,
  YEARS,
  calculatePremium,
  fmtAed,
  type EngineCylinders,
  type InsuranceType,
  type QuoteFormData,
  type VehicleType,
} from "../data";
import { supabase } from "../lib/supabase";
import { useLang } from "../lib/LanguageContext";
import {
  ShieldCheck,
  Car,
  User,
  Check,
  ChevronRight,
  ChevronLeft,
  Phone,
  MessageCircle,
  Loader2,
  PartyPopper,
  AlertCircle,
} from "lucide-react";

type Step = 1 | 2 | 3;

const INSURANCE_TYPES: { value: InsuranceType; descKey: string }[] = [
  { value: "Comprehensive", descKey: "comprehensiveDesc" },
  { value: "Third Party", descKey: "thirdPartyDesc" },
];

const VEHICLE_TYPES: { value: VehicleType; img: string }[] = [
  { value: "Sedan", img: "/car-sedan.webp" },
  { value: "SUV", img: "/car-suv.webp" },
  { value: "Coupe", img: "/car-coupe.webp" },
];

const ENGINE_OPTIONS: EngineCylinders[] = [4, 6, 8];

export default function QuoteForm() {
  const { t, lang, dir } = useLang();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<QuoteFormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimate = useMemo(() => calculatePremium(form), [form]);
  const brands = Object.keys(CAR_BRANDS);
  const models = form.brand ? CAR_BRANDS[form.brand] : [];

  const set = <K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const step1Valid = !!form.insuranceType;
  const step2Valid = !!form.vehicleType && !!form.engineCylinders && !!form.brand && !!form.model && !!form.modelYear;
  const step3Valid =
    form.customerName.trim().length > 1 &&
    /^[\d\s+()-]{7,}$/.test(form.mobileNumber) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const goTo = (s: Step) => {
    if (s === 2 && !step1Valid) return;
    if (s === 3 && !step2Valid) return;
    setStep(s);
  };

  const next = () => goTo((Math.min(3, step + 1)) as Step);
  const back = () => goTo((Math.max(1, step - 1)) as Step);

  const handleSubmit = async () => {
    if (!step3Valid || !estimate) return;
    setSubmitting(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from("quote_submissions").insert({
        insurance_type: form.insuranceType,
        vehicle_type: form.vehicleType,
        engine_cylinders: form.engineCylinders,
        brand: form.brand,
        model: form.model,
        model_year: form.modelYear,
        customer_name: form.customerName,
        mobile_number: form.mobileNumber,
        email: form.email,
        notes: form.notes || null,
        estimated_premium: estimate.final,
        language: lang,
      });
      if (insertError) throw insertError;
      setSubmitted(true);
    } catch {
      setError(
        lang === "ar"
          ? "تعذر حفظ طلبك عبر الإنترنت. يرجى الاتصال أو مراسلتنا على واتساب وسنساعدك فوراً."
          : "We couldn't save your quote online. Please call or WhatsApp us directly and we'll help right away."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm(INITIAL_FORM);
    setStep(1);
    setSubmitted(false);
    setError(null);
  };

  const BackIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const FwdIcon = dir === "rtl" ? ChevronLeft : ChevronRight;

  // Bilingual labels for insurance & vehicle types
  const insLabel = (v: InsuranceType) => (lang === "ar" ? INSURANCE_TYPE_AR[v] : v);
  const vehLabel = (v: VehicleType) => (lang === "ar" ? VEHICLE_TYPE_AR[v] : v);

  return (
    <section id="quote" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/5 blur-[120px]" />

      <div className="container-lux relative">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="section-eyebrow justify-center">
            <span className="h-px w-8 bg-gold-500/50" />
            {t("quoteEyebrow")}
            <span className="h-px w-8 bg-gold-500/50" />
          </p>
          <h2 className="section-title">
            {t("quoteTitle1")} <span className="gold-text">{t("quoteTitle2")}</span> {t("quoteTitleSuffix")}
          </h2>
          <p className="mt-4 text-gray-400">{t("quoteSubtitle")}</p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="card-lux overflow-hidden p-6 shadow-gold sm:p-8 lg:p-10">
            {submitted ? (
              <SuccessScreen estimate={estimate} onReset={reset} />
            ) : (
              <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
                {/* Form */}
                <div>
                  <Stepper current={step} onGo={goTo} />

                  {/* Step 1 */}
                  {step === 1 && (
                    <div className="animate-fade-in">
                      <StepHeader icon={<ShieldCheck className="h-5 w-5" />} title={t("step1Title")} subtitle={t("step1Subtitle")} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        {INSURANCE_TYPES.map((it) => (
                          <button
                            key={it.value}
                            onClick={() => set("insuranceType", it.value)}
                            className={`chip text-start p-5 ${form.insuranceType === it.value ? "chip-active" : "chip-idle"}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-display text-lg font-semibold">{insLabel(it.value)}</span>
                              {form.insuranceType === it.value && <Check className="h-5 w-5 text-gold-300" />}
                            </div>
                            <p className="mt-2 text-xs leading-relaxed text-gray-400">{t(it.descKey)}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <div className="animate-fade-in">
                      <StepHeader icon={<Car className="h-5 w-5" />} title={t("step2Title")} subtitle={t("step2Subtitle")} />

                      {/* Vehicle type */}
                      <p className="label-lux">{t("vehicleType")}</p>
                      <div className="mb-6 grid grid-cols-3 gap-3">
                        {VEHICLE_TYPES.map((v) => (
                          <button
                            key={v.value}
                            onClick={() => set("vehicleType", v.value)}
                            className={`group relative overflow-hidden rounded-xl border p-1 transition-all duration-300 ${
                              form.vehicleType === v.value ? "border-gold-400 shadow-gold" : "border-white/10 hover:border-gold-500/40"
                            }`}
                          >
                            <div className="relative h-24 overflow-hidden rounded-lg sm:h-28">
                              <img src={v.img} alt={vehLabel(v.value)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
                            </div>
                            <p className={`py-2 text-center text-sm font-semibold ${form.vehicleType === v.value ? "text-gold-200" : "text-gray-300"}`}>
                              {vehLabel(v.value)}
                            </p>
                          </button>
                        ))}
                      </div>

                      {/* Engine */}
                      <p className="label-lux">{t("engineCylinders")}</p>
                      <div className="mb-6 grid grid-cols-3 gap-3">
                        {ENGINE_OPTIONS.map((c) => (
                          <button
                            key={c}
                            onClick={() => set("engineCylinders", c)}
                            className={`chip ${form.engineCylinders === c ? "chip-active" : "chip-idle"}`}
                          >
                            <span className="font-display text-xl font-semibold">{c}</span>
                            <span className="ms-1 text-xs">{t("cyl")}</span>
                          </button>
                        ))}
                      </div>

                      {/* Brand / Model / Year */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="label-lux" htmlFor="brand">{t("brand")}</label>
                          <select id="brand" className="select-lux" value={form.brand}
                            onChange={(e) => { set("brand", e.target.value); set("model", ""); }}>
                            <option value="">{t("selectBrand")}</option>
                            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="label-lux" htmlFor="model">{t("model")}</label>
                          <select id="model" className="select-lux" value={form.model} disabled={!form.brand}
                            onChange={(e) => set("model", e.target.value)}>
                            <option value="">{form.brand ? t("selectModel") : t("chooseBrandFirst")}</option>
                            {models.map((m) => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="label-lux" htmlFor="year">{t("modelYear")}</label>
                          <select id="year" className="select-lux" value={form.modelYear}
                            onChange={(e) => set("modelYear", e.target.value)}>
                            <option value="">{t("selectYear")}</option>
                            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <div className="animate-fade-in">
                      <StepHeader icon={<User className="h-5 w-5" />} title={t("step3Title")} subtitle={t("step3Subtitle")} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="label-lux" htmlFor="name">{t("customerName")}</label>
                          <input id="name" className="input-lux" placeholder={t("namePlaceholder")}
                            value={form.customerName} onChange={(e) => set("customerName", e.target.value)} />
                        </div>
                        <div>
                          <label className="label-lux" htmlFor="mobile">{t("mobileNumber")}</label>
                          <input id="mobile" className="input-lux" type="tel" placeholder={t("mobilePlaceholder")}
                            value={form.mobileNumber} onChange={(e) => set("mobileNumber", e.target.value)} dir="ltr" />
                        </div>
                        <div>
                          <label className="label-lux" htmlFor="email">{t("email")}</label>
                          <input id="email" className="input-lux" type="email" placeholder={t("emailPlaceholder")}
                            value={form.email} onChange={(e) => set("email", e.target.value)} dir="ltr" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="label-lux" htmlFor="notes">
                            {t("notes")} <span className="text-gray-500">({t("notesOptional")})</span>
                          </label>
                          <textarea id="notes" className="input-lux min-h-[90px] resize-y" placeholder={t("notesPlaceholder")}
                            value={form.notes} onChange={(e) => set("notes", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nav */}
                  <div className="mt-8 flex items-center justify-between gap-4">
                    <button onClick={back} disabled={step === 1}
                      className={`btn-ghost ${step === 1 ? "pointer-events-none opacity-40" : ""}`}>
                      <BackIcon className="h-4 w-4" />
                      {t("btnBack")}
                    </button>
                    {step < 3 ? (
                      <button onClick={next} disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid)}
                        className={`btn-gold ${(step === 1 && !step1Valid) || (step === 2 && !step2Valid) ? "pointer-events-none opacity-40" : ""}`}>
                        {t("btnContinue")}
                        <FwdIcon className="h-4 w-4" />
                      </button>
                    ) : (
                      <button onClick={handleSubmit} disabled={!step3Valid || submitting}
                        className={`btn-gold ${!step3Valid || submitting ? "pointer-events-none opacity-40" : ""}`}>
                        {submitting ? (<><Loader2 className="h-4 w-4 animate-spin" />{t("submitting")}</>)
                                    : (<>{t("btnSubmit")}<FwdIcon className="h-4 w-4" /></>)}
                      </button>
                    )}
                  </div>

                  {error && (
                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                {/* Premium estimate */}
                <div className="lg:pl-2">
                  <PremiumEstimate estimate={estimate} form={form} insLabel={insLabel} vehLabel={vehLabel} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Sub-components ---------- */

function Stepper({ current, onGo }: { current: Step; onGo: (s: Step) => void }) {
  const { t } = useLang();
  const steps: { n: Step; label: string; icon: ReactNode }[] = [
    { n: 1, label: t("step1"), icon: <ShieldCheck className="h-4 w-4" /> },
    { n: 2, label: t("step2"), icon: <Car className="h-4 w-4" /> },
    { n: 3, label: t("step3"), icon: <User className="h-4 w-4" /> },
  ];
  return (
    <div className="mb-8 flex items-center gap-2 sm:gap-4">
      {steps.map((s, i) => {
        const done = current > s.n;
        const active = current === s.n;
        return (
          <div key={s.n} className="flex flex-1 items-center gap-2 sm:gap-4">
            <button onClick={() => onGo(s.n)} className="flex items-center gap-3" type="button">
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:h-10 sm:w-10 ${
                active ? "border-gold-400 bg-gold-500/20 text-gold-200 shadow-gold"
                  : done ? "border-gold-500/50 bg-gold-500/10 text-gold-300"
                  : "border-white/15 bg-ink-800 text-gray-500"
              }`}>
                {done ? <Check className="h-4 w-4" /> : s.icon}
              </div>
              <span className={`hidden text-xs font-semibold uppercase tracking-wider sm:block ${
                active ? "text-gold-200" : done ? "text-gold-400/70" : "text-gray-500"
              }`}>{s.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div className="h-px flex-1 bg-gradient-to-r from-gold-500/30 to-transparent">
                <div className={`h-full bg-gold-400 transition-all duration-500 ${done ? "w-full" : "w-0"}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepHeader({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
        {icon}
      </div>
      <div>
        <h3 className="font-display text-2xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

function PremiumEstimate({
  estimate,
  form,
  insLabel,
  vehLabel,
}: {
  estimate: { old: number; final: number } | null;
  form: QuoteFormData;
  insLabel: (v: InsuranceType) => string;
  vehLabel: (v: VehicleType) => string;
}) {
  const { t, lang } = useLang();

  return (
    <div className="sticky top-24 rounded-2xl border border-gold-500/25 bg-gradient-to-b from-ink-850 to-ink-900 p-6 shadow-gold">
      <p className="mb-1 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">{t("estEyebrow")}</p>
      <p className="mb-5 text-center text-[11px] text-gray-500">{t("estPerYear")}</p>

      {estimate ? (
        <div className="animate-scale-in">
          {/* Discount badge */}
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-950 shadow-gold animate-pulse-gold">
              {t("estOff")}
            </span>
          </div>

          {/* Old price */}
          <p className="text-center text-base text-gray-500">
            <span className="line-through decoration-red-500/60 decoration-2">{fmtAed(estimate.old, lang)}</span>
            <span className="ms-2 text-xs text-gray-600">{t("estOldLabel")}</span>
          </p>

          {/* Final price */}
          <p className="mt-2 text-center font-display text-5xl font-bold gold-text leading-none">
            {fmtAed(estimate.final, lang)}
          </p>
          <p className="mt-1 text-center text-xs text-gold-400/70">{t("estFinalLabel")}</p>

          {/* Summary */}
          <div className="mt-6 space-y-2 border-t border-gold-500/15 pt-5 text-sm">
            <Row label={t("estCoverage")} value={form.insuranceType ? insLabel(form.insuranceType) : "—"} />
            <Row label={t("estVehicle")} value={form.vehicleType ? vehLabel(form.vehicleType) : "—"} />
            <Row label={t("estEngine")} value={form.engineCylinders ? `${form.engineCylinders} ${t("cyl")}` : "—"} />
            <Row label={t("estCar")} value={form.brand ? `${form.brand} ${form.model}` : "—"} />
            <Row label={t("estYear")} value={form.modelYear || "—"} />
          </div>
        </div>
      ) : (
        <div className="py-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/20 bg-gold-500/5">
            <ShieldCheck className="h-8 w-8 text-gold-500/50" />
          </div>
          <p className="text-sm text-gray-500">{t("estEmpty")}</p>
        </div>
      )}

      {/* Contact */}
      <div className="mt-6 space-y-2.5 border-t border-gold-500/15 pt-5">
        <a href={`tel:${CONTACT.phoneIntl}`} className="btn-outline-gold w-full text-xs">
          <Phone className="h-4 w-4" />
          {t("navCall")} {CONTACT.phone}
        </a>
        <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full text-xs">
          <MessageCircle className="h-4 w-4" />
          {t("whatsappUs")} {CONTACT.phone}
        </a>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gold-100">{value}</span>
    </div>
  );
}

function SuccessScreen({ estimate, onReset }: { estimate: { old: number; final: number } | null; onReset: () => void }) {
  const { t, lang } = useLang();

  return (
    <div className="animate-scale-in py-8 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-ink-950 shadow-gold-lg animate-pulse-gold">
        <PartyPopper className="h-10 w-10" />
      </div>
      <h3 className="font-display text-3xl font-semibold text-white">{t("successTitle")}</h3>
      <p className="mx-auto mt-3 max-w-md text-gray-400">{t("successBody")}</p>

      {estimate && (
        <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-gold-500/25 bg-gradient-to-b from-ink-850 to-ink-900 p-6">
          <p className="text-xs uppercase tracking-wider text-gold-400">{t("successYourEst")}</p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="text-lg text-gray-500 line-through decoration-red-500/60">{fmtAed(estimate.old, lang)}</span>
            <span className="rounded-full bg-gold-500/20 px-3 py-1 text-xs font-bold text-gold-200">{t("estOff")}</span>
          </div>
          <p className="mt-2 font-display text-4xl font-bold gold-text">{fmtAed(estimate.final, lang)}</p>
          <p className="mt-1 text-xs text-gold-400/70">{t("successPerYear")}</p>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href={`tel:${CONTACT.phoneIntl}`} className="btn-outline-gold">
          <Phone className="h-4 w-4" />
          {t("callNow")}
        </a>
        <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-gold">
          <MessageCircle className="h-4 w-4" />
          {t("whatsappUs")}
        </a>
      </div>

      <button onClick={onReset} className="mt-6 text-sm text-gray-500 underline hover:text-gold-300">
        {t("successAnother")}
      </button>
    </div>
  );
}
