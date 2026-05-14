import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link, Bot, Trophy } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Link,
    title: 'Connect NestIQ to Your Listings',
    description:
      'Embed NestIQ on your property website or connect to your WhatsApp Business account in under 10 minutes. No technical skills required — just copy, paste, and go live.',
    detail: 'Works with: Website Widget · WhatsApp · Facebook Messenger · Email',
  },
  {
    number: '02',
    icon: Bot,
    title: 'AI Engages Every Lead Instantly',
    description:
      'The moment a buyer enquires, NestIQ responds — 24/7. It qualifies their intent, answers property questions, handles objections, and schedules viewings automatically.',
    detail: 'Avg. response time: 2.1 seconds',
  },
  {
    number: '03',
    icon: Trophy,
    title: 'You Close the Deal',
    description:
      'Receive pre-qualified, warm leads directly in your inbox or CRM — complete with conversation history, budget data, and preferred viewing times. You arrive at every conversation ready to close.',
    detail: 'Avg. qualification accuracy: 94%',
  },
];

export default function HowItWorks() {
  const lineRef = useRef(null);
  const lineInView = useInView(lineRef, { once: true, margin: '-100px' });

  return (
    <section
      id="how-it-works"
      className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #0a1520 50%, #0D1B2A 100%)' }}
    >
      {/* Ambient glows */}
      <div
        className="absolute right-0 top-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(200,169,110,0.05)' }}
      />
      <div
        className="absolute left-0 bottom-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(200,169,110,0.04)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: '#C8A96E' }}
          >
            How It Works
          </p>
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
            style={{ color: '#F4F1EC' }}
          >
            Up and Running in{' '}
            <span className="gradient-text">10 Minutes</span>
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: 'rgba(244,241,236,0.6)' }}
          >
            Three steps between you and a fully autonomous AI real estate
            assistant that never sleeps.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-2xl mx-auto" ref={lineRef}>

          {/* Vertical gold line — runs full height, perfectly centered */}
          <div
            className="absolute top-0 bottom-0 w-px"
            style={{ left: '50%', transform: 'translateX(-50%)', background: 'rgba(200,169,110,0.15)' }}
          >
            <motion.div
              className="w-full origin-top"
              style={{
                height: '100%',
                background: 'linear-gradient(180deg, #C8A96E 0%, rgba(200,169,110,0.3) 100%)',
              }}
              initial={{ scaleY: 0 }}
              animate={lineInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
            />
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-10">
            {steps.map((step, i) => (
              <div key={i} className="relative">

                {/* Icon node — centered on the line, sits above the card */}
                <motion.div
                  className="absolute z-10"
                  style={{ left: '50%', transform: 'translateX(-50%)', top: '-28px' }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.2, type: 'spring', stiffness: 200 }}
                >
                  {/* Outer pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: '1px solid rgba(200,169,110,0.25)', margin: '-6px' }}
                    animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
                  />

                  {/* Icon circle */}
                  <div
                    className="relative w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: '#0a1628',
                      border: '2px solid #C8A96E',
                      boxShadow: '0 0 20px rgba(200,169,110,0.25), 0 0 40px rgba(200,169,110,0.1)',
                    }}
                  >
                    <step.icon size={22} style={{ color: '#C8A96E' }} />

                    {/* Number badge */}
                    <div
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: '#C8A96E', color: '#0D1B2A', fontSize: '10px' }}
                    >
                      {i + 1}
                    </div>
                  </div>
                </motion.div>

                {/* Card */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="rounded-2xl pt-10 pb-8 px-8 md:px-10 relative overflow-hidden"
                  style={{
                    background: '#0a1628',
                    border: '1px solid rgba(200,169,110,0.2)',
                    borderLeft: '4px solid #C8A96E',
                    marginTop: '28px',
                  }}
                >
                  {/* Subtle inner glow top-left */}
                  <div
                    className="absolute top-0 left-0 w-48 h-32 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at top left, rgba(200,169,110,0.06), transparent 70%)',
                    }}
                  />

                  {/* Step number — muted, top-left */}
                  <p
                    className="font-display text-4xl font-semibold mb-3"
                    style={{ color: 'rgba(200,169,110,0.2)', lineHeight: 1 }}
                  >
                    {step.number}
                  </p>

                  {/* Title */}
                  <h3
                    className="font-display text-2xl md:text-3xl font-semibold mb-4 leading-snug"
                    style={{ color: '#F4F1EC' }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-base leading-relaxed mb-6"
                    style={{ color: '#94a3b8', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {step.description}
                  </p>

                  {/* Detail pill */}
                  <div
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium"
                    style={{
                      background: 'rgba(200,169,110,0.07)',
                      border: '1px solid rgba(200,169,110,0.18)',
                      color: 'rgba(200,169,110,0.85)',
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: '#22c55e' }}
                    />
                    {step.detail}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
