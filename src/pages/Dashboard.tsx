import { useNavigate } from 'react-router-dom';
import { Map, Plus, TrendingUp, Globe, ChevronRight, Calendar, DollarSign, Star } from 'lucide-react';
import { useAuthStore, useTripStore } from '../store';
import { CITIES } from '../data/mockData';
import { StatCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { differenceInDays, parseISO, format, isAfter, isBefore } from 'date-fns';

const today = new Date();

function TripCard({ trip, onClick }: { trip: any; onClick: () => void }) {
  const start = parseISO(trip.startDate);
  const end = parseISO(trip.endDate);
  const daysUntil = differenceInDays(start, today);
  const duration = differenceInDays(end, start);
  const isUpcoming = isAfter(start, today);
  const isActive = !isAfter(start, today) && !isBefore(end, today);
  const isPast = isBefore(end, today);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#0d61a3]/20"
    >
      <div className="relative h-36 overflow-hidden">
        <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-3 right-3">
          {isUpcoming && <Badge variant="blue">{daysUntil === 0 ? 'Tomorrow!' : `${daysUntil}d away`}</Badge>}
          {isActive && <Badge variant="green">Active</Badge>}
          {isPast && <Badge variant="gray">Completed</Badge>}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-base leading-tight">{trip.name}</h3>
          <p className="text-white/80 text-xs mt-0.5">{trip.stops.length} cities · {duration} days</p>
        </div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Calendar size={13} className="text-[#94a3b8]" />
          <span className="text-xs text-[#64748b]">{format(start, 'MMM d')} – {format(end, 'MMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign size={13} className="text-[#94a3b8]" />
          <span className="text-xs font-semibold text-[#1e293b]">{trip.totalBudget.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const { trips } = useTripStore();
  const navigate = useNavigate();

  const userTrips = trips.filter(t => t.userId === user?.id);
  const upcomingTrips = userTrips.filter(t => isAfter(parseISO(t.startDate), today));
  const totalBudget = userTrips.reduce((s, t) => s + t.totalBudget, 0);
  const totalCities = userTrips.reduce((s, t) => s + t.stops.length, 0);

  const popularCities = CITIES.sort((a, b) => b.popularity - a.popularity).slice(0, 6);

  const getTimeOfDay = () => {
    const h = today.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col gap-6" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Hero greeting */}
      <div className="relative rounded-3xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1400&auto=format&fit=crop"
          alt="Travel"
          className="w-full h-52 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#012f61]/90 via-[#0d61a3]/80 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8">
          <div className="text-white">
            <p className="text-sm font-medium text-white/75 mb-1">{getTimeOfDay()},</p>
            <h2 className="text-3xl font-bold mb-2">{user?.name?.split(' ')[0]} ✈️</h2>
            <p className="text-white/75 text-sm mb-5">
              {upcomingTrips.length > 0
                ? `You have ${upcomingTrips.length} upcoming trip${upcomingTrips.length > 1 ? 's' : ''}. Ready to explore?`
                : 'Start planning your next adventure today!'}
            </p>
            <Button variant="coral" size="md" icon={<Plus size={16} />} onClick={() => navigate('/trips/new')}>
              Plan New Trip
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Trips" value={userTrips.length} icon={<Map size={20} />} color="blue" subtitle="All time" />
        <StatCard title="Upcoming" value={upcomingTrips.length} icon={<Calendar size={20} />} color="teal" subtitle="Planned trips" />
        <StatCard title="Cities Visited" value={totalCities} icon={<Globe size={20} />} color="coral" subtitle="Across all trips" />
        <StatCard title="Total Budget" value={`$${totalBudget.toLocaleString()}`} icon={<DollarSign size={20} />} color="gold" subtitle="All trips" />
      </div>

      {/* Upcoming trips */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1e293b]">Your Trips</h2>
          <button
            onClick={() => navigate('/trips')}
            className="flex items-center gap-1 text-sm text-[#0d61a3] font-medium hover:underline"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>
        {userTrips.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#e2e8f0] p-12 text-center">
            <Map size={40} className="text-[#cbd5e1] mx-auto mb-3" />
            <h3 className="text-base font-semibold text-[#1e293b] mb-1">No trips yet</h3>
            <p className="text-sm text-[#94a3b8] mb-5">Start planning your first adventure!</p>
            <Button icon={<Plus size={16} />} onClick={() => navigate('/trips/new')}>Plan a Trip</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userTrips.slice(0, 3).map(trip => (
              <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trips/${trip.id}`)} />
            ))}
          </div>
        )}
      </div>

      {/* Popular destinations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1e293b]">Popular Destinations</h2>
            <p className="text-xs text-[#94a3b8] mt-0.5">Discover trending cities around the world</p>
          </div>
          <button
            onClick={() => navigate('/cities')}
            className="flex items-center gap-1 text-sm text-[#0d61a3] font-medium hover:underline"
          >
            Explore all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularCities.map(city => (
            <div
              key={city.id}
              onClick={() => navigate('/cities')}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#e2e8f0] hover:border-[#0d61a3]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-24 overflow-hidden">
                <img src={city.image} alt={city.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <p className="text-white font-bold text-xs leading-tight">{city.name}</p>
                  <p className="text-white/75 text-[10px]">{city.country}</p>
                </div>
              </div>
              <div className="p-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-semibold text-[#64748b]">{(city.popularity / 20).toFixed(1)}</span>
                </div>
                <span className="text-[10px] text-[#94a3b8]">${city.avgDailyCost}/day</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: Plus, label: 'Plan New Trip', desc: 'Start a new adventure', from: '#0d61a3', to_color: '#00b4d8', path: '/trips/new' },
          { icon: Globe, label: 'Explore Cities', desc: 'Discover destinations', from: '#ff6b6b', to_color: '#ffb347', path: '/cities' },
          { icon: TrendingUp, label: 'Track Budget', desc: 'Manage your expenses', from: '#10b981', to_color: '#00b4d8', path: '/budget' },
        ].map(action => (
          <div
            key={action.label}
            onClick={() => navigate(action.path)}
            className="relative overflow-hidden rounded-2xl p-5 cursor-pointer group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
            style={{ background: `linear-gradient(135deg, ${action.from}, ${action.to_color})` }}
          >
            <div className="relative z-10 text-white">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <action.icon size={20} />
              </div>
              <p className="font-bold text-base mb-0.5">{action.label}</p>
              <p className="text-white/75 text-xs">{action.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
