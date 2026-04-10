import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, ArrowLeft, Lock, Check } from 'lucide-react';
import { useLocation } from 'wouter';
import { useFunnel } from '@/contexts/FunnelContext';

export default function LeadCapture() {
  const [, setLocation] = useLocation();
  const { data, updateData, setCurrentStep } = useFunnel();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: 'firstName' | 'email' | 'phone', value: string) => {
    updateData({ [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!data.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(6);
      setLocation('/dashboard');
    }, 1500);
  };

  const handleBack = () => {
    setLocation('/results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B5E9E] via-[#2B7BC4] to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Unlock Your Personalized Results</h1>
          <p className="text-blue-100">Your personalized plan + exact pricing will be sent instantly</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10 bg-white/20 backdrop-blur-sm rounded-lg p-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-white">Step 3 of 3</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#F4C430] h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-white p-8 mb-8 shadow-xl border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-[#1B5E9E] mb-2">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={data.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                  errors.firstName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:border-[#1B5E9E] focus:ring-[#1B5E9E]'
                }`}
              />
              {errors.firstName && (
                <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#1B5E9E] mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:border-[#1B5E9E] focus:ring-[#1B5E9E]'
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-[#1B5E9E] mb-2">Phone Number</label>
              <Input
                type="tel"
                placeholder="(555) 123-4567"
                value={data.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                  errors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:border-[#1B5E9E] focus:ring-[#1B5E9E]'
                }`}
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* What You'll Receive */}
            <div className="bg-blue-50 border-l-4 border-[#1B5E9E] p-6 rounded-r-lg">
              <h3 className="font-bold text-[#1B5E9E] mb-4">What You'll Receive</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Your personalized quote and coverage options</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Detailed breakdown of your monthly and annual costs</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Comparison of different policy types</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Direct access to a licensed advisor</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Ability to lock in your current rate</span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1B5E9E] hover:shadow-lg font-semibold py-3 rounded-lg transition-all"
            >
              <Lock className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Unlocking...' : 'Unlock My Plan'}
            </Button>
          </form>

          {/* Security Message */}
          <p className="text-center text-sm text-gray-600 mt-6">
            ✓ Your information is secure and private. We respect your privacy.
          </p>
        </Card>

        {/* Back Button */}
        <Button
          onClick={handleBack}
          variant="outline"
          className="w-full border-2 border-white text-white hover:bg-white hover:text-[#1B5E9E] font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}
