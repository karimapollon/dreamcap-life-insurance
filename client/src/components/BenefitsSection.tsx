import { Card } from '@/components/ui/card';
import { Home, GraduationCap, Heart, DollarSign, TrendingUp, Shield } from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: 'Immediate Tax-Free Benefit',
    description: 'Your family receives the full death benefit tax-free, providing immediate financial relief.',
  },
  {
    icon: Home,
    title: 'Mortgage & Rent Protection',
    description: 'Ensure your family can keep their home by covering mortgage or rent payments.',
  },
  {
    icon: TrendingUp,
    title: 'Income Replacement',
    description: 'Replace lost income so your family maintains their standard of living.',
  },
  {
    icon: GraduationCap,
    title: 'Education Support',
    description: 'Fund your children\'s college education and future opportunities.',
  },
  {
    icon: Heart,
    title: 'Debt Protection',
    description: 'Cover credit card debt, car loans, and other financial obligations.',
  },
  {
    icon: Shield,
    title: 'Peace of Mind',
    description: 'Know your loved ones are protected, no matter what happens.',
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-dreamcap-sky-blue/5 to-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-display text-dreamcap-deep-blue mb-4">
            What Your Family Receives
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Life insurance provides comprehensive financial protection for your loved ones when they need it most.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={index}
                className="p-8 hover:shadow-lg transition-all duration-300 hover:border-dreamcap-sky-blue group cursor-pointer"
              >
                <div className="mb-4 inline-flex items-center justify-center w-14 h-14 bg-dreamcap-sky-blue/10 rounded-lg group-hover:bg-dreamcap-sky-blue group-hover:text-white transition-all">
                  <Icon className="w-6 h-6 text-dreamcap-sky-blue group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-dreamcap-deep-blue mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Benefit Visualization */}
        <div className="bg-gradient-to-r from-dreamcap-deep-blue/10 to-dreamcap-sky-blue/10 rounded-2xl p-12 border border-dreamcap-sky-blue/20">
          <h3 className="text-2xl text-display text-dreamcap-deep-blue mb-8 text-center">
            How Your Family Benefits
          </h3>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Without Protection */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-bold">✕</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-700">Without Life Insurance</h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="text-red-500 font-bold mt-1">•</span>
                  <span>Family faces immediate financial hardship</span>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="text-red-500 font-bold mt-1">•</span>
                  <span>May lose home due to unpaid mortgage</span>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="text-red-500 font-bold mt-1">•</span>
                  <span>Children's education plans disrupted</span>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="text-red-500 font-bold mt-1">•</span>
                  <span>Debt burden falls on surviving family</span>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="text-red-500 font-bold mt-1">•</span>
                  <span>Lifestyle significantly disrupted</span>
                </div>
              </div>
            </div>

            {/* With Protection */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-700">With Life Insurance</h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="text-green-500 font-bold mt-1">•</span>
                  <span>Immediate financial support for family</span>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="text-green-500 font-bold mt-1">•</span>
                  <span>Home is protected and secure</span>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="text-green-500 font-bold mt-1">•</span>
                  <span>Children can continue their education</span>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="text-green-500 font-bold mt-1">•</span>
                  <span>Debts are paid off</span>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="text-green-500 font-bold mt-1">•</span>
                  <span>Family maintains their standard of living</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
