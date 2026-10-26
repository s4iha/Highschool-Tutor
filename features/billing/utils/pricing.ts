/**
 * HighSchool Tutor Pricing Utilities & Currency Formatters
 * All gateway transactions are strictly mapped to integer centavos to eliminate float errors.
 */

export const MONTHLY_PRICE_PHP = 299;
export const ANNUAL_PRICE_PHP = 2499;

// 12 months @ ₱299 = ₱3,588. ₱3,588 - ₱2,499 = ₱1,089 savings (>30% discount)
export const ANNUAL_SAVINGS_PHP = 1089;
export const ANNUAL_SAVINGS_PERCENT = Math.round((ANNUAL_SAVINGS_PHP / (MONTHLY_PRICE_PHP * 12)) * 100);

export function toCentavos(amountPhp: number): number {
  return Math.round(amountPhp * 100);
}

export function fromCentavos(amountCentavos: number): number {
  return amountCentavos / 100;
}

export function formatPhp(amountPhp: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountPhp);
}

export interface PlanConfig {
  planId: "MONTHLY" | "ANNUAL";
  title: string;
  badge?: string;
  pricePhp: number;
  priceCentavos: number;
  durationDays: number;
  savingsPhp?: number;
  savingsText?: string;
  description: string;
}

export const PLAN_CONFIGS: Record<"MONTHLY" | "ANNUAL", PlanConfig> = {
  MONTHLY: {
    planId: "MONTHLY",
    title: "Monthly Access Pass",
    pricePhp: MONTHLY_PRICE_PHP,
    priceCentavos: toCentavos(MONTHLY_PRICE_PHP),
    durationDays: 30,
    description: "Flexible monthly access to all DepEd MATATAG high school subjects and Socratic AI tutoring.",
  },
  ANNUAL: {
    planId: "ANNUAL",
    title: "Annual Unlimited Pass",
    badge: "Best Value • Save ₱1,089",
    pricePhp: ANNUAL_PRICE_PHP,
    priceCentavos: toCentavos(ANNUAL_PRICE_PHP),
    durationDays: 365,
    savingsPhp: ANNUAL_SAVINGS_PHP,
    savingsText: `Save ${formatPhp(ANNUAL_SAVINGS_PHP)} vs. monthly billing (over 30% off)`,
    description: "Full year unlimited access to all 130+ DepEd subjects, quarter exam drill runners, and unlimited AI tutoring.",
  },
};
