import { Button } from '@/components/ui/button';
import { ArrowRight, Shield } from 'lucide-react';
import { useLocation } from 'wouter';
import { useFunnel } from '@/contexts/FunnelContext';

export default function Landing() {
  const [, setLocation] = useLocation();
  const { setCurrentStep } = useFunnel();

  const handleStart = () => {
    setCurrentStep(1);
    setLocation('/estimate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dreamcap-deep-blue via-blue-900 to-dreamcap-sky-blue flex items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-dreamcap-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-dreamcap-sky-blue/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl text-center">
        {/* Trust Badge */}
        <div className="mb-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-semibold">Trusted by 5M+ Families</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-6xl md:text-7xl font-display text-white mb-6 leading-tight">
          See What It Would Cost to Protect Your Family Today
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-blue-100 mb-4">
          Takes 30 seconds. No commitment.
        </p>

        <p className="text-lg text-blue-200 mb-12 max-w-xl mx-auto">
          Get an instant estimate of what life insurance could cost for your family. See your options in real-time.
        </p>

        {/* CTA Button */}
        <Button
          onClick={handleStart}
          className="bg-dreamcap-gold hover:bg-yellow-500 text-slate-900 font-semibold py-7 px-10 rounded-lg text-lg transition-all hover:shadow-2xl hover:scale-105 inline-flex items-center gap-2"
        >
          <span>Start My Estimate</span>
          <ArrowRight className="w-5 h-5" />
        </Button>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-white">
          <div>
            <p className="text-3xl font-display font-bold text-dreamcap-gold">98%</p>
            <p className="text-sm text-blue-200">Approval Rate</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-dreamcap-gold">24hrs</p>
            <p className="text-sm text-blue-200">Fast Approval</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-dreamcap-gold">$0</p>
            <p className="text-sm text-blue-200">Hidden Fees</p>
          </div>
        </div>
      </div>
    </div>
  );
}
