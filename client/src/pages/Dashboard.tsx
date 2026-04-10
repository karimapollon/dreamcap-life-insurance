import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield, TrendingUp, Heart, Users, Home, GraduationCap,
  DollarSign, Clock, CheckCircle, ArrowRight, ChevronDown,
  Wallet, PiggyBank, Umbrella, Lock, Phone, Calendar
} from 'lucide-react';
import { useFunnel } from '@/contexts/FunnelContext';
import { calculateQuote } from '@/lib/pricingEngine';
import { motion } from 'framer-motion';

function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }: {
  value: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = eased * value;
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}

export default function Dashboard() {
  const { data } = useFunnel();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const termLen = data.termLength || 20;

  const quote = calculateQuote({
    age: data.age,
    gender: data.gender || 'male',
    tobacco: data.tobacco,
    coverageAmount: data.coverageAmount,
    policyType: data.policyType || 'term',
    termLength: termLen,
  });

  const policyLabel = data.policyType === 'term' ? `${termLen}-Year Term` : data.policyType === 'whole' ? 'Whole Life' : 'Final Expense';

  // Family impact calculations
  const yearsOfIncome = Math.round(data.coverageAmount / 55000); // avg household income
  const mortgageMonths = Math.round(data.coverageAmount / 2000); // avg mortgage payment
  const collegeFunds = Math.round(data.coverageAmount / 35000); // avg annual college cost
  const dailyCost = quote.dailyCost;

  const faqs = [
    {
      q: 'What happens if I miss a payment?',
      a: 'Most policies include a 30-day grace period. If you miss a payment, your coverage remains active during this period. After that, your policy may lapse, but many insurers offer reinstatement options within 3-5 years.'
    },
    {
      q: 'Can I change my coverage amount later?',
      a: 'Term policies are typically fixed, but you can purchase additional coverage. Whole life policies may allow you to increase coverage through paid-up additions. Your advisor can help you adjust your plan as your needs change.'
    },
    {
      q: 'Is the death benefit really tax-free?',
      a: 'Yes. Under current IRS rules (Section 101(a)), life insurance death benefits paid to beneficiaries are generally income tax-free. This means your family receives the full coverage amount.'
    },
    {
      q: 'How long does approval take?',
      a: 'Many policies can be approved within 24-48 hours with no medical exam required. Traditional underwritten policies may take 2-4 weeks. Your advisor will recommend the fastest path based on your profile.'
    },
    {
      q: 'What if I already have employer life insurance?',
      a: 'Employer coverage typically only provides 1-2x your salary and ends when you leave the job. A personal policy ensures continuous coverage regardless of employment changes and can be customized to your family\'s actual needs.'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-[#1B5E9E] to-[#0F3A5F] text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">Your Protection Plan</p>
              <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                {data.firstName ? `${data.firstName.split(' ')[0]}'s Dashboard` : 'Your Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                <p className="text-xs text-blue-200">Monthly</p>
                <p className="text-2xl font-bold text-[#D4AF37]">
                  ${quote.monthlyPremium.toFixed(2)}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                <p className="text-xs text-blue-200">Coverage</p>
                <p className="text-2xl font-bold text-white">
                  ${(data.coverageAmount / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-8 bg-white shadow-sm rounded-xl p-1 h-auto">
            <TabsTrigger value="overview" className="py-3 text-sm font-semibold data-[state=active]:bg-[#1B5E9E] data-[state=active]:text-white rounded-lg">
              Plan Overview
            </TabsTrigger>
            <TabsTrigger value="benefits" className="py-3 text-sm font-semibold data-[state=active]:bg-[#1B5E9E] data-[state=active]:text-white rounded-lg">
              Benefits
            </TabsTrigger>
            <TabsTrigger value="family" className="py-3 text-sm font-semibold data-[state=active]:bg-[#1B5E9E] data-[state=active]:text-white rounded-lg">
              Family Impact
            </TabsTrigger>
            <TabsTrigger value="details" className="py-3 text-sm font-semibold data-[state=active]:bg-[#1B5E9E] data-[state=active]:text-white rounded-lg">
              Coverage Details
            </TabsTrigger>
          </TabsList>

          {/* ===== TAB 1: PLAN OVERVIEW ===== */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Premium Breakdown */}
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-[#1B5E9E]" />
                      </div>
                      <p className="text-sm text-gray-500">Monthly Premium</p>
                    </div>
                    <p className="text-3xl font-bold text-[#1B5E9E]">
                      <AnimatedNumber value={quote.monthlyPremium} prefix="$" decimals={2} />
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Estimated rate for your plan</p>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-500">Annual Premium</p>
                    </div>
                    <p className="text-3xl font-bold text-green-600">
                      <AnimatedNumber value={quote.annualPremium} prefix="$" decimals={2} />
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Save ~8% paying annually</p>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                        <PiggyBank className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <p className="text-sm text-gray-500">Daily Cost</p>
                    </div>
                    <p className="text-3xl font-bold text-[#D4AF37]">
                      <AnimatedNumber value={dailyCost} prefix="$" decimals={2} />
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Less than a cup of coffee</p>
                  </Card>
                </motion.div>
              </div>

              {/* Your Profile Summary */}
              <Card className="p-6 bg-white border-0 shadow-sm">
                <h3 className="text-lg font-bold text-[#1B5E9E] mb-4">Your Profile</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Age</p>
                    <p className="text-xl font-bold text-[#1B5E9E]">{data.age}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Gender</p>
                    <p className="text-xl font-bold text-[#1B5E9E]">{data.gender === 'male' ? 'Male' : 'Female'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Tobacco</p>
                    <p className="text-xl font-bold text-[#1B5E9E]">{data.tobacco ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Coverage</p>
                    <p className="text-xl font-bold text-[#1B5E9E]">${(data.coverageAmount / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Policy</p>
                    <p className="text-xl font-bold text-[#1B5E9E]">{policyLabel}</p>
                  </div>
                </div>
              </Card>

              {/* Cost Perspective */}
              <Card className="p-6 bg-gradient-to-r from-[#FFF8E1] to-[#FFF3CD] border-0 shadow-sm border-l-4 border-l-[#D4AF37]">
                <h3 className="text-lg font-bold text-[#1B5E9E] mb-3">Putting It In Perspective</h3>
                <p className="text-gray-700 mb-4">
                  For <span className="font-bold text-[#D4AF37]">${dailyCost.toFixed(2)} per day</span> — less than a cup of coffee — your family gets{' '}
                  <span className="font-bold text-[#1B5E9E]">${data.coverageAmount.toLocaleString()}</span> in tax-free protection.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-[#1B5E9E]">${dailyCost.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Your daily cost</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-400">$5.50</p>
                    <p className="text-xs text-gray-500">Avg. coffee</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-400">$15.00</p>
                    <p className="text-xs text-gray-500">Avg. lunch</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* ===== TAB 2: BENEFITS ===== */}
          <TabsContent value="benefits">
            <div className="space-y-6">
              {/* Key Benefits Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Shield,
                    title: 'Tax-Free Death Benefit',
                    desc: `Your beneficiaries receive the full $${data.coverageAmount.toLocaleString()} completely tax-free under IRS Section 101(a). No income tax, no estate tax for most families.`,
                    color: 'blue'
                  },
                  {
                    icon: Lock,
                    title: 'Guaranteed Level Premium',
                    desc: `Your rate of $${quote.monthlyPremium.toFixed(2)}/month is locked in and will never increase for the duration of your policy, regardless of health changes.`,
                    color: 'green'
                  },
                  {
                    icon: Clock,
                    title: 'Immediate Coverage',
                    desc: 'Once approved, your coverage begins immediately. Many applicants are approved within 24-48 hours with no medical exam required.',
                    color: 'amber'
                  },
                  {
                    icon: Umbrella,
                    title: 'Financial Safety Net',
                    desc: 'Covers mortgage payments, outstanding debts, childcare costs, and daily living expenses so your family maintains their standard of living.',
                    color: 'purple'
                  },
                ].map((benefit, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-md transition-shadow h-full">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        benefit.color === 'blue' ? 'bg-blue-50' :
                        benefit.color === 'green' ? 'bg-green-50' :
                        benefit.color === 'amber' ? 'bg-amber-50' : 'bg-purple-50'
                      }`}>
                        <benefit.icon className={`w-6 h-6 ${
                          benefit.color === 'blue' ? 'text-[#1B5E9E]' :
                          benefit.color === 'green' ? 'text-green-600' :
                          benefit.color === 'amber' ? 'text-[#D4AF37]' : 'text-purple-600'
                        }`} />
                      </div>
                      <h3 className="text-lg font-bold text-[#1B5E9E] mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* With vs Without Insurance */}
              <Card className="p-6 bg-white border-0 shadow-sm">
                <h3 className="text-lg font-bold text-[#1B5E9E] mb-6 text-center">Life With vs. Without Protection</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    <h4 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center text-red-700 text-xs">✕</span>
                      Without Life Insurance
                    </h4>
                    <ul className="space-y-3">
                      {[
                        'Family may struggle to pay mortgage or rent',
                        'Outstanding debts become family burden',
                        'Children\'s education plans may be derailed',
                        'Surviving spouse may need to work multiple jobs',
                        'Funeral costs ($7,000-$12,000 avg) add financial stress',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                          <span className="text-red-400 mt-0.5">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <h4 className="font-bold text-green-700 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      With Your DreamCap Plan
                    </h4>
                    <ul className="space-y-3">
                      {[
                        `$${data.coverageAmount.toLocaleString()} tax-free to your family`,
                        'Mortgage and debts fully covered',
                        'Children\'s education fund protected',
                        'Spouse can focus on family, not finances',
                        'All final expenses covered with dignity',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* ===== TAB 3: FAMILY IMPACT ===== */}
          <TabsContent value="family">
            <div className="space-y-6">
              {/* Impact Headline */}
              <Card className="p-8 bg-gradient-to-r from-[#1B5E9E] to-[#0F3A5F] border-0 shadow-lg text-white text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  What ${data.coverageAmount.toLocaleString()} Means for Your Family
                </h2>
                <p className="text-blue-200 max-w-2xl mx-auto">
                  Your coverage translates into real, tangible protection for the people who matter most.
                </p>
              </Card>

              {/* Impact Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Home,
                    label: 'Mortgage Protection',
                    value: `${mortgageMonths} months`,
                    desc: 'of mortgage payments covered',
                    color: 'bg-blue-50',
                    iconColor: 'text-[#1B5E9E]'
                  },
                  {
                    icon: TrendingUp,
                    label: 'Income Replacement',
                    value: `${yearsOfIncome} years`,
                    desc: 'of household income replaced',
                    color: 'bg-green-50',
                    iconColor: 'text-green-600'
                  },
                  {
                    icon: GraduationCap,
                    label: 'Education Fund',
                    value: `${collegeFunds} years`,
                    desc: 'of college tuition covered',
                    color: 'bg-amber-50',
                    iconColor: 'text-[#D4AF37]'
                  },
                  {
                    icon: Heart,
                    label: 'Peace of Mind',
                    value: '100%',
                    desc: 'of final expenses covered',
                    color: 'bg-purple-50',
                    iconColor: 'text-purple-600'
                  },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                    <Card className="p-6 bg-white border-0 shadow-sm text-center hover:shadow-md transition-shadow h-full">
                      <div className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                      <p className="text-3xl font-bold text-[#1B5E9E] mb-1">{item.value}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Family Scenario */}
              <Card className="p-6 bg-white border-0 shadow-sm">
                <h3 className="text-lg font-bold text-[#1B5E9E] mb-4">How Your Family Benefits</h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Immediate Needs (First 30 Days)',
                      items: ['Funeral and burial costs ($7,000-$12,000)', 'Outstanding medical bills', 'Legal and probate fees', 'Immediate living expenses'],
                      amount: Math.round(data.coverageAmount * 0.05)
                    },
                    {
                      title: 'Short-Term Stability (1-12 Months)',
                      items: ['Mortgage or rent payments', 'Car payments and insurance', 'Utility bills and groceries', 'Children\'s school and activities'],
                      amount: Math.round(data.coverageAmount * 0.25)
                    },
                    {
                      title: 'Long-Term Security (1-10+ Years)',
                      items: ['Ongoing mortgage payments', 'College education savings', 'Retirement fund for spouse', 'Emergency reserve fund'],
                      amount: Math.round(data.coverageAmount * 0.70)
                    },
                  ].map((phase, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-[#1B5E9E]">{phase.title}</h4>
                        <span className="text-sm font-bold text-[#D4AF37]">~${phase.amount.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {phase.items.map((item, j) => (
                          <p key={j} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Emotional Appeal */}
              <Card className="p-8 bg-gradient-to-r from-[#FFF8E1] to-[#FFF3CD] border-0 shadow-sm text-center">
                <Heart className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1B5E9E] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  "The best gift you can give your family is knowing they'll be okay."
                </h3>
                <p className="text-gray-600 text-sm">
                  For just ${dailyCost.toFixed(2)} a day, you're ensuring your loved ones never have to worry about finances during the hardest time of their lives.
                </p>
              </Card>
            </div>
          </TabsContent>

          {/* ===== TAB 4: COVERAGE DETAILS ===== */}
          <TabsContent value="details">
            <div className="space-y-6">
              {/* Policy Comparison Table */}
              <Card className="p-6 bg-white border-0 shadow-sm">
                <h3 className="text-lg font-bold text-[#1B5E9E] mb-6">Policy Type Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 font-bold text-[#1B5E9E]">Feature</th>
                        <th className={`text-center py-3 font-bold ${data.policyType === 'term' ? 'text-[#D4AF37]' : 'text-[#1B5E9E]'}`}>
                          Term Life {data.policyType === 'term' && '★'}
                        </th>
                        <th className={`text-center py-3 font-bold ${data.policyType === 'whole' ? 'text-[#D4AF37]' : 'text-[#1B5E9E]'}`}>
                          Whole Life {data.policyType === 'whole' && '★'}
                        </th>
                        <th className={`text-center py-3 font-bold ${data.policyType === 'final' ? 'text-[#D4AF37]' : 'text-[#1B5E9E]'}`}>
                          Final Expense {data.policyType === 'final' && '★'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Coverage Duration', '10-30 years', 'Lifetime', 'Lifetime'],
                        ['Premium Type', 'Level (fixed)', 'Level (fixed)', 'Level (fixed)'],
                        ['Cash Value', 'No', 'Yes, grows tax-deferred', 'No'],
                        ['Coverage Range', '$100K - $2M', '$25K - $500K', '$5K - $50K'],
                        ['Medical Exam', 'Sometimes', 'Sometimes', 'Usually not required'],
                        ['Best For', 'Young families, mortgages', 'Wealth building, estate', 'Seniors, burial costs'],
                        ['Avg. Monthly Cost', 'Lowest', 'Higher', 'Low-moderate'],
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-3 font-medium text-gray-700">{row[0]}</td>
                          <td className={`text-center py-3 ${data.policyType === 'term' ? 'font-bold text-[#1B5E9E] bg-blue-50/50' : 'text-gray-600'}`}>{row[1]}</td>
                          <td className={`text-center py-3 ${data.policyType === 'whole' ? 'font-bold text-[#1B5E9E] bg-blue-50/50' : 'text-gray-600'}`}>{row[2]}</td>
                          <td className={`text-center py-3 ${data.policyType === 'final' ? 'font-bold text-[#1B5E9E] bg-blue-50/50' : 'text-gray-600'}`}>{row[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-4">★ = Your selected policy type</p>
              </Card>

              {/* FAQ Section */}
              <Card className="p-6 bg-white border-0 shadow-sm">
                <h3 className="text-lg font-bold text-[#1B5E9E] mb-6">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="border border-gray-100 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-[#1B5E9E] text-sm">{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedFaq === i && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Rate Lock Notice */}
              <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-0 shadow-sm border-l-4 border-l-red-400">
                <div className="flex items-start gap-4">
                  <Clock className="w-8 h-8 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-1">Your Rate Is Time-Sensitive</h3>
                    <p className="text-sm text-gray-700">
                      Life insurance premiums increase with age. Every year you wait, your rate goes up.
                      At age {data.age}, your rate of <strong>${quote.monthlyPremium.toFixed(2)}/month</strong> is the lowest it will ever be.
                      By age {data.age + 5}, the same coverage could cost <strong>${(quote.monthlyPremium * 1.35).toFixed(2)}/month</strong> or more.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Estimate Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Premiums shown are estimates based on 2026 industry averages and may vary based on health, location, and carrier underwriting. Final rates will be determined upon application review. This is not a guarantee of coverage or pricing.
          </p>
        </div>

        {/* Sticky Bottom CTA */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#1B5E9E]">Ready to Secure Your Family's Future?</h3>
              <p className="text-gray-500 text-sm">Speak with a licensed advisor — no obligation, no pressure.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Button
                className="flex-1 md:flex-none bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1B5E9E] hover:shadow-lg font-bold py-4 px-6 rounded-xl text-base transition-all"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
              <Button
                variant="outline"
                className="flex-1 md:flex-none border-2 border-[#1B5E9E] text-[#1B5E9E] hover:bg-[#1B5E9E] hover:text-white font-bold py-4 px-6 rounded-xl text-base transition-all"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
