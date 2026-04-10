/**
 * DreamCap Life Insurance Pricing Engine
 * 
 * Based on 2026 industry rate data (source: LifeStein.com via NerdWallet, Feb 2026)
 * Uses interpolation between known data points for accurate estimates.
 * 
 * Rate basis: $500,000 coverage, Preferred health class
 * Rates scale linearly with coverage amount relative to $500K base.
 */

export type PolicyType = 'term' | 'whole' | 'final';

export interface QuoteInput {
  age: number;
  gender: 'male' | 'female';
  tobacco: boolean;
  coverageAmount: number;
  policyType: PolicyType;
  term?: number;
}

export interface QuoteResult {
  monthlyPremium: number;
  annualPremium: number;
  dailyCost: number;
  deathBenefit: number;
  policyType: PolicyType;
  explanation: string;
  savingsVsCoffee: number;
  costPerDay: string;
}

/**
 * Annual rates for $500,000 coverage, Preferred Non-Smoker
 * Source: LifeStein.com / NerdWallet, Feb 2026
 */
const TERM_20_ANNUAL_NONSMOKER: Record<string, { male: number; female: number }> = {
  '20': { male: 244, female: 211 },
  '25': { male: 230, female: 198 },
  '30': { male: 275, female: 215 },
  '35': { male: 300, female: 245 },
  '40': { male: 411, female: 341 },
  '45': { male: 580, female: 470 },
  '50': { male: 975, female: 756 },
  '55': { male: 1500, female: 1150 },
  '60': { male: 2647, female: 1885 },
  '65': { male: 5200, female: 3800 },
  '70': { male: 11015, female: 8940 },
  '75': { male: 16000, female: 13000 },
  '80': { male: 22000, female: 18000 },
  '85': { male: 30000, female: 25000 },
};

/**
 * Annual rates for $500,000 coverage, Smoker Preferred
 */
const TERM_20_ANNUAL_SMOKER: Record<string, { male: number; female: number }> = {
  '20': { male: 751, female: 554 },
  '25': { male: 770, female: 600 },
  '30': { male: 796, female: 645 },
  '35': { male: 1100, female: 880 },
  '40': { male: 1482, female: 1176 },
  '45': { male: 2400, female: 1800 },
  '50': { male: 3495, female: 2561 },
  '55': { male: 5800, female: 4200 },
  '60': { male: 8454, female: 6800 },
  '65': { male: 13136, female: 9655 },
  '70': { male: 20000, female: 16000 },
  '75': { male: 28000, female: 23000 },
  '80': { male: 38000, female: 32000 },
  '85': { male: 50000, female: 42000 },
};

/**
 * Annual rates for $500,000 Whole Life, Non-Smoker
 */
const WHOLE_ANNUAL_NONSMOKER: Record<string, { male: number; female: number }> = {
  '20': { male: 2548, female: 2260 },
  '25': { male: 3100, female: 2780 },
  '30': { male: 3662, female: 3292 },
  '35': { male: 4500, female: 4050 },
  '40': { male: 5524, female: 4967 },
  '45': { male: 7000, female: 6300 },
  '50': { male: 8749, female: 7782 },
  '55': { male: 11500, female: 10100 },
  '60': { male: 14517, female: 12670 },
  '65': { male: 19500, female: 17000 },
  '70': { male: 24797, female: 21766 },
  '75': { male: 32000, female: 28000 },
  '80': { male: 42000, female: 37000 },
  '85': { male: 55000, female: 48000 },
};

/**
 * Annual rates for $500,000 Whole Life, Smoker
 */
const WHOLE_ANNUAL_SMOKER: Record<string, { male: number; female: number }> = {
  '20': { male: 3325, female: 2973 },
  '25': { male: 4100, female: 3700 },
  '30': { male: 4923, female: 4492 },
  '35': { male: 6200, female: 5650 },
  '40': { male: 7533, female: 6915 },
  '45': { male: 9800, female: 8900 },
  '50': { male: 12371, female: 11068 },
  '55': { male: 16500, female: 14600 },
  '60': { male: 21107, female: 18427 },
  '65': { male: 27500, female: 24000 },
  '70': { male: 34922, female: 31798 },
  '75': { male: 45000, female: 40000 },
  '80': { male: 58000, female: 52000 },
  '85': { male: 72000, female: 65000 },
};

/**
 * Final Expense rates (per $10,000 coverage, annual)
 * Typically $5K-$50K coverage for seniors
 * Based on industry averages for simplified issue policies
 */
const FINAL_EXPENSE_ANNUAL_PER_10K: Record<string, { male: number; female: number }> = {
  '40': { male: 72, female: 60 },
  '45': { male: 96, female: 78 },
  '50': { male: 132, female: 108 },
  '55': { male: 180, female: 150 },
  '60': { male: 252, female: 210 },
  '65': { male: 360, female: 300 },
  '70': { male: 516, female: 432 },
  '75': { male: 720, female: 600 },
  '80': { male: 1020, female: 852 },
  '85': { male: 1440, female: 1200 },
};

const FINAL_EXPENSE_SMOKER_MULTIPLIER = 1.65;

/**
 * Interpolate between known data points for any age
 */
