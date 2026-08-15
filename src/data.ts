export type Lang = "ar" | "en";
export type InsuranceType = "comprehensive" | "third_party";
export type VehicleType = "Sedan" | "SUV" | "Coupe";
export type EngineCylinders = 4 | 6 | 8;
export type DriverAge = "25+" | "under_25";
export type LicenseYears = "3+" | "less_3";

export interface QuoteFormData {
  insuranceType: InsuranceType | "";
  vehicleType: VehicleType | "";
  engineCylinders: EngineCylinders | null;
  carValue: string;
  driverAge: DriverAge | "";
  licenseYears: LicenseYears | "";
  brand: string;
  model: string;
  modelYear: string;
}

export const INITIAL_FORM: QuoteFormData = {
  insuranceType: "",
  vehicleType: "",
  engineCylinders: null,
  carValue: "",
  driverAge: "",
  licenseYears: "",
  brand: "",
  model: "",
  modelYear: "",
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
  email: "raoofbanna0@gmail.com",
};

/* ---------- Pricing (AED per year) ---------- */

// Third Party pricing table: base by vehicle type + cylinders (age/license don't affect third party much)
const PRICING_TP: Record<VehicleType, Record<EngineCylinders, number>> = {
  Sedan: { 4: 650, 6: 730, 8: 810 },
  SUV: { 4: 850, 6: 900, 8: 940 },
  Coupe: { 4: 800, 6: 900, 8: 1000 },
};

// Comprehensive: rate per 1000 AED of car value, with surcharge multipliers for young driver / short license
const COMP_RATE_PER_THOUSAND = 3.5; // base rate
const YOUNG_DRIVER_MULTIPLIER = 1.6;
const SHORT_LICENSE_MULTIPLIER = 1.4;

// If comprehensive car value exceeds this, show WhatsApp contact instead of a price
export const COMP_VALUE_THRESHOLD = 500000;

export interface PriceResult {
  amount: number;
  isComprehensive: boolean;
  needsContact: boolean;
}

export function calculatePremium(form: QuoteFormData): PriceResult | null {
  if (!form.vehicleType || !form.engineCylinders) return null;

  if (form.insuranceType === "third_party") {
    const amount = PRICING_TP[form.vehicleType][form.engineCylinders];
    if (!amount) return null;
    return { amount, isComprehensive: false, needsContact: false };
  }

  if (form.insuranceType === "comprehensive") {
    if (!form.driverAge || !form.licenseYears) return null;
    const carValue = parseFloat(form.carValue);
    if (!carValue || carValue <= 0) return null;

    if (carValue > COMP_VALUE_THRESHOLD) {
      return { amount: 0, isComprehensive: true, needsContact: true };
    }

    let premium = (carValue / 1000) * COMP_RATE_PER_THOUSAND;
    if (form.driverAge === "under_25") premium *= YOUNG_DRIVER_MULTIPLIER;
    if (form.licenseYears === "less_3") premium *= SHORT_LICENSE_MULTIPLIER;

    // Apply vehicle type factor
    const typeFactor: Record<VehicleType, number> = { Sedan: 1, SUV: 1.15, Coupe: 1.3 };
    premium *= typeFactor[form.vehicleType];

    return { amount: Math.round(premium), isComprehensive: true, needsContact: false };
  }

  return null;
}

export const fmtAed = (n: number, lang: Lang) => {
  if (lang === "ar") {
    return n.toLocaleString("ar-EG", { maximumFractionDigits: 0 }) + " د.إ";
  }
  return "AED " + n.toLocaleString("en-AE", { maximumFractionDigits: 0 });
};

