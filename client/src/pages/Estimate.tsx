import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useLocation } from 'wouter';
import { useFunnel } from '@/contexts/FunnelContext';

const STEPS = [
  {
    id: 'age',
    title: 'What\'s your age?',
    subtitle: 'Great, this helps us find your lowest rate',
    type: 'slider',
    min: 18,
    max: 85,
    field: 'age',
  },
  {
    id: 'gender',
    title: 'What\'s your gender?',
    subtitle: 'Helps us personalize your options',
    type: 'choice',
    options: [
      { value: 'male', label: '👨 Male' },
      { value: 'female', label: '👩 Female' },
    ],
    field: 'gender',
  },
  {
    id: 'tobacco',
    title: 'Do you use tobacco?',
    subtitle: 'Nice — this can significantly reduce your cost',
    type: 'choice',
    options: [
      { value: 'no', label: '✓ No' },
      { value: 'yes', label: '✗ Yes' },
    ],
    field: 'tobacco',
  },
  {
    id: 'coverage',
    title: 'How much coverage would you like?',
    subtitle: 'Drag to choose the amount that protects your family',
    type: 'coverage-slider',
    min: 10000,
    max: 2000000,
    step: 5000,
    field: 'coverageAmount',
  },
  {
    id: 'policy',
    title: 'What type of policy?',
    subtitle: 'You\'re 60 seconds away from your personalized plan',
    type: 'choice',
    options: [
      { value: 'term', label: '📅 Term (20-year)' },
      { value: 'whole', label: '♾️ Whole Life' },
      { value: 'final', label: '🛡️ Final Expense' },
    ],
    field: 'policyType',
  },
];

export default function Estimate() {
  const [, setLocation] = useLocation();
  const { data, updateData, setCurrentStep } = useFunnel();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [validationError, setValidationError] = useState('');

  const step = STEPS[currentStepIndex];
  const isAnswered = isStepAnswered();
  const progressPercent = ((currentStepIndex + 1) / STEPS.length) * 100;

  function isStepAnswered(): boolean {
    const field = step.field as keyof typeof data;
    const value = data[field];
    
    if (step.type === 'slider' || step.type === 'coverage-slider') {
      return true;
    }
    
    if (step.type === 'choice') {
      if (field === 'gender') return (value as string) !== '';
      if (field === 'tobacco') return typeof value === 'boolean';
      if (field === 'policyType') return (value as string) !== '';
    }
    
    return false;
  }

  function handleNext() {
    if (!isAnswered) {
      setValidationError('Please select an option to continue');
      return;
    }

    if (currentStepIndex < STEPS.length - 1) {
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

  function handleSliderChange(value: number) {
    updateData({ age: value });
    setValidationError('');
  }

  function handleCoverageSliderChange(value: number) {
    updateData({ coverageAmount: value });
    setValidationError('');
  }

  function formatCurrency(amount: number): string {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  }

  function handleChoice(value: string) {
    const field = step.field as keyof typeof data;
    
    if (field === 'gender') {
      updateData({ gender: value as 'male' | 'female' });
    } else if (field === 'tobacco') {
      updateData({ tobacco: value === 'yes' });
    } else if (field === 'coverageAmount') {
      updateData({ coverageAmount: parseInt(value) });
    } else if (field === 'policyType') {
      updateData({ policyType: value as 'term' | 'whole' | 'final' });
    }
    
    setValidationError('');
  }

  const progressText = currentStepIndex === STEPS.length - 1 
    ? 'Final step — see your results next'
    : `Step ${currentStepIndex + 1} of ${STEPS.length}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B5E9E] via-[#2B7BC4] to-white py-12 px-4">
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
            <span className="text-sm text-blue-100">{currentStepIndex + 1} of {STEPS.length} questions</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#D4AF37] to-[#F4C430] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, idx) => (
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
              {idx < currentStepIndex ? (
                <Check className="w-4 h-4 inline mr-1" />
              ) : (
                <span>{idx + 1}</span>
              )}
            </div>
          ))}
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8 shadow-xl border-0 bg-white">
          <div className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-[#1B5E9E] mb-2">{step.title}</h2>
            <p className="text-gray-600">{step.subtitle}</p>
          </div>

          {/* Slider */}
          {step.type === 'slider' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="text-6xl font-bold text-[#D4AF37] mb-4">{data.age}</div>
              </div>
              <input
                type="range"
                min={step.min}
                max={step.max}
                value={data.age}
                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B5E9E]"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{step.min}</span>
                <span>{step.max}</span>
              </div>
            </div>
          )}

          {/* Choice Buttons */}
          {step.type === 'choice' && step.options && (
            <div className={`grid gap-4 animate-fade-in ${step.options.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {step.options.map((option) => {
                let isSelected = false;
                
                if (step.field === 'gender') {
                  isSelected = data.gender === option.value;
                } else if (step.field === 'tobacco') {
                  isSelected = (option.value === 'yes' && data.tobacco) || (option.value === 'no' && !data.tobacco);
                } else if (step.field === 'coverageAmount') {
                  isSelected = data.coverageAmount === parseInt(option.value);
                } else if (step.field === 'policyType') {
                  isSelected = data.policyType === option.value;
                }

                return (
                  <button
                    key={option.value}
                    onClick={() => handleChoice(option.value)}
                    className={`p-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isSelected
                        ? 'bg-[#1B5E9E] text-white shadow-lg scale-105 ring-2 ring-[#D4AF37]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Coverage Slider */}
          {step.type === 'coverage-slider' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#D4AF37] mb-1">
                  ${data.coverageAmount.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500 mt-2">in coverage protection</p>
              </div>
              
              {/* Slider Track */}
              <div className="relative px-1">
                <input
                  type="range"
                  min={step.min}
                  max={step.max}
                  step={step.step}
                  value={data.coverageAmount}
                  onChange={(e) => handleCoverageSliderChange(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B5E9E]"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{formatCurrency(step.min!)}</span>
                  <span>{formatCurrency(step.max!)}</span>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[50000, 100000, 250000, 500000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleCoverageSliderChange(amount)}
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
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
              <p className="text-red-700 text-sm font-medium">⚠️ {validationError}</p>
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
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 text-center text-sm text-white/80">
          <p>✓ Secure & Private • ✓ No Obligation • ✓ Takes 2 minutes</p>
        </div>
      </div>
    </div>
  );
}
