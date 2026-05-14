import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Star, Building } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    monthlyPrice: 49000,
    description: 'Perfect for independent agents and small agencies getting started with AI.',
    features: [
      '1 active property listing',
      '100 conversations per month',
      'Email follow-up automation',
      'Basic lead capture & storage',
      'Web widget integration',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    icon: Star,
    monthlyPrice: 149000,
    description: 'For growing agencies serious about scaling their lead conversion.',
    features: [
      'Unlimited property listings',
      '1,000 conversations per month',
      'WhatsApp + Email + SMS follow-ups',
      'Calendar sync & inspection booking',
      'Advanced analytics dashboard',
      'Lead scoring & prioritization',
      'CRM integrations',
      'Priority support',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Building,
    monthlyPrice: null,
    description: 'For large agencies and developers needing custom solutions at scale.',
    features: [
      'Everything in Pro',
      'White-label branding',
      'Full API access',
      'Unlimited conversations',
      'Dedicated account manager',
      'Custom AI training on your inventory',
      'SLA guarantee',
      'Onboarding & staff training',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const formatPrice = (price: number | null, annual: boolean): string => {
  if (price === null) return 'Custom';
  const p = annual ? Math.round(price * 0.8) : price;
  return `₦${p.toLocaleString('en-NG')}`;
};

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="pricing"
      className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #091525 60%, #0D1B2A 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(200,169,110,0.04)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#C8A96E' }}>
            Pricing
          </p>
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-5"
            style={{ color: '#F4F1EC' }}
          >
            Investment That Pays for{' '}
            <span className="gradient-text">Itself</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: 'rgba(244,241,236,0.6)' }}>
            One closed deal covers months of NestIQ. No hidden fees, no per-lead charges.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,169,110,0.15)' }}>
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                !isAnnual ? 'text-[#0D1B2A] bg-[#C8A96E]' : 'text-[rgba(244,241,236,0.6)] hover:text-[#F4F1EC]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                isAnnual ? 'text-[#0D1B2A] bg-[#C8A96E]' : 'text-[rgba(244,241,236,0.6)] hover:text-[#F4F1EC]'
              }`}
            >
              Annual
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: isAnnual ? 'rgba(13,27,42,0.3)' : 'rgba(200,169,110,0.15)',
                  color: isAnnual ? '#0D1B2A' : '#C8A96E',
                }}
              >
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.popular ? 'scale-105' : ''
              }`}
              style={{
                background: plan.popular
                  ? 'linear-gradient(145deg, #152436, #112030)'
                  : 'rgba(17,32,48,0.6)',
                border: plan.popular
                  ? '1.5px solid rgba(200,169,110,0.5)'
                  : '1px solid rgba(200,169,110,0.12)',
                boxShadow: plan.popular
                  ? '0 0 0 1px rgba(200,169,110,0.15), 0 30px 60px rgba(0,0,0,0.4), 0 0 40px rgba(200,169,110,0.1)'
                  : '0 10px 30px rgba(0,0,0,0.2)',
              }}
            >
              {/* Most Popular Badge */}
              {plan.popular && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold tracking-wide"
                  style={{ background: 'linear-gradient(135deg, #C8A96E, #A88A52)', color: '#0D1B2A' }}
                >
                  ★ MOST POPULAR
                </div>
              )}

              {/* Plan icon + name */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: plan.popular ? 'rgba(200,169,110,0.2)' : 'rgba(200,169,110,0.08)',
                    border: '1px solid rgba(200,169,110,0.25)',
                  }}
                >
                  <plan.icon size={18} style={{ color: '#C8A96E' }} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold" style={{ color: '#F4F1EC' }}>
                    {plan.name}
                  </h3>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isAnnual ? 'annual' : 'monthly'}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-end gap-2"
                  >
                    <span
                      className="font-display text-4xl md:text-5xl font-semibold"
                      style={{ color: plan.popular ? '#C8A96E' : '#F4F1EC' }}
                    >
                      {formatPrice(plan.monthlyPrice, isAnnual)}
                    </span>
                    {plan.monthlyPrice !== null && (
                      <span className="text-sm mb-2" style={{ color: 'rgba(244,241,236,0.45)' }}>
                        /month
                      </span>
                    )}
                  </motion.div>
                </AnimatePresence>
                {isAnnual && plan.monthlyPrice !== null && (
                  <p className="text-xs mt-1" style={{ color: '#C8A96E' }}>
                    Billed annually · Save ₦{Math.round(plan.monthlyPrice * 0.2 * 12).toLocaleString('en-NG')}
                  </p>
                )}
              </div>

              <p className="text-sm mb-8 leading-relaxed" style={{ color: 'rgba(244,241,236,0.55)' }}>
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: 'rgba(200,169,110,0.15)',
                        border: '1px solid rgba(200,169,110,0.3)',
                      }}
                    >
                      <Check size={11} style={{ color: '#C8A96E' }} strokeWidth={3} />
                    </div>
                    <span className="text-sm" style={{ color: 'rgba(244,241,236,0.75)' }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.button
                onClick={() => scrollTo('lead-capture')}
                className={`w-full py-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 shimmer ${
                  plan.popular ? 'btn-gold' : 'btn-outline-gold'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-sm mt-10"
          style={{ color: 'rgba(244,241,236,0.4)' }}
        >
          All plans include a 14-day free trial. No credit card required. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
}
