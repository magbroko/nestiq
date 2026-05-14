import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      "NestIQ handles 80% of our initial enquiries now. Our agents only speak to serious, pre-qualified buyers. We've cut our cost-per-lead by 60% and increased our monthly closings by 3x since we launched.",
    name: 'Adaeze Okonkwo',
    title: 'Director of Sales',
    company: 'Lagos Property Group',
    initials: 'AO',
    location: 'Lagos, Nigeria',
    metric: '3x more closings',
  },
  {
    quote:
      "We booked 14 property inspections in the very first week without a single agent lifting a finger. The buyers showed up pre-qualified and ready to move. NestIQ paid for itself in the first transaction alone.",
    name: 'Mohammed Al-Khalid',
    title: 'Managing Partner',
    company: 'Gulf Estates Dubai',
    initials: 'MK',
    location: 'Dubai, UAE',
    metric: '14 bookings in week 1',
  },
  {
    quote:
      "The automated follow-up sequence alone has doubled our conversion rate. Buyers who went cold are coming back because NestIQ kept the relationship warm. It's like having a tireless sales associate on every deal.",
    name: 'Sipho Mthembu',
    title: 'CEO',
    company: 'Cape Town Realty Group',
    initials: 'SM',
    location: 'Cape Town, South Africa',
    metric: '2x conversion rate',
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const navigate = (newIndex: number) => {
    setDirection(newIndex > active ? 1 : -1);
    setActive(newIndex);
  };

  const prev = () => navigate((active - 1 + testimonials.length) % testimonials.length);
  const next = () => navigate((active + 1) % testimonials.length);

  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #0a1520 50%, #0D1B2A 100%)' }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,169,110,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#C8A96E' }}>
            Client Results
          </p>
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold"
            style={{ color: '#F4F1EC' }}
          >
            Agencies That{' '}
            <span className="gradient-text">Trusted the Process</span>
          </h2>
        </motion.div>

        {/* Desktop: 3 cards */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="rounded-2xl p-8 flex flex-col"
              style={{
                background: 'rgba(17,32,48,0.7)',
                border: '1px solid rgba(200,169,110,0.15)',
                transition: 'all 0.3s ease',
              }}
              whileHover={{
                borderColor: 'rgba(200,169,110,0.35)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(200,169,110,0.08)',
                y: -4,
              }}
            >
              <Quote size={28} style={{ color: '#C8A96E', opacity: 0.6, marginBottom: '16px' }} />

              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 self-start"
                style={{
                  background: 'rgba(200,169,110,0.1)',
                  border: '1px solid rgba(200,169,110,0.2)',
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                <span className="text-xs font-semibold" style={{ color: '#C8A96E' }}>
                  {t.metric}
                </span>
              </div>

              <p className="text-base leading-relaxed mb-8 flex-1" style={{ color: 'rgba(244,241,236,0.8)' }}>
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3 pt-5" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(200,169,110,0.3), rgba(200,169,110,0.1))',
                    border: '1px solid rgba(200,169,110,0.3)',
                    color: '#C8A96E',
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#F4F1EC' }}>
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(244,241,236,0.5)' }}>
                    {t.title} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.4 }}
                className="p-8 rounded-2xl"
                style={{
                  background: 'rgba(17,32,48,0.8)',
                  border: '1px solid rgba(200,169,110,0.15)',
                }}
              >
                <Quote size={28} style={{ color: '#C8A96E', opacity: 0.6, marginBottom: '16px' }} />

                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5"
                  style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                  <span className="text-xs font-semibold" style={{ color: '#C8A96E' }}>
                    {testimonials[active].metric}
                  </span>
                </div>

                <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(244,241,236,0.8)' }}>
                  "{testimonials[active].quote}"
                </p>

                <div
                  className="flex items-center gap-3 pt-5"
                  style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(200,169,110,0.3), rgba(200,169,110,0.1))',
                      border: '1px solid rgba(200,169,110,0.3)',
                      color: '#C8A96E',
                    }}
                  >
                    {testimonials[active].initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#F4F1EC' }}>
                      {testimonials[active].name}
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(244,241,236,0.5)' }}>
                      {testimonials[active].title} · {testimonials[active].company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)' }}
            >
              <ChevronLeft size={18} style={{ color: '#C8A96E' }} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => navigate(i)}
                  className="transition-all duration-300 rounded-full cursor-pointer"
                  style={{
                    width: i === active ? '20px' : '8px',
                    height: '8px',
                    background: i === active ? '#C8A96E' : 'rgba(200,169,110,0.3)',
                  }}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)' }}
            >
              <ChevronRight size={18} style={{ color: '#C8A96E' }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
