import { motion } from 'framer-motion';

const footerLinks = {
  Product: ['Features', 'How It Works', 'Pricing', 'Integrations', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
  Support: ['Help Centre', 'Documentation', 'API Reference', 'Status Page'],
};

const SocialIcons = {
  LinkedIn: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#C8A96E">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  Instagram: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="#C8A96E" stroke="none"/>
    </svg>
  ),
  Twitter: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#C8A96E">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  WhatsApp: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#C8A96E">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
};

const socials = [
  { Icon: SocialIcons.LinkedIn, label: 'LinkedIn', href: '#' },
  { Icon: SocialIcons.Instagram, label: 'Instagram', href: '#' },
  { Icon: SocialIcons.Twitter, label: 'Twitter / X', href: '#' },
  { Icon: SocialIcons.WhatsApp, label: 'WhatsApp', href: '#' },
];

export default function Footer() {
  return (
    <footer className="relative" style={{ background: '#07111c' }}>
      {/* Gold divider */}
      <div
        className="w-full h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.5) 30%, rgba(200,169,110,0.5) 70%, transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1 mb-4">
              <span className="font-display text-2xl font-semibold" style={{ color: '#F4F1EC' }}>
                Nest
              </span>
              <span className="font-display text-2xl font-bold" style={{ color: '#C8A96E' }}>
                IQ
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(244,241,236,0.5)' }}>
              Your 24/7 AI Real Estate Agent. Qualify more leads, book more
              viewings, close more deals.
            </p>
            <div className="flex gap-3">
            {socials.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
                style={{
                  background: 'rgba(200,169,110,0.08)',
                  border: '1px solid rgba(200,169,110,0.15)',
                }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: 'rgba(200,169,110,0.2)',
                  borderColor: 'rgba(200,169,110,0.4)',
                }}
              >
                <social.Icon />
              </motion.a>
            ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-xs font-semibold tracking-widest uppercase mb-5"
                style={{ color: '#C8A96E' }}
              >
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200 cursor-pointer"
                      style={{ color: 'rgba(244,241,236,0.5)' }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = '#C8A96E';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = 'rgba(244,241,236,0.5)';
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(200,169,110,0.08)' }}
        >
          <p className="text-sm" style={{ color: 'rgba(244,241,236,0.35)' }}>
            © 2025 NestIQ Technologies Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms', 'Contact', 'Blog'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs transition-colors duration-200 cursor-pointer"
                style={{ color: 'rgba(244,241,236,0.35)' }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = '#C8A96E';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = 'rgba(244,241,236,0.35)';
                }}
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-xs" style={{ color: 'rgba(244,241,236,0.35)' }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
