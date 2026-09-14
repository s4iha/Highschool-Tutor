export interface PublicConfig {
  monthlyPricePhp: number;
  annualPricePhp: number;
  maxTrialSubjects: number;
  maxFreeLessons: number;
  gcashReceiverNumber: string;
  gcashAccountName: string;
  mayaReceiverNumber: string;
  mayaAccountName: string;
  enableAiTutorTrial: boolean;
  promoDiscountPercent: number;
}

export const DEFAULT_PUBLIC_CONFIG: PublicConfig = {
  monthlyPricePhp: 199,
  annualPricePhp: 1499,
  maxTrialSubjects: 3,
  maxFreeLessons: 3,
  gcashReceiverNumber: "0917-888-4321",
  gcashAccountName: "HIGHSCHOOL TUTOR PH",
  mayaReceiverNumber: "0918-999-8765",
  mayaAccountName: "HIGHSCHOOL TUTOR PH",
  enableAiTutorTrial: true,
  promoDiscountPercent: 20,
};
