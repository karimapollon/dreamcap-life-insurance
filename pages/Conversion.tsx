import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Shield, TrendingUp, Lock } from 'lucide-react';
import { useLocation } from 'wouter';
import { useFunnel } from '@/contexts/FunnelContext';
import { calculateQuote } from '@/lib/pricingEngine';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data } = useFunnel();

  const quote = calculateQuote({
    age: data.age,
    gender: data.gender || 'male',
    tobacco: data.tobacco,
    coverageAmount: data.coverageAmount,
    policyType: data.policyType || 'term',
    termLength: data.termLength || 20,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B5E9E] via-[#2B7BC4] to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-fade-in-scale">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">You're All Set!</h1>
          <p className="text-blue-100 text-lg">Your personalized quote has been sent to <span className="font-bold">{data.email}</span></p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Profile Summary */}
          <Card className="bg-white p-8 shadow-lg border-0">
            <h3 className="text-xl font-bold text-[#1B5E9E] mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Your Profile
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Age</p>
                <p className="text-2xl font-bold text-[#1B5E9E]">{data.age}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Gender</p>
                <p className="text-2xl font-bold text-[#1B5E9E]">{data.gender === 'male' ? 'Male' : 'Female'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Tobacco Use</p>
                <p className="text-2xl font-bold text-[#1B5E9E]">{data.tobacco ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </Card>

          {/* Pricing Summary */}
          <Card className="bg-gradient-to-br from-[#1B5E9E] to-[#0F3A5F] p-8 shadow-lg border-0 text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Estimated Pricing
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-blue-200 text-sm">Monthly Premium</p>
                <p className="text-4xl font-bold text-[#D4AF37]">{formatCurrency(quote.monthlyPremium)}</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Annual Premium</p>
                <p className="text-2xl font-bold text-blue-100">{formatCurrency(quote.annualPremium)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Coverage Details */}
        <Card className="bg-white p-8 shadow-lg border-0 mb-8">
          <h3 className="text-xl font-bold text-[#1B5E9E] mb-6">Your Coverage</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 text-sm mb-2">Coverage Amount</p>
              <p className="text-4xl font-bold text-[#1B5E9E]">{formatCurrency(data.coverageAmount)}</p>
              <p className="text-gray-600 text-sm mt-2">Tax-free death benefit</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Policy Type</p>
              <p className="text-4xl font-bold text-[#1B5E9E]">{data.policyType === 'term' ? '20-Year Term' : data.policyType === 'whole' ? 'Whole Life' : 'Final Expense'}</p>
              <p className="text-gray-600 text-sm mt-2">Selected protection plan</p>
            </div>
          </div>
        </Card>

        {/* Why This Plan Benefits You */}
        <Card className="bg-blue-50 border-l-4 border-[#1B5E9E] p-8 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-[#1B5E9E] mb-6">Why This Plan Benefits You</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700"><strong>Protects your family financially</strong> — Ensures your loved ones are covered if something happens to you</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700"><strong>Locks in low rates today</strong> — Your premium is based on your current age and health</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700"><strong>Builds long-term security</strong> — Peace of mind knowing your family is protected</span>
            </li>
          </ul>
        </Card>

        {/* Comparison Section */}
        <Card className="bg-white p-8 shadow-lg border-0 mb-8">
          <h3 className="text-xl font-bold text-[#1B5E9E] mb-6">Policy Type Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 font-bold text-[#1B5E9E]">Feature</th>
                  <th className="text-center py-3 font-bold text-[#1B5E9E]">Term</th>
                  <th className="text-center py-3 font-bold text-[#1B5E9E]">Whole Life</th>
                  <th className="text-center py-3 font-bold text-[#1B5E9E]">Final Expense</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3">Coverage Duration</td>
                  <td className="text-center">20-30 years</td>
                  <td className="text-center">Lifetime</td>
                  <td className="text-center">Lifetime</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3">Monthly Cost</td>
                  <td className="text-center text-[#D4AF37] font-bold">Lowest</td>
                  <td className="text-center text-[#D4AF37] font-bold">Higher</td>
                  <td className="text-center text-[#D4AF37] font-bold">Low</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3">Cash Value</td>
                  <td className="text-center">None</td>
                  <td className="text-center">✓ Yes</td>
                  <td className="text-center">None</td>
                </tr>
                <tr>
                  <td className="py-3">Best For</td>
                  <td className="text-center">Young families</td>
                  <td className="text-center">Long-term wealth</td>
                  <td className="text-center">Final expenses</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* What Happens Next */}
        <Card className="bg-[#FFF3CD] border-2 border-[#D4AF37] p-8 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-[#1B5E9E] mb-6">What Happens Next</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#1B5E9E] text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <p className="font-bold text-[#1B5E9E]">Check Your Email</p>
                <p className="text-gray-700 text-sm">Your detailed quote and options are on their way</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#1B5E9E] text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <p className="font-bold text-[#1B5E9E]">Speak with an Advisor</p>
                <p className="text-gray-700 text-sm">We'll call within 24 hours to answer your questions</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#1B5E9E] text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <p className="font-bold text-[#1B5E9E]">Apply & Get Approved</p>
                <p className="text-gray-700 text-sm">Fast approval process with no medical exam required</p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA Button */}
        <Button
          onClick={() => window.location.href = 'https://www.dreamcap.financial/book-session'}
          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1B5E9E] hover:shadow-lg font-bold py-4 rounded-lg text-lg transition-all"
        >
          <Lock className="w-5 h-5 mr-2" />
          Schedule Your 10-Minute Review
        </Button>

        {/* Urgency Message */}
        <p className="text-center text-white mt-6 font-semibold">⏰ Lock in your rate before it changes</p>
      </div>
    </div>
  );
}
