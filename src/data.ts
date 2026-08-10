export type Lang = "en" | "ar";
export type InsuranceType = "Comprehensive" | "Third Party";
export type VehicleType = "Sedan" | "SUV" | "Coupe";
export type EngineCylinders = 4 | 6 | 8;

export interface QuoteFormData {
  insuranceType: InsuranceType | "";
  vehicleType: VehicleType | "";
  engineCylinders: EngineCylinders | null;
  brand: string;
  model: string;
  modelYear: string;
  customerName: string;
  mobileNumber: string;
  email: string;
  notes: string;
}

export const INITIAL_FORM: QuoteFormData = {
  insuranceType: "",
  vehicleType: "",
  engineCylinders: null,
  brand: "",
  model: "",
  modelYear: "",
  customerName: "",
  mobileNumber: "",
  email: "",
  notes: "",
};

/* ---------- UAE Brand & Model catalog ---------- */
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

/* ---------- Pricing table (AED) ---------- */
// Sedan: 4=650, 6=740, 8=800 | SUV: 4=840, 6=880, 8=920 | Coupe: same as Sedan
export const PRICING: Record<VehicleType, Record<EngineCylinders, number>> = {
  Sedan: { 4: 650, 6: 740, 8: 800 },
  SUV: { 4: 840, 6: 880, 8: 920 },
  Coupe: { 4: 650, 6: 740, 8: 800 },
};

export const DISCOUNT_RATE = 0.3; // 30% discount

export function calculatePremium(form: Pick<QuoteFormData, "vehicleType" | "engineCylinders">): { old: number; final: number } | null {
  if (!form.vehicleType || !form.engineCylinders) return null;
  const old = PRICING[form.vehicleType][form.engineCylinders];
  if (!old) return null;
  const final = Math.round(old * (1 - DISCOUNT_RATE));
  return { old, final };
}

export const fmtAed = (n: number, lang: Lang) => {
  if (lang === "ar") {
    return n.toLocaleString("ar-EG", { maximumFractionDigits: 0 }) + " درهم";
  }
  return "AED " + n.toLocaleString("en-AE", { maximumFractionDigits: 0 });
};

/* ---------- Translations (lean — single screen only) ---------- */
export const T: Record<Lang, Record<string, string>> = {
  en: {
    brandName: "RAOUF",
    brandTagline: "Insurance Services",
    heroTitle: "Get Your Quote Now",
    insuranceType: "Insurance Type",
    vehicleType: "Vehicle Type",
    engineCylinders: "Cylinders",
    cyl: "Cyl",
    comprehensive: "Comprehensive",
    thirdParty: "Third Party",
    brand: "Brand",
    model: "Model",
    modelYear: "Model Year",
    selectBrand: "Select brand",
    selectModel: "Select model",
    chooseBrandFirst: "Choose brand first",
    selectYear: "Select year",
    getPrice: "Get Price Now",
    estEyebrow: "Estimated Premium",
    estOff: "30% OFF",
    estPerYear: "/year",
    estFinalLabel: "per year incl. discount",
    estCoverage: "Coverage",
    estVehicle: "Vehicle",
    estEngine: "Engine",
    estCar: "Car",
    estYear: "Year",
    estEmpty: "Select vehicle type & cylinders to see your price.",
    callNow: "Call",
    whatsappUs: "WhatsApp",
  },
  ar: {
    brandName: "رؤوف",
    brandTagline: "خدمات التأمين",
    heroTitle: "احصل على عرض سعر الآن",
    insuranceType: "نوع التأمين",
    vehicleType: "نوع المركبة",
    engineCylinders: "الأسطوانات",
    cyl: "سل",
    comprehensive: "شامل",
    thirdParty: "ضد الغير",
    brand: "العلامة",
    model: "الموديل",
    modelYear: "سنة الصنع",
    selectBrand: "اختر العلامة",
    selectModel: "اختر الموديل",
    chooseBrandFirst: "اختر العلامة أولاً",
    selectYear: "اختر السنة",
    getPrice: "احصل على السعر الآن",
    estEyebrow: "القسط المقدر",
    estOff: "خصم 30%",
    estPerYear: "/سنوياً",
    estFinalLabel: "سنوياً شامل الخصم",
    estCoverage: "التغطية",
    estVehicle: "المركبة",
    estEngine: "المحرك",
    estCar: "السيارة",
    estYear: "السنة",
    estEmpty: "اختر نوع المركبة والأسطوانات لرؤية السعر.",
    callNow: "اتصل",
    whatsappUs: "واتساب",
  },
};

// Arabic names for vehicle types
export const VEHICLE_TYPE_AR: Record<VehicleType, string> = {
  Sedan: "سيدان",
  SUV: "دفع رباعي",
  Coupe: "كوبيه",
};

export const INSURANCE_TYPE_AR: Record<InsuranceType, string> = {
  Comprehensive: "شامل",
  "Third Party": "ضد الغير",
};
