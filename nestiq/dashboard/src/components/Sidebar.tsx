import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, BarChart3, Settings } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/appointments', label: 'Appointments', icon: Calendar },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside
      className="fixed top-0 left-0 h-screen w-60 flex flex-col z-10"
      style={{
        background: 'rgba(6,14,23,0.95)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-900 font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #C8A96E, #e2c98a)' }}
          >
            N
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-none">NestIQ</div>
            <div className="text-white/40 text-xs mt-0.5">Agent Dashboard</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={16} className={isActive ? 'text-gold-500' : 'text-white/40'} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
            <span className="text-gold-500 text-xs font-semibold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white/80 text-xs font-medium truncate">Agent</div>
            <div className="text-white/30 text-xs truncate">{import.meta.env.VITE_AGENCY_NAME ?? 'Your Agency'}</div>
          </div>
          <Settings size={14} className="text-white/30" />
        </div>
      </div>
    </aside>
  );
}
