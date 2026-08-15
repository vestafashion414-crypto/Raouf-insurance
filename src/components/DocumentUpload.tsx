import { useRef, useState } from "react";
import {
  CONTACT,
  fmtAed,
  type PriceResult,
  type QuoteFormData,
} from "../data";
import { useLang } from "../lib/LanguageContext";
import { supabase } from "../lib/supabase";
import {
  ShieldCheck,
  FileText,
  Upload,
  Check,
  ChevronRight,
  MessageCircle,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Props {
  form: QuoteFormData;
  price: PriceResult;
  onNewQuote: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type DocKey = "drivingLicense" | "emiratesId" | "carOwnership";

export default function DocumentUpload({ form, price, onNewQuote }: Props) {
  const { t, lang } = useLang();
  const [files, setFiles] = useState<Record<DocKey, File | null>>({
    drivingLicense: null,
    emiratesId: null,
    carOwnership: null,
  });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFile = (key: DocKey, file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE) {
      setError(t("fileTooBig"));
      return;
    }
    setError("");
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const allFilesUploaded = files.drivingLicense && files.emiratesId && files.carOwnership;
  const formValid = allFilesUploaded && name.trim() && phone.trim();

  const handleSubmit = async () => {
    if (!formValid) {
      setError(t("selectAllFields"));
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const uploadPromises = (Object.keys(files) as DocKey[]).map(async (key) => {
        const file = files[key];
        if (!file) return null;
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${key}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("quote-documents")
          .upload(path, file);
        if (uploadError) throw uploadError;
        return { key, path };
      });

      const uploaded = await Promise.all(uploadPromises);

      const { error: insertError } = await supabase.from("quote_requests").insert({
        insurance_type: form.insuranceType,
        vehicle_type: form.vehicleType,
        engine_cylinders: form.engineCylinders,
        car_value: form.carValue ? parseFloat(form.carValue) : null,
        driver_age: form.driverAge,
        license_years: form.licenseYears,
        brand: form.brand,
        model: form.model,
        model_year: form.modelYear,
        estimated_price: price.needsContact ? null : price.amount,
        needs_contact: price.needsContact,
        customer_name: name,
        phone: phone,
        email: email || null,
        driving_license_path: uploaded[0]?.path ?? null,
        emirates_id_path: uploaded[1]?.path ?? null,
        car_ownership_path: uploaded[2]?.path ?? null,
      });

      if (insertError) throw insertError;

      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-quote-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            record: {
              customer_name: name,
              phone,
              email: email || null,
              insurance_type: form.insuranceType,
              brand: form.brand,
              model: form.model,
              model_year: form.modelYear,
              vehicle_type: form.vehicleType,
              engine_cylinders: form.engineCylinders,
              car_value: form.carValue ? parseFloat(form.carValue) : null,
              driver_age: form.driverAge,
              license_years: form.licenseYears,
              estimated_price: price.needsContact ? null : price.amount,
              needs_contact: price.needsContact,
              driving_license_path: uploaded[0]?.path ?? null,
              emirates_id_path: uploaded[1]?.path ?? null,
              car_ownership_path: uploaded[2]?.path ?? null,
              created_at: new Date().toISOString(),
            },
          }),
        });
      } catch {
        // Email failure shouldn't block success
      }

      setSuccess(true);
    } catch (err) {
      setError(t("submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-gold opacity-10" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gold-500/8 blur-[160px]" />
        </div>
        <div className="card-lux relative z-10 w-full max-w-md p-8 text-center shadow-gold-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/15">
            <Check className="h-8 w-8 text-gold-400" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-gold-100">{t("submitSuccess")}</h2>
          <button onClick={onNewQuote} className="btn-gold mt-6 mx-auto">
            {t("newQuote")}
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-gold opacity-10" />
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gold-500/8 blur-[160px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg space-y-4">
        {/* Price summary card */}
        <div className="card-lux p-5 shadow-gold">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold-400" />
              <span className="text-sm font-semibold uppercase tracking-wider text-gold-300">
                {t("yourPrice")}
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold gold-text leading-none">
              {price.needsContact
                ? t("contactForPrice")
                : fmtAed(price.amount, lang)}
            </span>
            {!price.needsContact && <span className="text-sm text-gray-400">{t("perYear")}</span>}
          </div>
          {price.needsContact && (
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold mt-4 w-full"
            >
              <MessageCircle className="h-4 w-4" />
              {t("whatsappUs")}
            </a>
          )}
        </div>

        {/* Documents section */}
        <div className="card-lux p-5 shadow-gold-lg sm:p-7">
          <div className="mb-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/40 bg-gradient-to-br from-ink-800 to-ink-900 shadow-gold">
              <ShieldCheck className="h-7 w-7 text-gold-400" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-2xl font-semibold text-white">{t("docsTitle")}</h1>
            <p className="mt-1 text-sm text-gray-400">{t("docsSubtitle")}</p>
          </div>

          {/* File uploads */}
          <div className="space-y-3">
            <p className="label-lux">{t("requiredDocs")}</p>
            <FileUpload
              label={t("drivingLicense")}
              icon={<FileText className="h-5 w-5 text-gold-400" />}
              file={files.drivingLicense}
              onChange={(f) => handleFile("drivingLicense", f)}
              placeholder={t("uploadFile")}
              uploadedLabel={t("fileUploaded")}
              changeLabel={t("changeFile")}
            />
            <FileUpload
              label={t("emiratesId")}
              icon={<FileText className="h-5 w-5 text-gold-400" />}
              file={files.emiratesId}
              onChange={(f) => handleFile("emiratesId", f)}
              placeholder={t("uploadFile")}
              uploadedLabel={t("fileUploaded")}
              changeLabel={t("changeFile")}
            />
            <FileUpload
              label={t("carOwnership")}
              icon={<FileText className="h-5 w-5 text-gold-400" />}
              file={files.carOwnership}
              onChange={(f) => handleFile("carOwnership", f)}
              placeholder={t("uploadFile")}
              uploadedLabel={t("fileUploaded")}
              changeLabel={t("changeFile")}
            />
          </div>

          {/* Contact info */}
          <div className="mt-5 space-y-3">
            <p className="label-lux">{t("contactInfo")}</p>
            <input
              className="input-lux"
              placeholder={t("fullNamePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input-lux"
              type="tel"
              placeholder={t("phonePlaceholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              className="input-lux"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!formValid || submitting}
            className={`btn-gold-lg mt-5 ${!formValid || submitting ? "pointer-events-none opacity-40" : ""}`}
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("submitting")}
              </>
            ) : (
              <>
                {t("submitRequest")}
                <ArrowRight className="h-5 w-5 rtl:rotate-180" />
              </>
            )}
          </button>

          <button
            onClick={onNewQuote}
            className="mt-3 w-full text-center text-sm text-gray-400 transition-colors hover:text-gold-300"
          >
            {t("backToForm")}
          </button>
        </div>
      </div>
    </section>
  );
}

function FileUpload({
  label,
  icon,
  file,
  onChange,
  placeholder,
  uploadedLabel,
  changeLabel,
}: {
  label: string;
  icon: React.ReactNode;
  file: File | null;
  onChange: (file: File | null) => void;
  placeholder: string;
  uploadedLabel: string;
  changeLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-gold-100">{label}</span>
      </div>
      <div
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all duration-200 ${
          file
            ? "border-gold-500/40 bg-gold-500/10"
            : "border-white/10 bg-ink-900/60 hover:border-gold-500/30"
        }`}
      >
        {file ? (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-gold-400" />
            <span className="text-sm text-gold-200">{uploadedLabel}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">{placeholder}</span>
          </div>
        )}
        {file && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="text-xs text-gold-400 hover:text-gold-300"
          >
            {changeLabel}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
import { useRef, useState } from "react";
import {
  CONTACT,
  fmtAed,
  type PriceResult,
  type QuoteFormData,
} from "../data";
import { useLang } from "../lib/LanguageContext";
import { supabase } from "../lib/supabase";
import {
  ShieldCheck,
  FileText,
  Upload,
  Check,
  ChevronRight,
  MessageCircle,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Props {
  form: QuoteFormData;
  price: PriceResult;
  onNewQuote: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type DocKey = "drivingLicense" | "emiratesId" | "carOwnership";

export default function DocumentUpload({ form, price, onNewQuote }: Props) {
  const { t, lang } = useLang();
  const [files, setFiles] = useState<Record<DocKey, File | null>>({
    drivingLicense: null,
    emiratesId: null,
    carOwnership: null,
  });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFile = (key: DocKey, file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE) {
      setError(t("fileTooBig"));
      return;
    }
    setError("");
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const allFilesUploaded = files.drivingLicense && files.emiratesId && files.carOwnership;
  const formValid = allFilesUploaded && name.trim() && phone.trim();

  const handleSubmit = async () => {
    if (!formValid) {
      setError(t("selectAllFields"));
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      // Upload files to Supabase Storage
      const uploadPromises = (Object.keys(files) as DocKey[]).map(async (key) => {
        const file = files[key];
        if (!file) return null;
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${key}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("quote-documents")
          .upload(path, file);
        if (uploadError) throw uploadError;
        return { key, path };
      });

      const uploaded = await Promise.all(uploadPromises);

      // Insert quote request record
      const { error: insertError } = await supabase.from("quote_requests").insert({
        insurance_type: form.insuranceType,
        vehicle_type: form.vehicleType,
        engine_cylinders: form.engineCylinders,
        car_value: form.carValue ? parseFloat(form.carValue) : null,
        driver_age: form.driverAge,
        license_years: form.licenseYears,
        brand: form.brand,
        model: form.model,
        model_year: form.modelYear,
        estimated_price: price.needsContact ? null : price.amount,
        needs_contact: price.needsContact,
        customer_name: name,
        phone: phone,
        email: email || null,
        driving_license_path: uploaded[0]?.path ?? null,
        emirates_id_path: uploaded[1]?.path ?? null,
        car_ownership_path: uploaded[2]?.path ?? null,
      });

      if (insertError) throw insertError;

      // Trigger email edge function (fire-and-forget, non-blocking)
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-quote-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            record: {
              customer_name: name,
              phone,
              email: email || null,
              insurance_type: form.insuranceType,
              brand: form.brand,
              model: form.model,
              model_year: form.modelYear,
              vehicle_type: form.vehicleType,
              engine_cylinders: form.engineCylinders,
              car_value: form.carValue ? parseFloat(form.carValue) : null,
              driver_age: form.driverAge,
              license_years: form.licenseYears,
              estimated_price: price.needsContact ? null : price.amount,
              needs_contact: price.needsContact,
              driving_license_path: uploaded[0]?.path ?? null,
              emirates_id_path: uploaded[1]?.path ?? null,
              car_ownership_path: uploaded[2]?.path ?? null,
              created_at: new Date().toISOString(),
            },
          }),
        });
      } catch {
        // Email failure shouldn't block success
      }

      setSuccess(true);
    } catch (err) {
      setError(t("submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-gold opacity-10" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gold-500/8 blur-[160px]" />
        </div>
        <div className="card-lux relative z-10 w-full max-w-md p-8 text-center shadow-gold-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/15">
            <Check className="h-8 w-8 text-gold-400" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-gold-100">{t("submitSuccess")}</h2>
          <button onClick={onNewQuote} className="btn-gold mt-6 mx-auto">
            {t("newQuote")}
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-gold opacity-10" />
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gold-500/8 blur-[160px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg space-y-4">
        {/* Price summary card */}
        <div className="card-lux p-5 shadow-gold">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold-400" />
              <span className="text-sm font-semibold uppercase tracking-wider text-gold-300">
                {t("yourPrice")}
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold gold-text leading-none">
              {price.needsContact
                ? t("contactForPrice")
                : fmtAed(price.amount, lang)}
            </span>
            {!price.needsContact && <span className="text-sm text-gray-400">{t("perYear")}</span>}
          </div>
          {price.needsContact && (
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold mt-4 w-full"
            >
              <MessageCircle className="h-4 w-4" />
              {t("whatsappUs")}
            </a>
          )}
        </div>

        {/* Documents section */}
        <div className="card-lux p-5 shadow-gold-lg sm:p-7">
          <div className="mb-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/40 bg-gradient-to-br from-ink-800 to-ink-900 shadow-gold">
              <ShieldCheck className="h-7 w-7 text-gold-400" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-2xl font-semibold text-white">{t("docsTitle")}</h1>
            <p className="mt-1 text-sm text-gray-400">{t("docsSubtitle")}</p>
          </div>

          {/* File uploads */}
          <div className="space-y-3">
            <p className="label-lux">{t("requiredDocs")}</p>
            <FileUpload
              label={t("drivingLicense")}
              icon={<FileText className="h-5 w-5 text-gold-400" />}
              file={files.drivingLicense}
              onChange={(f) => handleFile("drivingLicense", f)}
              placeholder={t("uploadFile")}
              uploadedLabel={t("fileUploaded")}
              changeLabel={t("changeFile")}
            />
            <FileUpload
              label={t("emiratesId")}
              icon={<FileText className="h-5 w-5 text-gold-400" />}
              file={files.emiratesId}
              onChange={(f) => handleFile("emiratesId", f)}
              placeholder={t("uploadFile")}
              uploadedLabel={t("fileUploaded")}
              changeLabel={t("changeFile")}
            />
            <FileUpload
              label={t("carOwnership")}
              icon={<FileText className="h-5 w-5 text-gold-400" />}
              file={files.carOwnership}
              onChange={(f) => handleFile("carOwnership", f)}
              placeholder={t("uploadFile")}
              uploadedLabel={t("fileUploaded")}
              changeLabel={t("changeFile")}
            />
          </div>

          {/* Contact info */}
          <div className="mt-5 space-y-3">
            <p className="label-lux">{t("contactInfo")}</p>
            <input
              className="input-lux"
              placeholder={t("fullNamePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input-lux"
              type="tel"
              placeholder={t("phonePlaceholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              className="input-lux"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!formValid || submitting}
            className={`btn-gold-lg mt-5 ${!formValid || submitting ? "pointer-events-none opacity-40" : ""}`}
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("submitting")}
              </>
            ) : (
              <>
                {t("submitRequest")}
                <ArrowRight className="h-5 w-5 rtl:rotate-180" />
              </>
            )}
          </button>

          <button
            onClick={onNewQuote}
            className="mt-3 w-full text-center text-sm text-gray-400 transition-colors hover:text-gold-300"
          >
            {t("backToForm")}
          </button>
        </div>
      </div>
    </section>
  );
}

function FileUpload({
  label,
  icon,
  file,
  onChange,
  placeholder,
  uploadedLabel,
  changeLabel,
}: {
  label: string;
  icon: React.ReactNode;
  file: File | null;
  onChange: (file: File | null) => void;
  placeholder: string;
  uploadedLabel: string;
  changeLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-gold-100">{label}</span>
      </div>
      <div
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all duration-200 ${
          file
            ? "border-gold-500/40 bg-gold-500/10"
            : "border-white/10 bg-ink-900/60 hover:border-gold-500/30"
        }`}
      >
        {file ? (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-gold-400" />
            <span className="text-sm text-gold-200">{uploadedLabel}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">{placeholder}</span>
          </div>
        )}
        {file && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="text-xs text-gold-400 hover:text-gold-300"
          >
            {changeLabel}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}


export default DocumentUpload