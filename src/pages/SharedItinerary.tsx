import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Globe, Copy, MapPin, Calendar, Clock, Star, Check, ChevronRight } from 'lucide-react';
import { useTripStore, useAuthStore } from '../store';
import Badge, { activityTypeColors } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { format, parseISO, differenceInDays } from 'date-fns';

export default function SharedItinerary() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { getTrip, addTrip } = useTripStore();
  const { user, isAuthenticated } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [tripCopied, setTripCopied] = useState(false);

  const trip = getTrip(tripId!);

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#f1f5f9] flex items-center justify-center text-[#94a3b8] mx-auto mb-4">
            <MapPin size={28} />
          </div>
          <h2 className="text-xl font-bold text-[#1e293b] mb-2">Trip not found</h2>
          <p className="text-[#64748b] text-sm mb-5">This itinerary may be private or doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const totalDays = differenceInDays(parseISO(trip.endDate), parseISO(trip.startDate));
  const totalActivities = trip.stops.reduce((s, st) => s + st.activities.length, 0);
  const totalEstimated = trip.stops.reduce((s, st) => s + st.accommodation + st.transport + st.meals + st.activities.reduce((a, ac) => a + ac.cost, 0), 0);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyTrip = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    addTrip({
      userId: user!.id,
      name: `Copy of ${trip.name}`,
      description: trip.description,
      startDate: trip.startDate,
      endDate: trip.endDate,
      coverImage: trip.coverImage,
      isPublic: false,
      stops: trip.stops.map(s => ({ ...s, id: Math.random().toString(36).substring(2, 9) })),
      notes: [],
      packingList: [],
      totalBudget: trip.totalBudget,
      currency: trip.currency,
      tags: trip.tags,
    });
    setTripCopied(true);
    setTimeout(() => navigate('/trips'), 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navbar */}
      <nav className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0d61a3] to-[#00b4d8] flex items-center justify-center">
            <Globe size={16} className="text-white" />
          </div>
          <span className="font-bold text-[#1e293b]">Traveloop</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" icon={copied ? <Check size={14} /> : <Copy size={14} />} onClick={handleShare}>
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button size="sm" variant="coral" icon={tripCopied ? <Check size={14} /> : <Copy size={14} />} onClick={handleCopyTrip}>
            {tripCopied ? 'Saved!' : 'Copy Trip'}
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden h-64 mb-8" style={{ animation: 'fadeIn 0.4s ease-out' }}>
          <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#012f61]/90 via-[#0d61a3]/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between p-8">
            <div className="flex flex-wrap gap-2">
              {trip.tags.map(tag => (
                <span key={tag} className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">#{tag}</span>
              ))}
              <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center gap-1">
                <Globe size={10} /> Public Itinerary
              </span>
            </div>
            <div className="text-white">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">{trip.name}</h1>
              {trip.description && <p className="text-white/80 text-sm mb-3">{trip.description}</p>}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <span className="flex items-center gap-1.5"><Calendar size={14} />{format(parseISO(trip.startDate), 'MMM d')} – {format(parseISO(trip.endDate), 'MMM d, yyyy')}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} />{trip.stops.length} cities</span>
                <span className="flex items-center gap-1.5"><Clock size={14} />{totalDays} days</span>
                <span className="flex items-center gap-1.5"><Star size={14} />{totalActivities} activities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Destinations', value: trip.stops.length, sub: 'cities' },
            { label: 'Duration', value: `${totalDays}d`, sub: 'days' },
            { label: 'Activities', value: totalActivities, sub: 'experiences' },
            { label: 'Est. Cost', value: `$${totalEstimated.toLocaleString()}`, sub: 'total' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#e2e8f0] p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#0d61a3]">{s.value}</p>
              <p className="text-xs font-medium text-[#64748b] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Journey */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#1e293b] mb-4">Journey Route</h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {trip.stops.map((stop, idx) => (
              <React.Fragment key={stop.id}>
                <div className="flex-shrink-0 bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden w-36 shadow-sm">
                  <div className="relative h-20">
                    <img src={stop.image} alt={stop.cityName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-1.5 left-2 text-white font-bold text-sm">{stop.cityName}</span>
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] text-[#94a3b8]">{format(parseISO(stop.startDate), 'MMM d')} – {format(parseISO(stop.endDate), 'MMM d')}</p>
                    <p className="text-[10px] font-semibold text-[#475569]">{stop.activities.length} activities</p>
                  </div>
                </div>
                {idx < trip.stops.length - 1 && <ChevronRight size={16} className="text-[#94a3b8] flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Itinerary */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#1e293b] mb-4">Full Itinerary</h2>
          <div className="flex flex-col gap-4">
            {trip.stops.map((stop, idx) => {
              const days = differenceInDays(parseISO(stop.endDate), parseISO(stop.startDate));
              const total = stop.accommodation + stop.transport + stop.meals + stop.activities.reduce((a, ac) => a + ac.cost, 0);
              return (
                <div key={stop.id} className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                  <div className="relative h-28 overflow-hidden">
                    <img src={stop.image} alt={stop.cityName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                    <div className="absolute inset-0 flex items-center px-5">
                      <div className="text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-6 h-6 rounded-full bg-[#ff6b6b] flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                          <h3 className="text-lg font-bold">{stop.cityName}</h3>
                          <span className="text-white/70 text-sm">{stop.country}</span>
                        </div>
                        <p className="text-white/80 text-xs">{format(parseISO(stop.startDate), 'MMM d')} – {format(parseISO(stop.endDate), 'MMM d, yyyy')} · {days} days</p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-xl text-white text-sm font-bold">
                      ${total.toLocaleString()}
                    </div>
                  </div>
                  {stop.activities.length > 0 && (
                    <div className="p-4">
                      <h4 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wide mb-3">Activities</h4>
                      <div className="flex flex-col gap-2">
                        {stop.activities.map(act => (
                          <div key={act.id} className="flex items-center gap-3 p-2.5 bg-[#f8fafc] rounded-xl">
                            <img src={act.image} alt={act.name} className="w-10 h-8 rounded-lg object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#1e293b] truncate">{act.name}</p>
                              <p className="text-xs text-[#94a3b8]">{act.duration}h · ${act.cost}</p>
                            </div>
                            <Badge variant={activityTypeColors[act.type] ?? 'gray'}>{act.type}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#0d61a3] to-[#00b4d8] rounded-3xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Love this itinerary?</h3>
          <p className="text-white/80 text-sm mb-4">Copy it to your account and customize it for your own trip!</p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={handleCopyTrip}>
              {tripCopied ? '✓ Saved to your trips!' : 'Copy This Trip'}
            </Button>
            <Button onClick={() => navigate('/signup')} className="bg-white/20 text-white border-white/30 border hover:bg-white/30">
              {isAuthenticated ? 'My Trips' : 'Sign Up Free'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
