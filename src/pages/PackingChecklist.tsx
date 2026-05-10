import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Plus, Trash2, RotateCcw, Package, FileText, Smartphone, Shirt, Heart, MoreHorizontal } from 'lucide-react';
import { useAuthStore, useTripStore } from '../store';
import { PACKING_PRESETS } from '../data/mockData';
import type { PackingItem } from '../types';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

const CATEGORIES: { key: PackingItem['category']; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'clothing', label: 'Clothing', icon: <Shirt size={16} />, color: 'bg-blue-100 text-blue-600' },
  { key: 'documents', label: 'Documents', icon: <FileText size={16} />, color: 'bg-amber-100 text-amber-600' },
  { key: 'electronics', label: 'Electronics', icon: <Smartphone size={16} />, color: 'bg-purple-100 text-purple-600' },
  { key: 'toiletries', label: 'Toiletries', icon: <Package size={16} />, color: 'bg-teal-100 text-teal-600' },
  { key: 'medical', label: 'Medical', icon: <Heart size={16} />, color: 'bg-red-100 text-red-600' },
  { key: 'other', label: 'Other', icon: <MoreHorizontal size={16} />, color: 'bg-gray-100 text-gray-600' },
];

export default function PackingChecklist() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { trips, addPackingItem, togglePackingItem, deletePackingItem, resetPackingList } = useTripStore();
  const userTrips = trips.filter(t => t.userId === user?.id);

  const [selectedTripId, setSelectedTripId] = useState(userTrips[0]?.id || '');
  const [addOpen, setAddOpen] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState<PackingItem['category']>('other');
  const [presetOpen, setPresetOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PackingItem['category'] | 'all'>('all');
  const [resetOpen, setResetOpen] = useState(false);

  const trip = userTrips.find(t => t.id === selectedTripId);

  if (userTrips.length === 0) return (
    <EmptyState icon={<CheckSquare size={28} />} title="No trips found" description="Create a trip to manage your packing list." actionLabel="Plan New Trip" onAction={() => navigate('/trips/new')} />
  );

  const packingList = trip?.packingList ?? [];
  const filtered = activeCategory === 'all' ? packingList : packingList.filter(i => i.category === activeCategory);
  const packed = packingList.filter(i => i.isPacked).length;
  const total = packingList.length;
  const pct = total > 0 ? Math.round((packed / total) * 100) : 0;

  const handleAdd = () => {
    if (!newItem.trim() || !selectedTripId) return;
    addPackingItem(selectedTripId, { name: newItem.trim(), category: newCategory, isPacked: false });
    setNewItem('');
    setAddOpen(false);
  };

  const handleAddPreset = (preset: typeof PACKING_PRESETS[0]) => {
    if (!selectedTripId) return;
    const already = trip?.packingList.some(i => i.name === preset.name);
    if (!already) addPackingItem(selectedTripId, { name: preset.name, category: preset.category, isPacked: false });
  };

  return (
    <div className="flex flex-col gap-6" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b]">Packing Checklist</h2>
          <p className="text-sm text-[#64748b] mt-0.5">Stay organized and pack nothing but the essentials</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Package size={14} />} onClick={() => setPresetOpen(true)}>
            Load Presets
          </Button>
          <Button icon={<Plus size={15} />} onClick={() => setAddOpen(true)}>Add Item</Button>
        </div>
      </div>

      {/* Trip selector */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedTripId}
          onChange={e => setSelectedTripId(e.target.value)}
          className="rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 bg-white flex-1"
        >
          {userTrips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        {packingList.length > 0 && (
          <Button variant="ghost" size="sm" icon={<RotateCcw size={14} />} onClick={() => setResetOpen(true)} className="text-[#64748b]">
            Reset All
          </Button>
        )}
      </div>

      {/* Progress */}
      {total > 0 && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-[#1e293b]">Packing Progress</h3>
              <p className="text-xs text-[#94a3b8]">{packed} of {total} items packed</p>
            </div>
            <div className={`text-3xl font-bold ${pct === 100 ? 'text-emerald-500' : 'text-[#0d61a3]'}`}>
              {pct}%
            </div>
          </div>
          <div className="w-full h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#0d61a3] to-[#00b4d8]'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct === 100 && (
            <p className="text-emerald-600 text-sm font-semibold mt-2">🎉 All packed and ready to go!</p>
          )}
          {/* Category stats */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
            {CATEGORIES.map(cat => {
              const catItems = packingList.filter(i => i.category === cat.key);
              const catPacked = catItems.filter(i => i.isPacked).length;
              return (
                <div key={cat.key} className={`text-center p-2 rounded-xl cursor-pointer transition-all ${activeCategory === cat.key ? 'ring-2 ring-[#0d61a3] bg-[#e8f4fc]' : 'bg-[#f8fafc] hover:bg-[#f1f5f9]'}`}
                  onClick={() => setActiveCategory(activeCategory === cat.key ? 'all' : cat.key)}>
                  <div className={`w-7 h-7 rounded-lg ${cat.color} flex items-center justify-center mx-auto mb-1`}>{cat.icon}</div>
                  <p className="text-[10px] font-medium text-[#64748b] truncate">{cat.label}</p>
                  <p className="text-xs font-bold text-[#1e293b]">{catPacked}/{catItems.length}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items */}
      {packingList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#e2e8f0] p-12 text-center">
          <CheckSquare size={40} className="text-[#cbd5e1] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#1e293b] mb-2">Your checklist is empty</h3>
          <p className="text-sm text-[#94a3b8] mb-5">Add items manually or load our preset packing suggestions.</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" icon={<Package size={15} />} onClick={() => setPresetOpen(true)}>Load Presets</Button>
            <Button icon={<Plus size={15} />} onClick={() => setAddOpen(true)}>Add Item</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {CATEGORIES.map(cat => {
            const items = filtered.filter(i => i.category === cat.key);
            if (items.length === 0) return null;
            return (
              <div key={cat.key} className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                <div className={`flex items-center gap-2 px-4 py-3 border-b border-[#f1f5f9]`}>
                  <div className={`w-7 h-7 rounded-lg ${cat.color} flex items-center justify-center`}>{cat.icon}</div>
                  <h3 className="font-bold text-[#334155] text-sm">{cat.label}</h3>
                  <span className="text-xs text-[#94a3b8] ml-auto">{items.filter(i => i.isPacked).length}/{items.length}</span>
                </div>
                <div className="divide-y divide-[#f8fafc]">
                  {items.map(item => (
                    <div key={item.id} className={`flex items-center gap-3 px-4 py-3 group transition-colors hover:bg-[#f8fafc] ${item.isPacked ? 'opacity-60' : ''}`}>
                      <button
                        onClick={() => togglePackingItem(selectedTripId, item.id)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          item.isPacked ? 'bg-[#0d61a3] border-[#0d61a3]' : 'border-[#cbd5e1] hover:border-[#0d61a3]'
                        }`}
                      >
                        {item.isPacked && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          </svg>
                        )}
                      </button>
                      <span className={`flex-1 text-sm ${item.isPacked ? 'line-through text-[#94a3b8]' : 'text-[#1e293b]'}`}>
                        {item.name}
                      </span>
                      <button
                        onClick={() => deletePackingItem(selectedTripId, item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-[#94a3b8] hover:text-red-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add item modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Packing Item"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!newItem.trim()}>Add Item</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-[#334155] block mb-1.5">Item Name</label>
            <input
              type="text"
              placeholder="e.g. Sunscreen SPF 50"
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3]"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#334155] block mb-2">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setNewCategory(cat.key)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                    newCategory === cat.key ? 'border-[#0d61a3] bg-[#e8f4fc] text-[#0d61a3]' : 'border-[#e2e8f0] text-[#64748b] hover:border-[#0d61a3]/40'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Preset modal */}
      <Modal open={presetOpen} onClose={() => setPresetOpen(false)} title="Load Preset Items" size="xl">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[#64748b]">Select items to add to your packing list. Items already added are marked.</p>
          {CATEGORIES.map(cat => {
            const presets = PACKING_PRESETS.filter(p => p.category === cat.key);
            return (
              <div key={cat.key}>
                <div className={`flex items-center gap-2 mb-2`}>
                  <div className={`w-6 h-6 rounded-lg ${cat.color} flex items-center justify-center`}>{cat.icon}</div>
                  <h4 className="text-sm font-bold text-[#334155]">{cat.label}</h4>
                </div>
                <div className="grid grid-cols-2 gap-1.5 ml-8">
                  {presets.map(preset => {
                    const already = trip?.packingList.some(i => i.name === preset.name);
                    return (
                      <button
                        key={preset.name}
                        onClick={() => handleAddPreset(preset)}
                        disabled={already}
                        className={`text-left text-xs px-3 py-2 rounded-lg border transition-all ${
                          already
                            ? 'border-[#0d61a3]/30 bg-[#e8f4fc] text-[#0d61a3] cursor-default'
                            : 'border-[#e2e8f0] text-[#475569] hover:border-[#0d61a3]/40 hover:bg-[#f8fafc]'
                        }`}
                      >
                        {already ? '✓ ' : '+ '}{preset.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Reset modal */}
      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Reset Checklist"
        footer={
          <>
            <Button variant="secondary" onClick={() => setResetOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => { resetPackingList(selectedTripId); setResetOpen(false); }}>Reset All</Button>
          </>
        }
      >
        <p className="text-[#64748b]">This will mark all items as unpacked. Your items won't be deleted.</p>
      </Modal>
    </div>
  );
}
