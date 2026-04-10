/**
 * DreamCap Life Insurance Pricing Engine
 * 
 * Implements realistic actuarial-style pricing based on:
 * - Age (primary driver)
 * - Gender
 * - Tobacco use (2-4x multiplier)
 * - Coverage amount
 * - Policy type (Term, Whole Life, Final Expense)
 * - Health rating
 */

export type PolicyType = 'term' | 'whole' | 'final';
export type HealthRating = 'preferred-plus' | 'preferred' | 'standard' | 'substandard';

export interface QuoteInput {
  age: number;
  gender: 'male' | 'female';
  tobacco: boolean;
  coverageAmount: number;
  policyType: PolicyType;
  healthRating?: HealthRating;
  term?: number; // Years for term life (10, 20, 30)
}

export interface QuoteResult {
  monthlyPremium: number;
  annualPremium: number;
  deathBenefit: number;
  policyType: PolicyType;
  explanation: string;
}

/**
 * Base rates per $1,000 of coverage (monthly)
 * These reflect real-world actuarial patterns
 */
const BASE_RATES = {
  term: {
    10: { male: 0.08, female: 0.07 },
    20: { male: 0.12, female: 0.10 },
    30: { male: 0.18, female: 0.15 },
  },
  whole: {
    male: 0.85,
    female: 0.75,
  },
  final: {
    male: 0.35,
    female: 0.30,
  },
};

/**
 * Age multipliers - increases significantly with age
 * Reflects exponential increase in mortality risk
 */
function getAgeMultiplier(age: number): number {
  if (age < 30) return 0.8;
  if (age < 35) return 0.9;
  if (age < 40) return 1.0;
  if (age < 45) return 1.2;
  if (age < 50) return 1.5;
  if (age < 55) return 2.0;
  if (age < 60) return 2.8;
  if (age < 65) return 4.0;
  return 5.5;
}

/**
 * Health rating multipliers
 */
function getHealthMultiplier(healthRating: HealthRating): number {
  const multipliers: Record<HealthRating, number> = {
    'preferred-plus': 0.85,
    'preferred': 1.0,
    'standard': 1.35,
    'substandard': 1.75,
  };
  return multipliers[healthRating];
}

/**
 * Tobacco multiplier - smokers pay significantly more
 */
function getTobaccoMultiplier(tobacco: boolean): number {
  return tobacco ? 3.5 : 1.0;
}

/**
 * Calculate monthly premium based on inputs
 */
function calculateMonthlyPremium(input: QuoteInput): number {
  let baseRate = 0;

  if (input.policyType === 'term') {
    const term = input.term || 20;
    const termRates = BASE_RATES.term[term as keyof typeof BASE_RATES.term];
    baseRate = termRates[input.gender];
  } else if (input.policyType === 'whole') {
    baseRate = BASE_RATES.whole[input.gender];
  } else if (input.policyType === 'final') {
    baseRate = BASE_RATES.final[input.gender];
  }

  // Apply multipliers
  const ageMultiplier = getAgeMultiplier(input.age);
  const healthMultiplier = getHealthMultiplier(input.healthRating || 'preferred');
  const tobaccoMultiplier = getTobaccoMultiplier(input.tobacco);

  // Calculate per $1,000 rate
  const adjustedRate = baseRate * ageMultiplier * healthMultiplier * tobaccoMultiplier;

  // Convert to actual premium
  const premiumPer1000 = adjustedRate;
  const coverageIn1000s = input.coverageAmount / 1000;
  const monthlyPremium = premiumPer1000 * coverageIn1000s;

  // Add base processing fee ($5-15 depending on policy type)
  const processingFee = input.policyType === 'final' ? 3 : input.policyType === 'whole' ? 8 : 5;

  return Math.round((monthlyPremium + processingFee) * 100) / 100;
}

/**
 * Generate a realistic explanation of the quote
 */
function generateExplanation(input: QuoteInput, premium: number): string {
  const ageGroup = input.age < 40 ? 'younger' : input.age < 55 ? 'mid-age' : 'mature';
  const tobaccoNote = input.tobacco ? ' As a tobacco user, your rate includes a significant health adjustment. ' : '';
  const healthNote = (input.healthRating && input.healthRating !== 'preferred') ? ` Your health rating (${input.healthRating}) is reflected in this estimate. ` : '';
  
  let policyDesc = '';
  if (input.policyType === 'term') {
    policyDesc = `This ${input.term || 20}-year term policy provides pure death benefit protection with no cash value.`;
  } else if (input.policyType === 'whole') {
    policyDesc = 'This whole life policy provides lifetime coverage with a cash value component that grows over time.';
  } else {
    policyDesc = 'This final expense policy is designed to cover funeral costs and immediate expenses.';
  }

  return `${policyDesc}${tobaccoNote}${healthNote}At age ${input.age}, this estimate reflects current actuarial tables for ${ageGroup} applicants. Rates are guaranteed if approved.`;
}

/**
 * Main quote calculation function
 */
export function calculateQuote(input: QuoteInput): QuoteResult {
  // Validate inputs
  if (input.age < 18 || input.age > 85) {
    throw new Error('Age must be between 18 and 85');
  }

  if (input.coverageAmount < 25000 || input.coverageAmount > 1000000) {
    throw new Error('Coverage amount must be between $25,000 and $1,000,000');
  }

  const monthlyPremium = calculateMonthlyPremium(input);
  const annualPremium = Math.round(monthlyPremium * 12 * 100) / 100;

  return {
    monthlyPremium,
    annualPremium,
    deathBenefit: input.coverageAmount,
    policyType: input.policyType,
    explanation: generateExplanation(input, monthlyPremium),
  };
}

/**
 * Get realistic premium range for a given age and policy type
 * Used for educational purposes on the landing page
 */
export function getPremiumRange(
  age: number,
  policyType: PolicyType,
  coverageAmount: number = 250000
): { min: number; max: number } {
  const minInput: QuoteInput = {
    age,
    gender: 'female',
    tobacco: false,
    coverageAmount,
    policyType,
    healthRating: 'preferred-plus',
    term: 20,
  };

  const maxInput: QuoteInput = {
    age,
    gender: 'male',
    tobacco: true,
    coverageAmount,
    policyType,
    healthRating: 'substandard',
    term: 20,
  };

  const minQuote = calculateQuote(minInput);
  const maxQuote = calculateQuote(maxInput);

  return {
    min: minQuote.monthlyPremium,
    max: maxQuote.monthlyPremium,
  };
}
