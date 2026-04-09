import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle, Download } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-display text-dreamcap-deep-blue mb-4">
            You're All Set!
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Your personalized quote has been sent to <span className="font-semibold">{data.email}</span>
          </p>

          {/* What Happens Next */}
          <Card className="p-8 bg-blue-50 border-2 border-dreamcap-sky-blue mb-8">
            <h2 className="text-lg font-semibold text-dreamcap-deep-blue mb-4">What Happens Next</h2>
            <div className="space-y-4 text-left">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-dreamcap-sky-blue text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Check Your Email</p>
                  <p className="text-sm text-slate-600">Your detailed quote and options are on their way</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-dreamcap-sky-blue text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Speak with an Advisor</p>
                  <p className="text-sm text-slate-600">We'll call within 24 hours to answer your questions</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-dreamcap-sky-blue text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Apply & Get Approved</p>
                  <p className="text-sm text-slate-600">Fast approval process with no medical exam required</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Your Quote Summary */}
          <Card className="p-6 bg-gradient-to-br from-dreamcap-deep-blue/5 to-dreamcap-sky-blue/5 border-2 border-slate-200 mb-8">
            <h3 className="font-semibold text-dreamcap-deep-blue mb-4">Your Quote Summary</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <p className="text-sm text-slate-600">Monthly Premium</p>
                <p className="text-3xl font-display font-bold text-dreamcap-gold">
                  {formatCurrency(quote.monthlyPremium)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Coverage Amount</p>
                <p className="text-3xl font-display font-bold text-dreamcap-deep-blue">
                  {formatCurrency(data.coverageAmount)}
                </p>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <Button
            onClick={() => setLocation('/')}
            className="bg-gradient-to-r from-dreamcap-deep-blue to-dreamcap-sky-blue hover:shadow-lg text-white font-semibold py-6 px-8 rounded-lg"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display text-dreamcap-deep-blue mb-2">
            Get Your Full Personalized Quote
          </h1>
          <p className="text-lg text-slate-600">
            Just a couple more details and we'll send you everything you need.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Step 3 of 3</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-dreamcap-deep-blue to-dreamcap-sky-blue h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Value Reinforcement */}
        <Card className="p-6 bg-gradient-to-r from-dreamcap-gold/10 to-dreamcap-sky-blue/10 border-2 border-dreamcap-sky-blue/30 mb-8">
          <h3 className="font-semibold text-dreamcap-deep-blue mb-3">What You'll Receive</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Your personalized quote and coverage options</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Detailed breakdown of your monthly and annual costs</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Comparison of different policy types</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Direct access to a licensed advisor</span>
            </li>
          </ul>
        </Card>

        {/* Form */}
        <Card className="p-8 shadow-lg border-0 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={data.name || ''}
                onChange={(e) => updateData({ name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-dreamcap-sky-blue focus:ring-2 focus:ring-dreamcap-sky-blue/20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={data.email || ''}
                onChange={(e) => updateData({ email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-dreamcap-sky-blue focus:ring-2 focus:ring-dreamcap-sky-blue/20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
              <Input
                type="tel"
                placeholder="(555) 123-4567"
                value={data.phone || ''}
                onChange={(e) => updateData({ phone: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-dreamcap-sky-blue focus:ring-2 focus:ring-dreamcap-sky-blue/20"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-dreamcap-deep-blue to-dreamcap-sky-blue hover:shadow-lg text-white font-semibold py-6 rounded-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Processing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Send My Quote
                </>
              )}
            </Button>

            <p className="text-xs text-slate-500 text-center">
              We respect your privacy. Your information is secure and will never be shared.
            </p>
          </form>
        </Card>

        {/* Back Button */}
        <Button
          onClick={handleBack}
          variant="outline"
          className="w-full py-6 rounded-lg border-2 border-slate-300 text-slate-900 font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}
