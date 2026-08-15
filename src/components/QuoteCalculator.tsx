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
  type DriverAge,
  type EngineCylinders,
  type InsuranceType,
  type Lang,
  type LicenseYears,
  type QuoteFormData,
  type VehicleType,
} from "../data";
import { useLang } from "../lib/LanguageContext";
import { ShieldCheck, Phone, Building2, MessageCircle, Languages, Car, CircleUser as UserCircle, Contact as ContactIcon, ChevronRight, ChevronLeft, Check, Sparkles, Info } from "lucide-react";

const INSURANCE_TYPES: InsuranceType[] = ["Comprehensive", "Third Party"];
const VEHICLE_TYPES: { value: VehicleType; img: string }[] = [
  { value: "Sedan", img: "/car-sedan.webp" },
  { value: "SUV", img: "/car-suv.webp" },
  { value: "Coupe", img: "/car-coupe.webp" },
];
const ENGINE_OPTIONS: EngineCylinders[] = [4, 6, 8];
const AGE_OPTIONS: DriverAge[] = ["25+", "Under 25"];
const LICENSE_OPTIONS: LicenseYears[] = ["3+", "Less than 3"];

export default function QuoteCalculator() {
  const { t, lang, toggle } = useLang();
  const [form, setForm] = useState<QuoteFormData>(INITIAL_FORM);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const estimate = useMemo(() => calculatePremium(form), [form]);
  const brands = Object.keys(CAR_BRANDS);
  const models = form.brand ? CAR_BRANDS[form.brand] : [];

  const set = <K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const insLabel = (v: InsuranceType) => (lang === "ar" ? INSURANCE_TYPE_AR[v] : v);
  const vehLabel = (v: VehicleType) => (lang === "ar" ? VEHICLE_TYPE_AR[v] : v);

  const step1Valid = !!(form.insuranceType && form.vehicleType && form.engineCylinders && form.driverAge && form.licenseYears);
  const step2Valid = !!(form.brand && form.model && form.modelYear);
  const step3Valid = !!(form.customerName && form.phone);

  const goNext = () => {
    if (step === 1 && !step1Valid) return;
    if (step === 2 && !step2Valid) return;
    setDirection("forward");
    setStep((s) => Math.min(3, s + 1));
  };
  const goBack = () => {
    setDirection("back");
    setStep((s) => Math.max(1, s - 1));
  };

  const animClass = direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left";

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="/hero-luxury-car.webp" alt="" className="h-full w-full object-cover opacity-35" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/92 via-ink-950/88 to-ink-950" />
        <div className="absolute inset-0 bg-grid-gold opacity-15" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/8 blur-[140px]" />
      </div>

      {/* Language toggle */}
      <button
        onClick={toggle}
        className="fixed end-5 top-5 z-50 flex h-10 items-center gap-2 rounded-full border border-gold-500/30 bg-ink-900/90 px-3.5 text-sm font-medium text-gold-200 backdrop-blur transition-all hover:bg-gold-500/15"
        aria-label="Toggle language"
      >
        <Languages className="h-4 w-4" />
        {lang === "en" ? "العربية" : "English"}
      </button>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="card-lux p-5 shadow-gold-lg sm:p-7">
          {/* Logo + title */}
          <div className="mb-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/40 bg-gradient-to-br from-ink-800 to-ink-900 shadow-gold">
              <ShieldCheck className="h-7 w-7 text-gold-400" strokeWidth={1.5} />
            </div>
            <p className="font-display text-xl font-semibold tracking-wide text-gold-200">
              {t("brandName")} <span className="text-gray-500">|</span> {t("brandTagline")}
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">{t("heroTitle")}</h1>
          </div>

          {/* Step indicator */}
          <div className="mb-5 flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => {
              const Icon = s === 1 ? Car : s === 2 ? UserCircle : ContactIcon;
              const isActive = step === s;
              const isDone = step > s;
              return (
                <div key={s} className="flex items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? "border-gold-400 bg-gold-500/15 text-gold-300 shadow-gold"
                        : isDone
                        ? "border-gold-600 bg-gold-600/15 text-gold-400"
                        : "border-white/10 bg-ink-800 text-gray-600"
                    }`}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  {s < 3 && (
                    <div className={`mx-1 h-0.5 w-6 rounded-full transition-all duration-300 ${step > s ? "bg-gold-500/60" : "bg-white/10"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <div key={step} className={animClass}>
            {step === 1 && <Step1 form={form} set={set} insLabel={insLabel} vehLabel={vehLabel} />}
            {step === 2 && <Step2 form={form} set={set} brands={brands} models={models} />}
            {step === 3 && <Step3 form={form} set={set} />}
          </div>

          {/* Price card — always visible, updates instantly */}
          <PriceCard estimate={estimate} />

          {/* Navigation */}
          <div className="mt-4 flex gap-3">
            {step > 1 && (
              <button onClick={goBack} className="btn-ghost flex-shrink-0 px-5 py-3.5">
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                {t("back")}
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={goNext}
                disabled={step === 1 ? !step1Valid : !step2Valid}
                className={`btn-gold flex-1 py-3.5 ${(step === 1 ? !step1Valid : !step2Valid) ? "pointer-events-none opacity-40" : ""}`}
              >
                {t("next")}
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            ) : (
              <a
                href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(whatsappMsg(form, estimate, lang))}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-gold flex-1 py-3.5 ${!step3Valid ? "pointer-events-none opacity-40" : ""}`}
              >
                <MessageCircle className="h-4 w-4" />
                {t("getQuote")}
              </a>
            )}
          </div>
        </div>

        {/* Price note */}
        <p className="mt-3 flex items-start gap-2 rounded-lg border border-gold-500/15 bg-ink-900/60 p-3 text-[11px] leading-relaxed text-gray-400">
          <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold-500/60" />
          {t("priceNote")}
        </p>

        {/* Contact buttons (always visible) */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <a href={`tel:${CONTACT.phoneIntl}`} className="btn-outline-gold w-full py-3 text-sm">
            <Phone className="h-4 w-4" />
            {t("callNow")}
          </a>
          <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full py-3 text-sm">
            <MessageCircle className="h-4 w-4" />
            {t("whatsappUs")}
          </a>
        </div>

        {/* About Us */}
        <div className="mt-4 rounded-2xl border border-gold-500/15 bg-ink-900/60 p-5 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-gold-500/30 bg-gradient-to-br from-ink-800 to-ink-900">
            <Building2 className="h-5 w-5 text-gold-400" />
          </div>
          <h3 className="font-display text-lg font-semibold text-gold-100">{t("aboutTitle")}</h3>
          <p className="mt-2 text-xs leading-relaxed text-gray-400">{t("aboutText")}</p>
        </div>
      </div>
    </section>
  );

  function whatsappMsg(f: QuoteFormData, est: { amount: number; tier: string } | null, l: Lang): string {
    if (!est) return "";
    const age = f.driverAge === "25+" ? (l === "ar" ? "25 سنة فما فوق" : "25 years and above") : (l === "ar" ? "أقل من 25 سنة" : "Under 25 years");
    const lic = f.licenseYears === "3+" ? (l === "ar" ? "3 سنوات أو أكثر" : "3 years or more") : (l === "ar" ? "أقل من 3 سنوات" : "Less than 3 years");
    const vtype = l === "ar" ? VEHICLE_TYPE_AR[f.vehicleType as VehicleType] : f.vehicleType;
    const itype = l === "ar" ? INSURANCE_TYPE_AR[f.insuranceType as InsuranceType] : f.insuranceType;
    if (l === "ar") {
      return [
        "طلب عرض سعر تأمين:",
        `الاسم: ${f.customerName || "-"}`,
        `الهاتف: ${f.phone || "-"}`,
        `نوع التأمين: ${itype || "-"}`,
        `نوع المركبة: ${vtype || "-"}`,
        `الأسطوانات: ${f.engineCylinders ?? "-"}`,
        `عمر السائق: ${age}`,
        `رخصة القيادة: ${lic}`,
        `العلامة: ${f.brand || "-"}`,
        `الموديل: ${f.model || "-"}`,
        `سنة الموديل: ${f.modelYear || "-"}`,
        `القسط المقدر: ${fmtAed(est.amount, "ar")} / سنوياً`,
      ].join("\n");
    }
    return [
      "Insurance Quote Request:",
      `Name: ${f.customerName || "-"}`,
      `Phone: ${f.phone || "-"}`,
      `Insurance Type: ${itype || "-"}`,
      `Vehicle Type: ${vtype || "-"}`,
      `Cylinders: ${f.engineCylinders ?? "-"}`,
      `Driver Age: ${age}`,
      `Driving License: ${lic}`,
      `Vehicle Brand: ${f.brand || "-"}`,
      `Vehicle Model: ${f.model || "-"}`,
      `Model Year: ${f.modelYear || "-"}`,
      `Estimated Premium: ${fmtAed(est.amount, "en")} / year`,
    ].join("\n");
  }
}

/* ---------- Step 1: Vehicle + Driver (all pricing factors) ---------- */
function Step1({
  form,
  set,
  insLabel,
  vehLabel,
}: {
  form: QuoteFormData;
  set: <K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) => void;
  insLabel: (v: InsuranceType) => string;
  vehLabel: (v: VehicleType) => string;
}) {
  const { t } = useLang();
  return (
    <div className="space-y-5">
      <div className="mb-1 flex items-center gap-2">
        <Car className="h-5 w-5 text-gold-400" />
        <h2 className="font-display text-lg font-semibold text-gold-100">{t("step1Title")}</h2>
      </div>

      <Field label={t("insuranceType")}>
        <div className="grid grid-cols-2 gap-2.5">
          {INSURANCE_TYPES.map((it) => (
            <button key={it} onClick={() => set("insuranceType", it)} className={`chip ${form.insuranceType === it ? "chip-active" : "chip-idle"}`}>
              {insLabel(it)}
            </button>
          ))}
        </div>
      </Field>

      <Field label={t("vehicleType")}>
        <div className="grid grid-cols-3 gap-2.5">
          {VEHICLE_TYPES.map((v) => (
            <button
              key={v.value}
              onClick={() => set("vehicleType", v.value)}
              className={`group relative overflow-hidden rounded-xl border p-1 transition-all duration-300 ${
                form.vehicleType === v.value ? "border-gold-400 shadow-gold" : "border-white/10 hover:border-gold-500/40"
              }`}
            >
              <div className="relative h-16 overflow-hidden rounded-lg">
                <img src={v.img} alt={vehLabel(v.value)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
              </div>
              <p className={`py-1 text-center text-xs font-semibold ${form.vehicleType === v.value ? "text-gold-200" : "text-gray-300"}`}>
                {vehLabel(v.value)}
              </p>
            </button>
          ))}
        </div>
      </Field>

      <Field label={t("engineCylinders")}>
        <div className="grid grid-cols-3 gap-2.5">
          {ENGINE_OPTIONS.map((c) => (
            <button key={c} onClick={() => set("engineCylinders", c)} className={`chip ${form.engineCylinders === c ? "chip-active" : "chip-idle"}`}>
              <span className="font-display text-lg font-semibold">{c}</span>
              <span className="ms-1 text-xs">{t("cyl")}</span>
            </button>
          ))}
        </div>
      </Field>

      <Field label={t("driverAge")}>
        <div className="grid grid-cols-2 gap-2.5">
          {AGE_OPTIONS.map((a) => (
            <button key={a} onClick={() => set("driverAge", a)} className={`chip ${form.driverAge === a ? "chip-active" : "chip-idle"}`}>
              {a === "25+" ? t("age25Plus") : t("ageUnder25")}
            </button>
          ))}
        </div>
      </Field>

      <Field label={t("licenseYears")}>
        <div className="grid grid-cols-1 gap-2.5">
          {LICENSE_OPTIONS.map((l) => (
            <button key={l} onClick={() => set("licenseYears", l)} className={`chip text-start ${form.licenseYears === l ? "chip-active" : "chip-idle"}`}>
              {l === "3+" ? t("lic3Plus") : t("licLess3")}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

/* ---------- Step 2: Car details ---------- */
function Step2({
  form,
  set,
  brands,
  models,
}: {
  form: QuoteFormData;
  set: <K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) => void;
  brands: string[];
  models: string[];
}) {
  const { t } = useLang();
  return (
    <div className="space-y-5">
      <div className="mb-1 flex items-center gap-2">
        <UserCircle className="h-5 w-5 text-gold-400" />
        <h2 className="font-display text-lg font-semibold text-gold-100">{t("step2Title")}</h2>
      </div>

      <Field label={t("brand")}>
        <select className="select-lux" value={form.brand} onChange={(e) => { set("brand", e.target.value); set("model", ""); }}>
          <option value="">{t("selectBrand")}</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t("model")}>
          <select className="select-lux" value={form.model} disabled={!form.brand} onChange={(e) => set("model", e.target.value)}>
            <option value="">{form.brand ? t("selectModel") : t("chooseBrandFirst")}</option>
            {models.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label={t("modelYear")}>
          <select className="select-lux" value={form.modelYear} onChange={(e) => set("modelYear", e.target.value)}>
            <option value="">{t("selectYear")}</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );
}

/* ---------- Step 3: Contact ---------- */
function Step3({
  form,
  set,
}: {
  form: QuoteFormData;
  set: <K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) => void;
}) {
  const { t } = useLang();
  return (
    <div className="space-y-5">
      <div className="mb-1 flex items-center gap-2">
        <ContactIcon className="h-5 w-5 text-gold-400" />
        <h2 className="font-display text-lg font-semibold text-gold-100">{t("step3Title")}</h2>
      </div>

      <Field label={t("customerName")}>
        <input className="input-lux" placeholder={t("fullName")} value={form.customerName} onChange={(e) => set("customerName", e.target.value)} />
      </Field>

      <Field label={t("phone")}>
        <input className="input-lux" type="tel" placeholder={t("phonePlaceholder")} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </Field>

      <Field label={t("whatsapp")}>
        <input className="input-lux" type="tel" placeholder={t("phonePlaceholder")} value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
      </Field>

      <Field label={t("email")}>
        <input className="input-lux" type="email" placeholder={t("emailPlaceholder")} value={form.email} onChange={(e) => set("email", e.target.value)} />
      </Field>
    </div>
  );
}

/* ---------- Price card (always visible, large gold card) ---------- */
function PriceCard({ estimate }: { estimate: { amount: number; tier: string } | null }) {
  const { t, lang } = useLang();

  if (!estimate) {
    return (
      <div className="mt-5 rounded-2xl border border-gold-500/15 bg-ink-900/60 p-5 text-center">
        <Sparkles className="mx-auto mb-2 h-5 w-5 text-gold-500/40" />
        <p className="text-sm text-gray-500">{t("selectToSee")}</p>
      </div>
    );
  }

  return (
    <div className="mt-5 animate-scale-in rounded-2xl border border-gold-500/40 bg-gradient-to-br from-gold-500/15 via-ink-850 to-ink-900 p-5 shadow-gold-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gold-400" />
          <span className="text-sm font-semibold uppercase tracking-wider text-gold-300">{t("estEyebrow")}</span>
        </div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${estimate.tier === "base" ? "bg-gold-500/25 text-gold-200" : "bg-orange-500/20 text-orange-300"}`}>
          {estimate.tier === "base" ? t("estBase") : t("estHigh")}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-5xl font-bold gold-text leading-none">{fmtAed(estimate.amount, lang)}</span>
        <span className="text-sm text-gray-400">{t("estPerYear")}</span>
      </div>
    </div>
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
