import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, ChevronDown, ChevronUp, MapPin, Calendar, DollarSign, Eye, Search } from 'lucide-react';
import { useTripStore } from '../store';
import { CITIES, ACTIVITIES } from '../data/mockData';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge, { activityTypeColors } from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { format, parseISO, differenceInDays } from 'date-fns';

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { getTrip, addStop, deleteStop, addActivity, removeActivity, updateStop } = useTripStore();
  const trip = getTrip(tripId!);

  const [addStopOpen, setAddStopOpen] = useState(false);
  const [activityModalStopId, setActivityModalStopId] = useState<string | null>(null);
  const [expandedStop, setExpandedStop] = useState<string | null>(trip?.stops[0]?.id ?? null);
  const [citySearch, setCitySearch] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [stopStart, setStopStart] = useState('');
  const [stopEnd, setStopEnd] = useState('');
  const [activitySearch, setActivitySearch] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');

  if (!trip) return (
    <EmptyState icon={<MapPin size={28} />} title="Trip not found" description="This trip doesn't exist." actionLabel="Back to trips" onAction={() => navigate('/trips')} />
  );

  const filteredCities = CITIES.filter(c =>
    c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    c.country.toLowerCase().includes(citySearch.toLowerCase())
  );

  const selectedCity = CITIES.find(c => c.id === selectedCityId);
  const stopCity = activityModalStopId ? trip.stops.find(s => s.id === activityModalStopId) : null;
  const availableActivities = ACTIVITIES.filter(a => {
    const matchCity = a.cityId === stopCity?.cityId;
    const matchSearch = a.name.toLowerCase().includes(activitySearch.toLowerCase());
    const matchFilter = activityFilter === 'all' || a.type === activityFilter;
    return matchCity && matchSearch && matchFilter;
  });

  const handleAddStop = () => {
    if (!selectedCityId || !stopStart || !stopEnd) return;
    const city = CITIES.find(c => c.id === selectedCityId)!;
    addStop(trip.id, {
      cityId: city.id,
      cityName: city.name,
      country: city.country,
      countryCode: city.id.toUpperCase(),
      image: city.image,
      startDate: stopStart,
      endDate: stopEnd,
      activities: [],
      accommodation: Math.round(city.avgDailyCost * 0.5),
      transport: 80,
      meals: Math.round(city.avgDailyCost * 0.3),
      order: trip.stops.length,
    });
    setAddStopOpen(false);
    setCitySearch(''); setSelectedCityId(''); setStopStart(''); setStopEnd('');
  };

  const handleAddActivity = (act: typeof ACTIVITIES[0]) => {
    if (!activityModalStopId) return;
    const already = trip.stops.find(s => s.id === activityModalStopId)?.activities.find(a => a.name === act.name);
    if (already) return;
    addActivity(trip.id, activityModalStopId, {
      name: act.name,
      type: act.type,
      cost: act.cost,
      duration: act.duration,
      description: act.description,
      image: act.image,
      time: '10:00',
    });
  };

  const totalCost = trip.stops.reduce((sum, s) =>
    sum + s.accommodation + s.transport + s.meals + s.activities.reduce((a, ac) => a + ac.cost, 0), 0
  );

  return (
    <div className="flex flex-col gap-6" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-[#94a3b8] font-medium uppercase tracking-wide mb-1">Itinerary Builder</p>
          <h2 className="text-2xl font-bold text-[#1e293b]">{trip.name}</h2>
          <div className="flex items-center gap-3 mt-1 text-sm text-[#64748b]">
            <span className="flex items-center gap-1"><Calendar size={13} /> {format(parseISO(trip.startDate), 'MMM d')} – {format(parseISO(trip.endDate), 'MMM d, yyyy')}</span>
            <span className="flex items-center gap-1"><MapPin size={13} /> {trip.stops.length} stops</span>
            <span className="flex items-center gap-1"><DollarSign size={13} /> ${totalCost.toLocaleString()} estimated</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Eye size={15} />} onClick={() => navigate(`/trips/${trip.id}`)}>Preview</Button>
          <Button icon={<Plus size={15} />} onClick={() => setAddStopOpen(true)}>Add City</Button>
        </div>
      </div>

      {/* Progress bar */}
      {trip.totalBudget > 0 && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#334155]">Budget Usage</span>
            <span className="text-sm font-bold text-[#1e293b]">${totalCost.toLocaleString()} / ${trip.totalBudget.toLocaleString()}</span>
          </div>
          <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${totalCost > trip.totalBudget ? 'bg-red-500' : 'bg-gradient-to-r from-[#0d61a3] to-[#00b4d8]'}`}
              style={{ width: `${Math.min(100, (totalCost / trip.totalBudget) * 100)}%` }}
            />
          </div>
          {totalCost > trip.totalBudget && (
            <p className="text-xs text-red-500 mt-1.5 font-medium">⚠ Over budget by ${(totalCost - trip.totalBudget).toLocaleString()}</p>
          )}
        </div>
      )}

      {/* Stops */}
      {trip.stops.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#e2e8f0] p-12 text-center">
          <MapPin size={40} className="text-[#cbd5e1] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#1e293b] mb-2">No cities added yet</h3>
          <p className="text-sm text-[#94a3b8] mb-5">Add your first destination to start building your itinerary.</p>
          <Button icon={<Plus size={16} />} onClick={() => setAddStopOpen(true)}>Add First City</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {trip.stops.map((stop, idx) => {
            const days = differenceInDays(parseISO(stop.endDate), parseISO(stop.startDate));
            const stopCost = stop.accommodation + stop.transport + stop.meals + stop.activities.reduce((a, ac) => a + ac.cost, 0);
            const isExpanded = expandedStop === stop.id;

            return (
              <div key={stop.id} className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                {/* Stop header */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[#f8fafc] transition-colors"
                  onClick={() => setExpandedStop(isExpanded ? null : stop.id)}
                >
                  {/* Order badge */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0d61a3] to-[#00b4d8] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {idx + 1}
                  </div>
                  {/* City image */}
                  <div className="w-16 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={stop.image} alt={stop.cityName} className="w-full h-full object-cover" />
                  </div>
                  {/* City info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[#1e293b]">{stop.cityName}</h3>
                      <span className="text-xs text-[#94a3b8]">{stop.country}</span>
                    </div>
                    <p className="text-xs text-[#64748b]">
                      {format(parseISO(stop.startDate), 'MMM d')} – {format(parseISO(stop.endDate), 'MMM d')} · {days} days · {stop.activities.length} activities
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-[#1e293b]">${stopCost.toLocaleString()}</p>
                    <p className="text-xs text-[#94a3b8]">est. cost</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={e => { e.stopPropagation(); deleteStop(trip.id, stop.id); }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-[#94a3b8] hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                    {isExpanded ? <ChevronUp size={16} className="text-[#94a3b8]" /> : <ChevronDown size={16} className="text-[#94a3b8]" />}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-[#f1f5f9] p-4">
                    {/* Budget inputs */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Accommodation', key: 'accommodation', value: stop.accommodation },
                        { label: 'Transport', key: 'transport', value: stop.transport },
                        { label: 'Meals', key: 'meals', value: stop.meals },
                      ].map(field => (
                        <div key={field.key}>
                          <label className="text-xs font-semibold text-[#64748b] block mb-1">{field.label} ($)</label>
                          <input
                            type="number"
                            value={field.value}
                            onChange={e => updateStop(trip.id, stop.id, { [field.key]: Number(e.target.value) })}
                            className="w-full rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3]"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Activities */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-[#334155]">Activities</h4>
                        <Button size="sm" variant="outline" icon={<Plus size={13} />} onClick={() => setActivityModalStopId(stop.id)}>
                          Add Activity
                        </Button>
                      </div>
                      {stop.activities.length === 0 ? (
                        <div className="text-center py-6 bg-[#f8fafc] rounded-xl border border-dashed border-[#e2e8f0]">
                          <p className="text-sm text-[#94a3b8]">No activities added. Click "Add Activity" to explore things to do!</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {stop.activities.map(act => (
                            <div key={act.id} className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] hover:border-[#0d61a3]/20 transition-colors group">
                              <div className="w-12 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={act.image} alt={act.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <p className="text-sm font-semibold text-[#1e293b] truncate">{act.name}</p>
                                  <Badge variant={activityTypeColors[act.type] ?? 'gray'}>{act.type}</Badge>
                                </div>
                                <p className="text-xs text-[#64748b]">${act.cost} · {act.duration}h</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={act.time || '10:00'}
                                  onChange={e => {
                                    const updated = { ...stop, activities: stop.activities.map(a => a.id === act.id ? { ...a, time: e.target.value } : a) };
                                    updateStop(trip.id, stop.id, { activities: updated.activities });
                                  }}
                                  className="text-xs rounded-lg border border-[#e2e8f0] px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#0d61a3]/30"
                                />
                                <button
                                  onClick={() => removeActivity(trip.id, stop.id, act.id)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-[#94a3b8] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Stop Modal */}
      <Modal open={addStopOpen} onClose={() => { setAddStopOpen(false); setSelectedCityId(''); setCitySearch(''); }} title="Add City to Itinerary" size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddStopOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStop} disabled={!selectedCityId || !stopStart || !stopEnd}>Add City</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {!selectedCityId ? (
            <>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={citySearch}
                  onChange={e => setCitySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
                {filteredCities.map(city => (
                  <div
                    key={city.id}
                    onClick={() => setSelectedCityId(city.id)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[#e2e8f0] cursor-pointer hover:border-[#0d61a3]/40 hover:bg-[#f8fafc] transition-all"
                  >
                    <img src={city.image} alt={city.name} className="w-12 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1e293b] truncate">{city.name}</p>
                      <p className="text-xs text-[#94a3b8]">{city.country} · ${city.avgDailyCost}/day</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 p-3 bg-[#e8f4fc] rounded-xl">
                <img src={selectedCity?.image} alt={selectedCity?.name} className="w-14 h-10 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-bold text-[#1e293b]">{selectedCity?.name}</p>
                  <p className="text-xs text-[#64748b]">{selectedCity?.country} · ~${selectedCity?.avgDailyCost}/day avg cost</p>
                </div>
                <button onClick={() => setSelectedCityId('')} className="text-sm text-[#0d61a3] hover:underline">Change</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#334155] block mb-1.5">Arrival Date</label>
                  <input type="date" value={stopStart} onChange={e => setStopStart(e.target.value)}
                    className="w-full rounded-xl border border-[#e2e8f0] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3]" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#334155] block mb-1.5">Departure Date</label>
                  <input type="date" value={stopEnd} onChange={e => setStopEnd(e.target.value)}
                    className="w-full rounded-xl border border-[#e2e8f0] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3]" />
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Activity Modal */}
      <Modal open={!!activityModalStopId} onClose={() => { setActivityModalStopId(null); setActivitySearch(''); }} title={`Add Activities — ${stopCity?.cityName}`} size="xl">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input type="text" placeholder="Search activities..." value={activitySearch} onChange={e => setActivitySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3]" />
            </div>
            <select value={activityFilter} onChange={e => setActivityFilter(e.target.value)}
              className="rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20">
              <option value="all">All Types</option>
              {['sightseeing', 'food', 'adventure', 'culture', 'nature', 'shopping', 'nightlife'].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          {availableActivities.length === 0 ? (
            <div className="text-center py-8 text-[#94a3b8]">
              <p className="text-sm">No activities found for {stopCity?.cityName}.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
              {availableActivities.map(act => {
                const added = stopCity?.activities.some(a => a.name === act.name);
                return (
                  <div key={act.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${added ? 'border-[#0d61a3]/30 bg-[#e8f4fc]' : 'border-[#e2e8f0] hover:border-[#0d61a3]/30 hover:bg-[#f8fafc]'}`}>
                    <img src={act.image} alt={act.name} className="w-14 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-[#1e293b] truncate">{act.name}</p>
                        <Badge variant={activityTypeColors[act.type] ?? 'gray'}>{act.type}</Badge>
                      </div>
                      <p className="text-xs text-[#64748b] line-clamp-1">{act.description}</p>
                      <p className="text-xs text-[#94a3b8] mt-0.5">${act.cost} · {act.duration}h · ★{act.rating}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={added ? 'secondary' : 'primary'}
                      onClick={() => !added && handleAddActivity(act)}
                      disabled={added}
                    >
                      {added ? 'Added' : 'Add'}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
