/**
 * DreamCap Life Insurance Pricing Engine
 * 
 * Based on 2026 industry rate data from:
 * - Ramsey Solutions Term Life Rate Chart (Feb 2026) — $1M coverage base
 * - ChoiceMutual Whole Life Rate Charts (Mar 2026) — multiple coverage tiers
 * - ChoiceMutual / MoneyGeek Final Expense Rates (2026) — per $10K coverage
 * 
 * All rates are ESTIMATES. Actual premiums vary by health, location, and carrier.
 */

export type PolicyType = 'term' | 'whole' | 'final';

export interface QuoteInput {
  age: number;
  gender: 'male' | 'female';
  tobacco: boolean;
  coverageAmount: number;
  policyType: PolicyType;
  termLength?: number; // 10, 15, 20, 25, 30 — only for term life
}

export interface QuoteResult {
  monthlyPremium: number;
  annualPremium: number;
  dailyCost: number;
  deathBenefit: number;
  policyType: PolicyType;
  termLength?: number;
  explanation: string;
  savingsVsCoffee: number;
  costPerDay: string;
}

// ─── Coverage Ranges by Policy Type ─────────────────────────────────────────

export const COVERAGE_RANGES: Record<PolicyType, { min: number; max: number; step: number; defaultVal: number }> = {
  term:  { min: 100000, max: 2000000, step: 25000, defaultVal: 250000 },
  whole: { min: 25000,  max: 500000,  step: 5000,  defaultVal: 50000  },
  final: { min: 5000,   max: 50000,   step: 1000,  defaultVal: 10000  },
};

export const QUICK_AMOUNTS: Record<PolicyType, number[]> = {
  term:  [100000, 250000, 500000, 1000000],
  whole: [25000, 50000, 100000, 250000],
  final: [5000, 10000, 15000, 25000],
};

// ─── Term Length Availability by Age ────────────────────────────────────────

export function getAvailableTermLengths(age: number): number[] {
  const lengths: number[] = [];
  if (age <= 80) lengths.push(10);
  if (age <= 70) lengths.push(15);
  if (age <= 65) lengths.push(20);
  if (age <= 60) lengths.push(25);
  if (age <= 55) lengths.push(30);
  return lengths;
}

// ─── TERM LIFE RATES ────────────────────────────────────────────────────────
// Source: Ramsey Solutions Feb 2026 — Monthly rates for $1M coverage, nonsmoker, "good" health
// We store monthly rates per $1M and scale proportionally

type RateRow = { male: number; female: number };
type RateTable = Record<string, RateRow>;

const TERM_MONTHLY_PER_1M: Record<number, RateTable> = {
  10: {
    '20': { male: 24.42, female: 19.11 },
    '30': { male: 27.62, female: 20.04 },
    '40': { male: 34.79, female: 30.33 },
    '50': { male: 89.49, female: 73.48 },
    '60': { male: 234.98, female: 168.70 },
    '70': { male: 749.45, female: 447.71 },
    '80': { male: 3384.70, female: 2334.10 },
  },
  15: {
    '20': { male: 28.87, female: 23.20 },
    '30': { male: 29.74, female: 24.85 },
    '40': { male: 47.17, female: 39.12 },
    '50': { male: 113.60, female: 92.50 },
    '60': { male: 323.67, female: 225.37 },
    '70': { male: 1082.37, female: 691.23 },
  },
  20: {
    '20': { male: 35.07, female: 27.43 },
    '30': { male: 39.70, female: 30.41 },
    '40': { male: 61.68, female: 50.59 },
    '50': { male: 155.47, female: 114.77 },
    '60': { male: 443.30, female: 311.26 },
    '70': { male: 1834.49, female: 1280.08 },
  },
  25: {
    '20': { male: 51.65, female: 36.70 },
    '30': { male: 52.49, female: 42.47 },
    '40': { male: 90.47, female: 72.68 },
    '50': { male: 228.17, female: 163.86 },
    '60': { male: 797.00, female: 537.02 },
  },
  30: {
    '20': { male: 59.72, female: 42.08 },
    '30': { male: 63.71, female: 48.87 },
    '40': { male: 109.28, female: 85.37 },
    '50': { male: 280.66, female: 206.74 },
  },
};

