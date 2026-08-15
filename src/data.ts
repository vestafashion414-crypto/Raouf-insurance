export type Lang = "en" | "ar";
export type InsuranceType = "Comprehensive" | "Third Party";
export type VehicleType = "Sedan" | "SUV" | "Coupe";
export type EngineCylinders = 4 | 6 | 8;
export type DriverAge = "25+" | "Under 25";
export type LicenseYears = "3+" | "Less than 3";
export type VehicleValue = "upto60k" | "60k-100k" | "100k+";
export type QuoteTier = "base" | "high";
export type PremiumResult = { amount: number; tier: QuoteTier } | { customQuote: true } | null;

export interface QuoteFormData {
  insuranceType: InsuranceType | "";
  vehicleType: VehicleType | "";
  engineCylinders: EngineCylinders | null;
  driverAge: DriverAge | "";
  licenseYears: LicenseYears | "";
  vehicleValue: VehicleValue | "";
  brand: string;
  model: string;
  modelYear: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export const INITIAL_FORM: QuoteFormData = {
  insuranceType: "",
  vehicleType: "",
  engineCylinders: null,
  driverAge: "",
  licenseYears: "",
  vehicleValue: "",
  brand: "",
  model: "",
  modelYear: "",
  customerName: "",
  phone: "",
  whatsapp: "",
  email: "",
};

export interface UploadedFiles {
  license: File | null;
  emiratesId: File | null;
  carOwnership: File | null;
}

export const INITIAL_FILES: UploadedFiles = {
  license: null,
  emiratesId: null,
  carOwnership: null,
};

export const CAR_BRANDS: Record<string, string[]> = {
  Toyota: ["Camry", "Corolla", "Land Cruiser", "Prado", "Hilux", "Fortuner", "Yaris"],
  Nissan: ["Patrol", "Sunny", "Altima", "X-Trail", "Pathfinder", "Patrol Safari"],
  Lexus: ["ES", "LS", "RX", "LX", "GX", "IS"],
  "Mercedes-Benz": ["S-Class", "E-Class", "C-Class", "G-Class", "GLE", "GLC", "A-Class"],
  BMW: ["7 Series", "5 Series", "3 Series", "X5", "X7", "M5", "X3"],
  Audi: ["A6", "A8", "Q7", "Q8", "RS6", "e-tron", "A4"],
  Hyundai: ["Sonata", "Elantra", "Tucson", "Santa Fe", "Accent", "Palisade"],
  Kia: ["Sportage", "Sorento", "K5", "Picanto", "Telluride", "Cerato"],
  BYD: ["Han", "Tang", "Atto 3", "Seal", "Dolphin", "Song"],
  Jetour: ["Dashing", "X70", "X90", "T2", "T5"],
  ROX: ["ROX 01", "ROX 02", "ROX 03"],
  Mitsubishi: ["Pajero", "Lancer", "Outlander", "ASX", "L200"],
  Honda: ["Accord", "Civic", "CR-V", "Pilot"],
  "Range Rover": ["Vogue", "Sport", "Evoque", "Velar", "Defender"],
  Porsche: ["911", "Cayenne", "Macan", "Panamera", "Taycan"],
};

export const YEARS: string[] = (() => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let y = currentYear + 1; y >= currentYear - 25; y--) {
    years.push(String(y));
  }
  return years;
})();

export const CONTACT = {
  phone: "0568051409",
  phoneIntl: "+971568051409",
  whatsapp: "971568051409",
};

/* ---------- Pricing (AED per year) ---------- */
// Base tier: age 25+ AND license 3+ years
const PRICING_BASE: Record<VehicleType, Record<EngineCylinders, number>> = {
  Sedan: { 4: 650, 6: 730, 8: 810 },
  SUV: { 4: 850, 6: 900, 8: 940 },
  Coupe: { 4: 800, 6: 900, 8: 1000 },
};

// High tier: under 25 OR license less than 3 years (Third Party only)
const PRICING_HIGH: Record<VehicleType, Record<EngineCylinders, number>> = {
  Sedan: { 4: 1250, 6: 1350, 8: 1500 },
  SUV: { 4: 1550, 6: 1850, 8: 1950 },
  Coupe: { 4: 1150, 6: 1350, 8: 1500 },
};

// Comprehensive base tier (age 25+ AND license 3+): value-based, null = custom quote
const COMPREHENSIVE_BASE: Record<VehicleType, Record<VehicleValue, number | null>> = {
  Sedan: { "upto60k": 1350, "60k-100k": 1400, "100k+": null },
  SUV: { "upto60k": 1750, "60k-100k": null, "100k+": null },
  Coupe: { "upto60k": null, "60k-100k": null, "100k+": null },
};

