export type Lang = "en" | "ar";
export type InsuranceType = "Comprehensive" | "Third Party";
export type VehicleType = "Sedan" | "SUV" | "Coupe";
export type EngineCylinders = 4 | 6 | 8;
export type DriverAge = "25+" | "Under 25";
export type LicenseYears = "3+" | "Less than 3";
export type QuoteTier = "base" | "high";

export interface QuoteFormData {
  insuranceType: InsuranceType | "";
  vehicleType: VehicleType | "";
  engineCylinders: EngineCylinders | null;
  driverAge: DriverAge | "";
  licenseYears: LicenseYears | "";
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
  brand: "",
  model: "",
  modelYear: "",
  customerName: "",
  phone: "",
  whatsapp: "",
  email: "",
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

// High tier: under 25 OR license less than 3 years
const PRICING_HIGH: Record<VehicleType, Record<EngineCylinders, number>> = {
  Sedan: { 4: 1250, 6: 1350, 8: 1500 },
  SUV: { 4: 1550, 6: 1850, 8: 1950 },
  Coupe: { 4: 1150, 6: 1350, 8: 1500 },
};

export function getTier(age: DriverAge | "", lic: LicenseYears | ""): QuoteTier | null {
  if (!age || !lic) return null;
  if (age === "Under 25" || lic === "Less than 3") return "high";
  return "base";
}

export function calculatePremium(form: Pick<QuoteFormData, "vehicleType" | "engineCylinders" | "driverAge" | "licenseYears">): { amount: number; tier: QuoteTier } | null {
  if (!form.vehicleType || !form.engineCylinders) return null;
  const tier = getTier(form.driverAge, form.licenseYears);
  if (!tier) return null;
  const table = tier === "base" ? PRICING_BASE : PRICING_HIGH;
  const amount = table[form.vehicleType][form.engineCylinders];
  if (!amount) return null;
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
    step1: "Vehicle",
    step2: "Driver",
    step3: "Contact",
    step1Title: "Vehicle Details",
    step2Title: "Car Details",
    step3Title: "Your Contact",
    insuranceType: "Insurance Type",
    vehicleType: "Vehicle Type",
    engineCylinders: "Cylinders",
    cyl: "Cyl",
    comprehensive: "Comprehensive",
    thirdParty: "Third Party",
    driverAge: "Driver Age",
    age25Plus: "25+",
    ageUnder25: "Under 25",
    licenseYears: "Driving License",
    lic3Plus: "More than 3 years",
    licLess3: "Less than 3 years",
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
    estEyebrow: "Estimated Premium",
    estPerYear: "/year",
    estBase: "Best price",
    estHigh: "Young driver rate",
    priceNote: "Prices shown are for drivers aged 25+ with a driving license older than 3 years. Other cases are calculated automatically.",
    callNow: "Call",
    whatsappUs: "WhatsApp",
    selectToSee: "Select vehicle, cylinders & driver details to see your price.",
    seePrice: "See Your Price",
    quoteReady: "Your quote is ready!",
    newQuote: "New Quote",
  },
  ar: {
    brandName: "رؤوف",
    brandTagline: "خدمات التأمين",
    heroTitle: "احصل على عرض سعر الآن",
    step1: "المركبة",
    step2: "السائق",
    step3: "الاتصال",
    step1Title: "تفاصيل المركبة",
    step2Title: "تفاصيل السيارة",
    step3Title: "بيانات التواصل",
    insuranceType: "نوع التأمين",
    vehicleType: "نوع المركبة",
    engineCylinders: "الأسطوانات",
    cyl: "سل",
    comprehensive: "شامل",
    thirdParty: "ضد الغير",
    driverAge: "عمر السائق",
    age25Plus: "+25",
    ageUnder25: "أقل من 25",
    licenseYears: "رخصة القيادة",
    lic3Plus: "أكثر من 3 سنوات",
    licLess3: "أقل من 3 سنوات",
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
    estEyebrow: "القسط المقدر",
    estPerYear: "/سنوياً",
    estBase: "أفضل سعر",
    estHigh: "سعر سائق شاب",
    priceNote: "الأسعار المعروضة للسائقين فوق 25 عاماً برخصة قيادة أقدم من 3 سنوات. الحالات الأخرى تُحسب تلقائياً.",
    callNow: "اتصل",
    whatsappUs: "واتساب",
    selectToSee: "اختر نوع المركبة والأسطوانات وبيانات السائق لرؤية السعر.",
    seePrice: "شاهد سعرك",
    quoteReady: "عرض السعر جاهز!",
    newQuote: "عرض جديد",
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
