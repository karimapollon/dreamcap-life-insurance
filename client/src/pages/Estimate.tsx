import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { useLocation } from 'wouter';
import { useFunnel } from '@/contexts/FunnelContext';

export default function Estimate() {
  const [, setLocation] = useLocation();
  const { data, updateData, setCurrentStep } = useFunnel();
  const [activeSection, setActiveSection] = useState(0);

  const handleNext = () => {
    setCurrentStep(2);
    setLocation('/results');
  };

  const handleBack = () => {
    setLocation('/');
  };

  const sections = [
    { label: 'Age', icon: '👤' },
    { label: 'Gender', icon: '👥' },
    { label: 'Tobacco', icon: '🚭' },
    { label: 'Coverage', icon: '🛡️' },
    { label: 'Policy', icon: '📋' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl text-display text-[#1B5E9E] mb-3">
            Let's Get Your Estimate
          </h1>
          <p className="text-lg text-[#6B7280]">
            Just a few quick details and you'll see your personalized quote.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-[#1A1F2E]">Step 1 of 3</span>
            <span className="text-sm font-semibold text-[#6B7280]">{activeSection + 1} of {sections.length} questions</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${((activeSection + 1) / sections.length) * 100}%` }}></div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {sections.map((section, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSection(idx)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeSection === idx
                  ? 'bg-[#1B5E9E] text-white shadow-lg'
                  : 'bg-white text-[#1B5E9E] border-2 border-[#1B5E9E] hover:bg-[#F5F7FA]'
              }`}
            >
              {section.icon} {section.label}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <Card className="p-8 shadow-lg border-0 mb-8 bg-white">
          {/* Age Section */}
          {activeSection === 0 && (
            <div className="animate-fade-in-scale">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl text-display text-[#1B5E9E] font-bold">What's your age?</h2>
                  <p className="text-sm text-[#6B7280] mt-1">This helps us calculate your rate</p>
                </div>
                <span className="text-5xl text-display text-[#D4AF37] font-bold">{data.age}</span>
              </div>
              <Slider
                value={[data.age]}
                onValueChange={(value) => updateData({ age: value[0] })}
                min={18}
                max={85}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[#6B7280] mt-2">
                <span>18</span>
                <span>85</span>
              </div>
            </div>
          )}

          {/* Gender Section */}
          {activeSection === 1 && (
            <div className="animate-fade-in-scale">
              <h2 className="text-2xl text-display text-[#1B5E9E] font-bold mb-2">What's your gender?</h2>
              <p className="text-sm text-[#6B7280] mb-6">This affects your premium rate</p>
              <div className="grid grid-cols-2 gap-4">
                {(['male', 'female'] as const).map((gender) => (
                  <button
                    key={gender}
                    onClick={() => updateData({ gender })}
                    className={`p-6 rounded-lg font-semibold text-lg transition-all border-2 ${
                      data.gender === gender
                        ? 'bg-[#1B5E9E] text-white border-[#1B5E9E] shadow-lg'
                        : 'bg-white text-[#1B5E9E] border-[#E5E7EB] hover:border-[#1B5E9E]'
                    }`}
                  >
                    {gender === 'male' ? '👨 Male' : '👩 Female'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tobacco Section */}
          {activeSection === 2 && (
            <div className="animate-fade-in-scale">
              <h2 className="text-2xl text-display text-[#1B5E9E] font-bold mb-2">Do you use tobacco?</h2>
              <p className="text-sm text-[#6B7280] mb-6">This impacts your rate significantly</p>
              <div className="grid grid-cols-2 gap-4">
                {['no', 'yes'].map((tobacco) => (
                  <button
                    key={tobacco}
                    onClick={() => updateData({ tobacco: tobacco === 'yes' })}
                    className={`p-6 rounded-lg font-semibold text-lg transition-all border-2 ${
                      data.tobacco === (tobacco === 'yes')
                        ? 'bg-[#1B5E9E] text-white border-[#1B5E9E] shadow-lg'
                        : 'bg-white text-[#1B5E9E] border-[#E5E7EB] hover:border-[#1B5E9E]'
                    }`}
                  >
                    {tobacco === 'no' ? '✓ No' : '✗ Yes'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Coverage Section */}
          {activeSection === 3 && (
            <div className="animate-fade-in-scale">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl text-display text-[#1B5E9E] font-bold">How much coverage?</h2>
                  <p className="text-sm text-[#6B7280] mt-1">Choose your death benefit amount</p>
                </div>
                <span className="text-4xl text-display text-[#D4AF37] font-bold">{formatCurrency(data.coverageAmount)}</span>
              </div>
              <Slider
                value={[data.coverageAmount]}
                onValueChange={(value) => updateData({ coverageAmount: value[0] })}
                min={25000}
                max={1000000}
                step={25000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[#6B7280] mt-2">
                <span>$25K</span>
                <span>$1M</span>
              </div>
            </div>
          )}

          {/* Policy Type Section */}
          {activeSection === 4 && (
            <div className="animate-fade-in-scale">
              <h2 className="text-2xl text-display text-[#1B5E9E] font-bold mb-2">What type of policy?</h2>
              <p className="text-sm text-[#6B7280] mb-6">Choose the coverage that fits your needs</p>
              <div className="space-y-3">
                {[
                  { value: 'term' as const, label: 'Term Life', desc: 'Coverage for 20 years' },
                  { value: 'whole' as const, label: 'Whole Life', desc: 'Lifetime coverage' },
                  { value: 'final' as const, label: 'Final Expense', desc: 'Funeral & burial costs' },
                ].map((policy) => (
                  <button
                    key={policy.value}
                    onClick={() => updateData({ policyType: policy.value })}
                    className={`w-full p-4 rounded-lg text-left font-semibold transition-all border-2 ${
                      data.policyType === policy.value
                        ? 'bg-[#1B5E9E] text-white border-[#1B5E9E] shadow-lg'
                        : 'bg-white text-[#1B5E9E] border-[#E5E7EB] hover:border-[#1B5E9E]'
                    }`}
                  >
                    <div className="font-bold">{policy.label}</div>
                    <div className={`text-sm ${data.policyType === policy.value ? 'text-blue-100' : 'text-[#6B7280]'}`}>
                      {policy.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex-1 py-6 rounded-lg border-2 border-[#1B5E9E] text-[#1B5E9E] font-semibold hover:bg-[#F5F7FA]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-[#1B5E9E] to-[#2B7BC4] hover:shadow-lg text-white font-semibold py-6 rounded-lg"
          >
            <span>See My Estimate</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Microcopy */}
        <p className="text-center text-sm text-[#6B7280] mt-6">
          ✓ Your information is secure and private. No commitment required.
        </p>
      </div>
    </div>
  );
}
