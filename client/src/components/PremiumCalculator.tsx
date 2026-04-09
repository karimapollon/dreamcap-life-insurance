import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { calculateQuote, PolicyType, HealthRating } from '@/lib/pricingEngine';
import { Shield, TrendingUp } from 'lucide-react';

interface CalculatorState {
  age: number;
  gender: 'male' | 'female';
  tobacco: boolean;
  coverageAmount: number;
  policyType: PolicyType;
  healthRating: HealthRating;
  term: number;
}

export default function PremiumCalculator() {
  const [state, setState] = useState<CalculatorState>({
    age: 35,
    gender: 'male',
    tobacco: false,
    coverageAmount: 250000,
    policyType: 'term',
    healthRating: 'preferred',
    term: 20,
  });

  const quote = useMemo(() => {
    try {
      return calculateQuote({
        ...state,
        term: state.term,
      });
    } catch (error) {
      return null;
    }
  }, [state]);

  const handleAgeChange = (value: number[]) => {
    setState((prev) => ({ ...prev, age: value[0] }));
  };

  const handleCoverageChange = (value: number[]) => {
    setState((prev) => ({ ...prev, coverageAmount: value[0] }));
  };

  const handleTermChange = (value: number[]) => {
    setState((prev) => ({ ...prev, term: value[0] }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyDetailed = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-display text-dreamcap-deep-blue mb-4">
            See Your Personalized Quote
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Adjust your details below to see realistic premium estimates based on current actuarial data.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Age Slider */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-semibold text-slate-700">Your Age</label>
                <span className="text-2xl font-display text-dreamcap-deep-blue">{state.age}</span>
              </div>
              <Slider
                value={[state.age]}
                onValueChange={handleAgeChange}
                min={18}
                max={85}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>18</span>
                <span>85</span>
              </div>
            </div>

            {/* Gender Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <label className="text-sm font-semibold text-slate-700 block mb-4">Gender</label>
              <ToggleGroup
                type="single"
                value={state.gender}
                onValueChange={(value) => {
                  if (value) setState((prev) => ({ ...prev, gender: value as 'male' | 'female' }));
                }}
                className="flex gap-2"
              >
                <ToggleGroupItem
                  value="male"
                  className="flex-1 py-3 rounded-lg border-2 border-slate-200 data-[state=on]:border-dreamcap-deep-blue data-[state=on]:bg-dreamcap-deep-blue data-[state=on]:text-white"
                >
                  Male
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="female"
                  className="flex-1 py-3 rounded-lg border-2 border-slate-200 data-[state=on]:border-dreamcap-deep-blue data-[state=on]:bg-dreamcap-deep-blue data-[state=on]:text-white"
                >
                  Female
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Tobacco Use */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <label className="text-sm font-semibold text-slate-700 block mb-4">Tobacco Use</label>
              <ToggleGroup
                type="single"
                value={state.tobacco ? 'yes' : 'no'}
                onValueChange={(value) => {
                  setState((prev) => ({ ...prev, tobacco: value === 'yes' }));
                }}
                className="flex gap-2"
              >
                <ToggleGroupItem
                  value="no"
                  className="flex-1 py-3 rounded-lg border-2 border-slate-200 data-[state=on]:border-dreamcap-sky-blue data-[state=on]:bg-dreamcap-sky-blue data-[state=on]:text-white"
                >
                  No
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="yes"
                  className="flex-1 py-3 rounded-lg border-2 border-slate-200 data-[state=on]:border-red-500 data-[state=on]:bg-red-500 data-[state=on]:text-white"
                >
                  Yes
                </ToggleGroupItem>
              </ToggleGroup>
              {state.tobacco && (
                <p className="text-sm text-red-600 mt-3 font-medium">Warning: Tobacco use increases premiums by 3-4x</p>
              )}
            </div>

            {/* Policy Type */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <label className="text-sm font-semibold text-slate-700 block mb-4">Policy Type</label>
              <ToggleGroup
                type="single"
                value={state.policyType}
                onValueChange={(value) => {
                  if (value) setState((prev) => ({ ...prev, policyType: value as PolicyType }));
                }}
                className="flex gap-2"
              >
                <ToggleGroupItem
                  value="term"
                  className="flex-1 py-3 rounded-lg border-2 border-slate-200 text-sm data-[state=on]:border-dreamcap-deep-blue data-[state=on]:bg-dreamcap-deep-blue data-[state=on]:text-white"
                >
                  Term Life
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="whole"
                  className="flex-1 py-3 rounded-lg border-2 border-slate-200 text-sm data-[state=on]:border-dreamcap-deep-blue data-[state=on]:bg-dreamcap-deep-blue data-[state=on]:text-white"
                >
                  Whole Life
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="final"
                  className="flex-1 py-3 rounded-lg border-2 border-slate-200 text-sm data-[state=on]:border-dreamcap-deep-blue data-[state=on]:bg-dreamcap-deep-blue data-[state=on]:text-white"
                >
                  Final Expense
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Term Length (for Term Life) */}
            {state.policyType === 'term' && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-semibold text-slate-700">Term Length</label>
                  <span className="text-2xl font-display text-dreamcap-deep-blue">{state.term} years</span>
                </div>
                <ToggleGroup
                  type="single"
                  value={state.term.toString()}
                  onValueChange={(value) => {
                    setState((prev) => ({ ...prev, term: parseInt(value) }));
                  }}
                  className="flex gap-2"
                >
                  <ToggleGroupItem
                    value="10"
                    className="flex-1 py-3 rounded-lg border-2 border-slate-200 data-[state=on]:border-dreamcap-sky-blue data-[state=on]:bg-dreamcap-sky-blue data-[state=on]:text-white"
                  >
                    10 yrs
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="20"
                    className="flex-1 py-3 rounded-lg border-2 border-slate-200 data-[state=on]:border-dreamcap-sky-blue data-[state=on]:bg-dreamcap-sky-blue data-[state=on]:text-white"
                  >
                    20 yrs
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="30"
                    className="flex-1 py-3 rounded-lg border-2 border-slate-200 data-[state=on]:border-dreamcap-sky-blue data-[state=on]:bg-dreamcap-sky-blue data-[state=on]:text-white"
                  >
                    30 yrs
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            )}

            {/* Coverage Amount Slider */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-semibold text-slate-700">Coverage Amount</label>
                <span className="text-2xl font-display text-dreamcap-gold">{formatCurrency(state.coverageAmount)}</span>
              </div>
              <Slider
                value={[state.coverageAmount]}
                onValueChange={handleCoverageChange}
                min={25000}
                max={1000000}
                step={25000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>$25K</span>
                <span>$1M</span>
              </div>
            </div>

            {/* Health Rating */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <label className="text-sm font-semibold text-slate-700 block mb-4">Health Rating</label>
              <Select
                value={state.healthRating}
                onValueChange={(value) => {
                  setState((prev) => ({ ...prev, healthRating: value as HealthRating }));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preferred-plus">Preferred Plus (Best)</SelectItem>
                  <SelectItem value="preferred">Preferred (Standard)</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="substandard">Substandard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Card - Sticky on Desktop */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            {quote && (
              <Card className="bg-gradient-to-br from-dreamcap-deep-blue to-blue-800 text-white p-8 shadow-xl border-0">
                {/* Premium Display */}
                <div className="mb-8">
                  <p className="text-sm font-semibold text-blue-100 mb-2">Your Estimated Monthly Premium</p>
                  <p className="text-5xl font-display font-bold mb-1">{formatCurrencyDetailed(quote.monthlyPremium)}</p>
                  <p className="text-sm text-blue-100">or {formatCurrencyDetailed(quote.annualPremium)}/year</p>
                </div>

                {/* Divider */}
                <div className="h-px bg-blue-400 mb-8 opacity-30"></div>

                {/* Protection Activated */}
                <div className="bg-blue-600 bg-opacity-50 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-200 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm mb-1">Your Family Could Receive</p>
                      <p className="text-2xl font-display font-bold text-blue-100">{formatCurrency(quote.deathBenefit)}</p>
                      <p className="text-xs text-blue-200 mt-1">Tax-free death benefit</p>
                    </div>
                  </div>
                </div>

                {/* Policy Details */}
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-100">Policy Type:</span>
                    <span className="font-semibold capitalize">{quote.policyType === 'term' ? `${state.term}-Year Term` : quote.policyType === 'whole' ? 'Whole Life' : 'Final Expense'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Your Age:</span>
                    <span className="font-semibold">{state.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Health Rating:</span>
                    <span className="font-semibold capitalize">{state.healthRating.replace('-', ' ')}</span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-blue-600 bg-opacity-40 rounded-lg p-3 mb-6">
                  <p className="text-xs text-blue-50 leading-relaxed">{quote.explanation}</p>
                </div>

                {/* CTA Button */}
                <Button className="w-full bg-dreamcap-gold hover:bg-yellow-500 text-slate-900 font-semibold py-6 rounded-lg transition-all hover:shadow-lg">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Get My Personalized Quote
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
