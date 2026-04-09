import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Shield, Home, TrendingUp, DollarSign } from 'lucide-react';
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
    const duration = 1500;
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
    const timer = setTimeout(() => setShowDetails(true), 1500);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-display text-dreamcap-deep-blue mb-2">
            Here's Your Estimate
          </h1>
          <p className="text-lg text-slate-600">
            This is what protecting your family could look like today.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Step 2 of 3</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-dreamcap-deep-blue to-dreamcap-sky-blue h-2 rounded-full" style={{ width: '66%' }}></div>
          </div>
        </div>

        {/* Main Premium Card */}
        <Card className="bg-gradient-to-br from-dreamcap-deep-blue to-blue-800 text-white p-12 shadow-2xl border-0 mb-8">
          <p className="text-sm font-semibold text-blue-100 mb-2">Your Estimated Monthly Premium</p>
          <p className="text-6xl font-display font-bold mb-4">
            {formatCurrency(animatedPremium)}
          </p>
          <p className="text-lg text-blue-100">
            or {formatCurrency(quote.annualPremium)}/year
          </p>

          {/* Divider */}
          <div className="h-px bg-blue-400 my-8 opacity-30"></div>

          {/* Protection Highlight */}
          <div className={`bg-blue-600 bg-opacity-50 rounded-lg p-6 transition-all duration-500 ${showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-blue-200 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-sm mb-2">Your Family Could Receive</p>
                <p className="text-4xl font-display font-bold text-blue-100 mb-1">
                  {formatCurrency(quote.deathBenefit)}
                </p>
                <p className="text-sm text-blue-200">Tax-free death benefit</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Benefits Grid */}
        {showDetails && (
          <div className={`grid md:grid-cols-2 gap-6 mb-8 transition-all duration-700`}>
            <Card className="p-6 border-2 border-dreamcap-sky-blue/30 hover:border-dreamcap-sky-blue transition-all">
              <div className="flex items-start gap-3 mb-3">
                <Home className="w-5 h-5 text-dreamcap-sky-blue flex-shrink-0 mt-1" />
                <h3 className="font-semibold text-dreamcap-deep-blue">Mortgage Protection</h3>
              </div>
              <p className="text-sm text-slate-600">
                Your family keeps the home covered, even if the worst happens.
              </p>
            </Card>

            <Card className="p-6 border-2 border-dreamcap-sky-blue/30 hover:border-dreamcap-sky-blue transition-all">
              <div className="flex items-start gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-dreamcap-sky-blue flex-shrink-0 mt-1" />
                <h3 className="font-semibold text-dreamcap-deep-blue">Income Replacement</h3>
              </div>
              <p className="text-sm text-slate-600">
                Replace lost income so your family maintains their lifestyle.
              </p>
            </Card>

            <Card className="p-6 border-2 border-dreamcap-sky-blue/30 hover:border-dreamcap-sky-blue transition-all">
              <div className="flex items-start gap-3 mb-3">
                <DollarSign className="w-5 h-5 text-dreamcap-sky-blue flex-shrink-0 mt-1" />
                <h3 className="font-semibold text-dreamcap-deep-blue">Debt Protection</h3>
              </div>
              <p className="text-sm text-slate-600">
                Cover credit cards, loans, and other financial obligations.
              </p>
            </Card>

            <Card className="p-6 border-2 border-dreamcap-sky-blue/30 hover:border-dreamcap-sky-blue transition-all">
              <div className="flex items-start gap-3 mb-3">
                <Shield className="w-5 h-5 text-dreamcap-sky-blue flex-shrink-0 mt-1" />
                <h3 className="font-semibold text-dreamcap-deep-blue">Peace of Mind</h3>
              </div>
              <p className="text-sm text-slate-600">
                Know your loved ones are protected, no matter what.
              </p>
            </Card>
          </div>
        )}

        {/* Policy Details */}
        {showDetails && (
          <Card className="p-6 bg-slate-50 border-2 border-slate-200 mb-8">
            <h3 className="font-semibold text-dreamcap-deep-blue mb-4">Your Quote Details</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-slate-600">Policy Type</p>
                <p className="font-semibold text-dreamcap-deep-blue capitalize">
                  {data.policyType === 'term' ? '20-Year Term' : data.policyType === 'whole' ? 'Whole Life' : 'Final Expense'}
                </p>
              </div>
              <div>
                <p className="text-slate-600">Coverage Amount</p>
                <p className="font-semibold text-dreamcap-deep-blue">{formatCurrency(data.coverageAmount)}</p>
              </div>
              <div>
                <p className="text-slate-600">Your Age</p>
                <p className="font-semibold text-dreamcap-deep-blue">{data.age}</p>
              </div>
              <div>
                <p className="text-slate-600">Gender</p>
                <p className="font-semibold text-dreamcap-deep-blue capitalize">{data.gender}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Urgency Message */}
        {showDetails && (
          <div className="bg-gradient-to-r from-dreamcap-gold/10 to-dreamcap-sky-blue/10 border-l-4 border-dreamcap-gold rounded-lg p-6 mb-8">
            <p className="text-sm font-semibold text-dreamcap-deep-blue mb-2">⏰ Rates Increase with Age</p>
            <p className="text-slate-700">
              This estimate reflects your current age and health. Waiting just 5 years could increase your premium by 20-30%.
            </p>
          </div>
        )}

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
            <span>Get My Full Quote</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Microcopy */}
        <p className="text-center text-sm text-slate-500 mt-6">
          You're one step closer to protecting your family.
        </p>
      </div>
    </div>
  );
}
