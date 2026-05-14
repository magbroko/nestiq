import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, ChevronRight, Phone, MapPin, DollarSign, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Lead, LeadStatus } from '../types';
import { fetchLeads } from '../api';
import StatusBadge from '../components/StatusBadge';

const STATUS_FILTERS: Array<{ value: LeadStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All Leads' },
  { value: 'new', label: 'New' },
  { value: 'qualifying', label: 'Qualifying' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'booked', label: 'Booked' },
  { value: 'closed', label: 'Closed' },
];

export default function LeadsList() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { leads: data, total: t } = await fetchLeads(page, limit);
      setLeads(data);
      setTotal(t);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = leads.filter((lead) => {
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      (lead.name?.toLowerCase().includes(searchLower) ?? false) ||
      lead.whatsapp_number.includes(search) ||
      (lead.location?.toLowerCase().includes(searchLower) ?? false) ||
      (lead.budget?.toLowerCase().includes(searchLower) ?? false);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Leads</h1>
          <p className="text-sm text-white/40 mt-0.5">{total} total contacts</p>
        </div>
        <button onClick={() => void load()} className="btn-secondary" disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search name, phone, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === f.value
                  ? 'bg-gold-500/15 text-gold-500 border border-gold-500/30'
                  : 'text-white/40 hover:text-white/70 border border-transparent hover:border-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/30 text-sm">No leads found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Contact', 'Status', 'Budget', 'Location', 'Property', 'Last Active', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-gold-500 text-xs font-bold">
                            {(lead.name ?? lead.whatsapp_number).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-white/90 text-sm font-medium">
                            {lead.name ?? <span className="text-white/30 italic">Unknown</span>}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Phone size={10} className="text-white/30" />
                            <span className="text-white/40 text-xs">{lead.whatsapp_number}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      {lead.budget ? (
                        <div className="flex items-center gap-1 text-white/70 text-sm">
                          <DollarSign size={12} className="text-gold-500/60" />
                          {lead.budget}
                        </div>
                      ) : (
                        <span className="text-white/20 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {lead.location ? (
                        <div className="flex items-center gap-1 text-white/70 text-sm">
                          <MapPin size={12} className="text-white/30" />
                          {lead.location}
                        </div>
                      ) : (
                        <span className="text-white/20 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-white/50 text-sm capitalize">{lead.property_type === 'unknown' ? '—' : lead.property_type}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-white/40 text-xs">
                        <Clock size={11} />
                        {formatDistanceToNow(new Date(lead.last_contact), { addSuffix: true })}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <ChevronRight size={14} className="text-white/20 group-hover:text-gold-500 transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between">
          <span className="text-white/30 text-sm">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary disabled:opacity-30"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * limit >= total}
              className="btn-secondary disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
