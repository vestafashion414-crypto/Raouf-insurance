import { useMemo, useState } from "react";
import {
  CAR_BRANDS,
  CONTACT,
  INSURANCE_TYPE_AR,
  INITIAL_FORM,
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
import { ShieldCheck, Phone, MessageCircle, Languages, Check, Loader as Loader2, PartyPopper } from "lucide-react";

const INSURANCE_TYPES: InsuranceType[] = ["Comprehensive", "Third Party"];
const VEHICLE_TYPES: { value: VehicleType; img: string }[] = [
  { value: "Sedan", img: "/car-sedan.webp" },
  { value: "SUV", img: "/car-suv.webp" },
  { value: "Coupe", img: "/car-coupe.webp" },
];
const ENGINE_OPTIONS: EngineCylinders[] = [4, 6, 8];

export default function QuoteCalculator() {
  const { t, lang, toggle } = useLang();
  const [form, setForm] = useState<QuoteFormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const estimate = useMemo(() => calculatePremium(form), [form]);
  const brands = Object.keys(CAR_BRANDS);
  const models = form.brand ? CAR_BRANDS[form.brand] : [];

  const set = <K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const insLabel = (v: InsuranceType) => (lang === "ar" ? INSURANCE_TYPE_AR[v] : v);
  const vehLabel = (v: VehicleType) => (lang === "ar" ? VEHICLE_TYPE_AR[v] : v);

  const handleGetPrice = async () => {
    if (!estimate) return;
    setSubmitting(true);
    try {
      await supabase.from("quote_submissions").insert({
        insurance_type: form.insuranceType,
        vehicle_type: form.vehicleType,
        engine_cylinders: form.engineCylinders,
        brand: form.brand,
        model: form.model,
        model_year: form.modelYear,
        customer_name: "—",
        mobile_number: CONTACT.phone,
        email: "—",
        notes: null,
        estimated_premium: estimate.final,
        language: lang,
      });
    } catch {
      /* price still shown to user */
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const reset = () => {
    setForm(INITIAL_FORM);
    setSubmitted(false);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/hero-luxury-car.webp"
          alt="Black luxury car"
          className="h-full w-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/90 via-ink-950/85 to-ink-950" />
        <div className="absolute inset-0 bg-grid-gold opacity-20" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/8 blur-[140px]" />
      </div>

      {/* Language toggle */}
      <button
        onClick={toggle}
        className="fixed end-5 top-5 z-50 flex h-11 items-center gap-2 rounded-full border border-gold-500/30 bg-ink-900/90 px-4 text-sm font-medium text-gold-200 backdrop-blur transition-all hover:bg-gold-500/15"
        aria-label="Toggle language"
      >
        <Languages className="h-4 w-4" />
        {lang === "en" ? "العربية" : "English"}
      </button>

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl">
        {submitted && estimate ? (
          <SuccessCard estimate={estimate} onReset={reset} />
        ) : (
          <div className="card-lux p-6 shadow-gold-lg sm:p-8 lg:p-10">
            {/* Logo + title */}
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-500/40 bg-gradient-to-br from-ink-800 to-ink-900 shadow-gold">
                <ShieldCheck className="h-8 w-8 text-gold-400" strokeWidth={1.5} />
              </div>
              <p className="font-display text-2xl font-semibold tracking-wide text-gold-200">
                {t("brandName")} <span className="text-gray-400">|</span> {t("brandTagline")}
              </p>
              <h1 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
                {t("heroTitle")}
              </h1>
            </div>

            <div className="space-y-6">
              {/* Insurance Type */}
              <Field label={t("insuranceType")}>
                <div className="grid grid-cols-2 gap-3">
                  {INSURANCE_TYPES.map((it) => (
                    <button
                      key={it}
                      onClick={() => set("insuranceType", it)}
                      className={`chip ${form.insuranceType === it ? "chip-active" : "chip-idle"}`}
                    >
                      {insLabel(it)}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Vehicle Type */}
              <Field label={t("vehicleType")}>
                <div className="grid grid-cols-3 gap-3">
                  {VEHICLE_TYPES.map((v) => (
                    <button
                      key={v.value}
                      onClick={() => set("vehicleType", v.value)}
                      className={`group relative overflow-hidden rounded-xl border p-1 transition-all duration-300 ${
                        form.vehicleType === v.value ? "border-gold-400 shadow-gold" : "border-white/10 hover:border-gold-500/40"
                      }`}
                    >
                      <div className="relative h-20 overflow-hidden rounded-lg sm:h-24">
                        <img src={v.img} alt={vehLabel(v.value)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
                      </div>
                      <p className={`py-1.5 text-center text-xs font-semibold sm:text-sm ${form.vehicleType === v.value ? "text-gold-200" : "text-gray-300"}`}>
                        {vehLabel(v.value)}
                      </p>
                    </button>
                  ))}
                </div>
              </Field>

              {/* Cylinders */}
              <Field label={t("engineCylinders")}>
                <div className="grid grid-cols-3 gap-3">
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
              </Field>

              {/* Brand / Model / Year */}
              <div className="grid gap-4 sm:grid-cols-3">
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
                <div>
                  <label className="label-lux" htmlFor="year">{t("modelYear")}</label>
                  <select id="year" className="select-lux" value={form.modelYear}
                    onChange={(e) => set("modelYear", e.target.value)}>
                    <option value="">{t("selectYear")}</option>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {/* Price display */}
              <PriceDisplay estimate={estimate} form={form} insLabel={insLabel} vehLabel={vehLabel} />

              {/* Get Price button */}
              <button
                onClick={handleGetPrice}
                disabled={!estimate || submitting}
                className={`btn-gold w-full py-4 text-base ${!estimate || submitting ? "pointer-events-none opacity-40" : ""}`}
              >
                {submitting ? (
                  <><Loader2 className="h-5 w-5 animate-spin" />{lang === "ar" ? "جارٍ الحساب…" : "Calculating…"}</>
                ) : (
                  <>{t("getPrice")}</>
                )}
              </button>

              {/* Contact buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a href={`tel:${CONTACT.phoneIntl}`} className="btn-outline-gold w-full">
                  <Phone className="h-4 w-4" />
                  {t("callNow")} {CONTACT.phone}
                </a>
                <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full">
                  <MessageCircle className="h-4 w-4" />
                  {t("whatsappUs")} {CONTACT.phone}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label-lux">{label}</p>
      {children}
    </div>
  );
}

function PriceDisplay({
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

  if (!estimate) {
    return (
      <div className="rounded-xl border border-gold-500/15 bg-ink-900/60 p-5 text-center">
        <p className="text-sm text-gray-500">{t("estEmpty")}</p>
      </div>
    );
  }

  return (
    <div className="animate-scale-in rounded-xl border border-gold-500/30 bg-gradient-to-b from-ink-850 to-ink-900 p-5 shadow-gold">
      <div className="flex items-center justify-between gap-4">
        {/* Left: label + details */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">{t("estEyebrow")}</span>
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-950">
              {t("estOff")}
            </span>
          </div>
          <div className="space-y-1 text-xs text-gray-400">
            {form.insuranceType && <p><span className="text-gray-500">{t("estCoverage")}:</span> <span className="text-gold-100">{insLabel(form.insuranceType)}</span></p>}
            {form.vehicleType && <p><span className="text-gray-500">{t("estVehicle")}:</span> <span className="text-gold-100">{vehLabel(form.vehicleType)} · {form.engineCylinders}{t("cyl")}</span></p>}
            {form.brand && <p><span className="text-gray-500">{t("estCar")}:</span> <span className="text-gold-100">{form.brand} {form.model} {form.modelYear}</span></p>}
          </div>
        </div>

        {/* Right: price */}
        <div className="text-end">
          <p className="text-sm text-gray-500 line-through decoration-red-500/60 decoration-2">
            {fmtAed(estimate.old, lang)}
            <span className="ms-1 text-xs text-gray-600">{t("estPerYear")}</span>
          </p>
          <p className="font-display text-4xl font-bold gold-text leading-none sm:text-5xl">
            {fmtAed(estimate.final, lang)}
          </p>
          <p className="mt-0.5 text-[10px] text-gold-400/70">{t("estFinalLabel")}</p>
        </div>
      </div>
    </div>
  );
}

function SuccessCard({ estimate, onReset }: { estimate: { old: number; final: number }; onReset: () => void }) {
  const { t, lang } = useLang();

  return (
    <div className="card-lux animate-scale-in p-8 text-center shadow-gold-lg sm:p-10">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-ink-950 shadow-gold-lg animate-pulse-gold">
        <PartyPopper className="h-10 w-10" />
      </div>

      <p className="text-xs font-semibold uppercase tracking-wider text-gold-400">{t("estEyebrow")}</p>

      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="text-lg text-gray-500 line-through decoration-red-500/60">{fmtAed(estimate.old, lang)}</span>
        <span className="rounded-full bg-gold-500/20 px-3 py-1 text-xs font-bold text-gold-200">{t("estOff")}</span>
      </div>
      <p className="mt-2 font-display text-6xl font-bold gold-text">{fmtAed(estimate.final, lang)}</p>
      <p className="mt-1 text-xs text-gold-400/70">{t("estFinalLabel")}</p>

      <div className="mx-auto mt-4 flex items-center justify-center gap-2 text-sm text-gray-300">
        <Check className="h-4 w-4 text-gold-400" />
        {lang === "ar" ? "تم حفظ السعر لك" : "Price locked in for you"}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <a href={`tel:${CONTACT.phoneIntl}`} className="btn-outline-gold w-full">
          <Phone className="h-4 w-4" />
          {t("callNow")} {CONTACT.phone}
        </a>
        <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">
          <MessageCircle className="h-4 w-4" />
          {t("whatsappUs")}
        </a>
      </div>

      <button onClick={onReset} className="mt-6 text-sm text-gray-500 underline hover:text-gold-300">
        {lang === "ar" ? "حساب سعر آخر" : "Calculate another price"}
      </button>
    </div>
  );
}
