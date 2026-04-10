import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Check, Shield, Clock, Heart } from 'lucide-react';
import { useLocation } from 'wouter';
import { useFunnel } from '@/contexts/FunnelContext';
import { COVERAGE_RANGES, QUICK_AMOUNTS, getAvailableTermLengths } from '@/lib/pricingEngine';
import type { PolicyType } from '@/lib/pricingEngine';

/**
 * Estimate Page — Step-by-step funnel
 * 
 * Step order:
 * 1. Age (slider)
 * 2. Gender (choice)
 * 3. Tobacco use (choice)
 * 4. Policy type (choice with descriptions)
 * 5. Term length (conditional — only for term life)
 * 6. Coverage amount (slider with dynamic ranges based on policy type)
 */

export default function Estimate() {
  const [, setLocation] = useLocation();
  const { data, updateData, setCurrentStep } = useFunnel();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [validationError, setValidationError] = useState('');

  // Determine which steps to show based on policy type
  const steps = useMemo(() => {
    const baseSteps = [
      { id: 'age', title: "What's your age?", subtitle: 'This helps us find your lowest rate' },
      { id: 'gender', title: "What's your gender?", subtitle: 'Helps us personalize your options' },
      { id: 'tobacco', title: 'Do you use tobacco?', subtitle: 'Non-tobacco users qualify for lower rates' },
      {
        id: 'policy',
        title: 'What type of coverage are you looking for?',
        subtitle: 'Each plan is designed for different needs',
      },
    ];

    // Add term length step only if policy type is 'term'
    if (data.policyType === 'term') {
      baseSteps.push({
        id: 'termLength',
        title: 'How many years of coverage do you need?',
        subtitle: 'Longer terms lock in your rate for more years',
      });
    }

    // Always add coverage amount as the final step
    baseSteps.push({
      id: 'coverage',
      title: 'How much coverage would you like?',
      subtitle: getCoverageSubtitle(data.policyType as PolicyType),
    });

    return baseSteps;
  }, [data.policyType]);

  const step = steps[currentStepIndex];
  const totalSteps = steps.length;
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  // Available term lengths based on age
  const availableTermLengths = useMemo(() => getAvailableTermLengths(data.age), [data.age]);

  // Coverage range based on policy type
  const coverageRange = useMemo(() => {
    if (!data.policyType) return COVERAGE_RANGES.term;
    return COVERAGE_RANGES[data.policyType as PolicyType] || COVERAGE_RANGES.term;
  }, [data.policyType]);

  const quickAmounts = useMemo(() => {
    if (!data.policyType) return QUICK_AMOUNTS.term;
    return QUICK_AMOUNTS[data.policyType as PolicyType] || QUICK_AMOUNTS.term;
  }, [data.policyType]);

  function getCoverageSubtitle(policyType: PolicyType | ''): string {
    switch (policyType) {
      case 'term':
        return 'Term life typically ranges from $100K to $2M';
      case 'whole':
        return 'Whole life typically ranges from $25K to $500K';
      case 'final':
        return 'Final expense covers funeral and burial costs';
      default:
        return 'Drag to choose the amount that protects your family';
    }
  }

  function isStepAnswered(): boolean {
    if (!step) return false;
    switch (step.id) {
      case 'age':
        return data.age >= 18 && data.age <= 85;
      case 'gender':
        return data.gender === 'male' || data.gender === 'female';
      case 'tobacco':
        return typeof data.tobacco === 'boolean';
      case 'policy':
        return data.policyType === 'term' || data.policyType === 'whole' || data.policyType === 'final';
      case 'termLength':
        return availableTermLengths.includes(data.termLength);
      case 'coverage':
        return data.coverageAmount >= coverageRange.min && data.coverageAmount <= coverageRange.max;
      default:
        return false;
    }
  }

  const isAnswered = isStepAnswered();

  function handleNext() {
    if (!isAnswered) {
      setValidationError('Please select an option to continue');
      return;
    }

    // When policy type changes, reset coverage to the default for that type
    if (step.id === 'policy') {
      const pType = data.policyType as PolicyType;
      const range = COVERAGE_RANGES[pType];
      updateData({ coverageAmount: range.defaultVal });

      // Also ensure term length is valid
      if (pType === 'term') {
        const available = getAvailableTermLengths(data.age);
        if (!available.includes(data.termLength)) {
          updateData({ termLength: available[Math.floor(available.length / 2)] || 20 });
        }
      }
    }

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setValidationError('');
    } else {
      // All steps complete, go to lead capture
      setCurrentStep(5);
      setLocation('/lead-capture');
    }
  }

  function handleBack() {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setValidationError('');
    } else {
      setLocation('/');
    }
  }

  function formatCurrency(amount: number): string {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  }

  const progressText =
    currentStepIndex === totalSteps - 1
      ? 'Final step — see your results next'
      : `Step ${currentStepIndex + 1} of ${totalSteps}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B5E9E] via-[#2B7BC4] to-[#e8f0fe] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Let's Get Your Estimate</h1>
          <p className="text-blue-100">Just a few quick details and you'll see your personalized quote.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-white/20 backdrop-blur-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-white">{progressText}</span>
            <span className="text-sm text-blue-100">
              {currentStepIndex + 1} of {totalSteps} questions
            </span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#D4AF37] to-[#F4C430] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((s, idx) => (
            <div
              key={s.id}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all ${
                idx === currentStepIndex
                  ? 'bg-[#D4AF37] text-[#1B5E9E]'
                  : idx < currentStepIndex
                  ? 'bg-green-400 text-white'
                  : 'bg-white/30 text-white'
              }`}
            >
              {idx < currentStepIndex ? <Check className="w-4 h-4 inline mr-1" /> : <span>{idx + 1}</span>}
            </div>
          ))}
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8 shadow-xl border-0 bg-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1B5E9E] mb-2">{step.title}</h2>
            <p className="text-gray-600">{step.subtitle}</p>
          </div>

          {/* ── Age Slider ── */}
          {step.id === 'age' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-[#D4AF37] mb-4">{data.age}</div>
              </div>
              <input
                type="range"
                min={18}
                max={85}
                value={data.age}
                onChange={(e) => {
                  updateData({ age: parseInt(e.target.value) });
                  setValidationError('');
                }}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B5E9E]"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>18</span>
                <span>85</span>
              </div>
            </div>
          )}

          {/* ── Gender Choice ── */}
          {step.id === 'gender' && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'male', label: 'Male', icon: '👨' },
                { value: 'female', label: 'Female', icon: '👩' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    updateData({ gender: opt.value as 'male' | 'female' });
                    setValidationError('');
                  }}
                  className={`p-5 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                    data.gender === opt.value
                      ? 'bg-[#1B5E9E] text-white shadow-lg scale-105 ring-2 ring-[#D4AF37]'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-2xl block mb-1">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* ── Tobacco Choice ── */}
          {step.id === 'tobacco' && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: false, label: 'No', icon: '✓' },
                { value: true, label: 'Yes', icon: '✗' },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  onClick={() => {
                    updateData({ tobacco: opt.value });
                    setValidationError('');
                  }}
                  className={`p-5 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                    data.tobacco === opt.value
                      ? 'bg-[#1B5E9E] text-white shadow-lg scale-105 ring-2 ring-[#D4AF37]'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-2xl block mb-1">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* ── Policy Type Choice ── */}
          {step.id === 'policy' && (
            <div className="space-y-4">
              {[
                {
                  value: 'term' as const,
                  label: 'Term Life',
                  icon: <Clock className="w-6 h-6" />,
                  desc: 'Affordable coverage for a set period (10–30 years). Ideal for families with a mortgage, young children, or income to replace.',
                  range: '$100K – $2M coverage',
                },
                {
                  value: 'whole' as const,
                  label: 'Whole Life',
                  icon: <Shield className="w-6 h-6" />,
                  desc: 'Lifetime coverage with a cash value that grows over time. Ideal for legacy planning and guaranteed protection.',
                  range: '$25K – $500K coverage',
                },
                {
                  value: 'final' as const,
                  label: 'Final Expense',
                  icon: <Heart className="w-6 h-6" />,
                  desc: 'Covers funeral, burial, and end-of-life costs so your family isn\'t burdened. No medical exam required.',
                  range: '$5K – $50K coverage',
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    updateData({ policyType: opt.value });
                    setValidationError('');
                  }}
                  className={`w-full text-left p-5 rounded-xl transition-all duration-300 border-2 ${
                    data.policyType === opt.value
                      ? 'bg-[#1B5E9E] text-white shadow-lg border-[#D4AF37]'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        data.policyType === opt.value ? 'bg-white/20' : 'bg-[#1B5E9E]/10'
                      }`}
                    >
                      <span className={data.policyType === opt.value ? 'text-white' : 'text-[#1B5E9E]'}>
                        {opt.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{opt.label}</div>
                      <p
                        className={`text-sm mb-2 ${
                          data.policyType === opt.value ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {opt.desc}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          data.policyType === opt.value
                            ? 'bg-[#D4AF37] text-[#1B5E9E]'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {opt.range}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── Term Length Choice (only for term life) ── */}
          {step.id === 'termLength' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {availableTermLengths.map((years) => (
                  <button
                    key={years}
                    onClick={() => {
                      updateData({ termLength: years });
                      setValidationError('');
                    }}
                    className={`p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      data.termLength === years
                        ? 'bg-[#1B5E9E] text-white shadow-lg scale-105 ring-2 ring-[#D4AF37]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-2xl font-bold mb-1">{years}</div>
                    <div className="text-sm opacity-80">years</div>
                  </button>
                ))}
              </div>
              {availableTermLengths.length < 5 && (
                <p className="text-xs text-gray-400 text-center mt-3">
                  Some term lengths are not available at age {data.age}.
                </p>
              )}
            </div>
          )}

          {/* ── Coverage Amount Slider ── */}
          {step.id === 'coverage' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#D4AF37] mb-1">
                  ${data.coverageAmount.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500 mt-2">in coverage protection</p>
              </div>

              {/* Slider */}
              <div className="relative px-1">
                <input
                  type="range"
                  min={coverageRange.min}
                  max={coverageRange.max}
                  step={coverageRange.step}
                  value={Math.min(Math.max(data.coverageAmount, coverageRange.min), coverageRange.max)}
                  onChange={(e) => {
                    updateData({ coverageAmount: parseInt(e.target.value) });
                    setValidationError('');
                  }}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B5E9E]"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{formatCurrency(coverageRange.min)}</span>
                  <span>{formatCurrency(coverageRange.max)}</span>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      updateData({ coverageAmount: amount });
                      setValidationError('');
                    }}
                    className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                      data.coverageAmount === amount
                        ? 'bg-[#1B5E9E] text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Validation Error */}
          {validationError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{validationError}</p>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex-1 border-2 border-white text-white hover:bg-white hover:text-[#1B5E9E] font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`flex-1 font-semibold transition-all ${
              isAnswered
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1B5E9E] hover:shadow-lg hover:scale-105'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            {currentStepIndex === totalSteps - 1 ? 'See My Estimate' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 text-center text-sm text-white/80">
          <p>Secure & Private &bull; No Obligation &bull; Takes 2 minutes</p>
        </div>
      </div>
    </div>
  );
}
