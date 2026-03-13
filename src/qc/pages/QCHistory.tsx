import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Copy, Edit3, Trash2, X, ClipboardList } from 'lucide-react';
import { Report, FormType, FORM_LABELS, SHIFT_OPTIONS } from '../types';
import { fmtDateTime, copyText } from '../helpers';
import { queryReports, deleteReport } from '../db';

const TYPE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'sortir_bawang', label: 'Sortir' },
  { value: 'cabe_giling', label: 'Cabe' },
  { value: 'suhu_equipment', label: 'Suhu Eq.' },
  { value: 'tester_bahan', label: 'Tester' },
  { value: 'return_barang', label: 'Return' },
  { value: 'suhu_datalogger', label: 'Data Logger' },
  { value: 'prepare', label: 'Prepare' },
];

const FORM_ROUTES: Record<string, string> = {
  sortir_bawang: '/qc/form/sortir',
  cabe_giling: '/qc/form/cabe',
  suhu_equipment: '/qc/form/suhu',
  tester_bahan: '/qc/form/tester',
  return_barang: '/qc/form/return',
  suhu_datalogger: '/qc/form/datalogger',
  prepare: '/qc/form/prepare',
};

export default function QCHistory() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const showToast = useCallback((message: string, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadReports = useCallback(() => {
    const rows = queryReports({ type: typeFilter, shift: shiftFilter, search: search.trim() });
    setReports(rows as unknown as Report[]);
  }, [typeFilter, shiftFilter, search]);

  useEffect(() => { loadReports(); }, [loadReports]);

  const handleCopy = async (text: string) => {
    await copyText(text);
    showToast('Report copied ✓');
  };

  const handleDelete = (id: string) => {
    deleteReport(id);
    setReports(prev => prev.filter(r => r.id !== id));
    setDeletingId(null);
    showToast('Report deleted', 'info');
  };

  const handleEdit = (r: Report) => {
    const route = FORM_ROUTES[r.type];
    if (route) navigate(`${route}?edit=${r.id}`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-5">
      <div>
        <h2 className="text-sm font-bold text-white font-['Orbitron'] tracking-wider">HISTORY</h2>
        <p className="text-xs text-gray-500 mt-1">{reports.length} reports</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports..."
          className="w-full bg-panel-dark/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-neon-blue/40 focus:outline-none transition-all" />
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TYPE_FILTERS.map(f => (
          <button key={f.value} onClick={() => setTypeFilter(f.value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              typeFilter === f.value
                ? 'bg-neon-blue/15 text-neon-blue border-neon-blue/30'
                : 'bg-white/[0.03] text-gray-500 border-white/5 hover:text-gray-300'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Shift Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button onClick={() => setShiftFilter('all')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            shiftFilter === 'all' ? 'bg-neon-pink/15 text-neon-pink border-neon-pink/30' : 'bg-white/[0.03] text-gray-500 border-white/5'
          }`}>All Shifts</button>
        {SHIFT_OPTIONS.map(s => (
          <button key={s} onClick={() => setShiftFilter(s)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              shiftFilter === s ? 'bg-neon-pink/15 text-neon-pink border-neon-pink/30' : 'bg-white/[0.03] text-gray-500 border-white/5'
            }`}>{s}</button>
        ))}
      </div>

      {/* Empty */}
      {reports.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          <ClipboardList size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No reports found</p>
        </div>
      )}

      {/* Report Cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {reports.map((r, idx) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
              className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-neon-blue/10 text-neon-blue border border-neon-blue/20">
                  {FORM_LABELS[r.type as FormType] || r.type}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neon-pink/10 text-neon-pink border border-neon-pink/20">
                  {r.shift}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{fmtDateTime(r.created_at)}</p>

              {expandedId === r.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 rounded-lg border border-neon-blue/10 bg-panel-dark/60 text-gray-300 text-[11px] font-mono whitespace-pre-wrap leading-relaxed mb-3 max-h-48 overflow-y-auto">
                  {r.generated_text}
                </motion.div>
              )}

              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-neon-blue border border-neon-blue/15 bg-neon-blue/5 hover:bg-neon-blue/10 transition-all">
                  {expandedId === r.id ? <X size={12} /> : <Eye size={12} />}
                  {expandedId === r.id ? 'Close' : 'View'}
                </button>
                <button onClick={() => handleCopy(r.generated_text)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-neon-green border border-neon-green/15 bg-neon-green/5 hover:bg-neon-green/10 transition-all">
                  <Copy size={12} /> Copy
                </button>
                <button onClick={() => handleEdit(r)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-neon-pink border border-neon-pink/15 bg-neon-pink/5 hover:bg-neon-pink/10 transition-all">
                  <Edit3 size={12} /> Edit
                </button>
                {deletingId === r.id ? (
                  <button onClick={() => handleDelete(r.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-red-400 border border-red-500/30 bg-red-500/15 animate-pulse">
                    Confirm?
                  </button>
                ) : (
                  <button onClick={() => setDeletingId(r.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-red-400/60 border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 transition-all">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-md border shadow-lg ${
              toast.type === 'success' ? 'bg-neon-green/15 text-neon-green border-neon-green/20' :
              toast.type === 'error' ? 'bg-red-500/15 text-red-400 border-red-500/20' :
              'bg-neon-blue/15 text-neon-blue border-neon-blue/20'
            }`}>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
