import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function LeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    coverage: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to a backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Benefits List */}
          <div>
            <h2 className="text-4xl md:text-5xl font-display text-dreamcap-deep-blue mb-8">
              Get Your Free Personalized Quote
            </h2>

            <p className="text-lg text-slate-600 mb-8">
              Join thousands of families who have already taken the first step to protect their loved ones.
            </p>

            <div className="space-y-4">
              {[
                'Personalized quote based on your health and age',
                'No obligation to purchase',
                'Compare multiple policy options',
                'Speak with a licensed advisor',
                'Fast approval process',
              ].map((benefit, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-display text-dreamcap-gold font-bold">98%</p>
                  <p className="text-sm text-slate-600">Approval Rate</p>
                </div>
                <div>
                  <p className="text-3xl font-display text-dreamcap-gold font-bold">24hrs</p>
                  <p className="text-sm text-slate-600">Avg. Decision Time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <Card className="p-10 shadow-xl border-0 bg-white">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-dreamcap-sky-blue focus:ring-2 focus:ring-dreamcap-sky-blue/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-dreamcap-sky-blue focus:ring-2 focus:ring-dreamcap-sky-blue/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-dreamcap-sky-blue focus:ring-2 focus:ring-dreamcap-sky-blue/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
                  <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                    <SelectTrigger className="w-full px-4 py-3 rounded-lg border border-slate-300">
                      <SelectValue placeholder="Select your age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-25">18-25</SelectItem>
                      <SelectItem value="26-35">26-35</SelectItem>
                      <SelectItem value="36-45">36-45</SelectItem>
                      <SelectItem value="46-55">46-55</SelectItem>
                      <SelectItem value="56-65">56-65</SelectItem>
                      <SelectItem value="65+">65+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Coverage Interest</label>
                  <Select value={formData.coverage} onValueChange={(value) => setFormData({ ...formData, coverage: value })}>
                    <SelectTrigger className="w-full px-4 py-3 rounded-lg border border-slate-300">
                      <SelectValue placeholder="Select coverage amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100k">$100,000</SelectItem>
                      <SelectItem value="250k">$250,000</SelectItem>
                      <SelectItem value="500k">$500,000</SelectItem>
                      <SelectItem value="1m">$1,000,000</SelectItem>
                      <SelectItem value="not-sure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full bg-dreamcap-gold hover:bg-yellow-500 text-slate-900 font-semibold py-4 rounded-lg text-lg transition-all hover:shadow-lg">
                    Get My Free Quote
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>

                <p className="text-xs text-slate-500 text-center">
                  We respect your privacy. Your information is secure and will never be shared.
                </p>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-display text-dreamcap-deep-blue mb-2">Thank You!</h3>
                <p className="text-slate-600 mb-4">
                  We've received your information. An advisor will contact you within 24 hours with your personalized quote.
                </p>
                <p className="text-sm text-slate-500">
                  Check your email for a confirmation and next steps.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
