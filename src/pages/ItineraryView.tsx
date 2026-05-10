import { useState, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit3, Calendar, MapPin, Clock, LayoutList, CalendarDays, Globe, ChevronRight, Share2 } from 'lucide-react';
import { useTripStore } from '../store';
import Button from '../components/ui/Button';
import Badge, { activityTypeColors } from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { format, parseISO, differenceInDays, eachDayOfInterval } from 'date-fns';

export default function ItineraryView() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { getTrip } = useTripStore();
  const trip = getTrip(tripId!);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [copied, setCopied] = useState(false);

  if (!trip) return (
    <EmptyState icon={<MapPin size={28} />} title="Trip not found" description="This trip doesn't exist." actionLabel="Back to trips" onAction={() => navigate('/trips')} />
  );

  const totalDays = differenceInDays(parseISO(trip.endDate), parseISO(trip.startDate));
  const totalActivitiesCost = trip.stops.reduce((s, st) => s + st.activities.reduce((a, ac) => a + ac.cost, 0), 0);
  const totalStayCost = trip.stops.reduce((s, st) => s + st.accommodation, 0);
  const totalTransport = trip.stops.reduce((s, st) => s + st.transport, 0);
  const totalMeals = trip.stops.reduce((s, st) => s + st.meals, 0);
  const totalEstimated = totalActivitiesCost + totalStayCost + totalTransport + totalMeals;

  const handleShare = () => {
    const url = `${window.location.origin}/shared/${trip.id}`;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  // Build calendar days
  const allDays = eachDayOfInterval({ start: parseISO(trip.startDate), end: parseISO(trip.endDate) });

  const getStopForDay = (day: Date) => {
    return trip.stops.find(s => {
      const start = parseISO(s.startDate);
      const end = parseISO(s.endDate);
      return day >= start && day < end;
    });
  };

  return (
    <div className="flex flex-col gap-6" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden h-56">
        <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#012f61]/90 via-[#0d61a3]/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {trip.tags.map(tag => (
                <span key={tag} className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">#{tag}</span>
              ))}
              {trip.isPublic && (
                <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center gap-1">
                  <Globe size={10} /> Public
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" icon={<Edit3 size={14} />} onClick={() => navigate(`/trips/${trip.id}/builder`)}>Edit</Button>
              <Button size="sm" variant="coral" icon={copied ? undefined : <Share2 size={14} />} onClick={handleShare}>
                {copied ? 'Copied!' : 'Share'}
              </Button>
            </div>
          </div>
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-1">{trip.name}</h1>
            {trip.description && <p className="text-white/80 text-sm">{trip.description}</p>}
            <div className="flex items-center gap-4 mt-2 text-sm text-white/80">
              <span className="flex items-center gap-1.5"><Calendar size={14} />{format(parseISO(trip.startDate), 'MMM d')} – {format(parseISO(trip.endDate), 'MMM d, yyyy')}</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} />{trip.stops.length} cities</span>
              <span className="flex items-center gap-1.5"><Clock size={14} />{totalDays} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Budget', value: `$${trip.totalBudget.toLocaleString()}`, sub: 'budgeted', color: 'bg-blue-50 text-blue-700 border-blue-100' },
          { label: 'Estimated Cost', value: `$${totalEstimated.toLocaleString()}`, sub: 'projected', color: 'bg-teal-50 text-teal-700 border-teal-100' },
          { label: 'Activities', value: `$${totalActivitiesCost.toLocaleString()}`, sub: 'activities cost', color: 'bg-amber-50 text-amber-700 border-amber-100' },
          { label: 'Avg Per Day', value: `$${totalDays > 0 ? Math.round(totalEstimated / totalDays) : 0}`, sub: 'daily average', color: 'bg-coral-50 text-coral-700 border-coral-100' },
        ].map(s => (
          <div key={s.label} className={`p-4 rounded-2xl border ${s.color}`}>
            <p className="text-xs font-medium opacity-70 mb-1">{s.label}</p>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs opacity-60">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* City journey */}
      <div>
        <h3 className="text-base font-bold text-[#1e293b] mb-3">Journey Route</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {trip.stops.map((stop, idx) => (
            <Fragment key={stop.id}>
              <div className="flex-shrink-0 bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden w-32 shadow-sm">
                <div className="relative h-16">
                  <img src={stop.image} alt={stop.cityName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-1 left-2 text-white font-bold text-xs">{stop.cityName}</span>
                </div>
                <div className="p-2">
                  <p className="text-[10px] text-[#94a3b8]">{format(parseISO(stop.startDate), 'MMM d')} – {format(parseISO(stop.endDate), 'MMM d')}</p>
                  <p className="text-[10px] font-semibold text-[#475569]">{stop.activities.length} activities</p>
                </div>
              </div>
              {idx < trip.stops.length - 1 && (
                <ChevronRight size={16} className="text-[#94a3b8] flex-shrink-0" />
              )}
            </Fragment>
          ))}
        </div>
      </div>

      {/* View toggle */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#1e293b]">Detailed Itinerary</h3>
          <div className="flex gap-1 p-1 bg-[#f1f5f9] rounded-xl">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'list' ? 'bg-white text-[#1e293b] shadow-sm' : 'text-[#64748b] hover:text-[#1e293b]'}`}
            >
              <LayoutList size={14} /> List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'calendar' ? 'bg-white text-[#1e293b] shadow-sm' : 'text-[#64748b] hover:text-[#1e293b]'}`}
            >
              <CalendarDays size={14} /> Calendar
            </button>
          </div>
        </div>

        {trip.stops.length === 0 ? (
          <EmptyState
            icon={<MapPin size={28} />}
            title="No itinerary yet"
            description="Add cities and activities in the builder."
            actionLabel="Open Builder"
            onAction={() => navigate(`/trips/${trip.id}/builder`)}
          />
        ) : view === 'list' ? (
          <div className="flex flex-col gap-4">
            {trip.stops.map((stop, idx) => {
              const days = differenceInDays(parseISO(stop.endDate), parseISO(stop.startDate));
              const stopTotal = stop.accommodation + stop.transport + stop.meals + stop.activities.reduce((a, ac) => a + ac.cost, 0);
              return (
                <div key={stop.id} className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                  {/* Stop header */}
                  <div className="relative h-32 overflow-hidden">
                    <img src={stop.image} alt={stop.cityName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                    <div className="absolute inset-0 flex items-center px-5">
                      <div className="text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-6 h-6 rounded-full bg-[#ff6b6b] flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                          <h3 className="text-xl font-bold">{stop.cityName}</h3>
                          <span className="text-white/70 text-sm">{stop.country}</span>
                        </div>
                        <p className="text-white/80 text-sm">{format(parseISO(stop.startDate), 'MMM d')} – {format(parseISO(stop.endDate), 'MMM d, yyyy')} · {days} days</p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl text-white text-sm font-bold">
                      ${stopTotal.toLocaleString()}
                    </div>
                  </div>

                  {/* Cost breakdown */}
                  <div className="grid grid-cols-4 divide-x divide-[#f1f5f9] border-b border-[#f1f5f9]">
                    {[
                      { label: 'Stay', value: stop.accommodation },
                      { label: 'Transport', value: stop.transport },
                      { label: 'Meals', value: stop.meals },
                      { label: 'Activities', value: stop.activities.reduce((a, ac) => a + ac.cost, 0) },
                    ].map(item => (
                      <div key={item.label} className="p-3 text-center">
                        <p className="text-xs text-[#94a3b8]">{item.label}</p>
                        <p className="text-sm font-bold text-[#1e293b]">${item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Activities */}
                  {stop.activities.length > 0 && (
                    <div className="p-4">
                      <h4 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wide mb-3">Activities</h4>
                      <div className="flex flex-col gap-2">
                        {stop.activities.sort((a, b) => (a.time || '').localeCompare(b.time || '')).map(act => (
                          <div key={act.id} className="flex items-center gap-3">
                            {act.time && (
                              <span className="text-xs font-mono text-[#94a3b8] w-10 flex-shrink-0">{act.time}</span>
                            )}
                            <div className="flex-1 flex items-center gap-3 p-2.5 bg-[#f8fafc] rounded-xl border border-[#f1f5f9]">
                              <img src={act.image} alt={act.name} className="w-10 h-8 rounded-lg object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#1e293b] truncate">{act.name}</p>
                                <p className="text-xs text-[#94a3b8]">{act.duration}h · ${act.cost}</p>
                              </div>
                              <Badge variant={activityTypeColors[act.type] ?? 'gray'}>{act.type}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Calendar view
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="grid divide-y divide-[#f1f5f9]">
              {allDays.map((day, idx) => {
                const stop = getStopForDay(day);
                const dayActivities = stop?.activities.filter(() => true) ?? [];
                const isFirst = stop ? format(day, 'yyyy-MM-dd') === stop.startDate : false;
                return (
                  <div key={idx} className={`flex gap-4 p-4 ${stop ? '' : 'opacity-50'}`}>
                    <div className="w-14 flex-shrink-0 text-center">
                      <p className="text-xs text-[#94a3b8] font-medium">{format(day, 'EEE')}</p>
                      <p className="text-xl font-bold text-[#1e293b]">{format(day, 'd')}</p>
                      <p className="text-xs text-[#94a3b8]">{format(day, 'MMM')}</p>
                    </div>
                    <div className="flex-1">
                      {stop && (
                        <>
                          {isFirst && (
                            <div className="flex items-center gap-2 mb-2">
                              <img src={stop.image} alt={stop.cityName} className="w-6 h-5 rounded object-cover" />
                              <span className="text-sm font-bold text-[#0d61a3]">Arrive {stop.cityName}, {stop.country}</span>
                            </div>
                          )}
                          {dayActivities.length > 0 && idx === 0 && (
                            <div className="flex flex-col gap-1.5">
                              {dayActivities.slice(0, 2).map(act => (
                                <div key={act.id} className="flex items-center gap-2 text-sm text-[#475569]">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#0d61a3] flex-shrink-0" />
                                  {act.time && <span className="text-xs text-[#94a3b8]">{act.time}</span>}
                                  <span className="truncate">{act.name}</span>
                                  <span className="text-xs text-[#94a3b8] ml-auto">${act.cost}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {!isFirst && dayActivities.length === 0 && (
                            <p className="text-sm text-[#94a3b8]">Free day in {stop.cityName}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
