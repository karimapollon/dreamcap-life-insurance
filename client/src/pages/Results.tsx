import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { useFunnel } from '@/contexts/FunnelContext';
import { calculateQuote } from '@/lib/pricingEngine';

export default function Results() {
  const [, setLocation] = useLocation();
  const { data, setCurrentStep } = useFunnel();
  const [animatedPremium, setAnimatedPremium] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const quote = calculateQuote({
    age: data.age,
    gender: data.gender || 'male',
    tobacco: data.tobacco,
    coverageAmount: data.coverageAmount,
    policyType: data.policyType || 'term',
    term: 20,
  });

  // Animate premium number
  useEffect(() => {
    let start = 0;
    const end = quote.monthlyPremium;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedPremium(end);
        clearInterval(timer);
      } else {
        setAnimatedPremium(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [quote.monthlyPremium]);

  // Trigger details reveal after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowDetails(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    setCurrentStep(5);
    setLocation('/lead-capture');
  };

  const handleBack = () => {
    setLocation('/estimate');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const dailyCost = quote.monthlyPremium / 30;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B5E9E] via-[#2B7BC4] to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Here's Your Estimate</h1>
          <p className="text-blue-100">This is what protecting your family could look like starting today.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10 bg-white/20 backdrop-blur-sm rounded-lg p-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-white">Step 2 of 3</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#F4C430] h-2 rounded-full" style={{ width: '66%' }}></div>
          </div>
        </div>

        {/* Main Premium Card - Hero Section */}
        <Card className="bg-gradient-to-br from-[#1B5E9E] to-[#0F3A5F] p-12 mb-8 shadow-2xl border-0 text-white animate-fade-in-scale">
          <p className="text-sm font-semibold text-blue-200 mb-4">Your Estimated Monthly Cost</p>
          
          {/* Large Premium Number */}
          <div className="mb-8">
            <p className="text-7xl font-bold text-[#D4AF37] mb-2">${animatedPremium.toFixed(2)}</p>
            <p className="text-blue-100">or ${(quote.monthlyPremium * 12).toFixed(0)}/year</p>
          </div>

          {/* Daily Cost Highlight */}
          {showDetails && (
            <div className="bg-blue-500/30 backdrop-blur-sm rounded-lg p-6 animate-fade-in">
              <p className="text-blue-200 text-sm mb-2">That's just</p>
              <p className="text-4xl font-bold text-[#D4AF37]">${dailyCost.toFixed(2)}/day</p>
              <p className="text-blue-100 mt-2">For complete peace of mind</p>
            </div>
          )}
        </Card>

        {/* Coverage Details */}
        {showDetails && (
          <Card className="bg-white p-8 mb-8 shadow-lg border-0 animate-fade-in">
            <h3 className="text-xl font-bold text-[#1B5E9E] mb-6">Your Family Could Receive</h3>
            <p className="text-4xl font-bold text-[#1B5E9E] mb-2">{formatCurrency(data.coverageAmount)}</p>
            <p className="text-gray-600">Tax-free death benefit to protect what matters most</p>
          </Card>
        )}

        {/* Urgency Message */}
        {showDetails && (
          <Card className="bg-[#FFF3CD] border-2 border-[#D4AF37] p-6 mb-8 animate-fade-in">
            <p className="text-[#1B5E9E] font-semibold mb-2">⏰ Rates Increase with Age</p>
            <p className="text-gray-700 text-sm">This estimate reflects your current age and health. Waiting just 5 years could increase your premium by 20-30%. Lock in your rate today.</p>
          </Card>
        )}

        {/* Quote Details Summary */}
        {showDetails && (
          <Card className="bg-gray-50 p-6 mb-8 border-0 animate-fade-in">
            <h4 className="font-bold text-[#1B5E9E] mb-4">Your Quote Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Policy Type</p>
                <p className="font-semibold text-[#1B5E9E]">{data.policyType === 'term' ? '20-Year Term' : data.policyType === 'whole' ? 'Whole Life' : 'Final Expense'}</p>
              </div>
              <div>
                <p className="text-gray-600">Coverage Amount</p>
                <p className="font-semibold text-[#1B5E9E]">{formatCurrency(data.coverageAmount)}</p>
              </div>
              <div>
                <p className="text-gray-600">Your Age</p>
                <p className="font-semibold text-[#1B5E9E]">{data.age}</p>
              </div>
              <div>
                <p className="text-gray-600">Gender</p>
                <p className="font-semibold text-[#1B5E9E]">{data.gender === 'male' ? 'Male' : 'Female'}</p>
              </div>
            </div>
          </Card>
        )}

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
            className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1B5E9E] hover:shadow-lg font-semibold"
          >
            Unlock My Results
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Trust Message */}
        <p className="text-center text-sm text-white/80 mt-8">
          You're one step closer to protecting your family.
        </p>
      </div>
    </div>
  );
}
