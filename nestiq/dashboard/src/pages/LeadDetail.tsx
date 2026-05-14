import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Send, Phone, MapPin, DollarSign, Calendar, Home,
  Clock, ExternalLink, ChevronDown, RefreshCw
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Lead, Conversation, LeadStatus } from '../types';
import { fetchLeadDetail, sendManualMessage, updateLeadStatus } from '../api';
import StatusBadge from '../components/StatusBadge';

const STATUS_OPTIONS: LeadStatus[] = ['new', 'qualifying', 'qualified', 'booked', 'closed'];

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [sendError, setSendError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const { lead: l, conversations: c } = await fetchLeadDetail(id);
      setLead(l);
      setConversations(c);
    } catch (err) {
      console.error('Failed to load lead:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  const handleSend = async () => {
    if (!message.trim() || !lead || sending) return;
    setSending(true);
    setSendError('');
    try {
      await sendManualMessage(lead.id, message.trim());
      setMessage('');
      await load();
    } catch (err) {
      setSendError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (status: LeadStatus) => {
    if (!lead) return;
    setShowStatusMenu(false);
    try {
      await updateLeadStatus(lead.id, status);
      setLead({ ...lead, status });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-6 text-center">
        <p className="text-white/40">Lead not found</p>
        <button onClick={() => navigate('/leads')} className="btn-secondary mt-4">Go back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div
        className="flex-none px-6 py-4 border-b border-white/[0.06] flex items-center gap-4"
        style={{ background: 'rgba(6,14,23,0.8)' }}
      >
        <button onClick={() => navigate('/leads')} className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors">
          <ArrowLeft size={16} className="text-white/60" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
          <span className="text-gold-500 font-bold text-sm">
            {(lead.name ?? lead.whatsapp_number).charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-semibold text-sm">
              {lead.name ?? 'Unknown'}
            </h2>
            <StatusBadge status={lead.status} />
          </div>
          <p className="text-white/40 text-xs">{lead.whatsapp_number}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => void load()} className="btn-secondary py-1.5">
            <RefreshCw size={13} />
          </button>
          {/* Status Changer */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="btn-secondary py-1.5"
            >
              Change Status <ChevronDown size={13} />
            </button>
            {showStatusMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-white/10 overflow-hidden z-20"
                style={{ background: '#0D1B2A' }}>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void handleStatusChange(s)}
                    className="w-full text-left px-3 py-2 text-xs text-white/70 hover:bg-white/[0.05] capitalize transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversation Thread */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {conversations.length === 0 ? (
              <div className="text-center py-12 text-white/30 text-sm">No messages yet</div>
            ) : (
              conversations.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="max-w-[70%]">
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'rounded-tl-sm text-white/80'
                          : 'rounded-tr-sm text-navy-900'
                      }`}
                      style={
                        msg.role === 'user'
                          ? { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }
                          : { background: 'linear-gradient(135deg, #C8A96E, #D4B97E)' }
                      }
                    >
                      {msg.message}
                    </div>
                    <p className={`text-xs mt-1 text-white/25 ${msg.role === 'assistant' ? 'text-right' : ''}`}>
                      {msg.role === 'assistant' ? 'NestIQ · ' : ''}{format(new Date(msg.timestamp), 'HH:mm · MMM d')}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Send Box */}
          <div className="flex-none px-6 py-4 border-t border-white/[0.06]">
            {sendError && (
              <p className="text-red-400 text-xs mb-2">{sendError}</p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void handleSend(); } }}
                placeholder="Type a message to send via WhatsApp..."
                className="input-field flex-1"
              />
              <button
                onClick={() => void handleSend()}
                disabled={!message.trim() || sending}
                className="btn-primary disabled:opacity-40"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                Send
              </button>
            </div>
            <p className="text-white/20 text-xs mt-2">
              Messages are sent directly via WhatsApp Business API
            </p>
          </div>
        </div>

        {/* Lead Info Sidebar */}
        <div
          className="flex-none w-64 border-l border-white/[0.06] overflow-y-auto"
          style={{ background: 'rgba(6,14,23,0.5)' }}
        >
          <div className="p-4 space-y-4">
            <h3 className="text-white/40 text-xs font-semibold uppercase tracking-wider">Lead Info</h3>

            <InfoRow icon={Phone} label="Phone" value={lead.whatsapp_number} />
            <InfoRow icon={DollarSign} label="Budget" value={lead.budget} />
            <InfoRow icon={MapPin} label="Location" value={lead.location} />
            <InfoRow icon={Home} label="Property" value={lead.property_type === 'unknown' ? null : lead.property_type} />
            <InfoRow icon={Clock} label="Timeline" value={lead.buying_timeline} />
            <InfoRow
              icon={Calendar}
              label="Mortgage"
              value={lead.needs_mortgage === null ? null : lead.needs_mortgage ? 'Yes' : 'No'}
            />

            <div className="pt-2 border-t border-white/[0.06]">
              <p className="text-white/25 text-xs">
                First contact:{' '}
                <span className="text-white/50">
                  {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                </span>
              </p>
              <p className="text-white/25 text-xs mt-1">
                Last active:{' '}
                <span className="text-white/50">
                  {formatDistanceToNow(new Date(lead.last_contact), { addSuffix: true })}
                </span>
              </p>
            </div>

            <a
              href={`https://wa.me/${lead.whatsapp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ExternalLink size={12} />
              Open in WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-white/30 text-xs mb-0.5 flex items-center gap-1.5">
        <Icon size={11} />
        {label}
      </p>
      <p className={`text-sm capitalize ${value ? 'text-white/80' : 'text-white/20 italic'}`}>
        {value ?? 'Not collected'}
      </p>
    </div>
  );
}
