import { Button } from '@/components/ui/button';
import { ArrowRight, Shield } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dreamcap-deep-blue/5 via-transparent to-dreamcap-sky-blue/5"></div>

      <div className="container relative z-10 pt-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-160px)]">
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex items-center gap-2 bg-dreamcap-sky-blue/10 text-dreamcap-sky-blue px-4 py-2 rounded-full w-fit">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold">Trusted by Families</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-dreamcap-deep-blue mb-6 leading-tight">
              Protect Your Family Before It's Too Late
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-xl">
              Life insurance provides immediate peace of mind and financial security. In just minutes, see how much coverage your family could receive and what it costs today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button className="bg-dreamcap-gold hover:bg-yellow-500 text-slate-900 font-semibold py-6 px-8 rounded-lg text-lg transition-all hover:shadow-lg hover:scale-105">
                <span>See My Options</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="border-2 border-dreamcap-deep-blue text-dreamcap-deep-blue hover:bg-dreamcap-deep-blue/5 font-semibold py-6 px-8 rounded-lg text-lg">
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
              <div>
                <p className="text-3xl font-display text-dreamcap-gold font-bold">5M+</p>
                <p className="text-sm text-slate-600">Families Protected</p>
              </div>
              <div>
                <p className="text-3xl font-display text-dreamcap-gold font-bold">24hrs</p>
                <p className="text-sm text-slate-600">Fast Approval</p>
              </div>
              <div>
                <p className="text-3xl font-display text-dreamcap-gold font-bold">$0</p>
                <p className="text-sm text-slate-600">Hidden Fees</p>
              </div>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663422524482/kJxKWRTnM5eN3s3bdiVG2o/hero-family-protection-9yVXVrQ3zF25PsHbsh6FPS.webp"
                alt="Happy multi-generational family"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>

            {/* Floating card accent */}
            <div className="absolute -bottom-8 -left-8 bg-white rounded-xl p-6 shadow-xl border border-slate-100 z-20 max-w-xs">
              <p className="text-sm text-slate-600 mb-2">Average Savings</p>
              <p className="text-3xl font-display text-dreamcap-gold font-bold">$47/month</p>
              <p className="text-xs text-slate-500 mt-2">vs. industry average</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-dreamcap-deep-blue via-dreamcap-sky-blue to-dreamcap-gold"></div>
    </section>
  );
}
