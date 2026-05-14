import { useState, useEffect } from 'react';
import { TrendingUp, Users, CheckCircle, Calendar, Clock, MapPin, RefreshCw } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Analytics as AnalyticsData } from '../types';
import { fetchAnalytics } from '../api';

const STATUS_COLORS: Record<string, string> = {
  new: '#6366f1',
  qualifying: '#f59e0b',
  qualified: '#10b981',
  booked: '#3b82f6',
  closed: '#6b7280',
};

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const result = await fetchAnalytics();
      setData(result);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  const qualificationRate =
    data.totalLeads > 0
      ? Math.round(((data.qualifiedLeads) / data.totalLeads) * 100)
      : 0;

  const pieData = Object.entries(data.statusBreakdown)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: STATUS_COLORS[status] ?? '#6b7280',
    }));

  const locationData = data.topLocations.map((l) => ({
    name: l.location.length > 15 ? l.location.slice(0, 15) + '…' : l.location,
    leads: l.count,
  }));

  const statCards = [
    {
      label: 'Total Leads',
      value: data.totalLeads,
      icon: Users,
      color: '#6366f1',
      sub: `+${data.leadsThisWeek} this week`,
    },
    {
      label: 'Qualified Leads',
      value: data.qualifiedLeads,
      icon: CheckCircle,
      color: '#10b981',
      sub: `${qualificationRate}% qualification rate`,
    },
    {
      label: 'Inspections Booked',
      value: data.bookedAppointments,
      icon: Calendar,
      color: '#C8A96E',
      sub: `${data.statusBreakdown.booked} active`,
    },
    {
      label: 'Avg Response Time',
      value: `${data.avgResponseTimeMinutes}m`,
      icon: Clock,
      color: '#3b82f6',
      sub: 'Powered by Claude AI',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Analytics</h1>
          <p className="text-sm text-white/40 mt-0.5">Performance overview</p>
        </div>
        <button onClick={() => void load()} className="btn-secondary" disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}
              >
                <card.icon size={16} style={{ color: card.color }} />
              </div>
              <TrendingUp size={13} className="text-white/20" />
            </div>
            <div className="text-2xl font-bold text-white">{card.value}</div>
            <div className="text-xs text-white/40 mt-1">{card.label}</div>
            <div className="text-xs mt-1.5" style={{ color: card.color + 'cc' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lead Status Breakdown */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Lead Status Breakdown</h3>
          {pieData.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-8">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#0D1B2A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Locations */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-gold-500" />
              Top Enquiry Locations
            </span>
          </h3>
          {locationData.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-8">No location data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={locationData} layout="vertical" margin={{ left: 0, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0D1B2A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="leads" fill="#C8A96E" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Funnel */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-5">Lead Funnel</h3>
        <div className="space-y-3">
          {Object.entries(data.statusBreakdown).map(([status, count]) => {
            const pct = data.totalLeads > 0 ? (count / data.totalLeads) * 100 : 0;
            return (
              <div key={status}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-white/60 capitalize">{status}</span>
                  <span className="text-xs text-white/40">{count} leads · {pct.toFixed(0)}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: STATUS_COLORS[status] ?? '#6b7280',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