// ─── WHOLE LIFE RATES ───────────────────────────────────────────────────────
// Source: ChoiceMutual Mar 2026 — Monthly rates for $100K coverage, nonsmoker
// We store monthly rates per $100K and scale proportionally

const WHOLE_MONTHLY_PER_100K: RateTable = {
  '30': { male: 120, female: 100 },
  '35': { male: 140, female: 118 },
  '40': { male: 165, female: 137 },
  '45': { male: 174, female: 150 },
  '50': { male: 207, female: 161 },
  '55': { male: 246, female: 186 },
  '60': { male: 309, female: 228 },
  '65': { male: 405, female: 288 },
  '70': { male: 540, female: 380 },
  '75': { male: 731, female: 524 },
  '80': { male: 1029, female: 719 },
  '85': { male: 1427, female: 1001 },
};

// ─── FINAL EXPENSE RATES ────────────────────────────────────────────────────
// Source: ChoiceMutual / MoneyGeek / CNBC 2026 — Monthly rates per $10K coverage, nonsmoker

const FINAL_MONTHLY_PER_10K: RateTable = {
  '40': { male: 12, female: 11 },
  '45': { male: 14, female: 13 },
  '50': { male: 38, female: 30 },
  '55': { male: 44, female: 35 },
  '60': { male: 52, female: 42 },
  '65': { male: 65, female: 52 },
  '70': { male: 85, female: 68 },
  '75': { male: 115, female: 92 },
  '80': { male: 160, female: 125 },
  '85': { male: 220, female: 175 },
};

// ─── INTERPOLATION ──────────────────────────────────────────────────────────

function interpolateRate(table: RateTable, age: number, gender: 'male' | 'female'): number {
  const ages = Object.keys(table).map(Number).sort((a, b) => a - b);

  if (age <= ages[0]) return table[String(ages[0])][gender];
  if (age >= ages[ages.length - 1]) return table[String(ages[ages.length - 1])][gender];

  let lowerAge = ages[0];
  let upperAge = ages[ages.length - 1];

  for (let i = 0; i < ages.length - 1; i++) {
    if (age >= ages[i] && age <= ages[i + 1]) {
      lowerAge = ages[i];
      upperAge = ages[i + 1];
      break;
    }
  }

  const lowerRate = table[String(lowerAge)][gender];
  const upperRate = table[String(upperAge)][gender];
  const fraction = (age - lowerAge) / (upperAge - lowerAge);

  return lowerRate + fraction * (upperRate - lowerRate);
}

// ─── TOBACCO MULTIPLIER ─────────────────────────────────────────────────────

const TOBACCO_MULTIPLIER: Record<PolicyType, number> = {
  term: 2.0,
  whole: 1.45,
  final: 1.65,
};

// ─── MAIN CALCULATION ───────────────────────────────────────────────────────

function calculateMonthlyPremium(input: QuoteInput): number {
  let monthly: number;

  if (input.policyType === 'term') {
    const termLength = input.termLength || 20;
    const termTable = TERM_MONTHLY_PER_1M[termLength];
    if (!termTable) {
      throw new Error(`Invalid term length: ${termLength}`);
    }
    // Rate is per $1M, scale to actual coverage
    const baseRate = interpolateRate(termTable, input.age, input.gender);
    monthly = baseRate * (input.coverageAmount / 1000000);

  } else if (input.policyType === 'whole') {
    // Rate is per $100K, scale to actual coverage
    const baseRate = interpolateRate(WHOLE_MONTHLY_PER_100K, input.age, input.gender);
    monthly = baseRate * (input.coverageAmount / 100000);

  } else {
    // Final expense: rate is per $10K, scale to actual coverage
    const cappedCoverage = Math.min(input.coverageAmount, 50000);
    const baseRate = interpolateRate(FINAL_MONTHLY_PER_10K, input.age, input.gender);
    monthly = baseRate * (cappedCoverage / 10000);
  }

  // Apply tobacco multiplier
  if (input.tobacco) {
    monthly *= TOBACCO_MULTIPLIER[input.policyType];
  }

  return monthly;
}

