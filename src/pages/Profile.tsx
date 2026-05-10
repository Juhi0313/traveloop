import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Globe, Camera, Trash2, LogOut, Save, Shield, BookmarkCheck } from 'lucide-react';
import { useAuthStore, useTripStore } from '../store';
import { CITIES } from '../data/mockData';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { format, parseISO } from 'date-fns';

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Italian', 'Portuguese'];

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();
  const { trips } = useTripStore();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [language, setLanguage] = useState(user?.language ?? 'English');
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const userTrips = trips.filter(t => t.userId === user?.id);
  const savedCities = CITIES.filter(c => user?.savedDestinations.includes(c.id));

  const handleSave = () => {
    updateUser({ name, phone, bio, language });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div>
        <h2 className="text-2xl font-bold text-[#1e293b]">Profile & Settings</h2>
        <p className="text-sm text-[#64748b] mt-0.5">Manage your account information and preferences</p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        {/* Cover gradient */}
        <div className="h-24 bg-gradient-to-r from-[#012f61] via-[#0d61a3] to-[#00b4d8]" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-12 mb-4 flex items-end justify-between">
            <div className="relative">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-lg" />
              ) : (
                <div className="w-20 h-20 rounded-2xl border-4 border-white bg-gradient-to-br from-[#0d61a3] to-[#00b4d8] flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0d61a3] rounded-full flex items-center justify-center text-white border-2 border-white">
                <Camera size={12} />
              </button>
            </div>
            {user.isAdmin && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                <Shield size={12} /> Admin
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#1e293b]">{user.name}</h3>
            <p className="text-sm text-[#64748b]">{user.email}</p>
            <p className="text-xs text-[#94a3b8] mt-0.5">Member since {format(parseISO(user.createdAt), 'MMMM yyyy')}</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 p-4 bg-[#f8fafc] rounded-xl">
            <div className="text-center">
              <p className="text-xl font-bold text-[#0d61a3]">{userTrips.length}</p>
              <p className="text-xs text-[#64748b]">Trips</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-[#ff6b6b]">{userTrips.reduce((s, t) => s + t.stops.length, 0)}</p>
              <p className="text-xs text-[#64748b]">Cities</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-[#10b981]">{savedCities.length}</p>
              <p className="text-xs text-[#64748b]">Saved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit info */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
        <h3 className="font-bold text-[#1e293b] mb-4 flex items-center gap-2">
          <User size={16} className="text-[#0d61a3]" /> Personal Information
        </h3>
        <div className="flex flex-col gap-4">
          <Input
            label="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            icon={<User size={15} />}
          />
          <Input
            label="Email Address"
            type="email"
            value={user.email}
            disabled
            icon={<Mail size={15} />}
            hint="Email cannot be changed"
          />
          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+1 555 0100"
            icon={<Phone size={15} />}
          />
          <div>
            <label className="text-sm font-semibold text-[#334155] block mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell us about yourself and your travel style..."
              rows={3}
              className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3] resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#334155] block mb-1.5 flex items-center gap-1.5">
              <Globe size={14} /> Language Preference
            </label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3]"
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex justify-end">
            <Button icon={saved ? undefined : <Save size={15} />} onClick={handleSave}>
              {saved ? '✓ Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Saved destinations */}
      {savedCities.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
          <h3 className="font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <BookmarkCheck size={16} className="text-[#0d61a3]" /> Saved Destinations
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {savedCities.map(city => (
              <div key={city.id} className="relative rounded-xl overflow-hidden h-20 group cursor-pointer" onClick={() => navigate('/cities')}>
                <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <p className="text-white font-bold text-xs">{city.name}</p>
                  <p className="text-white/70 text-[10px]">{city.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Account actions */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
        <h3 className="font-bold text-[#1e293b] mb-4">Account</h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-3 p-3 rounded-xl border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] hover:text-[#1e293b] transition-colors text-sm font-medium w-full"
          >
            <LogOut size={16} />
            Sign Out
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-3 p-3 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium w-full"
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>
      </div>

      {/* Logout modal */}
      <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Sign Out"
        footer={
          <>
            <Button variant="secondary" onClick={() => setLogoutOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleLogout}>Sign Out</Button>
          </>
        }
      >
        <p className="text-[#64748b]">Are you sure you want to sign out of Traveloop?</p>
      </Modal>

      {/* Delete account modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Account"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleLogout}>Yes, Delete Account</Button>
          </>
        }
      >
        <div className="text-[#64748b]">
          <p className="mb-2">This action is <strong className="text-red-600">permanent and irreversible</strong>.</p>
          <p>All your trips, itineraries, notes, and packing lists will be permanently deleted.</p>
        </div>
      </Modal>
    </div>
  );
}
