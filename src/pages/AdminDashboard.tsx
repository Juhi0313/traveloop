import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Map, Globe, Shield, Eye, Activity } from 'lucide-react';
import { useAuthStore, useTripStore } from '../store';
import { CITIES } from '../data/mockData';
import { StatCard } from '../components/ui/Card';

const COLORS = ['#0d61a3', '#ff6b6b', '#00b4d8', '#ffb347', '#10b981', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-[#1e293b]">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { trips } = useTripStore();

  if (!user?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Shield size={48} className="text-[#cbd5e1] mb-4" />
        <h2 className="text-xl font-bold text-[#1e293b] mb-2">Admin Access Only</h2>
        <p className="text-[#64748b] text-sm">You don't have permission to view this page.</p>
      </div>
    );
  }

  // Generate analytics data
  const totalTrips = trips.length;
  const publicTrips = trips.filter(t => t.isPublic).length;
  const totalCities = new Set(trips.flatMap(t => t.stops.map(s => s.cityId))).size;
  const totalActivities = trips.reduce((s, t) => s + t.stops.reduce((ss, st) => ss + st.activities.length, 0), 0);

  // City popularity from trips
  const cityUsage = CITIES.map(c => ({
    name: c.name,
    trips: trips.filter(t => t.stops.some(s => s.cityId === c.id)).length,
    popularity: c.popularity,
  })).sort((a, b) => b.trips - a.trips).slice(0, 8);

  // Monthly trips (simulated)
  const monthlyData = [
    { month: 'Jan', trips: 8, users: 24 },
    { month: 'Feb', trips: 12, users: 35 },
    { month: 'Mar', trips: 18, users: 48 },
    { month: 'Apr', trips: 22, users: 62 },
    { month: 'May', trips: 31, users: 85 },
    { month: 'Jun', trips: totalTrips, users: 110 },
  ];

  // Activity types distribution
  const activityTypes = trips.flatMap(t => t.stops.flatMap(s => s.activities.map(a => a.type)));
  const typeCounts = activityTypes.reduce<Record<string, number>>((acc, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});
  const typeData = Object.entries(typeCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Budget ranges
  const budgetRanges = [
    { range: '$0–1k', count: trips.filter(t => t.totalBudget < 1000).length },
    { range: '$1k–2k', count: trips.filter(t => t.totalBudget >= 1000 && t.totalBudget < 2000).length },
    { range: '$2k–5k', count: trips.filter(t => t.totalBudget >= 2000 && t.totalBudget < 5000).length },
    { range: '$5k+', count: trips.filter(t => t.totalBudget >= 5000).length },
  ];

  // User list (simulated)
  const users = [
    { id: 'u1', name: 'Alex Johnson', email: 'alex@traveloop.com', trips: trips.filter(t => t.userId === 'u1').length, joined: '2025-01-15', role: 'User' },
    { id: 'admin', name: 'Admin User', email: 'admin@traveloop.com', trips: 0, joined: '2024-01-01', role: 'Admin' },
  ];

  return (
    <div className="flex flex-col gap-6" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1">
              <Shield size={11} /> Admin
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#1e293b]">Analytics Dashboard</h2>
          <p className="text-sm text-[#64748b] mt-0.5">Platform usage, trends, and user management</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="2" icon={<Users size={20} />} color="blue" subtitle="Registered" />
        <StatCard title="Total Trips" value={totalTrips} icon={<Map size={20} />} color="coral" subtitle="All time" />
        <StatCard title="Cities Used" value={totalCities} icon={<Globe size={20} />} color="teal" subtitle="Unique destinations" />
        <StatCard title="Activities" value={totalActivities} icon={<Activity size={20} />} color="gold" subtitle="Total planned" />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly growth */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
          <h3 className="font-bold text-[#1e293b] mb-1">Growth Overview</h3>
          <p className="text-xs text-[#94a3b8] mb-4">Trips and users over the last 6 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="trips" name="Trips" stroke="#0d61a3" strokeWidth={2.5} dot={{ fill: '#0d61a3', r: 4 }} />
              <Line type="monotone" dataKey="users" name="Users" stroke="#ff6b6b" strokeWidth={2.5} dot={{ fill: '#ff6b6b', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Activity type pie */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
          <h3 className="font-bold text-[#1e293b] mb-1">Activity Types</h3>
          <p className="text-xs text-[#94a3b8] mb-4">Distribution of planned activities</p>
          {typeData.length === 0 ? (
            <div className="text-center py-8 text-[#94a3b8] text-sm">No activity data</div>
          ) : (
            <div className="flex gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" outerRadius={70} paddingAngle={2} dataKey="value">
                    {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 flex flex-col justify-center gap-1.5">
                {typeData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-[#64748b] capitalize flex-1">{d.name}</span>
                    <span className="text-xs font-bold text-[#1e293b]">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top cities */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
          <h3 className="font-bold text-[#1e293b] mb-1">Top Cities</h3>
          <p className="text-xs text-[#94a3b8] mb-4">Most popular destinations in planned trips</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cityUsage} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="trips" name="Trips" fill="#0d61a3" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget ranges */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
          <h3 className="font-bold text-[#1e293b] mb-1">Budget Distribution</h3>
          <p className="text-xs text-[#94a3b8] mb-4">How much users budget for their trips</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={budgetRanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Trips" fill="#ffb347" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform stats */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-5">
        <h3 className="font-bold text-[#1e293b] mb-4">Platform Overview</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Public Trips', value: publicTrips, total: totalTrips, color: '#0d61a3' },
            { label: 'Private Trips', value: totalTrips - publicTrips, total: totalTrips, color: '#64748b' },
            { label: 'Trips with Budget', value: trips.filter(t => t.totalBudget > 0).length, total: totalTrips, color: '#10b981' },
            { label: 'Multi-city Trips', value: trips.filter(t => t.stops.length > 1).length, total: totalTrips, color: '#ff6b6b' },
          ].map(s => (
            <div key={s.label} className="p-3 bg-[#f8fafc] rounded-xl">
              <p className="text-xs text-[#64748b] mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-[#1e293b]">{s.value}</p>
              <div className="mt-2 w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${s.total > 0 ? (s.value / s.total) * 100 : 0}%`, background: s.color }} />
              </div>
              <p className="text-[10px] text-[#94a3b8] mt-1">{s.total > 0 ? Math.round((s.value / s.total) * 100) : 0}% of all trips</p>
            </div>
          ))}
        </div>
      </div>

      {/* User management table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#f1f5f9] flex items-center justify-between">
          <h3 className="font-bold text-[#1e293b]">User Management</h3>
          <span className="text-xs text-[#94a3b8]">{users.length} users</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8fafc]">
                <th className="text-left px-5 py-3 text-xs font-bold text-[#64748b] uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-[#64748b] uppercase tracking-wide">Email</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-[#64748b] uppercase tracking-wide">Trips</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-[#64748b] uppercase tracking-wide">Joined</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-[#64748b] uppercase tracking-wide">Role</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-[#64748b] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0d61a3] to-[#00b4d8] flex items-center justify-center text-white font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-[#1e293b]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#64748b]">{u.email}</td>
                  <td className="px-5 py-3 text-center font-semibold text-[#1e293b]">{u.trips}</td>
                  <td className="px-5 py-3 text-[#64748b] text-xs">{u.joined}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.role === 'Admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button type="button" aria-label="View user" className="p-1.5 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] transition-colors">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