// ─── EXPLANATION GENERATOR ──────────────────────────────────────────────────

function generateExplanation(input: QuoteInput, monthlyPremium: number): string {
  const tobaccoNote = input.tobacco
    ? 'As a tobacco user, your rate includes a health adjustment. '
    : '';

  const genderLabel = input.gender === 'male' ? 'man' : 'woman';
  const coverageStr = `$${input.coverageAmount.toLocaleString()}`;

  let policyDesc = '';
  if (input.policyType === 'term') {
    const termYears = input.termLength || 20;
    policyDesc = `This ${termYears}-year term policy provides ${coverageStr} in tax-free death benefit protection at a locked-in rate for the duration of the term.`;
  } else if (input.policyType === 'whole') {
    policyDesc = `This whole life policy provides ${coverageStr} in lifetime coverage with a cash value component that grows tax-deferred.`;
  } else {
    const cappedStr = `$${Math.min(input.coverageAmount, 50000).toLocaleString()}`;
    policyDesc = `This final expense policy covers funeral costs and immediate expenses up to ${cappedStr}.`;
  }

  return `${policyDesc} ${tobaccoNote}Estimated rate for a ${input.age}-year-old ${genderLabel} based on 2026 industry averages.`;
}

// ─── PUBLIC API ─────────────────────────────────────────────────────────────

export function calculateQuote(input: QuoteInput): QuoteResult {
  if (input.age < 18 || input.age > 85) {
    throw new Error('Age must be between 18 and 85');
  }

  const range = COVERAGE_RANGES[input.policyType];
  if (input.coverageAmount < range.min || input.coverageAmount > range.max) {
    throw new Error(`Coverage must be between $${range.min.toLocaleString()} and $${range.max.toLocaleString()} for ${input.policyType} life`);
  }

  const monthlyPremium = Math.round(calculateMonthlyPremium(input) * 100) / 100;
  const annualPremium = Math.round(monthlyPremium * 12 * 100) / 100;
  const dailyCost = Math.round((annualPremium / 365) * 100) / 100;
  const savingsVsCoffee = Math.round((5.50 - dailyCost) * 100) / 100;

  return {
    monthlyPremium,
    annualPremium,
    dailyCost,
    deathBenefit: input.policyType === 'final' ? Math.min(input.coverageAmount, 50000) : input.coverageAmount,
    policyType: input.policyType,
    termLength: input.policyType === 'term' ? (input.termLength || 20) : undefined,
    explanation: generateExplanation(input, monthlyPremium),
    savingsVsCoffee: Math.max(savingsVsCoffee, 0),
    costPerDay: `$${dailyCost.toFixed(2)}`,
  };
}

export function getPremiumRange(
  age: number,
  policyType: PolicyType,
  coverageAmount?: number
): { min: number; max: number } {
  const range = COVERAGE_RANGES[policyType];
  const coverage = coverageAmount || range.defaultVal;

  const minInput: QuoteInput = {
    age,
    gender: 'female',
    tobacco: false,
    coverageAmount: coverage,
    policyType,
    termLength: policyType === 'term' ? 20 : undefined,
  };

  const maxInput: QuoteInput = {
    age,
    gender: 'male',
    tobacco: true,
    coverageAmount: coverage,
    policyType,
    termLength: policyType === 'term' ? 20 : undefined,
  };

  const minQuote = calculateQuote(minInput);
  const maxQuote = calculateQuote(maxInput);

  return { min: minQuote.monthlyPremium, max: maxQuote.monthlyPremium };
}
