import HeroSection from '@/components/HeroSection';
import PremiumCalculator from '@/components/PremiumCalculator';
import BenefitsSection from '@/components/BenefitsSection';
import UrgencyAndTrust from '@/components/UrgencyAndTrust';
import LeadForm from '@/components/LeadForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <PremiumCalculator />
      <BenefitsSection />
      <UrgencyAndTrust />
      <LeadForm />
    </div>
  );
}
