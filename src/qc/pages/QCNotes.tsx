import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Check, X, StickyNote } from 'lucide-react';
import { QCPageHeader } from '../components/QCPageHeader';
import { Note } from '../types';
import { genId, nowISO, fmtDateTime } from '../helpers';
import { getAllNotes, saveNote as dbSaveNote, deleteNote as dbDeleteNote } from '../db';

export const QCNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadNotes = useCallback(() => {
    setNotes(getAllNotes() as Note[]);
  }, []);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  const addNote = () => {
    if (!newContent.trim()) return;
    const id = genId();
    const now = nowISO();
    const note = { id, content: newContent.trim(), created_at: now, updated_at: now };
    dbSaveNote(note);
    setNotes(prev => [note, ...prev]);
    setNewContent('');
    setShowAdd(false);
  };

  const saveEdit = (id: string) => {
    if (!editContent.trim()) return;
    const now = nowISO();
    const existing = notes.find(n => n.id === id);
    if (!existing) return;
    const updated = { ...existing, content: editContent.trim(), updated_at: now };
    dbSaveNote(updated);
    setNotes(prev => prev.map(n => n.id === id ? updated : n));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    dbDeleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
    setDeletingId(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <QCPageHeader
        title="Notes"
        subtitle="Personal Notes"
        rightAction={
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all"
          >
            <Plus size={14} /> New
          </button>
        }
      />

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-[#0D0D1A]/60 border border-[#00F0FF]/15 rounded-2xl p-4">
              <textarea
                className="w-full bg-[#0D0D1A]/60 border border-[#00F0FF]/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00F0FF] transition-all resize-y min-h-[80px] placeholder:text-white/30"
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="Write a note..."
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 mt-3">
                <button onClick={addNote} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-[#00F0FF] text-black hover:opacity-90 transition-all">
                  <Check size={16} /> Save
                </button>
                <button onClick={() => { setShowAdd(false); setNewContent(''); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-white/50 hover:border-white/20 transition-all">
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {notes.length === 0 && !showAdd && (
        <div className="flex flex-col items-center justify-center py-16 text-white/30 gap-3">
          <StickyNote size={40} />
          <p className="text-sm">No notes yet</p>
          <p className="text-xs">Tap + New to add one</p>
        </div>
      )}

      {/* Notes list */}
      <div className="flex flex-col gap-3">
        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0D0D1A]/60 border border-[#00F0FF]/10 rounded-2xl p-4"
          >
            {editingId === note.id ? (
              <>
                <textarea
                  className="w-full bg-[#0D0D1A]/60 border border-[#00F0FF]/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00F0FF] transition-all resize-y min-h-[80px]"
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2 mt-3">
                  <button onClick={() => saveEdit(note.id)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold bg-[#00F0FF] text-black">
                    <Check size={14} /> Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold border border-white/10 text-white/50">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap mb-3">
                  {note.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/30">{fmtDateTime(note.updated_at)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingId(note.id); setEditContent(note.content); }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all"
                    >
                      <Edit3 size={13} />
                    </button>
                    {deletingId === note.id ? (
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-red-500/50 text-red-400 bg-red-500/10"
                      >
                        Confirm?
                      </button>
                    ) : (
                      <button
                        onClick={() => setDeletingId(note.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QCNotes;
