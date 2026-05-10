import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Tag, MapPin, ArrowRight } from 'lucide-react';
import { useAuthStore, useTripStore } from '../store';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Textarea } from '../components/ui/Input';
import Card from '../components/ui/Card';

const COVER_OPTIONS = [
  'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&auto=format&fit=crop',
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'SGD', 'INR'];

export default function CreateTrip() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addTrip } = useTripStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [coverImage, setCoverImage] = useState(COVER_OPTIONS[0]);
  const [isPublic, setIsPublic] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['culture', 'adventure']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Trip name is required.';
    if (!startDate) e.startDate = 'Start date is required.';
    if (!endDate) e.endDate = 'End date is required.';
    if (startDate && endDate && endDate <= startDate) e.endDate = 'End date must be after start date.';
    return e;
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags(prev => [...prev, t]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const id = addTrip({
      userId: user!.id,
      name,
      description,
      startDate,
      endDate,
      coverImage,
      isPublic,
      stops: [],
      notes: [],
      packingList: [],
      totalBudget: Number(budget) || 0,
      currency,
      tags,
    });
    navigate(`/trips/${id}/builder`);
  };

  return (
    <div className="max-w-3xl mx-auto" style={{ animation: 'slideUp 0.4s ease-out' }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1e293b]">Plan a New Trip</h2>
        <p className="text-sm text-[#64748b] mt-1">Fill in the details below to start building your itinerary.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Cover image */}
        <Card>
          <h3 className="text-sm font-bold text-[#334155] mb-3 flex items-center gap-2">
            <Camera size={16} /> Cover Photo
          </h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {COVER_OPTIONS.map(img => (
              <div
                key={img}
                onClick={() => setCoverImage(img)}
                className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  coverImage === img ? 'border-[#0d61a3] ring-2 ring-[#0d61a3]/30' : 'border-transparent hover:border-[#0d61a3]/40'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                {coverImage === img && (
                  <div className="absolute inset-0 bg-[#0d61a3]/30 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-[#0d61a3] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Preview */}
          <div className="relative h-32 rounded-xl overflow-hidden">
            <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#012f61]/70 to-transparent flex items-center px-4">
              <p className="text-white font-bold text-base">{name || 'Your Trip Name'}</p>
            </div>
          </div>
        </Card>

        {/* Basic info */}
        <Card>
          <h3 className="text-sm font-bold text-[#334155] mb-4 flex items-center gap-2">
            <MapPin size={16} /> Trip Details
          </h3>
          <div className="flex flex-col gap-4">
            <Input
              label="Trip Name *"
              placeholder="e.g. European Summer Adventure"
              value={name}
              onChange={e => setName(e.target.value)}
              error={errors.name}
            />
            <Textarea
              label="Description"
              placeholder="Describe your trip plans, goals, or anything special about this journey..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date *"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                error={errors.startDate}
              />
              <Input
                label="End Date *"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                error={errors.endDate}
              />
            </div>
          </div>
        </Card>

        {/* Budget */}
        <Card>
          <h3 className="text-sm font-bold text-[#334155] mb-4">Budget</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="Total Budget"
                type="number"
                placeholder="e.g. 3500"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                hint="Enter your estimated total trip budget"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#334155] block mb-1.5">Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-[#e2e8f0] bg-white text-[#1e293b] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3]"
              >
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </Card>

        {/* Tags & visibility */}
        <Card>
          <h3 className="text-sm font-bold text-[#334155] mb-4 flex items-center gap-2">
            <Tag size={16} /> Tags & Visibility
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-[#334155] block mb-2">Tags (max 5)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3]"
                />
                <Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-[#e8f4fc] text-[#0d61a3] rounded-full text-xs font-medium">
                    #{tag}
                    <button type="button" onClick={() => setTags(t => t.filter(x => x !== tag))} className="ml-0.5 hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
              <div
                onClick={() => setIsPublic(v => !v)}
                className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${isPublic ? 'bg-[#0d61a3]' : 'bg-[#cbd5e1]'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isPublic ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1e293b]">Make trip public</p>
                <p className="text-xs text-[#94a3b8]">Others can view and get inspired by your itinerary</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-3 justify-end pb-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/trips')}>Cancel</Button>
          <Button type="submit" loading={loading} iconRight={<ArrowRight size={16} />}>
            Create & Build Itinerary
          </Button>
        </div>
      </form>
    </div>
  );
}
