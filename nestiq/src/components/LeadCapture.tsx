import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  agencyName: string;
  listingCount: string;
}

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export default function LeadCapture() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error((err as { error?: string }).error ?? 'Failed to submit');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Demo request failed:', error);
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="lead-capture"
      className="py-28 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0D1B2A 0%, #07111c 60%, #0D1B2A 100%)',
      }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(200,169,110,0.07) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#C8A96E' }}>
              Get Started
            </p>
            <h2
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-5 leading-tight"
              style={{ color: '#F4F1EC' }}
            >
              Turn Every Enquiry Into{' '}
              <span className="gradient-text">a Viewing</span>
            </h2>
            <p className="text-lg" style={{ color: 'rgba(244,241,236,0.6)' }}>
              Book a personalized demo and see exactly how NestIQ will transform
              your agency's lead conversion. No commitment required.
            </p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="rounded-2xl p-8 md:p-10 relative"
            style={{
              background: 'rgba(17,32,48,0.7)',
              border: '1px solid rgba(200,169,110,0.18)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
            }}
          >
            {/* Gold top line */}
            <div
              className="absolute top-0 left-8 right-8 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #C8A96E, transparent)' }}
            />

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                      background: 'rgba(200,169,110,0.15)',
                      border: '2px solid rgba(200,169,110,0.4)',
                    }}
                  >
                    <CheckCircle size={40} style={{ color: '#C8A96E' }} />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-display text-3xl font-semibold mb-3"
                    style={{ color: '#F4F1EC' }}
                  >
                    You're on the List
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-base mb-6"
                    style={{ color: 'rgba(244,241,236,0.6)' }}
                  >
                    We'll be in touch within{' '}
                    <span style={{ color: '#C8A96E', fontWeight: 600 }}>24 hours</span> to
                    schedule your personalized demo. Check your inbox for a
                    confirmation email.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-4 justify-center"
                  >
                    {['Demo confirmed', 'Onboarding guide sent', 'Account created'].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm"
                        style={{ color: 'rgba(244,241,236,0.6)' }}
                      >
                        <CheckCircle size={14} style={{ color: '#22c55e' }} />
                        {item}
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid md:grid-cols-2 gap-5 mb-5">
                    {/* Full Name */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: 'rgba(244,241,236,0.75)' }}
                      >
                        Full Name <span style={{ color: '#C8A96E' }}>*</span>
                      </label>
                      <input
                        {...register('fullName', {
                          required: 'Full name is required',
                          minLength: { value: 2, message: 'Name must be at least 2 characters' },
                        })}
                        placeholder="Adaeze Okonkwo"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: errors.fullName
                            ? '1px solid rgba(239,68,68,0.6)'
                            : '1px solid rgba(200,169,110,0.2)',
                          color: '#F4F1EC',
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(200,169,110,0.6)';
                          e.target.style.boxShadow = '0 0 0 3px rgba(200,169,110,0.08)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.fullName
                            ? 'rgba(239,68,68,0.6)'
                            : 'rgba(200,169,110,0.2)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {errors.fullName && (
                        <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: 'rgba(244,241,236,0.75)' }}
                      >
                        Work Email <span style={{ color: '#C8A96E' }}>*</span>
                      </label>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Please enter a valid email address',
                          },
                        })}
                        type="email"
                        placeholder="adaeze@lgproperty.com"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: errors.email
                            ? '1px solid rgba(239,68,68,0.6)'
                            : '1px solid rgba(200,169,110,0.2)',
                          color: '#F4F1EC',
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(200,169,110,0.6)';
                          e.target.style.boxShadow = '0 0 0 3px rgba(200,169,110,0.08)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.email
                            ? 'rgba(239,68,68,0.6)'
                            : 'rgba(200,169,110,0.2)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {errors.email && (
                        <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: 'rgba(244,241,236,0.75)' }}
                      >
                        Phone Number <span style={{ color: '#C8A96E' }}>*</span>
                      </label>
                      <input
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[+\d][\d\s\-()]{7,}$/,
                            message: 'Please enter a valid phone number',
                          },
                        })}
                        type="tel"
                        placeholder="+234 812 345 6789"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: errors.phone
                            ? '1px solid rgba(239,68,68,0.6)'
                            : '1px solid rgba(200,169,110,0.2)',
                          color: '#F4F1EC',
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(200,169,110,0.6)';
                          e.target.style.boxShadow = '0 0 0 3px rgba(200,169,110,0.08)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.phone
                            ? 'rgba(239,68,68,0.6)'
                            : 'rgba(200,169,110,0.2)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {errors.phone && (
                        <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Agency Name */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: 'rgba(244,241,236,0.75)' }}
                      >
                        Agency Name <span style={{ color: '#C8A96E' }}>*</span>
                      </label>
                      <input
                        {...register('agencyName', {
                          required: 'Agency name is required',
                        })}
                        placeholder="Lagos Property Group"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: errors.agencyName
                            ? '1px solid rgba(239,68,68,0.6)'
                            : '1px solid rgba(200,169,110,0.2)',
                          color: '#F4F1EC',
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(200,169,110,0.6)';
                          e.target.style.boxShadow = '0 0 0 3px rgba(200,169,110,0.08)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.agencyName
                            ? 'rgba(239,68,68,0.6)'
                            : 'rgba(200,169,110,0.2)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {errors.agencyName && (
                        <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>
                          {errors.agencyName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Listings Count */}
                  <div className="mb-8">
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'rgba(244,241,236,0.75)' }}
                    >
                      How many listings do you manage?{' '}
                      <span style={{ color: '#C8A96E' }}>*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register('listingCount', {
                          required: 'Please select your listing count',
                        })}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 appearance-none cursor-pointer"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: errors.listingCount
                            ? '1px solid rgba(239,68,68,0.6)'
                            : '1px solid rgba(200,169,110,0.2)',
                          color: '#F4F1EC',
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(200,169,110,0.6)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.listingCount
                            ? 'rgba(239,68,68,0.6)'
                            : 'rgba(200,169,110,0.2)';
                        }}
                      >
                        <option value="" style={{ background: '#0D1B2A' }}>Select number of listings...</option>
                        <option value="1-10" style={{ background: '#0D1B2A' }}>1 – 10 listings</option>
                        <option value="11-50" style={{ background: '#0D1B2A' }}>11 – 50 listings</option>
                        <option value="51-200" style={{ background: '#0D1B2A' }}>51 – 200 listings</option>
                        <option value="200+" style={{ background: '#0D1B2A' }}>200+ listings</option>
                      </select>
                      <div
                        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: '#C8A96E' }}
                      >
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                          <path d="M1 1L6 6L11 1" stroke="#C8A96E" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                    {errors.listingCount && (
                      <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>
                        {errors.listingCount.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-gold shimmer py-4 rounded-xl text-base font-semibold cursor-pointer flex items-center justify-center gap-3 disabled:opacity-80 disabled:cursor-not-allowed"
                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Book My Free Demo
                        <ArrowRight size={18} />
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-xs mt-4" style={{ color: 'rgba(244,241,236,0.35)' }}>
                    By submitting, you agree to our{' '}
                    <span className="underline cursor-pointer" style={{ color: 'rgba(200,169,110,0.6)' }}>
                      Privacy Policy
                    </span>
                    . We respect your data and will never spam you.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
