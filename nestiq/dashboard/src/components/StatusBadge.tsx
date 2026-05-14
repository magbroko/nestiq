import { LeadStatus, AppointmentStatus } from '../types';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  new: { label: 'New', bg: 'bg-indigo-500/10', text: 'text-indigo-400', dot: 'bg-indigo-400' },
  qualifying: { label: 'Qualifying', bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  qualified: { label: 'Qualified', bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  booked: { label: 'Booked', bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  closed: { label: 'Closed', bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' },
  confirmed: { label: 'Confirmed', bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  pending: { label: 'Pending', bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
  completed: { label: 'Completed', bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' },
};

interface Props {
  status: LeadStatus | AppointmentStatus;
}

export default function StatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.new;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