export function getTier(age: DriverAge | "", lic: LicenseYears | ""): QuoteTier | null {
  if (!age || !lic) return null;
  if (age === "Under 25" || lic === "Less than 3") return "high";
  return "base";
}

export function calculatePremium(form: Pick<QuoteFormData, "insuranceType" | "vehicleType" | "engineCylinders" | "driverAge" | "licenseYears" | "vehicleValue">): PremiumResult {
  if (!form.insuranceType || !form.vehicleType) return null;
  const tier = getTier(form.driverAge, form.licenseYears);
  if (!tier) return null;

  if (form.insuranceType === "Third Party") {
    if (!form.engineCylinders) return null;
    const table = tier === "base" ? PRICING_BASE : PRICING_HIGH;
    const amount = table[form.vehicleType][form.engineCylinders];
    if (!amount) return null;
    return { amount, tier };
  }

  if (!form.vehicleValue) return null;
  if (tier === "high") return { customQuote: true };
  const amount = COMPREHENSIVE_BASE[form.vehicleType][form.vehicleValue];
  if (amount == null) return { customQuote: true };
  return { amount, tier };
}

export const fmtAed = (n: number, lang: Lang) => {
  if (lang === "ar") {
    return n.toLocaleString("ar-EG", { maximumFractionDigits: 0 }) + " د.إ";
  }
  return "AED " + n.toLocaleString("en-AE", { maximumFractionDigits: 0 });
};

