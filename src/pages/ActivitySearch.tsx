import { useState } from 'react';
import { Search, Star, DollarSign, Clock, Filter, Zap } from 'lucide-react';
import { ACTIVITIES, CITIES } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import Badge, { activityTypeColors } from '../components/ui/Badge';
import Button from '../components/ui/Button';

const TYPES = ['all', 'sightseeing', 'food', 'adventure', 'culture', 'nature', 'shopping', 'nightlife'];

export default function ActivitySearch() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [maxCost, setMaxCost] = useState(200);
  const [sortBy, setSortBy] = useState<'rating' | 'cost-asc' | 'cost-desc' | 'duration'>('rating');
  const [selectedCity, setSelectedCity] = useState('all');

  const filtered = ACTIVITIES
    .filter(a => {
      const city = CITIES.find(c => c.id === a.cityId);
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || city?.name.toLowerCase().includes(search.toLowerCase());
      const matchType = type === 'all' || a.type === type;
      const matchCost = a.cost <= maxCost;
      const matchCity = selectedCity === 'all' || a.cityId === selectedCity;
      return matchSearch && matchType && matchCost && matchCity;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'cost-asc') return a.cost - b.cost;
      if (sortBy === 'cost-desc') return b.cost - a.cost;
      return a.duration - b.duration;
    });

  return (
    <div className="flex flex-col gap-6" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff6b6b] to-[#ffb347] rounded-3xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={18} className="text-white/80" />
          <p className="text-sm font-medium text-white/80">Activity Explorer</p>
        </div>
        <h2 className="text-2xl font-bold mb-3">Find Unforgettable Experiences</h2>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search activities or cities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white text-[#1e293b] placeholder:text-[#94a3b8] text-sm focus:outline-none shadow-lg"
          />
        </div>
      </div>

      {/* Type filters */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-[#64748b]" />
            <span className="text-sm font-semibold text-[#334155]">Filters</span>
          </div>
          <span className="text-xs text-[#94a3b8]">{filtered.length} activities</span>
        </div>

        {/* Activity types */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                type === t ? 'bg-[#ff6b6b] text-white' : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
              }`}
            >
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* City filter */}
          <div className="flex-1">
            <label className="text-xs font-medium text-[#64748b] block mb-1.5">Filter by City</label>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20"
            >
              <option value="all">All Cities</option>
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}, {c.country}</option>)}
            </select>
          </div>
          {/* Max cost */}
          <div className="flex-1">
            <label className="text-xs font-medium text-[#64748b] block mb-1.5">Max Cost: ${maxCost}</label>
            <input
              type="range"
              min={0}
              max={200}
              value={maxCost}
              onChange={e => setMaxCost(Number(e.target.value))}
              className="w-full accent-[#ff6b6b]"
            />
          </div>
          {/* Sort */}
          <div>
            <label className="text-xs font-medium text-[#64748b] block mb-1.5">Sort by</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20"
            >
              <option value="rating">Highest Rated</option>
              <option value="cost-asc">Price: Low to High</option>
              <option value="cost-desc">Price: High to Low</option>
              <option value="duration">Shortest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Search size={40} className="text-[#cbd5e1] mx-auto mb-3" />
          <p className="text-[#64748b]">No activities match your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(activity => {
            const city = CITIES.find(c => c.id === activity.cityId);
            return (
              <div key={activity.id} className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#ff6b6b]/20">
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img src={activity.image} alt={activity.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant={activityTypeColors[activity.type] ?? 'gray'}>{activity.type}</Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-sm leading-tight">{activity.name}</h3>
                    {city && <p className="text-white/75 text-xs">{city.name}, {city.country}</p>}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-xs text-[#64748b] mb-3 line-clamp-2">{activity.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 text-xs text-[#64748b]">
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-[#94a3b8]" /> {activity.duration}h
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={12} className="text-[#94a3b8]" /> ${activity.cost}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-[#1e293b]">{activity.rating}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="coral"
                    fullWidth
                    onClick={() => navigate('/trips/new')}
                  >
                    Add to Trip
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
