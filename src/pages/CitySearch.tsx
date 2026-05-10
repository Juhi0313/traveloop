import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, DollarSign, Globe, Filter, MapPin, TrendingUp } from 'lucide-react';
import { CITIES } from '../data/mockData';
import { useAuthStore } from '../store';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const REGIONS = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Middle East', 'Oceania'];
export default function CitySearch() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [maxCost] = useState(5);
  const [sortBy, setSortBy] = useState<'popularity' | 'cost-asc' | 'cost-desc'>('popularity');
  const [savedIds, setSavedIds] = useState<string[]>(user?.savedDestinations ?? []);

  const filtered = CITIES
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase());
      const matchRegion = region === 'All' || c.region === region;
      const matchCost = c.costIndex <= maxCost;
      return matchSearch && matchRegion && matchCost;
    })
    .sort((a, b) => {
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      if (sortBy === 'cost-asc') return a.avgDailyCost - b.avgDailyCost;
      return b.avgDailyCost - a.avgDailyCost;
    });

  const toggleSave = (cityId: string) => {
    const updated = savedIds.includes(cityId) ? savedIds.filter(id => id !== cityId) : [...savedIds, cityId];
    setSavedIds(updated);
    updateUser({ savedDestinations: updated });
  };

  const costColor = (idx: number): 'green' | 'gold' | 'coral' => {
    if (idx <= 2) return 'green';
    if (idx <= 3) return 'gold';
    return 'coral';
  };

  return (
    <div className="flex flex-col gap-6" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#012f61] to-[#0d61a3] rounded-3xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={20} className="text-[#00b4d8]" />
          <p className="text-sm font-medium text-white/75">City Explorer</p>
        </div>
        <h2 className="text-2xl font-bold mb-3">Discover Your Next Destination</h2>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search cities or countries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white text-[#1e293b] placeholder:text-[#94a3b8] text-sm focus:outline-none shadow-lg"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={15} className="text-[#64748b]" />
          <span className="text-sm font-semibold text-[#334155]">Filters</span>
          <span className="ml-auto text-xs text-[#94a3b8]">{filtered.length} of {CITIES.length} cities</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Region */}
          <div className="flex-1">
            <p className="text-xs font-medium text-[#64748b] mb-2">Region</p>
            <div className="flex flex-wrap gap-1.5">
              {REGIONS.map(r => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${region === r ? 'bg-[#0d61a3] text-white' : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          {/* Sort */}
          <div>
            <p className="text-xs font-medium text-[#64748b] mb-2">Sort by</p>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-xl border border-[#e2e8f0] px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20"
            >
              <option value="popularity">Most Popular</option>
              <option value="cost-asc">Cost: Low to High</option>
              <option value="cost-desc">Cost: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cities grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Search size={40} className="text-[#cbd5e1] mx-auto mb-3" />
          <p className="text-[#64748b]">No cities found for your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(city => {
            const isSaved = savedIds.includes(city.id);
            return (
              <div key={city.id} className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#0d61a3]/20">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img src={city.image} alt={city.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Cost index */}
                  <div className="absolute top-3 left-3">
                    <Badge variant={costColor(city.costIndex)}>
                      {'$'.repeat(city.costIndex)}
                    </Badge>
                  </div>

                  {/* Save button */}
                  <button
                    onClick={() => toggleSave(city.id)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSaved ? 'bg-[#ff6b6b] text-white' : 'bg-white/80 backdrop-blur-sm text-[#64748b] hover:bg-white'
                    }`}
                  >
                    <Star size={14} className={isSaved ? 'fill-white' : ''} />
                  </button>

                  {/* City name */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-lg leading-tight">{city.name}</h3>
                    <p className="text-white/80 text-sm">{city.country} · {city.region}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-xs text-[#64748b] mb-3 line-clamp-2">{city.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className={i < Math.round(city.popularity / 20) ? 'text-amber-400 fill-amber-400' : 'text-[#e2e8f0]'} />
                        ))}
                      </div>
                      <span className="text-xs text-[#64748b]">{(city.popularity / 20).toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-[#1e293b]">
                      <DollarSign size={13} className="text-[#94a3b8]" />
                      {city.avgDailyCost}<span className="text-xs font-normal text-[#94a3b8]">/day</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      fullWidth
                      icon={<MapPin size={13} />}
                      onClick={() => navigate('/trips/new')}
                    >
                      Plan Trip
                    </Button>
                    <Button
                      size="sm"
                      variant={isSaved ? 'secondary' : 'ghost'}
                      icon={<Star size={13} className={isSaved ? 'fill-amber-400 text-amber-400' : ''} />}
                      onClick={() => toggleSave(city.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats banner */}
      <div className="bg-gradient-to-r from-[#ff6b6b] to-[#ffb347] rounded-3xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-1">Ready to explore?</h3>
            <p className="text-white/80 text-sm">Pick a destination and start building your dream itinerary</p>
          </div>
          <Button
            variant="secondary"
            icon={<TrendingUp size={16} />}
            onClick={() => navigate('/trips/new')}
          >
            Plan New Trip
          </Button>
        </div>
      </div>
    </div>
  );
}
