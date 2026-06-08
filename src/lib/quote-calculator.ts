export type CoverageType = "auto" | "home" | "life" | "business";

export type MaritalStatus = "single" | "married" | "divorced" | "widowed";
export type DrivingRecord = "clean" | "minor" | "major";
export type AutoCoverageLevel = "liability" | "standard" | "comprehensive";
export type HomeCoverageLevel = "basic" | "standard" | "premium";
export type PaymentFrequency = "monthly" | "annual";

export interface QuoteFormData {
  firstName: string;
  lastName: string;
  age: number;
  zipCode: string;
  maritalStatus: MaritalStatus;

  coverageTypes: CoverageType[];

  vehicleYear: number;
  vehicleMake: string;
  annualMileage: number;
  drivingRecord: DrivingRecord;
  autoCoverageLevel: AutoCoverageLevel;

  homeValue: number;
  yearBuilt: number;
  squareFootage: number;
  hasSecuritySystem: boolean;
  homeCoverageLevel: HomeCoverageLevel;

  lifeCoverageAmount: number;
  termYears: number;
  isSmoker: boolean;

  industry: string;
  employeeCount: number;
  annualRevenue: number;
  liabilityLimit: number;

  deductible: number;
  paymentFrequency: PaymentFrequency;
}

export interface QuoteFactor {
  label: string;
  impact: string;
}

export interface QuoteLineItem {
  type: CoverageType;
  label: string;
  monthlyPremium: number;
  annualPremium: number;
  factors: QuoteFactor[];
}

export interface QuoteResult {
  lineItems: QuoteLineItem[];
  subtotalMonthly: number;
  bundleDiscountPercent: number;
  bundleDiscountAmount: number;
  deductibleAdjustment: number;
  totalMonthly: number;
  totalAnnual: number;
  paymentFrequency: PaymentFrequency;
}

export const defaultFormData: QuoteFormData = {
  firstName: "",
  lastName: "",
  age: 35,
  zipCode: "",
  maritalStatus: "single",

  coverageTypes: [],

  vehicleYear: new Date().getFullYear() - 3,
  vehicleMake: "Toyota",
  annualMileage: 12000,
  drivingRecord: "clean",
  autoCoverageLevel: "standard",

  homeValue: 350000,
  yearBuilt: 2005,
  squareFootage: 1800,
  hasSecuritySystem: false,
  homeCoverageLevel: "standard",

  lifeCoverageAmount: 500000,
  termYears: 20,
  isSmoker: false,

  industry: "professional-services",
  employeeCount: 5,
  annualRevenue: 500000,
  liabilityLimit: 1000000,

  deductible: 1000,
  paymentFrequency: "monthly",
};

const COVERAGE_LABELS: Record<CoverageType, string> = {
  auto: "Auto Insurance",
  home: "Home Insurance",
  life: "Life Insurance",
  business: "Business Insurance",
};

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function zipRiskMultiplier(zipCode: string): number {
  const zip = parseInt(zipCode.slice(0, 3), 10);
  if (Number.isNaN(zip)) return 1;
  if (zip >= 900 && zip <= 961) return 1.18;
  if (zip >= 100 && zip <= 149) return 1.22;
  if (zip >= 600 && zip <= 629) return 1.08;
  if (zip >= 750 && zip <= 799) return 1.05;
  return 1;
}

function ageMultiplier(age: number): number {
  if (age < 25) return 1.35;
  if (age < 30) return 1.15;
  if (age <= 55) return 1;
  if (age <= 65) return 1.1;
  return 1.25;
}

