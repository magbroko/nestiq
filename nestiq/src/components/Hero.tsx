import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Zap, Calendar, Shield } from 'lucide-react';

const conversation = [
  { sender: 'buyer', text: "Hi, I'm looking for a 3-bed in Lagos Island" },
  { sender: 'nestiq', text: "Great choice! What's your budget range?" },
  { sender: 'buyer', text: "Around ₦85 million" },
  {
    sender: 'nestiq',
    text: "Perfect. I have 4 properties that match. Are you available for a viewing this Saturday?",
  },
  { sender: 'buyer', text: "Yes, Saturday works for me!" },
  {
    sender: 'nestiq',
    text: "Excellent! I've booked a viewing for Saturday 10:00 AM. You'll receive a confirmation via WhatsApp shortly.",
  },
];

const badges = [
  { icon: Zap, text: 'Responds in <3 seconds' },
  { icon: Calendar, text: 'Auto-books inspections' },
  { icon: Shield, text: 'GDPR Compliant' },
];

function ParticleMesh() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 8 + 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: '#C8A96E',
          }}
          animate={{
            y: [0, -30, -10, -40, 0],
            x: [0, 10, -8, 5, 0],
            opacity: [0.2, 0.6, 0.3, 0.7, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <radialGradient id="lineGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C8A96E" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C8A96E" stopOpacity="0" />
          </radialGradient>
        </defs>
        {particles.slice(0, 12).map((p, i) => {
          const next = particles[(i + 3) % 12];
          return (
            <line
              key={i}
              x1={`${p.x}%`}
              y1={`${p.y}%`}
              x2={`${next.x}%`}
              y2={`${next.y}%`}
              stroke="#C8A96E"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>
    </div>
  );
}

function ChatWidget() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingFor, setTypingFor] = useState<'nestiq' | null>(null);
  const loopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runConversation = () => {
    setVisibleMessages([]);
    setIsTyping(false);
    setTypingFor(null);

    let delay = 500;
    conversation.forEach((msg, idx) => {
      const isNestIQ = msg.sender === 'nestiq';

      if (isNestIQ) {
        loopRef.current = setTimeout(() => {
          setTypingFor('nestiq');
          setIsTyping(true);
        }, delay);
        delay += 1200;
      }

      loopRef.current = setTimeout(() => {
        setIsTyping(false);
        setTypingFor(null);
        setVisibleMessages((prev) => [...prev, idx]);
      }, delay);
      delay += isNestIQ ? 600 : 800;
    });

    loopRef.current = setTimeout(runConversation, delay + 3000);
  };

  useEffect(() => {
    runConversation();
    return () => {
      if (loopRef.current) clearTimeout(loopRef.current);
    };
  }, []);

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #112030, #0D1B2A)',
        border: '1px solid rgba(200,169,110,0.2)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 40px rgba(200,169,110,0.08)',
        maxWidth: '420px',
        width: '100%',
      }}
    >
      {/* Chat header */}
      <div
        className="flex items-center gap-3 px-4 py-4"
        style={{ background: 'rgba(200,169,110,0.08)', borderBottom: '1px solid rgba(200,169,110,0.15)' }}
      >
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #C8A96E, #A88A52)', color: '#0D1B2A' }}
          >
            N
          </div>
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
            style={{ backgroundColor: '#22c55e', borderColor: '#112030' }}
          />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#F4F1EC' }}>
            NestIQ Assistant
          </p>
          <p className="text-xs" style={{ color: '#C8A96E' }}>
            Online · Typically replies instantly
          </p>
        </div>
        <div className="ml-auto flex gap-1.5">
          {['#ef4444', '#f59e0b', '#22c55e'].map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-3 min-h-[320px] max-h-[380px] overflow-y-auto">
        <div className="text-center mb-4">
          <span className="text-xs px-3 py-1 rounded-full" style={{ color: '#C8A96E', background: 'rgba(200,169,110,0.1)' }}>
            Today · Property Inquiry
          </span>
        </div>

        <AnimatePresence>
          {conversation.map(
            (msg, idx) =>
              visibleMessages.includes(idx) && (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'nestiq' && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-auto shrink-0"
                      style={{ background: 'linear-gradient(135deg, #C8A96E, #A88A52)', color: '#0D1B2A' }}
                    >
                      N
                    </div>
                  )}
                  <div
                    className="max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={
                      msg.sender === 'buyer'
                        ? {
                            background: 'rgba(200,169,110,0.15)',
                            color: '#F4F1EC',
                            borderBottomRightRadius: '4px',
                            border: '1px solid rgba(200,169,110,0.2)',
                          }
                        : {
                            background: 'rgba(255,255,255,0.07)',
                            color: '#F4F1EC',
                            borderBottomLeftRadius: '4px',
                            border: '1px solid rgba(255,255,255,0.08)',
                          }
                    }
                  >
                    {msg.text}
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && typingFor === 'nestiq' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: 'linear-gradient(135deg, #C8A96E, #A88A52)', color: '#0D1B2A' }}
              >
                N
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#C8A96E' }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ borderTop: '1px solid rgba(200,169,110,0.1)', background: 'rgba(255,255,255,0.03)' }}
      >
        <div
          className="flex-1 px-4 py-2.5 rounded-full text-sm"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(244,241,236,0.4)' }}
        >
          Type a message...
        </div>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #C8A96E, #A88A52)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#0D1B2A">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="#0D1B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden texture-overlay"
      style={{ background: 'linear-gradient(160deg, #0D1B2A 0%, #0a1520 50%, #0D1B2A 100%)' }}
    >
      <ParticleMesh />

      {/* Radial glow behind content */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(200,169,110,0.05) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.25)' }}
            >
              <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-xs font-medium" style={{ color: '#C8A96E' }}>
                AI-Powered Real Estate Assistant
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] mb-6"
              style={{ color: '#F4F1EC' }}
            >
              Close More{' '}
              <span className="gradient-text">Deals.</span>
              <br />
              Sleep More{' '}
              <span className="gradient-text">Hours.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: 'rgba(244,241,236,0.65)' }}
            >
              NestIQ qualifies buyers, books inspections, and follows up —
              automatically. 24 hours a day, so you can focus on what you do
              best: closing deals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.button
                onClick={() => scrollTo('lead-capture')}
                className="btn-gold shimmer px-8 py-4 rounded-xl text-base font-semibold cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Start Free Trial
              </motion.button>
              <motion.button
                onClick={() => scrollTo('demo')}
                className="btn-outline-gold px-8 py-4 rounded-xl text-base font-medium cursor-pointer flex items-center gap-2 justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Play size={16} className="fill-current" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Floating Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap gap-3"
            >
              {badges.map((badge, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(200,169,110,0.2)',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <badge.icon size={14} style={{ color: '#C8A96E' }} />
                  <span className="text-xs font-medium" style={{ color: 'rgba(244,241,236,0.75)' }}>
                    {badge.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Chat Widget */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow behind widget */}
              <div
                className="absolute inset-0 rounded-2xl blur-3xl"
                style={{ background: 'rgba(200,169,110,0.12)', transform: 'scale(1.1)' }}
              />
              <ChatWidget />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0D1B2A, transparent)' }}
      />
    </section>
  );
}
