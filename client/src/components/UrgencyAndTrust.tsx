import { Card } from '@/components/ui/card';
import { TrendingUp, Clock, Users, Award, CheckCircle } from 'lucide-react';

export default function UrgencyAndTrust() {
  return (
    <>
      {/* Urgency Section */}
      <section className="py-20 bg-gradient-to-r from-dreamcap-deep-blue to-blue-900 text-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Urgency Message */}
            <div>
              <h2 className="text-4xl md:text-5xl font-display mb-6">
                Why Waiting Can Be Expensive
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Life insurance rates are locked in based on your current age and health. Every year you wait, your premiums increase.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-dreamcap-gold">
                      <TrendingUp className="w-6 h-6 text-slate-900" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Rates Increase with Age</h3>
                    <p className="text-blue-100">A 35-year-old pays significantly less than a 45-year-old for the same coverage.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-dreamcap-gold">
                      <Clock className="w-6 h-6 text-slate-900" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Health Changes Affect Eligibility</h3>
                    <p className="text-blue-100">A health event today could affect your rates or coverage options tomorrow.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-dreamcap-gold">
                      <Users className="w-6 h-6 text-slate-900" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Your Family Needs Protection Now</h3>
                    <p className="text-blue-100">The average family is only 3 months of income away from financial crisis.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual Example */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-display mb-8 text-center">Premium Example: $250K Coverage</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-blue-100">Age 30, Non-Smoker</span>
                  <span className="text-2xl font-display text-dreamcap-gold">$18/mo</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-blue-100">Age 40, Non-Smoker</span>
                  <span className="text-2xl font-display text-dreamcap-gold">$28/mo</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-blue-100">Age 50, Non-Smoker</span>
                  <span className="text-2xl font-display text-dreamcap-gold">$58/mo</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border-2 border-dreamcap-gold">
                  <span className="text-blue-100">Age 60, Non-Smoker</span>
                  <span className="text-2xl font-display text-dreamcap-gold">$128/mo</span>
                </div>
              </div>

              <p className="text-sm text-blue-100 mt-6 text-center">
                Waiting 30 years could cost you an extra $3,300 per year in premiums.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-dreamcap-deep-blue mb-4">
              Why Families Choose DreamCap
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We make life insurance simple, affordable, and accessible for every family.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-all">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-dreamcap-sky-blue/10 rounded-lg">
                <Clock className="w-6 h-6 text-dreamcap-sky-blue" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Fast Quotes</h3>
              <p className="text-sm text-slate-600">Get personalized quotes in minutes, not days.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-dreamcap-sky-blue/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-dreamcap-sky-blue" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Affordable Options</h3>
              <p className="text-sm text-slate-600">Coverage starting at just $15/month for young, healthy applicants.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-dreamcap-sky-blue/10 rounded-lg">
                <Users className="w-6 h-6 text-dreamcap-sky-blue" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Expert Guidance</h3>
              <p className="text-sm text-slate-600">Our advisors help you choose the right coverage for your family.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-dreamcap-sky-blue/10 rounded-lg">
                <Award className="w-6 h-6 text-dreamcap-sky-blue" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Trusted Partner</h3>
              <p className="text-sm text-slate-600">A+ rated by leading insurance agencies nationwide.</p>
            </Card>
          </div>

          {/* Testimonial */}
          <div className="mt-16 bg-gradient-to-r from-dreamcap-sky-blue/10 to-dreamcap-gold/10 rounded-2xl p-12 border border-dreamcap-sky-blue/20">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-dreamcap-gold text-xl">★</span>
              ))}
            </div>
            <p className="text-lg text-slate-700 mb-4 italic">
              "DreamCap made it so easy to get life insurance. I was worried about the process, but they walked me through everything. Now I sleep better knowing my family is protected."
            </p>
            <p className="font-semibold text-dreamcap-deep-blue">Sarah M., Age 38</p>
            <p className="text-sm text-slate-600">$500K Term Life Policy</p>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <p className="font-semibold text-slate-900">No Medical Exam</p>
              <p className="text-sm text-slate-600">Quick approval for most applicants</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <p className="font-semibold text-slate-900">Transparent Pricing</p>
              <p className="text-sm text-slate-600">No hidden fees or surprises</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <p className="font-semibold text-slate-900">24/7 Support</p>
              <p className="text-sm text-slate-600">Always here when you need us</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
