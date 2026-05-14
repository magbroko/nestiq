import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, Phone, Video, X, RefreshCw } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { Appointment } from '../types';
import { fetchAppointments, cancelAppointment } from '../api';
import StatusBadge from '../components/StatusBadge';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { appointments: data } = await fetchAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this appointment? The calendar event will also be removed.')) return;
    setCancellingId(id);
    try {
      await cancelAppointment(id);
      await load();
    } catch (err) {
      console.error('Failed to cancel:', err);
    } finally {
      setCancellingId(null);
    }
  };

  function getDateLabel(datetime: string): { label: string; highlight: boolean } {
    const date = new Date(datetime);
    if (isPast(date)) return { label: 'Past', highlight: false };
    if (isToday(date)) return { label: 'Today', highlight: true };
    if (isTomorrow(date)) return { label: 'Tomorrow', highlight: true };
    return { label: format(date, 'EEE, MMM d'), highlight: false };
  }

  const upcoming = appointments.filter((a) => a.status !== 'cancelled' && !isPast(new Date(a.datetime)));
  const past = appointments.filter((a) => a.status === 'cancelled' || isPast(new Date(a.datetime)));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Appointments</h1>
          <p className="text-sm text-white/40 mt-0.5">{upcoming.length} upcoming inspections</p>
        </div>
        <button onClick={() => void load()} className="btn-secondary" disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar size={40} className="mx-auto text-white/10 mb-4" />
          <p className="text-white/30 text-sm">No appointments booked yet</p>
          <p className="text-white/20 text-xs mt-1">Appointments appear here when buyers book inspections via WhatsApp</p>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">
                Upcoming ({upcoming.length})
              </h2>
              <div className="space-y-3">
                {upcoming.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    dateLabel={getDateLabel(appt.datetime)}
                    onCancel={() => void handleCancel(appt.id)}
                    cancelling={cancellingId === appt.id}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Past / Cancelled */}
          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">
                Past & Cancelled ({past.length})
              </h2>
              <div className="space-y-3 opacity-60">
                {past.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    dateLabel={getDateLabel(appt.datetime)}
                    onCancel={() => void handleCancel(appt.id)}
                    cancelling={cancellingId === appt.id}
                    dimmed
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function AppointmentCard({
  appointment: a,
  dateLabel,
  onCancel,
  cancelling,
  dimmed = false,
}: {
  appointment: Appointment;
  dateLabel: { label: string; highlight: boolean };
  onCancel: () => void;
  cancelling: boolean;
  dimmed?: boolean;
}) {
  const dt = new Date(a.datetime);
  const leadName = a.leads?.name ?? 'Unknown Buyer';
  const leadPhone = a.leads?.whatsapp_number ?? '';

  return (
    <div className={`card p-4 flex items-start gap-4 ${dimmed ? '' : 'hover:border-gold-500/20 transition-colors'}`}>
      {/* Date Block */}
      <div
        className="flex-none w-14 h-14 rounded-lg flex flex-col items-center justify-center text-center"
        style={{
          background: dateLabel.highlight ? 'rgba(200,169,110,0.1)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${dateLabel.highlight ? 'rgba(200,169,110,0.3)' : 'rgba(255,255,255,0.07)'}`,
        }}
      >
        <span className={`text-xs font-semibold ${dateLabel.highlight ? 'text-gold-500' : 'text-white/40'}`}>
          {format(dt, 'MMM').toUpperCase()}
        </span>
        <span className={`text-xl font-bold leading-none ${dateLabel.highlight ? 'text-gold-400' : 'text-white/70'}`}>
          {format(dt, 'd')}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-white/90 font-semibold text-sm">Property Inspection — {leadName}</h3>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1 text-xs text-white/40">
                <Clock size={11} />
                {format(dt, 'HH:mm')}
                {dateLabel.highlight && (
                  <span className="ml-1 text-gold-500 font-semibold">({dateLabel.label})</span>
                )}
              </div>
              {a.property_address && a.property_address !== 'TBD — Agent will confirm' && (
                <div className="flex items-center gap-1 text-xs text-white/40">
                  <MapPin size={11} />
                  {a.property_address}
                </div>
              )}
              {leadPhone && (
                <div className="flex items-center gap-1 text-xs text-white/40">
                  <Phone size={11} />
                  {leadPhone}
                </div>
              )}
            </div>
          </div>
          <StatusBadge status={a.status} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          {a.calendar_meet_link && (
            <a
              href={a.calendar_meet_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors"
            >
              <Video size={12} />
              Join Meet
            </a>
          )}
          {a.status === 'confirmed' && (
            <button
              onClick={onCancel}
              disabled={cancelling}
              className="btn-danger py-1.5 text-xs"
            >
              {cancelling ? (
                <div className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
              ) : (
                <X size={12} />
              )}
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
