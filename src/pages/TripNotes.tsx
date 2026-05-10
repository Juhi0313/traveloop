import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Edit3, Trash2, Search, Clock } from 'lucide-react';
import { useAuthStore, useTripStore } from '../store';
import type { Note } from '../types';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { format, parseISO } from 'date-fns';

export default function TripNotes() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { trips, addNote, updateNote, deleteNote } = useTripStore();
  const userTrips = trips.filter(t => t.userId === user?.id);

  const [selectedTripId, setSelectedTripId] = useState(userTrips[0]?.id || '');
  const [search, setSearch] = useState('');
  const [noteModal, setNoteModal] = useState<{ open: boolean; note?: Note }>({ open: false });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const trip = userTrips.find(t => t.id === selectedTripId);
  const notes = trip?.notes ?? [];
  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setTitle(''); setContent(''); setNoteModal({ open: true }); };
  const openEdit = (note: Note) => { setTitle(note.title); setContent(note.content); setNoteModal({ open: true, note }); };

  const handleSave = () => {
    if (!title.trim() || !content.trim() || !selectedTripId) return;
    if (noteModal.note) {
      updateNote(selectedTripId, noteModal.note.id, { title, content });
    } else {
      addNote(selectedTripId, { tripId: selectedTripId, title, content });
    }
    setNoteModal({ open: false });
  };

  if (userTrips.length === 0) return (
    <EmptyState icon={<FileText size={28} />} title="No trips found" description="Create a trip first to add notes." actionLabel="Plan New Trip" onAction={() => navigate('/trips/new')} />
  );

  const noteColors = ['border-l-[#0d61a3]', 'border-l-[#ff6b6b]', 'border-l-[#10b981]', 'border-l-[#ffb347]', 'border-l-[#8b5cf6]'];

  return (
    <div className="flex flex-col gap-6" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b]">Trip Notes</h2>
          <p className="text-sm text-[#64748b] mt-0.5">Keep reminders, tips, and info about your trips</p>
        </div>
        <Button icon={<Plus size={15} />} onClick={openAdd}>New Note</Button>
      </div>

      {/* Trip selector + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedTripId}
          onChange={e => setSelectedTripId(e.target.value)}
          className="rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 bg-white"
        >
          {userTrips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3]"
          />
        </div>
      </div>

      {/* Notes */}
      {filtered.length === 0 ? (
        notes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#e2e8f0] p-12 text-center">
            <FileText size={40} className="text-[#cbd5e1] mx-auto mb-3" />
            <h3 className="text-base font-semibold text-[#1e293b] mb-2">No notes yet</h3>
            <p className="text-sm text-[#94a3b8] mb-5">Jot down hotel info, local contacts, or day-specific reminders.</p>
            <Button icon={<Plus size={15} />} onClick={openAdd}>Write First Note</Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#94a3b8]">No notes match your search.</p>
          </div>
        )
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note, idx) => (
            <div
              key={note.id}
              className={`bg-white rounded-2xl border border-[#e2e8f0] border-l-4 ${noteColors[idx % noteColors.length]} shadow-sm p-5 group flex flex-col gap-3 transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-[#1e293b] text-sm leading-snug flex-1">{note.title}</h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => openEdit(note)} className="p-1.5 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#0d61a3] transition-colors">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => setDeleteId(note.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#64748b] hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#64748b] flex-1 line-clamp-4 leading-relaxed">{note.content}</p>
              <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                <Clock size={11} />
                {format(parseISO(note.updatedAt), 'MMM d, yyyy · h:mm a')}
              </div>
            </div>
          ))}

          {/* Add note card */}
          <button
            onClick={openAdd}
            className="bg-white rounded-2xl border-2 border-dashed border-[#e2e8f0] p-5 flex flex-col items-center justify-center gap-2 text-[#94a3b8] hover:border-[#0d61a3]/40 hover:text-[#0d61a3] transition-all min-h-32"
          >
            <Plus size={24} />
            <span className="text-sm font-medium">Add Note</span>
          </button>
        </div>
      )}

      {/* Note modal */}
      <Modal
        open={noteModal.open}
        onClose={() => setNoteModal({ open: false })}
        title={noteModal.note ? 'Edit Note' : 'New Note'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setNoteModal({ open: false })}>Cancel</Button>
            <Button onClick={handleSave} disabled={!title.trim() || !content.trim()}>
              {noteModal.note ? 'Save Changes' : 'Add Note'}
            </Button>
          </>
        }
        size="lg"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-[#334155] block mb-1.5">Title</label>
            <input
              type="text"
              placeholder="e.g. Paris Hotel Check-in Info"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3]"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#334155] block mb-1.5">Note</label>
            <textarea
              placeholder="Write your note here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3] resize-none"
            />
          </div>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Note"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { if (deleteId) { deleteNote(selectedTripId, deleteId); setDeleteId(null); } }}>Delete</Button>
          </>
        }
      >
        <p className="text-[#64748b]">Are you sure you want to delete this note? This cannot be undone.</p>
      </Modal>
    </div>
  );
}