function calculateAutoPremium(data: QuoteFormData): QuoteLineItem {
  const vehicleAge = new Date().getFullYear() - data.vehicleYear;
  const baseRates: Record<AutoCoverageLevel, number> = {
    liability: 85,
    standard: 145,
    comprehensive: 210,
  };

  let premium = baseRates[data.autoCoverageLevel];
  const factors: QuoteFactor[] = [
    { label: "Coverage level", impact: data.autoCoverageLevel },
  ];

  if (vehicleAge <= 3) {
    premium *= 1.12;
    factors.push({ label: "Newer vehicle", impact: "+12%" });
  } else if (vehicleAge >= 12) {
    premium *= 0.92;
    factors.push({ label: "Older vehicle", impact: "-8%" });
  }

  if (data.annualMileage > 15000) {
    premium *= 1.15;
    factors.push({ label: "High mileage", impact: "+15%" });
  } else if (data.annualMileage < 8000) {
    premium *= 0.9;
    factors.push({ label: "Low mileage", impact: "-10%" });
  }

  const recordMultipliers: Record<DrivingRecord, number> = {
    clean: 1,
    minor: 1.25,
    major: 1.6,
  };
  if (data.drivingRecord !== "clean") {
    premium *= recordMultipliers[data.drivingRecord];
    factors.push({
      label: "Driving record",
      impact: data.drivingRecord === "minor" ? "+25%" : "+60%",
    });
  }

  premium *= ageMultiplier(data.age) * zipRiskMultiplier(data.zipCode);

  if (data.maritalStatus === "married") {
    premium *= 0.95;
    factors.push({ label: "Married discount", impact: "-5%" });
  }

  const monthly = roundCurrency(premium);
  return {
    type: "auto",
    label: COVERAGE_LABELS.auto,
    monthlyPremium: monthly,
    annualPremium: roundCurrency(monthly * 12),
    factors,
  };
}

function calculateHomePremium(data: QuoteFormData): QuoteLineItem {
  const baseRates: Record<HomeCoverageLevel, number> = {
    basic: 0.28,
    standard: 0.38,
    premium: 0.52,
  };

  const rate = baseRates[data.homeCoverageLevel];
  let premium = (data.homeValue / 1000) * rate;
  const factors: QuoteFactor[] = [
    { label: "Coverage level", impact: data.homeCoverageLevel },
    { label: "Home value", impact: `$${data.homeValue.toLocaleString()}` },
  ];

  const homeAge = new Date().getFullYear() - data.yearBuilt;
  if (homeAge > 40) {
    premium *= 1.18;
    factors.push({ label: "Older home", impact: "+18%" });
  } else if (homeAge < 10) {
    premium *= 0.95;
    factors.push({ label: "Newer construction", impact: "-5%" });
  }

  if (data.squareFootage > 3000) {
    premium *= 1.1;
    factors.push({ label: "Large home", impact: "+10%" });
  }

  if (data.hasSecuritySystem) {
    premium *= 0.92;
    factors.push({ label: "Security system", impact: "-8%" });
  }

  premium *= zipRiskMultiplier(data.zipCode);

  const monthly = roundCurrency(premium);
  return {
    type: "home",
    label: COVERAGE_LABELS.home,
    monthlyPremium: monthly,
    annualPremium: roundCurrency(monthly * 12),
    factors,
  };
}

function calculateLifePremium(data: QuoteFormData): QuoteLineItem {
  const coverageUnits = data.lifeCoverageAmount / 100000;
  let premium = coverageUnits * 12 * (data.termYears <= 15 ? 1.1 : 1);

  const factors: QuoteFactor[] = [
    {
      label: "Coverage amount",
      impact: `$${data.lifeCoverageAmount.toLocaleString()}`,
    },
    { label: "Term length", impact: `${data.termYears} years` },
  ];

  if (data.isSmoker) {
    premium *= 2.1;
    factors.push({ label: "Tobacco use", impact: "+110%" });
  }

  premium *= ageMultiplier(data.age);

  if (data.age > 50) {
    premium *= 1.2;
    factors.push({ label: "Age band", impact: "+20%" });
  }

  const monthly = roundCurrency(premium);
  return {
    type: "life",
    label: COVERAGE_LABELS.life,
    monthlyPremium: monthly,
    annualPremium: roundCurrency(monthly * 12),
    factors,
  };
}

function calculateBusinessPremium(data: QuoteFormData): QuoteLineItem {
  const industryMultipliers: Record<string, number> = {
    "professional-services": 1,
    retail: 1.15,
    construction: 1.45,
    healthcare: 1.25,
    technology: 0.95,
    hospitality: 1.3,
  };

  let premium = 120;
  const factors: QuoteFactor[] = [
    { label: "Industry", impact: data.industry.replace(/-/g, " ") },
  ];

  premium *= industryMultipliers[data.industry] ?? 1.1;
  premium += data.employeeCount * 8;
  factors.push({
    label: "Employees",
    impact: `${data.employeeCount} ($${data.employeeCount * 8}/mo)`,
  });

  if (data.annualRevenue > 1000000) {
    premium *= 1.2;
    factors.push({ label: "Revenue scale", impact: "+20%" });
  }

  const liabilityUnits = data.liabilityLimit / 500000;
  premium *= 0.85 + liabilityUnits * 0.15;
  factors.push({
    label: "Liability limit",
    impact: `$${(data.liabilityLimit / 1000000).toFixed(1)}M`,
  });

  premium *= zipRiskMultiplier(data.zipCode);

  const monthly = roundCurrency(premium);
  return {
    type: "business",
    label: COVERAGE_LABELS.business,
    monthlyPremium: monthly,
    annualPremium: roundCurrency(monthly * 12),
    factors,
  };
}

