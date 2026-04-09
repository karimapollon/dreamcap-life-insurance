import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Shield, Home, TrendingUp, DollarSign, Clock } from 'lucide-react';
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
    gender: data.gender,
    tobacco: data.tobacco,
    coverageAmount: data.coverageAmount,
    policyType: data.policyType,
    healthRating: data.healthRating,
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
    setCurrentStep(3);
    setLocation('/convert');
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
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl text-display text-[#1B5E9E] mb-3">
            Here's Your Estimate
          </h1>
          <p className="text-lg text-[#6B7280]">
            This is what protecting your family could look like starting today.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-[#1A1F2E]">Step 2 of 3</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: '66%' }}></div>
          </div>
        </div>

        {/* Main Premium Card - Hero Section */}
        <Card className="card-premium-dark p-12 mb-10 shadow-2xl animate-fade-in-scale">
          <p className="text-sm font-semibold text-blue-200 mb-4">Your Estimated Monthly Cost</p>
          
          {/* Large Premium Number */}
          <div className="mb-8">
            <p className="text-7xl md:text-8xl text-display font-bold text-[#D4AF37] mb-2">
              {formatCurrency(animatedPremium)}
            </p>
            <p className="text-xl text-blue-100">
              or {formatCurrency(quote.annualPremium)}/year
            </p>
          </div>

          {/* Daily Cost Highlight */}
          <div className="bg-blue-600 bg-opacity-50 rounded-lg p-6 mb-8">
            <p className="text-blue-100 text-sm mb-2">That's just</p>
            <p className="text-4xl text-display font-bold text-[#D4AF37]">
              {formatCurrency(dailyCost)}/day
            </p>
            <p className="text-blue-100 text-sm mt-2">For complete peace of mind</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-blue-400 my-8 opacity-30"></div>

          {/* Protection Highlight */}
          {showDetails && (
            <div className={`bg-blue-600 bg-opacity-50 rounded-lg p-8 transition-all duration-500 animate-slide-up`}>
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-sm text-blue-100 mb-2">Your Family Could Receive</p>
                  <p className="text-5xl text-display font-bold text-white mb-2">
                    {formatCurrency(quote.deathBenefit)}
                  </p>
                  <p className="text-sm text-blue-100">Tax-free death benefit to protect what matters most</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Benefits Grid */}
        {showDetails && (
          <div className={`grid md:grid-cols-2 gap-6 mb-10 transition-all duration-700`}>
            <Card className="p-6 border-2 border-[#1B5E9E]/20 hover:border-[#1B5E9E] hover:shadow-lg transition-all">
              <div className="flex items-start gap-3 mb-3">
                <Home className="w-6 h-6 text-[#1B5E9E] flex-shrink-0 mt-1" />
                <h3 className="font-semibold text-lg text-[#1B5E9E]">Mortgage Protection</h3>
              </div>
              <p className="text-sm text-[#6B7280]">
                Your family keeps the home covered, even if the worst happens.
              </p>
            </Card>

            <Card className="p-6 border-2 border-[#1B5E9E]/20 hover:border-[#1B5E9E] hover:shadow-lg transition-all">
              <div className="flex items-start gap-3 mb-3">
                <TrendingUp className="w-6 h-6 text-[#1B5E9E] flex-shrink-0 mt-1" />
                <h3 className="font-semibold text-lg text-[#1B5E9E]">Income Replacement</h3>
              </div>
              <p className="text-sm text-[#6B7280]">
                Replace lost income so your family maintains their lifestyle.
              </p>
            </Card>

            <Card className="p-6 border-2 border-[#1B5E9E]/20 hover:border-[#1B5E9E] hover:shadow-lg transition-all">
              <div className="flex items-start gap-3 mb-3">
                <DollarSign className="w-6 h-6 text-[#1B5E9E] flex-shrink-0 mt-1" />
                <h3 className="font-semibold text-lg text-[#1B5E9E]">Debt Protection</h3>
              </div>
              <p className="text-sm text-[#6B7280]">
                Cover credit cards, loans, and other financial obligations.
              </p>
            </Card>

            <Card className="p-6 border-2 border-[#1B5E9E]/20 hover:border-[#1B5E9E] hover:shadow-lg transition-all">
              <div className="flex items-start gap-3 mb-3">
                <Shield className="w-6 h-6 text-[#1B5E9E] flex-shrink-0 mt-1" />
                <h3 className="font-semibold text-lg text-[#1B5E9E]">Peace of Mind</h3>
              </div>
              <p className="text-sm text-[#6B7280]">
                Know your loved ones are protected, no matter what.
              </p>
            </Card>
          </div>
        )}

        {/* Policy Details */}
        {showDetails && (
          <Card className="p-8 bg-[#F5F7FA] border-2 border-[#E5E7EB] mb-10">
            <h3 className="font-semibold text-lg text-[#1B5E9E] mb-6">Your Quote Details</h3>
            <div className="grid md:grid-cols-2 gap-8 text-sm">
              <div>
                <p className="text-[#6B7280] text-xs font-semibold uppercase mb-1">Policy Type</p>
                <p className="font-bold text-lg text-[#1B5E9E] capitalize">
                  {data.policyType === 'term' ? '20-Year Term' : data.policyType === 'whole' ? 'Whole Life' : 'Final Expense'}
                </p>
              </div>
              <div>
                <p className="text-[#6B7280] text-xs font-semibold uppercase mb-1">Coverage Amount</p>
                <p className="font-bold text-lg text-[#1B5E9E]">{formatCurrency(data.coverageAmount)}</p>
              </div>
              <div>
                <p className="text-[#6B7280] text-xs font-semibold uppercase mb-1">Your Age</p>
                <p className="font-bold text-lg text-[#1B5E9E]">{data.age}</p>
              </div>
              <div>
                <p className="text-[#6B7280] text-xs font-semibold uppercase mb-1">Gender</p>
                <p className="font-bold text-lg text-[#1B5E9E] capitalize">{data.gender}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Urgency Message */}
        {showDetails && (
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#1B5E9E]/10 border-l-4 border-[#D4AF37] rounded-lg p-6 mb-10 animate-slide-up">
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#1B5E9E] mb-2">⏰ Rates Increase with Age</p>
                <p className="text-[#6B7280]">
                  This estimate reflects your current age and health. Waiting just 5 years could increase your premium by 20-30%. Lock in your rate today.
                </p>
              </div>
            </div>
          </div>
        )}

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
            <span>Get My Full Quote</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Microcopy */}
        <p className="text-center text-sm text-[#6B7280] mt-8">
          You're one step closer to protecting your family.
        </p>
      </div>
    </div>
  );
}
