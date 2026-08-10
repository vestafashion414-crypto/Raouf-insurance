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

export function calculatePremium(form: QuoteFormData): { old: number; final: number } | null {
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

/* ---------- Translations ---------- */
export const T: Record<Lang, Record<string, string>> = {
  en: {
    // Brand
    brandName: "RAOUF",
    brandTagline: "Insurance Services",
    // Nav
    navQuote: "Get a Quote",
    navServices: "Services",
    navWhyUs: "Why Us",
    navReviews: "Reviews",
    navCall: "Call",
    navGetQuote: "Get Quote Now",
    // Hero
    heroBadge: "UAE Licensed Insurance Broker",
    heroTitle1: "Premium Car Insurance,",
    heroTitle2: "Tailored for the UAE",
    heroSubtitle:
      "Comprehensive and third-party coverage with exclusive rates up to 30% off. Get your personalised quote in under two minutes.",
    heroRating: "4.9/5 from 2,300+ UAE drivers",
    heroBtnQuote: "Get Quote Now",
    heroBtnCall: "Call",
    heroBtnWhatsapp: "WhatsApp",
    statDiscount: "Max Discount",
    statPartners: "Insurer Partners",
    statSupport: "Claims Support",
    // Quote form
    quoteEyebrow: "Instant Quote",
    quoteTitle1: "Get Your",
    quoteTitle2: "Premium Quote",
    quoteTitleSuffix: "in 3 Steps",
    quoteSubtitle:
      "No paperwork, no waiting. Tell us about your car and we'll show your estimated premium instantly.",
    step1: "Insurance Type",
    step2: "Vehicle Details",
    step3: "Customer Details",
    step1Title: "Choose Your Coverage",
    step1Subtitle: "Select the type of insurance you need",
    comprehensive: "Comprehensive",
    comprehensiveDesc: "Full coverage including own damage, theft & third party",
    thirdParty: "Third Party",
    thirdPartyDesc: "Covers damage to others — the legal minimum in the UAE",
    step2Title: "Vehicle Details",
    step2Subtitle: "Tell us about your car",
    step3Title: "Your Details",
    step3Subtitle: "So we can send your personalised quote",
    vehicleType: "Vehicle Type",
    engineCylinders: "Engine Cylinders",
    cyl: "Cyl",
    brand: "Brand",
    model: "Model",
    selectBrand: "Select brand",
    selectModel: "Select model",
    chooseBrandFirst: "Choose brand first",
    modelYear: "Model Year",
    selectYear: "Select year",
    customerName: "Customer Name",
    namePlaceholder: "e.g. Ahmed Al Mansoori",
    mobileNumber: "Mobile Number",
    mobilePlaceholder: "05x xxx xxxx",
    email: "Email",
    emailPlaceholder: "you@example.com",
    notes: "Notes",
    notesOptional: "optional",
    notesPlaceholder: "Any additional details about your vehicle or coverage needs…",
    btnBack: "Back",
    btnContinue: "Continue",
    btnSubmit: "Get Quote Now",
    submitting: "Submitting…",
    // Premium estimate
    estEyebrow: "Estimated Premium",
    estPerYear: "Annual price, before add-ons",
    estOff: "30% OFF",
    estOldLabel: "/year",
    estFinalLabel: "per year incl. discount",
    estCoverage: "Coverage",
    estVehicle: "Vehicle",
    estEngine: "Engine",
    estCar: "Car",
    estYear: "Year",
    estEmpty: "Complete steps 1 & 2 to see your estimated premium with an exclusive 30% discount.",
    callNow: "Call Now",
    whatsappUs: "WhatsApp Us",
    // Success
    successTitle: "Quote Request Received!",
    successBody:
      "Thank you. Our insurance specialist will contact you within 24 hours to finalise your policy and lock in your exclusive rate.",
    successYourEst: "Your Estimated Premium",
    successPerYear: "per year",
    successAnother: "Submit another quote",
    // Services
    servicesEyebrow: "Our Services",
    servicesTitle1: "Coverage That",
    servicesTitle2: "Goes Further",
    servicesSubtitle:
      "From basic third-party to fully comprehensive protection — we tailor every policy to your vehicle and lifestyle.",
    svcComprehensive: "Comprehensive Cover",
    svcComprehensiveDesc:
      "Own damage, theft, natural events, and third-party liability — all in one premium package.",
    svcThirdParty: "Third-Party Cover",
    svcThirdPartyDesc:
      "Affordable, legally compliant coverage that protects you against liability to others.",
    svcAgency: "Agency Repair",
    svcAgencyDesc:
      "Optional agency repair add-on so your car is always restored by the manufacturer's experts.",
    svcInstant: "Instant Policy Issuance",
    svcInstantDesc:
      "Get your policy document by email within minutes of confirmation — no waiting required.",
    svcClaims: "24/7 Claims Support",
    svcClaimsDesc:
      "Round-the-clock claims assistance with a dedicated UAE-based team, in Arabic and English.",
    svcDiscount: "Exclusive Discounts",
    svcDiscountDesc:
      "Access rates not available to the public — up to 30% off through our insurer partnerships.",
    // Why us
    whyEyebrow: "Why Choose Us",
    whyTitle1: "The Smarter Way to",
    whyTitle2: "Insure Your Car",
    whyBody:
      "RAOUF INSURANCE SERVICES is a trusted UAE insurance broker. We do the comparison work for you, negotiate better rates, and stay by your side at claim time.",
    whyPartner1: "15+ Insurer Partners",
    whyPartner1Desc: "We compare quotes from the UAE's leading insurers to find you the best rate.",
    whyPartner2: "Up to 30% Cheaper",
    whyPartner2Desc: "Exclusive broker rates that aren't available when you go directly to the insurer.",
    whyPartner3: "2-Minute Quotes",
    whyPartner3Desc: "No paperwork or long forms. Get your estimate instantly, then finalise in minutes.",
    whyPartner4: "2,300+ Happy Clients",
    whyPartner4Desc:
      "Trusted by drivers across Dubai, Abu Dhabi, Sharjah, and the Northern Emirates.",
    whySaving: "Average Saving",
    feat1: "No-claims bonus protection",
    feat2: "Free roadside assistance on comprehensive plans",
    feat3: "Personal accident cover included",
    feat4: "Oman extension available",
    feat5: "Flexible monthly payment plans",
    feat6: "Bilingual Arabic & English support",
    // Testimonials
    revEyebrow: "Client Reviews",
    revTitle1: "Trusted by",
    revTitle2: "UAE Drivers",
    revAverage: "average",
    revReviews: "reviews",
    // Footer
    footerCtaTitle1: "Ready to",
    footerCtaTitle2: "Save 30%",
    footerCtaTitleSuffix: "on Your Car Insurance?",
    footerCtaBody:
      "Get your free, no-obligation quote today. Our team is ready to help you find the perfect coverage at the best price.",
    footerAbout:
      "Your trusted UAE insurance broker. Comprehensive and third-party car insurance with exclusive rates and genuine support.",
    footerQuick: "Quick Links",
    footerCoverage: "Coverage",
    footerContact: "Get in Touch",
    footerHours: "Sat–Thu, 9:00 AM – 7:00 PM",
    footerRights: "All rights reserved.",
    footerLicensed: "Licensed insurance broker · regulated by the UAE Insurance Authority",
    // Floating
    floatWhatsapp: "Chat on WhatsApp",
    floatCall: "Call",
  },
  ar: {
    brandName: "رؤوف",
    brandTagline: "خدمات التأمين",
    navQuote: "احصل على عرض سعر",
    navServices: "خدماتنا",
    navWhyUs: "لماذا نحن",
    navReviews: "آراء العملاء",
    navCall: "اتصل",
    navGetQuote: "احصل على عرض سعر",
    heroBadge: "وسيط تأمين مرخص في الإمارات",
    heroTitle1: "تأمين سيارات متميز،",
    heroTitle2: "مصمم للإمارات",
    heroSubtitle:
      "تغطية شاملة وضد الغير بأسعار حصرية تصل خصوماتها إلى 30%. احصل على عرض سعر مخصص في أقل من دقيقتين.",
    heroRating: "4.9/5 من أكثر من 2,300 سائق إماراتي",
    heroBtnQuote: "احصل على عرض سعر",
    heroBtnCall: "اتصل",
    heroBtnWhatsapp: "واتساب",
    statDiscount: "أقصى خصم",
    statPartners: "شركاء التأمين",
    statSupport: "دعم المطالبات",
    quoteEyebrow: "عرض سعر فوري",
    quoteTitle1: "احصل على",
    quoteTitle2: "عرض سعر متميز",
    quoteTitleSuffix: "في 3 خطوات",
    quoteSubtitle:
      "بدون أوراق وبدون انتظار. أخبرنا عن سيارتك وسنعرض لك القسط المقدر فوراً.",
    step1: "نوع التأمين",
    step2: "تفاصيل المركبة",
    step3: "بيانات العميل",
    step1Title: "اختر تغطيتك",
    step1Subtitle: "حدد نوع التأمين الذي تحتاجه",
    comprehensive: "شامل",
    comprehensiveDesc: "تغطية كاملة تشمل أضرار المركبة والسرقة والتأمين ضد الغير",
    thirdParty: "ضد الغير",
    thirdPartyDesc: "يغطي أضرار الآخرين — الحد الأدنى القانوني في الإمارات",
    step2Title: "تفاصيل المركبة",
    step2Subtitle: "أخبرنا عن سيارتك",
    step3Title: "بياناتك",
    step3Subtitle: "لإرسال عرض السعر المخصص إليك",
    vehicleType: "نوع المركبة",
    engineCylinders: "أسطوانات المحرك",
    cyl: "سل",
    brand: "العلامة التجارية",
    model: "الموديل",
    selectBrand: "اختر العلامة",
    selectModel: "اختر الموديل",
    chooseBrandFirst: "اختر العلامة أولاً",
    modelYear: "سنة الصنع",
    selectYear: "اختر السنة",
    customerName: "اسم العميل",
    namePlaceholder: "مثال: أحمد المنصوري",
    mobileNumber: "رقم الجوال",
    mobilePlaceholder: "05x xxx xxxx",
    email: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",
    notes: "ملاحظات",
    notesOptional: "اختياري",
    notesPlaceholder: "أي تفاصيل إضافية عن سيارتك أو احتياجات التغطية…",
    btnBack: "رجوع",
    btnContinue: "متابعة",
    btnSubmit: "احصل على عرض سعر",
    submitting: "جارٍ الإرسال…",
    estEyebrow: "القسط المقدر",
    estPerYear: "السعر السنوي، قبل الإضافات",
    estOff: "خصم 30%",
    estOldLabel: "/سنوياً",
    estFinalLabel: "سنوياً شامل الخصم",
    estCoverage: "التغطية",
    estVehicle: "المركبة",
    estEngine: "المحرك",
    estCar: "السيارة",
    estYear: "السنة",
    estEmpty: "أكمل الخطوتين 1 و 2 لرؤية قسطك المقدر مع خصم حصري 30%.",
    callNow: "اتصل الآن",
    whatsappUs: "راسلنا على واتساب",
    successTitle: "تم استلام طلب عرض السعر!",
    successBody:
      "شكراً لك. سيتواصل معك أخصائي التأمين خلال 24 ساعة لإنهاء بوليصتك وتثبيت سعرتك الحصرية.",
    successYourEst: "قسطك المقدر",
    successPerYear: "سنوياً",
    successAnother: "إرسال طلب آخر",
    servicesEyebrow: "خدماتنا",
    servicesTitle1: "تغطية",
    servicesTitle2: "تتجاوز المألوف",
    servicesSubtitle:
      "من التأمين الأساسي ضد الغير إلى الحماية الشاملة الكاملة — نصمم كل بوليصة لتناسب سيارتك ونمط حياتك.",
    svcComprehensive: "التغطية الشاملة",
    svcComprehensiveDesc: "أضرار المركبة، السرقة، الأحداث الطبيعية، ومسؤولية الطرف الثالث — في باقة متميزة واحدة.",
    svcThirdParty: "تغطية ضد الغير",
    svcThirdPartyDesc: "تغطية ميسورة ومتوافقة قانونياً تحميك من المسؤولية تجاه الآخرين.",
    svcAgency: "إصلاح الوكيل",
    svcAgencyDesc: "إضافة اختيارية لإصلاح الوكيل لضمان استعادة سيارتك دائماً على يد خبراء الشركة المصنعة.",
    svcInstant: "إصدار فوري للبوليصة",
    svcInstantDesc: "استقبل وثيقة التأمين عبر البريد الإلكتروني خلال دقائق من التأكيد — دون انتظار.",
    svcClaims: "دعم المطالبات 24/7",
    svcClaimsDesc: "مساعدة مطالبات على مدار الساعة بفريق إماراتي مخصص، بالعربية والإنجليزية.",
    svcDiscount: "خصومات حصرية",
    svcDiscountDesc: "أسعار غير متاحة للعامة — خصم يصل إلى 30% عبر شراكاتنا مع شركات التأمين.",
    whyEyebrow: "لماذا تختارنا",
    whyTitle1: "الطريقة الأذكى",
    whyTitle2: "لتأمين سيارتك",
    whyBody:
      "رؤوف لخدمات التأمين وسيط تأمين إماراتي موثوق. نقوم بمقارنة العروض نيابة عنك، ونفاوض على أسعار أفضل، ونظل بجانبك عند تقديم المطالبات.",
    whyPartner1: "أكثر من 15 شريك تأمين",
    whyPartner1Desc: "نقارن عروض كبرى شركات التأمين في الإمارات لنقدم لك أفضل سعر.",
    whyPartner2: "أرخص بنسبة تصل إلى 30%",
    whyPartner2Desc: "أسعار وسيط حصرية غير متاحة عند الذهاب مباشرة إلى شركة التأمين.",
    whyPartner3: "عروض في دقيقتين",
    whyPartner3Desc: "بدون أوراق أو نماذج طويلة. احصل على تقديرك فوراً، ثم أنهِ في دقائق.",
    whyPartner4: "أكثر من 2,300 عميل سعيد",
    whyPartner4Desc: "موثوق من السائقين في دبي وأبوظبي والشارقة والإمارات الشمالية.",
    whySaving: "متوسط التوفير",
    feat1: "حماية مكافأة عدم المطالبة",
    feat2: "مساعدة على الطريق مجاناً في الوثائق الشاملة",
    feat3: "تغطية الحوادث الشخصية مشمولة",
    feat4: "تمديد تغطية عُمان متاح",
    feat5: "خطط دفع شهري مرنة",
    feat6: "دعم ثنائي اللغة بالعربية والإنجليزية",
    revEyebrow: "آراء العملاء",
    revTitle1: "موثوق من",
    revTitle2: "سائقي الإمارات",
    revAverage: "متوسط",
    revReviews: "تقييم",
    footerCtaTitle1: "هل أنت مستعد",
    footerCtaTitle2: "لتوفير 30%",
    footerCtaTitleSuffix: "على تأمين سيارتك؟",
    footerCtaBody:
      "احصل على عرض سعر مجاني وبدون التزام اليوم. فريقنا جاهز لمساعدتك في إيجاد التغطية المثالية بأفضل سعر.",
    footerAbout:
      "وسيط التأمين الإماراتي الموثوق. تأمين سيارات شامل وضد الغير بأسعار حصرية ودعم حقيقي.",
    footerQuick: "روابط سريعة",
    footerCoverage: "التغطية",
    footerContact: "تواصل معنا",
    footerHours: "السبت – الخميس، 9:00 ص – 7:00 م",
    footerRights: "جميع الحقوق محفوظة.",
    footerLicensed: "وسيط تأمين مرخص · منظّم من هيئة التأمين الإماراتية",
    floatWhatsapp: "الدردشة على واتساب",
    floatCall: "اتصل",
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