function interpolateRate(
  rateTable: Record<string, { male: number; female: number }>,
  age: number,
  gender: 'male' | 'female'
): number {
  const ages = Object.keys(rateTable).map(Number).sort((a, b) => a - b);
  
  // Clamp age to table range
  if (age <= ages[0]) return rateTable[String(ages[0])][gender];
  if (age >= ages[ages.length - 1]) return rateTable[String(ages[ages.length - 1])][gender];
  
  // Find surrounding data points
  let lowerAge = ages[0];
  let upperAge = ages[ages.length - 1];
  
  for (let i = 0; i < ages.length - 1; i++) {
    if (age >= ages[i] && age <= ages[i + 1]) {
      lowerAge = ages[i];
      upperAge = ages[i + 1];
      break;
    }
  }
  
  const lowerRate = rateTable[String(lowerAge)][gender];
  const upperRate = rateTable[String(upperAge)][gender];
  
  // Linear interpolation
  const fraction = (age - lowerAge) / (upperAge - lowerAge);
  return lowerRate + fraction * (upperRate - lowerRate);
}

/**
 * Calculate annual premium based on inputs
 * All rates are based on $500K coverage and scaled proportionally
 */
function calculateAnnualPremium(input: QuoteInput): number {
  const coverageRatio = input.coverageAmount / 500000;
  let annualRate: number;

  if (input.policyType === 'term') {
    const table = input.tobacco ? TERM_20_ANNUAL_SMOKER : TERM_20_ANNUAL_NONSMOKER;
    annualRate = interpolateRate(table, input.age, input.gender);
    annualRate *= coverageRatio;
  } else if (input.policyType === 'whole') {
    const table = input.tobacco ? WHOLE_ANNUAL_SMOKER : WHOLE_ANNUAL_NONSMOKER;
    annualRate = interpolateRate(table, input.age, input.gender);
    annualRate *= coverageRatio;
  } else {
    // Final expense — uses per-$10K rate table
    // Cap coverage at $50K for final expense
    const cappedCoverage = Math.min(input.coverageAmount, 50000);
    const coverageUnits = cappedCoverage / 10000;
    annualRate = interpolateRate(FINAL_EXPENSE_ANNUAL_PER_10K, input.age, input.gender);
    annualRate *= coverageUnits;
    if (input.tobacco) {
      annualRate *= FINAL_EXPENSE_SMOKER_MULTIPLIER;
    }
  }

  // Add small policy fee ($36-$60/year depending on type)
  const policyFee = input.policyType === 'final' ? 36 : input.policyType === 'whole' ? 60 : 48;
  
  return annualRate + policyFee;
}

/**
 * Generate explanation of the quote
 */
function generateExplanation(input: QuoteInput, monthlyPremium: number): string {
  const tobaccoNote = input.tobacco 
    ? 'As a tobacco user, your rate includes a health adjustment. Quitting could reduce your premium by up to 60%. ' 
    : '';
  
  let policyDesc = '';
  if (input.policyType === 'term') {
    policyDesc = `This 20-year term policy provides $${input.coverageAmount.toLocaleString()} in tax-free death benefit protection at a locked-in rate.`;
  } else if (input.policyType === 'whole') {
    policyDesc = `This whole life policy provides $${input.coverageAmount.toLocaleString()} in lifetime coverage with a cash value component that grows tax-deferred.`;
  } else {
    policyDesc = `This final expense policy covers funeral costs and immediate expenses up to $${Math.min(input.coverageAmount, 50000).toLocaleString()}.`;
  }

  return `${policyDesc} ${tobaccoNote}Based on 2026 industry rates for a ${input.age}-year-old ${input.gender === 'male' ? 'man' : 'woman'} in preferred health. Rates are guaranteed upon approval.`;
}

/**
 * Main quote calculation function
 */
export function calculateQuote(input: QuoteInput): QuoteResult {
  if (input.age < 18 || input.age > 85) {
    throw new Error('Age must be between 18 and 85');
  }

  if (input.coverageAmount < 10000 || input.coverageAmount > 2000000) {
    throw new Error('Coverage amount must be between $10,000 and $2,000,000');
  }

  const annualPremium = calculateAnnualPremium(input);
  const monthlyPremium = Math.round((annualPremium / 12) * 100) / 100;
  const roundedAnnual = Math.round(annualPremium * 100) / 100;
  const dailyCost = Math.round((annualPremium / 365) * 100) / 100;

  // Compare to daily coffee cost (~$5.50 avg)
  const savingsVsCoffee = Math.round((5.50 - dailyCost) * 100) / 100;

  return {
    monthlyPremium,
    annualPremium: roundedAnnual,
    dailyCost,
    deathBenefit: input.policyType === 'final' ? Math.min(input.coverageAmount, 50000) : input.coverageAmount,
    policyType: input.policyType,
    explanation: generateExplanation(input, monthlyPremium),
    savingsVsCoffee: Math.max(savingsVsCoffee, 0),
    costPerDay: `$${dailyCost.toFixed(2)}`,
  };
}

/**
 * Get premium range for educational display
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
    term: 20,
  };

  const maxInput: QuoteInput = {
    age,
    gender: 'male',
    tobacco: true,
    coverageAmount,
    policyType,
    term: 20,
  };

  const minQuote = calculateQuote(minInput);
  const maxQuote = calculateQuote(maxInput);

  return {
    min: minQuote.monthlyPremium,
    max: maxQuote.monthlyPremium,
  };
}