const calculators: Record<
  CoverageType,
  (data: QuoteFormData) => QuoteLineItem
> = {
  auto: calculateAutoPremium,
  home: calculateHomePremium,
  life: calculateLifePremium,
  business: calculateBusinessPremium,
};

export function calculateQuote(data: QuoteFormData): QuoteResult | null {
  if (data.coverageTypes.length === 0) return null;

  const lineItems = data.coverageTypes.map((type) => calculators[type](data));
  const subtotalMonthly = roundCurrency(
    lineItems.reduce((sum, item) => sum + item.monthlyPremium, 0),
  );

  let bundleDiscountPercent = 0;
  if (data.coverageTypes.length >= 3) bundleDiscountPercent = 15;
  else if (data.coverageTypes.length === 2) bundleDiscountPercent = 10;

  const bundleDiscountAmount = roundCurrency(
    subtotalMonthly * (bundleDiscountPercent / 100),
  );

  let deductibleAdjustment = 0;
  if (data.deductible >= 2500) deductibleAdjustment = roundCurrency(subtotalMonthly * 0.08);
  else if (data.deductible >= 1500) deductibleAdjustment = roundCurrency(subtotalMonthly * 0.05);
  else if (data.deductible <= 500) deductibleAdjustment = roundCurrency(subtotalMonthly * -0.06);

  const totalMonthly = roundCurrency(
    subtotalMonthly - bundleDiscountAmount - deductibleAdjustment,
  );

  const annualPayDiscount =
    data.paymentFrequency === "annual"
      ? roundCurrency(totalMonthly * 12 * 0.05)
      : 0;

  const totalAnnual =
    data.paymentFrequency === "annual"
      ? roundCurrency(totalMonthly * 12 - annualPayDiscount)
      : roundCurrency(totalMonthly * 12);

  return {
    lineItems,
    subtotalMonthly,
    bundleDiscountPercent,
    bundleDiscountAmount,
    deductibleAdjustment,
    totalMonthly,
    totalAnnual,
    paymentFrequency: data.paymentFrequency,
  };
}

export function validateStep(
  step: number,
  data: QuoteFormData,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (step === 0) {
    if (!data.firstName.trim()) errors.firstName = "First name is required";
    if (!data.lastName.trim()) errors.lastName = "Last name is required";
    if (data.age < 18 || data.age > 100) errors.age = "Age must be between 18 and 100";
    if (!/^\d{5}(-\d{4})?$/.test(data.zipCode.trim()))
      errors.zipCode = "Enter a valid 5-digit ZIP code";
  }

  if (step === 1) {
    if (data.coverageTypes.length === 0)
      errors.coverageTypes = "Select at least one coverage type";
  }

  if (step === 2) {
    if (data.coverageTypes.includes("auto")) {
      if (data.vehicleYear < 1990 || data.vehicleYear > new Date().getFullYear() + 1)
        errors.vehicleYear = "Enter a valid vehicle year";
      if (!data.vehicleMake.trim()) errors.vehicleMake = "Vehicle make is required";
    }
    if (data.coverageTypes.includes("home")) {
      if (data.homeValue < 50000) errors.homeValue = "Minimum home value is $50,000";
      if (data.squareFootage < 200) errors.squareFootage = "Enter valid square footage";
    }
    if (data.coverageTypes.includes("life")) {
      if (data.lifeCoverageAmount < 50000)
        errors.lifeCoverageAmount = "Minimum coverage is $50,000";
    }
    if (data.coverageTypes.includes("business")) {
      if (data.employeeCount < 1) errors.employeeCount = "At least 1 employee required";
      if (data.annualRevenue < 10000)
        errors.annualRevenue = "Enter valid annual revenue";
    }
  }

  return errors;
}
