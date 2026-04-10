import { ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { useFunnel } from '@/contexts/FunnelContext';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const [, setLocation] = useLocation();
  const { setCurrentStep } = useFunnel();

  const handleStart = () => {
    setCurrentStep(1);
    setLocation('/estimate');
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Logo Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-center md:justify-start z-20">
        <img src="/logo.png" alt="DreamCap Financial Logo" className="h-12 md:h-16 w-auto brightness-0 invert" />
      </div>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-center">
        {/* Trust Badge */}
        <div className="mb-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-3 rounded-full border border-white/20 hover:bg-white/15 transition-all">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-semibold">Trusted by 5M+ Families</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-6xl md:text-7xl text-display text-white mb-6 leading-tight">
          See What It Would Cost to Protect Your Family Today
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-blue-100 mb-4 font-semibold">
          Takes 30 seconds. No commitment.
        </p>

        <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto leading-relaxed">
          Get an instant estimate of what life insurance could cost for your family. See your options in real-time.
        </p>

        {/* Primary CTA Button */}
        <Button
          onClick={handleStart}
          className="bg-gradient-to-r from-[#D4AF37] to-[#E8C547] hover:from-[#E8C547] hover:to-[#F0D04D] text-[#1A1F2E] font-bold py-8 px-12 rounded-lg text-lg transition-all hover:shadow-2xl hover:scale-105 active:scale-95 inline-flex items-center gap-3 mb-12 shadow-xl"
        >
          <span>Start My Estimate</span>
          <ArrowRight className="w-5 h-5" />
        </Button>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
            <p className="text-3xl text-display text-[#D4AF37] font-bold mb-2">98%</p>
            <p className="text-sm text-blue-100">Approval Rate</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
            <p className="text-3xl text-display text-[#D4AF37] font-bold mb-2">24hrs</p>
            <p className="text-sm text-blue-100">Fast Approval</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
            <p className="text-3xl text-display text-[#D4AF37] font-bold mb-2">$0</p>
            <p className="text-sm text-blue-100">Hidden Fees</p>
          </div>
        </div>

        {/* Value Bullets */}
        <div className="space-y-3 max-w-lg mx-auto">
          <div className="flex items-center gap-3 text-white justify-center">
            <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
            <span className="text-sm">No medical exam required</span>
          </div>
          <div className="flex items-center gap-3 text-white justify-center">
            <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
            <span className="text-sm">Instant quote in seconds</span>
          </div>
          <div className="flex items-center gap-3 text-white justify-center">
            <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
            <span className="text-sm">Lock in your rate today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
