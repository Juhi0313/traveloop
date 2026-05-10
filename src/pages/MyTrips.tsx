import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Map, Calendar, DollarSign, Eye, Edit3, Trash2, Globe, Search } from 'lucide-react';
import { useAuthStore, useTripStore } from '../store';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import { format, parseISO, differenceInDays, isAfter, isBefore } from 'date-fns';

const today = new Date();

function getStatus(startDate: string, endDate: string) {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  if (isAfter(start, today)) return { label: 'Upcoming', variant: 'blue' as const };
  if (!isBefore(end, today)) return { label: 'Active', variant: 'green' as const };
  return { label: 'Completed', variant: 'gray' as const };
}

export default function MyTrips() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { trips, deleteTrip } = useTripStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const userTrips = trips.filter(t => t.userId === user?.id);

  const filtered = userTrips.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.stops.some(s => s.cityName.toLowerCase().includes(search.toLowerCase()));
    const start = parseISO(t.startDate);
    const end = parseISO(t.endDate);
    if (filter === 'upcoming') return matchSearch && isAfter(start, today);
    if (filter === 'past') return matchSearch && isBefore(end, today);
    return matchSearch;
  });

  const handleDelete = () => {
    if (deleteId) { deleteTrip(deleteId); setDeleteId(null); }
  };

  return (
    <div className="flex flex-col gap-6" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b]">My Trips</h2>
          <p className="text-sm text-[#64748b] mt-0.5">{userTrips.length} trip{userTrips.length !== 1 ? 's' : ''} planned</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => navigate('/trips/new')}>Plan New Trip</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search trips or cities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm bg-white text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3]"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'upcoming', 'past'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-[#0d61a3] text-white shadow-md'
                  : 'bg-white border border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Map size={28} />}
          title={search ? 'No trips found' : 'No trips yet'}
          description={search ? 'Try a different search term.' : 'Start planning your first adventure and see it here!'}
          actionLabel={!search ? 'Plan New Trip' : undefined}
          onAction={() => navigate('/trips/new')}
        />
      ) : (
        <div className="grid gap-4">
          {filtered.map(trip => {
            const start = parseISO(trip.startDate);
            const end = parseISO(trip.endDate);
            const duration = differenceInDays(end, start);
            const status = getStatus(trip.startDate, trip.endDate);
            return (
              <div key={trip.id} className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden hover:border-[#0d61a3]/20 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col sm:flex-row">
                  {/* Cover image */}
                  <div className="relative sm:w-52 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                    <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 sm:bg-gradient-to-b sm:from-transparent sm:to-black/30" />
                    <div className="absolute top-3 left-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    {trip.isPublic && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="teal"><Globe size={10} /> Public</Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-[#1e293b]">{trip.name}</h3>
                      </div>
                      {trip.description && (
                        <p className="text-sm text-[#64748b] mb-3 line-clamp-1">{trip.description}</p>
                      )}

                      {/* Cities */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {trip.stops.map(stop => (
                          <span key={stop.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f1f5f9] rounded-lg text-xs font-medium text-[#475569]">
                            {stop.cityName}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-[#64748b]">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#0d61a3]" />
                          {format(start, 'MMM d')} – {format(end, 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Map size={13} className="text-[#0d61a3]" />
                          {duration} days · {trip.stops.length} cities
                        </span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign size={13} className="text-[#0d61a3]" />
                          ${trip.totalBudget.toLocaleString()} budget
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#f1f5f9]">
                      <Button
                        size="sm"
                        variant="primary"
                        icon={<Eye size={14} />}
                        onClick={() => navigate(`/trips/${trip.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<Edit3 size={14} />}
                        onClick={() => navigate(`/trips/${trip.id}/builder`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<DollarSign size={14} />}
                        onClick={() => navigate(`/budget?trip=${trip.id}`)}
                      >
                        Budget
                      </Button>
                      <div className="ml-auto">
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<Trash2 size={14} />}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setDeleteId(trip.id)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Trip"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Trip</Button>
          </>
        }
      >
        <p className="text-[#64748b]">
          Are you sure you want to delete this trip? This action cannot be undone and all itinerary data will be permanently removed.
        </p>
      </Modal>
    </div>
  );
}
