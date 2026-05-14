import { motion } from 'framer-motion';
import { Zap, Target, Database, Calendar, RefreshCw, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Response',
    description:
      'Replies to every property enquiry in under 3 seconds, any time of day or night. No missed leads, no waiting.',
    highlight: '<3 sec',
  },
  {
    icon: Target,
    title: 'Smart Buyer Qualification',
    description:
      'Systematically asks the right questions: budget, preferred location, timeline, and mortgage status to filter serious buyers.',
    highlight: '100% automated',
  },
  {
    icon: Database,
    title: 'Lead Intelligence',
    description:
      'Stores and organizes every lead with full conversation history, intent signals, and readiness scores in a live CRM.',
    highlight: 'Full CRM sync',
  },
  {
    icon: Calendar,
    title: 'Inspection Booking',
    description:
      'Syncs directly with your calendar and auto-schedules property viewings, sending confirmation and reminders to both parties.',
    highlight: 'Zero friction',
  },
  {
    icon: RefreshCw,
    title: 'Automated Follow-Up',
    description:
      'Sends perfectly timed follow-ups via WhatsApp, email, or SMS — personalized to each lead\'s stage in the buying journey.',
    highlight: 'Multi-channel',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Real-time insights on lead quality, conversion rates, response times, and top-performing listings — all in one view.',
    highlight: 'Live data',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function Features() {
  return (
    <section id="features" className="py-28 relative">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(200,169,110,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
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
            Platform Features
          </p>
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
            style={{ color: '#F4F1EC' }}
          >
            Everything Your Sales Team
            <br />
            <span className="gradient-text">Needed Yesterday</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'rgba(244,241,236,0.6)' }}
          >
            NestIQ handles the repetitive work so your agents can focus on
            building relationships and closing deals.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="card-navy gold-top-border rounded-xl p-7 group cursor-default"
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'rgba(200,169,110,0.1)',
                    border: '1px solid rgba(200,169,110,0.2)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <feature.icon
                    size={22}
                    style={{ color: '#C8A96E' }}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(200,169,110,0.08)',
                    color: '#C8A96E',
                    border: '1px solid rgba(200,169,110,0.15)',
                  }}
                >
                  {feature.highlight}
                </span>
              </div>

              <h3
                className="font-display text-xl font-semibold mb-3"
                style={{ color: '#F4F1EC' }}
              >
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(244,241,236,0.6)' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