/* ---------- Translations ---------- */
export const T: Record<Lang, Record<string, string>> = {
  en: {
    brandName: "RAOUF",
    brandTagline: "Insurance Services",
    heroTitle: "Get Your Quote Now",
    heroSubtitle: "Premium UAE car insurance — competitive rates from multiple insurers in minutes.",
    formTitle: "Get Your Price",
    formSubtitle: "Fill in the details below to see your estimated premium instantly.",
    stepQuote: "Quote",
    stepDocuments: "Documents",
    stepDone: "Done",
    quoteStepTitle: "Vehicle & Driver Details",
    docsStepTitle: "Upload Your Documents",
    insuranceType: "Insurance Type",
    vehicleType: "Vehicle Type",
    engineCylinders: "Cylinders",
    cyl: "Cyl",
    comprehensive: "Comprehensive",
    thirdParty: "Third Party",
    driverAge: "Driver Age",
    age25Plus: "25 years and above",
    ageUnder25: "Under 25 years",
    licenseYears: "Driving License",
    lic3Plus: "3 years or more",
    licLess3: "Less than 3 years",
    vehicleValue: "Vehicle Value (AED)",
    valUpto60k: "Up to 60,000 AED",
    val60to100k: "60,001 - 100,000 AED",
    val100kPlus: "More than 100,000 AED",
    brand: "Brand",
    model: "Model",
    modelYear: "Year",
    selectBrand: "Select brand",
    selectModel: "Select model",
    chooseBrandFirst: "Choose brand first",
    selectYear: "Select year",
    customerName: "Customer Name",
    fullName: "Full name",
    phone: "Phone Number",
    whatsapp: "WhatsApp",
    email: "Email (optional)",
    emailPlaceholder: "your@email.com",
    phonePlaceholder: "05X XXX XXXX",
    next: "Next",
    back: "Back",
    getQuote: "Get Quote",
    getPrice: "Get Price",
    estEyebrow: "Estimated Premium",
    estPerYear: "/year",
    estBase: "Best price",
    estHigh: "Young driver rate",
    customQuote: "Please contact us on WhatsApp for the best offer.",
    customQuoteBtn: "Contact us on WhatsApp",
    priceNote: "Prices shown are for drivers aged 25+ with a driving license older than 3 years. Other cases are calculated automatically.",
    callNow: "Call",
    whatsappUs: "WhatsApp",
    selectToSee: "Fill in the form and press Get Price to see your estimated premium.",
    continueToDocs: "Continue to Documents",
    uploadLicense: "Driving License",
    uploadEmiratesId: "Emirates ID",
    uploadCarOwnership: "Car Ownership (Mulkiya)",
    uploadHint: "Tap to upload — JPG, PNG, or PDF",
    uploadDone: "Uploaded",
    submitRequest: "Submit Request",
    submitting: "Submitting…",
    submitSuccess: "Your request has been submitted successfully!",
    submitError: "Something went wrong. Please try again or contact us on WhatsApp.",
    newQuote: "New Quote",
    requiredField: "Required",
    aboutTitle: "About Us",
    aboutText: "RAOUF INSURANCE SERVICES is a licensed UAE insurance broker. We source offers from all insurance companies at competitive prices, and help you choose the best coverage in the fastest time.",
    seePrice: "See Your Price",
    quoteReady: "Your quote is ready!",
  },
  ar: {
    brandName: "رؤوف",
    brandTagline: "خدمات التأمين",
    heroTitle: "احصل على عرض سعر الآن",
    heroSubtitle: "تأمين سيارات في الإمارات — أسعار تنافسية من عدة شركات تأمين في دقائق.",
    formTitle: "احصل على سعر",
    formSubtitle: "املأ البيانات أدناه لرؤية القسط المقدر فوراً.",
    stepQuote: "السعر",
    stepDocuments: "المستندات",
    stepDone: "تم",
    quoteStepTitle: "بيانات المركبة والسائق",
    docsStepTitle: "رفع المستندات",
    insuranceType: "نوع التأمين",
    vehicleType: "نوع المركبة",
    engineCylinders: "الأسطوانات",
    cyl: "سل",
    comprehensive: "شامل",
    thirdParty: "ضد الغير",
    driverAge: "عمر السائق",
    age25Plus: "25 سنة فما فوق",
    ageUnder25: "أقل من 25 سنة",
    licenseYears: "رخصة القيادة",
    lic3Plus: "3 سنوات أو أكثر",
    licLess3: "أقل من 3 سنوات",
    vehicleValue: "قيمة المركبة (درهم)",
    valUpto60k: "حتى 60,000 درهم",
    val60to100k: "60,001 - 100,000 درهم",
    val100kPlus: "أكثر من 100,000 درهم",
    brand: "العلامة",
    model: "الموديل",
    modelYear: "السنة",
    selectBrand: "اختر العلامة",
    selectModel: "اختر الموديل",
    chooseBrandFirst: "اختر العلامة أولاً",
    selectYear: "اختر السنة",
    customerName: "اسم العميل",
    fullName: "الاسم الكامل",
    phone: "رقم الهاتف",
    whatsapp: "واتساب",
    email: "البريد (اختياري)",
    emailPlaceholder: "your@email.com",
    phonePlaceholder: "05X XXX XXXX",
    next: "التالي",
    back: "السابق",
    getQuote: "احصل على عرض السعر",
    getPrice: "احصل على السعر",
    estEyebrow: "القسط المقدر",
    estPerYear: "/سنوياً",
    estBase: "أفضل سعر",
    estHigh: "سعر سائق شاب",
    customQuote: "يرجى التواصل معنا عبر واتساب للحصول على أفضل عرض.",
    customQuoteBtn: "تواصل معنا عبر واتساب",
    priceNote: "الأسعار المعروضة للسائقين فوق 25 عاماً برخصة قيادة أقدم من 3 سنوات. الحالات الأخرى تُحسب تلقائياً.",
    callNow: "اتصل",
    whatsappUs: "واتساب",
    selectToSee: "املأ النموذج واضغط احصل على السعر لرؤية القسط المقدر.",
    continueToDocs: "متابعة لرفع المستندات",
    uploadLicense: "رخصة القيادة",
    uploadEmiratesId: "الهوية الإماراتية",
    uploadCarOwnership: "ملكية السيارة (ملكية)",
    uploadHint: "اضغط للرفع — JPG أو PNG أو PDF",
    uploadDone: "تم الرفع",
    submitRequest: "إرسال الطلب",
    submitting: "جارٍ الإرسال…",
    submitSuccess: "تم إرسال طلبك بنجاح!",
    submitError: "حدث خطأ. يرجى المحاولة مرة أخرى أو التواصل معنا عبر واتساب.",
    newQuote: "عرض جديد",
    requiredField: "مطلوب",
    aboutTitle: "من نحن",
    aboutText: "رؤوف لخدمات التأمين وسيط تأمين معتمد في الإمارات. نوفر عروضاً من جميع شركات التأمين بأسعار تنافسية، ونساعدك في اختيار أفضل تغطية بأسرع وقت.",
    seePrice: "شاهد سعرك",
    quoteReady: "عرض السعر جاهز!",
  },
};

export const VEHICLE_TYPE_AR: Record<VehicleType, string> = {
  Sedan: "سيدان",
  SUV: "دفع رباعي",
  Coupe: "كوبيه",
};

export const INSURANCE_TYPE_AR: Record<InsuranceType, string> = {
  Comprehensive: "شامل",
  "Third Party": "ضد الغير",
};

export const VEHICLE_VALUE_EN: Record<VehicleValue, string> = {
  "upto60k": "Up to 60,000 AED",
  "60k-100k": "60,001 - 100,000 AED",
  "100k+": "More than 100,000 AED",
};

export const VEHICLE_VALUE_AR: Record<VehicleValue, string> = {
  "upto60k": "حتى 60,000 درهم",
  "60k-100k": "60,001 - 100,000 درهم",
  "100k+": "أكثر من 100,000 درهم",
};
