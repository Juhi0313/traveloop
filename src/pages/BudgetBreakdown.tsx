import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, AlertTriangle, CheckCircle, TrendingUp, MapPin } from 'lucide-react';
import { useAuthStore, useTripStore } from '../store';
import { StatCard } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { parseISO, differenceInDays } from 'date-fns';

const COLORS = ['#0d61a3', '#ff6b6b', '#00b4d8', '#ffb347', '#10b981', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-3 shadow-lg">
        <p className="font-semibold text-[#1e293b] text-sm">{label || payload[0].name}</p>
        <p className="text-[#0d61a3] font-bold">${Number(payload[0].value).toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function BudgetBreakdown() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { trips } = useTripStore();
  const tripIdParam = searchParams.get('trip');

  const userTrips = trips.filter(t => t.userId === user?.id);
  const [selectedTripId, setSelectedTripId] = useState(tripIdParam || userTrips[0]?.id || '');
  const trip = userTrips.find(t => t.id === selectedTripId);

  if (userTrips.length === 0) return (
    <EmptyState icon={<DollarSign size={28} />} title="No trips found" description="Create a trip first to track its budget." actionLabel="Plan New Trip" onAction={() => navigate('/trips/new')} />
  );

  if (!trip) return null;

  const totalAccommodation = trip.stops.reduce((s, st) => s + st.accommodation, 0);
  const totalTransport = trip.stops.reduce((s, st) => s + st.transport, 0);
  const totalMeals = trip.stops.reduce((s, st) => s + st.meals, 0);
  const totalActivities = trip.stops.reduce((s, st) => s + st.activities.reduce((a, ac) => a + ac.cost, 0), 0);
  const totalEstimated = totalAccommodation + totalTransport + totalMeals + totalActivities;
  const totalDays = differenceInDays(parseISO(trip.endDate), parseISO(trip.startDate));
  const remaining = trip.totalBudget - totalEstimated;
  const isOverBudget = remaining < 0;

  const pieData = [
    { name: 'Accommodation', value: totalAccommodation },
    { name: 'Transport', value: totalTransport },
    { name: 'Meals', value: totalMeals },
    { name: 'Activities', value: totalActivities },
  ].filter(d => d.value > 0);

  const barData = trip.stops.map(s => ({
    name: s.cityName,
    Accommodation: s.accommodation,
    Transport: s.transport,
    Meals: s.meals,
    Activities: s.activities.reduce((a, ac) => a + ac.cost, 0),
  }));

  const perDayData = trip.stops.map(s => {
    const days = differenceInDays(parseISO(s.endDate), parseISO(s.startDate)) || 1;
    const total = s.accommodation + s.transport + s.meals + s.activities.reduce((a, ac) => a + ac.cost, 0);
    return { name: s.cityName, 'Daily Average': Math.round(total / days) };
  });

  const budgetPct = trip.totalBudget > 0 ? Math.min(100, (totalEstimated / trip.totalBudget) * 100) : 0;

  return (
    <div className="flex flex-col gap-6" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b]">Budget Tracker</h2>
          <p className="text-sm text-[#64748b] mt-0.5">Track and analyze your trip spending</p>
        </div>
        <select
          value={selectedTripId}
          onChange={e => setSelectedTripId(e.target.value)}
          className="rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3] bg-white"
        >
          {userTrips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Budget overview */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#1e293b]">{trip.name}</h3>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${isOverBudget ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
            {isOverBudget ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
            {isOverBudget ? `$${Math.abs(remaining).toLocaleString()} over budget` : `$${remaining.toLocaleString()} remaining`}
          </div>
        </div>

        <div className="mb-2 flex justify-between text-sm">
          <span className="text-[#64748b]">Spent: <strong className="text-[#1e293b]">${totalEstimated.toLocaleString()}</strong></span>
          <span className="text-[#64748b]">Budget: <strong className="text-[#1e293b]">${trip.totalBudget.toLocaleString()}</strong></span>
        </div>
        <div className="w-full h-3 bg-[#f1f5f9] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${isOverBudget ? 'bg-red-500' : 'bg-gradient-to-r from-[#0d61a3] to-[#00b4d8]'}`}
            style={{ width: `${budgetPct}%` }}
          />
        </div>
        <p className="text-xs text-[#94a3b8] mt-1">{budgetPct.toFixed(0)}% of budget used · {trip.currency}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Budget" value={`$${trip.totalBudget.toLocaleString()}`} icon={<DollarSign size={20} />} color="blue" subtitle="Planned" />
        <StatCard title="Estimated Cost" value={`$${totalEstimated.toLocaleString()}`} icon={<TrendingUp size={20} />} color={isOverBudget ? 'coral' : 'teal'} subtitle="Projected spend" />
        <StatCard title="Avg Per Day" value={`$${totalDays > 0 ? Math.round(totalEstimated / totalDays) : 0}`} icon={<MapPin size={20} />} color="gold" subtitle="Daily average" />
        <StatCard title="Activities" value={`$${totalActivities.toLocaleString()}`} icon={<TrendingUp size={20} />} color="coral" subtitle="All activities" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
          <h3 className="font-bold text-[#1e293b] mb-1">Cost Breakdown</h3>
          <p className="text-xs text-[#94a3b8] mb-4">How your budget is distributed</p>
          {pieData.length === 0 ? (
            <div className="text-center py-8 text-[#94a3b8] text-sm">No cost data yet</div>
          ) : (
            <div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-[#64748b] truncate">{d.name}</span>
                    <span className="text-xs font-bold text-[#1e293b] ml-auto">${d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cost by city bar chart */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
          <h3 className="font-bold text-[#1e293b] mb-1">Cost by City</h3>
          <p className="text-xs text-[#94a3b8] mb-4">Breakdown across all destinations</p>
          {barData.length === 0 ? (
            <div className="text-center py-8 text-[#94a3b8] text-sm">No cities added yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Accommodation" fill="#0d61a3" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Transport" fill="#00b4d8" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Meals" fill="#ffb347" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Activities" fill="#ff6b6b" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Per-day average */}
      {perDayData.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
          <h3 className="font-bold text-[#1e293b] mb-1">Average Daily Cost by City</h3>
          <p className="text-xs text-[#94a3b8] mb-4">Helps you understand where you spend most per day</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={perDayData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Daily Average" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Detailed table */}
      {trip.stops.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#f1f5f9]">
            <h3 className="font-bold text-[#1e293b]">Stop-by-Stop Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f8fafc]">
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#64748b] uppercase tracking-wide">City</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-[#64748b] uppercase tracking-wide">Stay</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-[#64748b] uppercase tracking-wide">Transport</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-[#64748b] uppercase tracking-wide">Meals</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-[#64748b] uppercase tracking-wide">Activities</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-[#64748b] uppercase tracking-wide">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {trip.stops.map(stop => {
                  const actCost = stop.activities.reduce((a, ac) => a + ac.cost, 0);
                  const total = stop.accommodation + stop.transport + stop.meals + actCost;
                  return (
                    <tr key={stop.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={stop.image} alt={stop.cityName} className="w-8 h-6 rounded object-cover" />
                          <div>
                            <p className="font-semibold text-[#1e293b]">{stop.cityName}</p>
                            <p className="text-xs text-[#94a3b8]">{stop.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right px-4 py-3 text-[#64748b]">${stop.accommodation}</td>
                      <td className="text-right px-4 py-3 text-[#64748b]">${stop.transport}</td>
                      <td className="text-right px-4 py-3 text-[#64748b]">${stop.meals}</td>
                      <td className="text-right px-4 py-3 text-[#64748b]">${actCost}</td>
                      <td className="text-right px-4 py-3 font-bold text-[#1e293b]">${total.toLocaleString()}</td>
                    </tr>
                  );
                })}
                <tr className="bg-[#f8fafc] border-t-2 border-[#e2e8f0]">
                  <td className="px-4 py-3 font-bold text-[#1e293b]">Total</td>
                  <td className="text-right px-4 py-3 font-bold text-[#1e293b]">${totalAccommodation}</td>
                  <td className="text-right px-4 py-3 font-bold text-[#1e293b]">${totalTransport}</td>
                  <td className="text-right px-4 py-3 font-bold text-[#1e293b]">${totalMeals}</td>
                  <td className="text-right px-4 py-3 font-bold text-[#1e293b]">${totalActivities}</td>
                  <td className="text-right px-4 py-3 font-bold text-lg text-[#0d61a3]">${totalEstimated.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