/* ---------- Translations ---------- */
export const T: Record<Lang, Record<string, string>> = {
  ar: {
    brandName: "RAOUF",
    brandTagline: "INSURANCE SERVICES",
    heroTitle: "احصل على عرض سعر تأمين خلال دقائق",
    heroSubtitle: "عروض من جميع شركات التأمين بأسعار تنافسية",
    langToggle: "English",
    formTitle: "طلب عرض سعر",
    insuranceType: "نوع التأمين",
    comprehensive: "شامل",
    thirdParty: "ضد الغير",
    vehicleType: "نوع السيارة",
    engineCylinders: "عدد السلندرات",
    carValue: "قيمة السيارة (للشامل فقط)",
    carValuePlaceholder: "مثال: 120000",
    driverAge: "العمر",
    age25Plus: "25 سنة فما فوق",
    ageUnder25: "أقل من 25 سنة",
    licenseYears: "مدة الرخصة",
    lic3Plus: "3 سنوات أو أكثر",
    licLess3: "أقل من 3 سنوات",
    brand: "الماركة",
    selectBrand: "اختر الماركة",
    model: "الموديل",
    selectModel: "اختر الموديل",
    chooseBrandFirst: "اختر الماركة أولاً",
    modelYear: "سنة الصنع",
    selectYear: "اختر السنة",
    getPrice: "احصل على السعر",
    yourPrice: "سعرك التقديري",
    perYear: "/ سنوياً",
    contactForPrice: "يرجى التواصل معنا عبر واتساب للحصول على أفضل عرض",
    whatsappUs: "تواصل عبر واتساب",
    enterVehicleValue: "أدخل قيمة السيارة لحساب السعر",
    selectAllFields: "يرجى تعبئة جميع الحقول المطلوبة",
    cylinders: "سلندر",
    /* Document upload page */
    docsTitle: "رفع المستندات",
    docsSubtitle: "لإتمام طلبك، يرجى رفع المستندات التالية",
    drivingLicense: "رخصة القيادة",
    emiratesId: "الهوية الإماراتية",
    carOwnership: "ملكية السيارة",
    uploadFile: "اضغط لرفع الملف",
    fileUploaded: "تم رفع الملف",
    changeFile: "تغيير",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "الاسم الكامل",
    phoneNumber: "رقم الهاتف",
    phonePlaceholder: "05X XXX XXXX",
    email: "البريد الإلكتروني",
    emailPlaceholder: "your@email.com",
    submitRequest: "إرسال الطلب",
    submitting: "جاري الإرسال...",
    submitSuccess: "تم إرسال طلبك بنجاح! سنتواصل معك قريبًا.",
    submitError: "حدث خطأ. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.",
    backToForm: "العودة للنموذج",
    requiredDocs: "المستندات المطلوبة (3)",
    contactInfo: "بيانات التواصل",
    newQuote: "طلب جديد",
    /* About section */
    aboutTitle: "من نحن",
    aboutText: "RAOUF INSURANCE SERVICES هو وسيط تأمين معتمد في الإمارات، نوفر عروضًا من جميع شركات التأمين بأسعار تنافسية، ونساعد العميل في اختيار أفضل تغطية بأسرع وقت.",
    /* Bottom bar */
    callNow: "اتصال",
    whatsappBottom: "واتساب",
    getQuoteBottom: "احصل على السعر",
    /* Footer */
    rightsReserved: "جميع الحقوق محفوظة",
    fileTooBig: "حجم الملف كبير جدًا (الحد الأقصى 5 ميجابايت)",
  },
  en: {
    brandName: "RAOUF",
    brandTagline: "INSURANCE SERVICES",
    heroTitle: "Get an insurance quote in minutes",
    heroSubtitle: "Competitive offers from all insurance companies",
    langToggle: "العربية",
    formTitle: "Request a Quote",
    insuranceType: "Insurance Type",
    comprehensive: "Comprehensive",
    thirdParty: "Third Party",
    vehicleType: "Vehicle Type",
    engineCylinders: "Number of Cylinders",
    carValue: "Car Value (comprehensive only)",
    carValuePlaceholder: "e.g. 120,000",
    driverAge: "Driver Age",
    age25Plus: "25 years and above",
    ageUnder25: "Under 25 years",
    licenseYears: "License Duration",
    lic3Plus: "3 years or more",
    licLess3: "Less than 3 years",
    brand: "Brand",
    selectBrand: "Select brand",
    model: "Model",
    selectModel: "Select model",
    chooseBrandFirst: "Select brand first",
    modelYear: "Year",
    selectYear: "Select year",
    getPrice: "Get Price",
    yourPrice: "Your Estimated Price",
    perYear: "/ year",
    contactForPrice: "Please contact us via WhatsApp for the best offer",
    whatsappUs: "Contact via WhatsApp",
    enterVehicleValue: "Enter car value to calculate price",
    selectAllFields: "Please fill in all required fields",
    cylinders: "cyl",
    docsTitle: "Upload Documents",
    docsSubtitle: "To complete your request, please upload the following documents",
    drivingLicense: "Driving License",
    emiratesId: "Emirates ID",
    carOwnership: "Car Ownership",
    uploadFile: "Click to upload",
    fileUploaded: "File uploaded",
    changeFile: "Change",
    fullName: "Full Name",
    fullNamePlaceholder: "Full name",
    phoneNumber: "Phone Number",
    phonePlaceholder: "05X XXX XXXX",
    email: "Email",
    emailPlaceholder: "your@email.com",
    submitRequest: "Submit Request",
    submitting: "Submitting...",
    submitSuccess: "Your request has been submitted successfully! We will contact you soon.",
    submitError: "An error occurred. Please try again or contact us via WhatsApp.",
    backToForm: "Back to form",
    requiredDocs: "Required Documents (3)",
    contactInfo: "Contact Information",
    newQuote: "New Quote",
    aboutTitle: "About Us",
    aboutText: "RAOUF INSURANCE SERVICES is a licensed insurance broker in the UAE, providing offers from all insurance companies at competitive prices, and helping customers choose the best coverage as quickly as possible.",
    callNow: "Call",
    whatsappBottom: "WhatsApp",
    getQuoteBottom: "Get Quote",
    rightsReserved: "All rights reserved",
    fileTooBig: "File is too large (max 5MB)",
  },
};
