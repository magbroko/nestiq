import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

const agencies = [
  { name: 'Lagos Property Group', abbr: 'LPG' },
  { name: 'Gulf Estates Dubai', abbr: 'GED' },
  { name: 'Cape Town Realty', abbr: 'CTR' },
  { name: 'Nairobi Urban Homes', abbr: 'NUH' },
  { name: 'Abuja Prime Estates', abbr: 'APE' },
  { name: 'Accra Luxury Living', abbr: 'ALL' },
  { name: 'Riyadh Prestige Realty', abbr: 'RPR' },
  { name: 'Cairo Property Co.', abbr: 'CPC' },
  { name: 'Joburg Metro Homes', abbr: 'JMH' },
  { name: 'Dar es Salaam Estates', abbr: 'DSE' },
  { name: 'Casablanca Prime', abbr: 'CBP' },
  { name: 'Kampala Realty Group', abbr: 'KRG' },
];

const doubled = [...agencies, ...agencies];

export default function SocialProof() {
  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{ borderTop: '1px solid rgba(200,169,110,0.1)', borderBottom: '1px solid rgba(200,169,110,0.1)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-medium tracking-widest uppercase"
          style={{ color: 'rgba(200,169,110,0.7)' }}
        >
          Trusted by 500+ real estate agencies across Africa &amp; the Middle East
        </motion.p>
      </div>

      <div className="marquee-container">
        <div className="marquee-track">
          {doubled.map((agency, i) => (
            <div
              key={i}
              className="flex items-center gap-3 mx-6 shrink-0"
              style={{ minWidth: 'max-content' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: 'rgba(200,169,110,0.1)',
                  border: '1px solid rgba(200,169,110,0.2)',
                  color: '#C8A96E',
                }}
              >
                {agency.abbr}
              </div>
              <span
                className="text-sm font-medium whitespace-nowrap"
                style={{ color: 'rgba(244,241,236,0.55)' }}
              >
                {agency.name}
              </span>
              <div
                className="w-1 h-1 rounded-full ml-4"
                style={{ backgroundColor: 'rgba(200,169,110,0.3)' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '500+', label: 'Partner Agencies' },
            { value: '2.4M+', label: 'Leads Qualified' },
            { value: '98.7%', label: 'Response Rate' },
            { value: '3.2x', label: 'Avg. Conversion Lift' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center py-4"
            >
              <div
                className="font-display text-3xl md:text-4xl font-semibold mb-1"
                style={{ color: '#C8A96E' }}
              >
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: 'rgba(244,241,236,0.5)' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
