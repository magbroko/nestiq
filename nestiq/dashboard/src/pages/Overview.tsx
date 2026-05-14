import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle, Calendar, TrendingUp, ArrowRight, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Lead, Analytics } from '../types';
import { fetchLeads, fetchAnalytics } from '../api';
import StatusBadge from '../components/StatusBadge';

export default function Overview() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchLeads(1, 5), fetchAnalytics()])
      .then(([leadsData, analyticsData]) => {
        setLeads(leadsData.leads);
        setAnalytics(analyticsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  const qualRate = analytics.totalLeads > 0
    ? Math.round((analytics.qualifiedLeads / analytics.totalLeads) * 100)
    : 0;

  const stats = [
    { label: 'Total Leads', value: analytics.totalLeads, icon: Users, color: '#6366f1', change: `+${analytics.leadsThisWeek} this week` },
    { label: 'Qualified', value: analytics.qualifiedLeads, icon: CheckCircle, color: '#10b981', change: `${qualRate}% rate` },
    { label: 'Booked', value: analytics.bookedAppointments, icon: Calendar, color: '#C8A96E', change: 'inspections' },
    { label: 'Response Time', value: `${analytics.avgResponseTimeMinutes}m`, icon: TrendingUp, color: '#3b82f6', change: 'avg via AI' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div
        className="rounded-xl p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(200,169,110,0.12) 0%, rgba(13,27,42,0.8) 100%)',
          border: '1px solid rgba(200,169,110,0.2)',
        }}
      >
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(200,169,110,0.08)' }}
        />
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-navy-900 font-bold text-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #C8A96E, #e2c98a)' }}
          >
            N
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">NestIQ is live and running</h1>
            <p className="text-white/50 text-sm mt-0.5">
              Your AI sales assistant is handling WhatsApp enquiries automatically
            </p>
          </div>
          <div className="ml-auto flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}
            >
              <stat.icon size={16} style={{ color: stat.color }} />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
            <div className="text-xs mt-1" style={{ color: stat.color + 'aa' }}>{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/70 flex items-center gap-2">
            <MessageSquare size={14} className="text-gold-500" />
            Recent Leads
          </h2>
          <button
            onClick={() => navigate('/leads')}
            className="text-xs text-gold-500 hover:text-gold-400 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={12} />
          </button>
        </div>

        {leads.length === 0 ? (
          <div className="text-center py-10 text-white/25 text-sm">
            No leads yet. Messages from WhatsApp will appear here.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {leads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => navigate(`/leads/${lead.id}`)}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold-500 text-xs font-bold">
                    {(lead.name ?? lead.whatsapp_number).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white/90 text-sm font-medium truncate">
                    {lead.name ?? <span className="text-white/30 italic text-xs">Unknown</span>}
                  </div>
                  <div className="text-white/30 text-xs truncate">{lead.whatsapp_number}</div>
                </div>
                {lead.budget && (
                  <div className="text-white/50 text-xs hidden sm:block">{lead.budget}</div>
                )}
                <StatusBadge status={lead.status} />
                <div className="text-white/25 text-xs hidden md:block">
                  {formatDistanceToNow(new Date(lead.last_contact), { addSuffix: true })}
                </div>
                <ArrowRight size={13} className="text-white/15 flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Locations */}
      {analytics.topLocations.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Top Enquiry Locations</h3>
          <div className="space-y-2.5">
            {analytics.topLocations.map((loc, i) => {
              const pct = analytics.totalLeads > 0
                ? Math.round((loc.count / analytics.totalLeads) * 100)
                : 0;
              return (
                <div key={loc.location} className="flex items-center gap-3">
                  <span className="text-white/20 text-xs w-4">{i + 1}</span>
                  <span className="text-white/70 text-sm flex-1 min-w-0 truncate">{loc.location}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: '#C8A96E' }}
                      />
                    </div>
                    <span className="text-white/30 text-xs w-8 text-right">{loc.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
