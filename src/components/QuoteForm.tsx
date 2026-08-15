import { useState } from "react";
import {
  CAR_BRANDS,
  INITIAL_FORM,
  YEARS,
  calculatePremium,
  type DriverAge,
  type EngineCylinders,
  type InsuranceType,
  type LicenseYears,
  type PriceResult,
  type QuoteFormData,
  type VehicleType,
} from "../data";
import { useLang } from "../lib/LanguageContext";
import {
  ShieldCheck,
  Languages,
  Sparkles,
} from "lucide-react";

const INSURANCE_TYPES: { value: InsuranceType; key: string }[] = [
  { value: "comprehensive", key: "comprehensive" },
  { value: "third_party", key: "thirdParty" },
];
const VEHICLE_TYPES: VehicleType[] = ["Sedan", "SUV", "Coupe"];
const ENGINE_OPTIONS: EngineCylinders[] = [4, 6, 8];
const AGE_OPTIONS: DriverAge[] = ["25+", "under_25"];
const LICENSE_OPTIONS: LicenseYears[] = ["3+", "less_3"];

interface Props {
  onPriceCalculated: (form: QuoteFormData, result: PriceResult) => void;
}

export default function QuoteForm({ onPriceCalculated }: Props) {
  const { t, toggle } = useLang();
  const [form, setForm] = useState<QuoteFormData>(INITIAL_FORM);
  const [error, setError] = useState("");

  const brands = Object.keys(CAR_BRANDS);
  const models = form.brand ? CAR_BRANDS[form.brand] : [];
  const isComprehensive = form.insuranceType === "comprehensive";

  const set = <K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const formValid =
    form.insuranceType &&
    form.vehicleType &&
    form.engineCylinders &&
    form.driverAge &&
    form.licenseYears &&
    form.brand &&
    form.model &&
    form.modelYear &&
    (!isComprehensive || (form.carValue && parseFloat(form.carValue) > 0));

  const handleSubmit = () => {
    if (!formValid) {
      setError(t("selectAllFields"));
      return;
    }
    setError("");
    const result = calculatePremium(form);
    if (result) {
      onPriceCalculated(form, result);
    }
  };

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-gold opacity-10" />
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gold-500/8 blur-[160px]" />
      </div>

      {/* Language toggle */}
      <button
        onClick={toggle}
        className="fixed end-5 top-5 z-50 flex h-10 items-center gap-2 rounded-full border border-gold-500/30 bg-ink-900/90 px-4 text-sm font-medium text-gold-200 backdrop-blur transition-all hover:bg-gold-500/15"
        aria-label="Toggle language"
      >
        <Languages className="h-4 w-4" />
        {t("langToggle")}
      </button>

      {/* Main split layout */}
      <div className="relative z-10 flex min-h-screen flex-col-reverse items-center lg:flex-row lg:items-stretch">
        {/* Form side - left on desktop, first on mobile */}
        <div className="flex w-full items-center justify-center px-4 py-8 sm:px-6 lg:w-1/2 lg:px-12 xl:px-16">
          <div className="card-lux w-full max-w-lg p-5 shadow-gold-lg sm:p-7 lg:max-w-xl">
            {/* Logo + title */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/40 bg-gradient-to-br from-ink-800 to-ink-900 shadow-gold">
                <ShieldCheck className="h-7 w-7 text-gold-400" strokeWidth={1.5} />
              </div>
              <p className="font-display text-xl font-semibold tracking-wide text-gold-200">
                {t("brandName")} <span className="text-gray-600">|</span> {t("brandTagline")}
              </p>
              <h1 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
                {t("formTitle")}
              </h1>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              {/* 1. Insurance type */}
              <Field label={t("insuranceType")}>
                <div className="grid grid-cols-2 gap-2.5">
                  {INSURANCE_TYPES.map((it) => (
                    <button
                      key={it.value}
                      onClick={() => set("insuranceType", it.value)}
                      className={`chip ${form.insuranceType === it.value ? "chip-active" : "chip-idle"}`}
                    >
                      {t(it.key)}
                    </button>
                  ))}
                </div>
              </Field>

              {/* 2. Vehicle type */}
              <Field label={t("vehicleType")}>
                <div className="grid grid-cols-3 gap-2.5">
                  {VEHICLE_TYPES.map((v) => (
                    <button
                      key={v}
                      onClick={() => set("vehicleType", v)}
                      className={`chip ${form.vehicleType === v ? "chip-active" : "chip-idle"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </Field>

              {/* 3. Engine cylinders */}
              <Field label={t("engineCylinders")}>
                <div className="grid grid-cols-3 gap-2.5">
                  {ENGINE_OPTIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => set("engineCylinders", c)}
                      className={`chip ${form.engineCylinders === c ? "chip-active" : "chip-idle"}`}
                    >
                      <span className="font-display text-lg font-semibold">{c}</span>
                      <span className="ms-1 text-xs">{t("cylinders")}</span>
                    </button>
                  ))}
                </div>
              </Field>

              {/* 4. Car value (comprehensive only) */}
              {isComprehensive && (
                <Field label={t("carValue")}>
                  <input
                    type="number"
                    inputMode="numeric"
                    className="input-lux"
                    placeholder={t("carValuePlaceholder")}
                    value={form.carValue}
                    onChange={(e) => set("carValue", e.target.value)}
                    min="0"
                  />
                </Field>
              )}

              {/* 5. Driver age */}
              <Field label={t("driverAge")}>
                <div className="grid grid-cols-2 gap-2.5">
                  {AGE_OPTIONS.map((a) => (
                    <button
                      key={a}
                      onClick={() => set("driverAge", a)}
                      className={`chip ${form.driverAge === a ? "chip-active" : "chip-idle"}`}
                    >
                      {a === "25+" ? t("age25Plus") : t("ageUnder25")}
                    </button>
                  ))}
                </div>
              </Field>

              {/* 6. License years */}
              <Field label={t("licenseYears")}>
                <div className="grid grid-cols-2 gap-2.5">
                  {LICENSE_OPTIONS.map((l) => (
                    <button
                      key={l}
                      onClick={() => set("licenseYears", l)}
                      className={`chip ${form.licenseYears === l ? "chip-active" : "chip-idle"}`}
                    >
                      {l === "3+" ? t("lic3Plus") : t("licLess3")}
                    </button>
                  ))}
                </div>
              </Field>

              {/* 7. Brand */}
              <Field label={t("brand")}>
                <select
                  className="select-lux"
                  value={form.brand}
                  onChange={(e) => {
                    set("brand", e.target.value);
                    set("model", "");
                  }}
                >
                  <option value="">{t("selectBrand")}</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </Field>

              {/* 8. Model + 9. Year */}
              <div className="grid grid-cols-2 gap-3">
                <Field label={t("model")}>
                  <select
                    className="select-lux"
                    value={form.model}
                    disabled={!form.brand}
                    onChange={(e) => set("model", e.target.value)}
                  >
                    <option value="">{form.brand ? t("selectModel") : t("chooseBrandFirst")}</option>
                    {models.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </Field>
                <Field label={t("modelYear")}>
                  <select
                    className="select-lux"
                    value={form.modelYear}
                    onChange={(e) => set("modelYear", e.target.value)}
                  >
                    <option value="">{t("selectYear")}</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Error message */}
              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm text-red-300">
                  {error}
                </p>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!formValid}
                className={`btn-gold-lg ${!formValid ? "pointer-events-none opacity-40" : ""}`}
              >
                <Sparkles className="h-5 w-5" />
                {t("getPrice")}
              </button>
            </div>
          </div>
        </div>

        {/* Car image side - right on desktop, second on mobile */}
        <div className="relative flex w-full items-center justify-center overflow-hidden lg:w-1/2 lg:min-h-screen">
          {/* Hero text overlay on desktop */}
          <div className="absolute inset-0 z-10 flex flex-col items-start justify-center px-8 lg:px-12 xl:px-16">
            <div className="max-w-md animate-fade-up">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-gold-400">
                {t("brandName")} {t("brandTagline")}
              </p>
              <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                {t("heroTitle")}
              </h2>
              <p className="mt-3 text-base text-gray-400 lg:text-lg">{t("heroSubtitle")}</p>
            </div>
          </div>

          {/* Car image */}
          <img
            src="https://images.pexels.com/photos/261986/pexels-photo-261986.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Luxury car"
            className="h-full w-full object-cover opacity-60"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-ink-950/30 lg:to-ink-950" />
        </div>
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
