import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { useFunnel } from '@/contexts/FunnelContext';

export default function Estimate() {
  const [, setLocation] = useLocation();
  const { data, updateData, setCurrentStep } = useFunnel();
  const [activeSection, setActiveSection] = useState<'age' | 'gender' | 'tobacco' | 'coverage' | 'policy' | null>('age');

  const handleNext = () => {
    setCurrentStep(2);
    setLocation('/results');
  };

  const handleBack = () => {
    setLocation('/');
  };

  const sections = [
    { id: 'age', label: 'Age', complete: true },
    { id: 'gender', label: 'Gender', complete: true },
    { id: 'tobacco', label: 'Tobacco', complete: true },
    { id: 'coverage', label: 'Coverage', complete: true },
    { id: 'policy', label: 'Policy Type', complete: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display text-dreamcap-deep-blue mb-2">
            Let's Get Your Estimate
          </h1>
          <p className="text-lg text-slate-600">
            Just a few quick details and you'll see your personalized quote.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Step 1 of 3</span>
            <span className="text-sm text-slate-500">5 questions</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-dreamcap-deep-blue to-dreamcap-sky-blue h-2 rounded-full" style={{ width: '33%' }}></div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-8 shadow-lg border-0 mb-8">
          {/* Age */}
          <div className="mb-10 pb-10 border-b border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-semibold text-dreamcap-deep-blue">What's your age?</label>
              <span className="text-3xl font-display text-dreamcap-gold">{data.age}</span>
            </div>
            <Slider
              value={[data.age]}
              onValueChange={(value) => updateData({ age: value[0] })}
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

          {/* Gender */}
          <div className="mb-10 pb-10 border-b border-slate-200">
            <label className="text-lg font-semibold text-dreamcap-deep-blue block mb-4">What's your gender?</label>
            <ToggleGroup
              type="single"
              value={data.gender}
              onValueChange={(value) => {
                if (value) updateData({ gender: value as 'male' | 'female' });
              }}
              className="flex gap-3"
            >
              <ToggleGroupItem
                value="male"
                className="flex-1 py-4 rounded-lg border-2 border-slate-300 data-[state=on]:border-dreamcap-deep-blue data-[state=on]:bg-dreamcap-deep-blue data-[state=on]:text-white font-semibold"
              >
                Male
              </ToggleGroupItem>
              <ToggleGroupItem
                value="female"
                className="flex-1 py-4 rounded-lg border-2 border-slate-300 data-[state=on]:border-dreamcap-deep-blue data-[state=on]:bg-dreamcap-deep-blue data-[state=on]:text-white font-semibold"
              >
                Female
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Tobacco */}
          <div className="mb-10 pb-10 border-b border-slate-200">
            <label className="text-lg font-semibold text-dreamcap-deep-blue block mb-4">Do you use tobacco?</label>
            <ToggleGroup
              type="single"
              value={data.tobacco ? 'yes' : 'no'}
              onValueChange={(value) => {
                updateData({ tobacco: value === 'yes' });
              }}
              className="flex gap-3"
            >
              <ToggleGroupItem
                value="no"
                className="flex-1 py-4 rounded-lg border-2 border-slate-300 data-[state=on]:border-dreamcap-sky-blue data-[state=on]:bg-dreamcap-sky-blue data-[state=on]:text-white font-semibold"
              >
                No
              </ToggleGroupItem>
              <ToggleGroupItem
                value="yes"
                className="flex-1 py-4 rounded-lg border-2 border-slate-300 data-[state=on]:border-red-500 data-[state=on]:bg-red-500 data-[state=on]:text-white font-semibold"
              >
                Yes
              </ToggleGroupItem>
            </ToggleGroup>
            {data.tobacco && (
              <p className="text-sm text-red-600 mt-3 font-medium">⚠️ Tobacco use increases premiums by 3-4x</p>
            )}
          </div>

          {/* Coverage Amount */}
          <div className="mb-10 pb-10 border-b border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-semibold text-dreamcap-deep-blue">How much coverage?</label>
              <span className="text-3xl font-display text-dreamcap-gold">
                ${(data.coverageAmount / 1000).toFixed(0)}K
              </span>
            </div>
            <Slider
              value={[data.coverageAmount]}
              onValueChange={(value) => updateData({ coverageAmount: value[0] })}
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

          {/* Policy Type */}
          <div>
            <label className="text-lg font-semibold text-dreamcap-deep-blue block mb-4">What type of policy?</label>
            <ToggleGroup
              type="single"
              value={data.policyType}
              onValueChange={(value) => {
                if (value) updateData({ policyType: value as 'term' | 'whole' | 'final' });
              }}
              className="flex gap-3"
            >
              <ToggleGroupItem
                value="term"
                className="flex-1 py-4 rounded-lg border-2 border-slate-300 text-sm data-[state=on]:border-dreamcap-deep-blue data-[state=on]:bg-dreamcap-deep-blue data-[state=on]:text-white font-semibold"
              >
                Term Life
              </ToggleGroupItem>
              <ToggleGroupItem
                value="whole"
                className="flex-1 py-4 rounded-lg border-2 border-slate-300 text-sm data-[state=on]:border-dreamcap-deep-blue data-[state=on]:bg-dreamcap-deep-blue data-[state=on]:text-white font-semibold"
              >
                Whole Life
              </ToggleGroupItem>
              <ToggleGroupItem
                value="final"
                className="flex-1 py-4 rounded-lg border-2 border-slate-300 text-sm data-[state=on]:border-dreamcap-deep-blue data-[state=on]:bg-dreamcap-deep-blue data-[state=on]:text-white font-semibold"
              >
                Final Expense
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex-1 py-6 rounded-lg border-2 border-slate-300 text-slate-900 font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-dreamcap-deep-blue to-dreamcap-sky-blue hover:shadow-lg text-white font-semibold py-6 rounded-lg"
          >
            <span>See My Estimate</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Microcopy */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Your information is secure and private. No commitment required.
        </p>
      </div>
    </div>
  );
}
