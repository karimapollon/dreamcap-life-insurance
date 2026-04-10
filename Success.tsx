import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Mail, Phone, Clock } from 'lucide-react';
import { useLocation } from 'wouter';
import { useFunnel } from '@/contexts/FunnelContext';
import { motion } from 'framer-motion';

export default function Success() {
  const [, setLocation] = useLocation();
  const { data } = useFunnel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B5E9E] via-[#2B7BC4] to-[#4A90E2] flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* Logo Header */}
        <div className="flex justify-center mb-12">
          <img src="/logo.png" alt="DreamCap Financial Logo" className="h-12 md:h-16 w-auto brightness-0 invert" />
        </div>
        {/* Animated Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-green-400/20 backdrop-blur-sm rounded-full mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.5 }}
          >
            <CheckCircle className="w-14 h-14 text-green-300" />
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          You're All Set, {data.firstName ? data.firstName.split(' ')[0] : 'Friend'}!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-blue-100 text-lg mb-10"
        >
          Your personalized protection plan is ready to explore.
        </motion.p>

        {/* Quick Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="grid grid-cols-3 gap-3 mb-10"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Mail className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
            <p className="text-xs text-blue-100">Quote sent to</p>
            <p className="text-sm font-semibold text-white truncate">{data.email || 'your email'}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Phone className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
            <p className="text-xs text-blue-100">Advisor call</p>
            <p className="text-sm font-semibold text-white">Within 24hrs</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Clock className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
            <p className="text-xs text-blue-100">Rate locked for</p>
            <p className="text-sm font-semibold text-white">30 days</p>
          </div>
        </motion.div>

        {/* CTA to Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            onClick={() => setLocation('/dashboard')}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1B5E9E] hover:shadow-2xl hover:scale-[1.02] font-bold py-5 rounded-xl text-lg transition-all duration-300"
          >
            View My Protection Plan
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-blue-200 text-sm mt-4">
            Explore your personalized dashboard with plan details, benefits, and family impact analysis.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
