import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import { useLocation } from 'wouter';
import { useFunnel } from '@/contexts/FunnelContext';
import { calculateQuote } from '@/lib/pricingEngine';

export default function Conversion() {
  const [, setLocation] = useLocation();
  const { data, updateData, setCurrentStep } = useFunnel();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const quote = calculateQuote({
    age: data.age,
    gender: data.gender,
    tobacco: data.tobacco,
    coverageAmount: data.coverageAmount,
    policyType: data.policyType,
    healthRating: data.healthRating,
    term: 20,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleBack = () => {
    setLocation('/results');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-white py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full animate-fade-in-scale">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl text-display text-[#1B5E9E] mb-4">
            You're All Set!
          </h1>
          <p className="text-xl text-[#6B7280] mb-10">
            Your personalized quote has been sent to <span className="font-bold text-[#1B5E9E]">{data.email}</span>
          </p>

          {/* What Happens Next */}
          <Card className="p-8 bg-blue-50 border-2 border-[#4A90E2] mb-10">
            <h2 className="text-2xl text-display text-[#1B5E9E] mb-6">What Happens Next</h2>
            <div className="space-y-4 text-left">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#1B5E9E] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <p className="font-bold text-[#1B5E9E]">Check Your Email</p>
                  <p className="text-sm text-[#6B7280]">Your detailed quote and options are on their way</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#1B5E9E] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <p className="font-bold text-[#1B5E9E]">Speak with an Advisor</p>
                  <p className="text-sm text-[#6B7280]">We'll call within 24 hours to answer your questions</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#1B5E9E] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <p className="font-bold text-[#1B5E9E]">Apply & Get Approved</p>
                  <p className="text-sm text-[#6B7280]">Fast approval process with no medical exam required</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Your Quote Summary */}
          <Card className="p-8 bg-gradient-to-br from-[#1B5E9E]/5 to-[#4A90E2]/5 border-2 border-[#E5E7EB] mb-10">
            <h3 className="font-bold text-lg text-[#1B5E9E] mb-6">Your Quote Summary</h3>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <p className="text-[#6B7280] text-xs font-semibold uppercase mb-2">Monthly Premium</p>
                <p className="text-5xl text-display font-bold text-[#D4AF37]">
                  {formatCurrency(quote.monthlyPremium)}
                </p>
              </div>
              <div>
                <p className="text-[#6B7280] text-xs font-semibold uppercase mb-2">Coverage Amount</p>
                <p className="text-5xl text-display font-bold text-[#1B5E9E]">
                  {formatCurrency(data.coverageAmount)}
                </p>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <Button
            onClick={() => setLocation('/')}
            className="bg-gradient-to-r from-[#1B5E9E] to-[#2B7BC4] hover:shadow-lg text-white font-semibold py-6 px-10 rounded-lg text-lg"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl text-display text-[#1B5E9E] mb-3">
            Lock In Your Personalized Plan
          </h1>
          <p className="text-lg text-[#6B7280]">
            You're one step away from securing this coverage for your family.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-[#1A1F2E]">Step 3 of 3</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Quote Summary Card */}
        <Card className="p-8 bg-gradient-to-br from-[#1B5E9E]/10 to-[#4A90E2]/10 border-2 border-[#1B5E9E]/30 mb-10">
          <h3 className="font-bold text-lg text-[#1B5E9E] mb-6">Your Personalized Quote</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-[#6B7280] text-xs font-semibold uppercase mb-2">Monthly Cost</p>
              <p className="text-4xl text-display font-bold text-[#D4AF37]">{formatCurrency(quote.monthlyPremium)}</p>
            </div>
            <div className="text-center">
              <p className="text-[#6B7280] text-xs font-semibold uppercase mb-2">Coverage</p>
              <p className="text-4xl text-display font-bold text-[#1B5E9E]">{formatCurrency(data.coverageAmount)}</p>
            </div>
            <div className="text-center">
              <p className="text-[#6B7280] text-xs font-semibold uppercase mb-2">Policy Type</p>
              <p className="text-lg font-bold text-[#1B5E9E] capitalize">
                {data.policyType === 'term' ? 'Term' : data.policyType === 'whole' ? 'Whole' : 'Final'}
              </p>
            </div>
          </div>
        </Card>

        {/* Value Bullets */}
        <Card className="p-8 bg-blue-50 border-2 border-[#4A90E2]/30 mb-10">
          <h3 className="font-bold text-lg text-[#1B5E9E] mb-6">What You'll Receive</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-[#1A1F2E]">Your personalized quote and coverage options</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-[#1A1F2E]">Detailed breakdown of your monthly and annual costs</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-[#1A1F2E]">Comparison of different policy types</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-[#1A1F2E]">Direct access to a licensed advisor</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-[#1A1F2E]">Ability to lock in your current rate</span>
            </li>
          </ul>
        </Card>

        {/* Form */}
        <Card className="p-10 shadow-lg border-0 mb-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#1B5E9E] mb-2">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={data.name || ''}
                onChange={(e) => updateData({ name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-[#E5E7EB] focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1B5E9E] mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={data.email || ''}
                onChange={(e) => updateData({ email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-[#E5E7EB] focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1B5E9E] mb-2">Phone Number</label>
              <Input
                type="tel"
                placeholder="(555) 123-4567"
                value={data.phone || ''}
                onChange={(e) => updateData({ phone: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-[#E5E7EB] focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#1B5E9E] to-[#2B7BC4] hover:shadow-lg text-white font-bold py-7 rounded-lg text-lg disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2 inline" />
                  Send My Personalized Plan
                </>
              )}
            </Button>

            <p className="text-xs text-[#6B7280] text-center">
              ✓ Your information is secure and never shared. We respect your privacy.
            </p>
          </form>
        </Card>

        {/* Back Button */}
        <Button
          onClick={handleBack}
          variant="outline"
          className="w-full py-6 rounded-lg border-2 border-[#1B5E9E] text-[#1B5E9E] font-semibold hover:bg-[#F5F7FA]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}
