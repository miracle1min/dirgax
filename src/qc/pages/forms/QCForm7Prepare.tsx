import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Copy, Save, ChefHat, X } from 'lucide-react';
import { genId, nowISO, copyText, fmtDate } from '../../helpers';
import { getReportById, saveReport } from '../../db';

interface PrepareItem { key: string; emoji: string; label: string; unit: string; }

const GROUPS: PrepareItem[][] = [
  [
    { key: 'mie', emoji: '🍜', label: 'Mie', unit: 'Baki' },
    { key: 'cabai', emoji: '🌶️', label: 'Cabai', unit: 'Resep' },
    { key: 'bawangGoreng', emoji: '🧅', label: 'Bawang Goreng', unit: 'Toples' },
  ],
  [
    { key: 'udangRambutan', emoji: '🍤', label: 'Udang Rambutan', unit: 'Sealpack' },
    { key: 'udangKejuFrozen', emoji: '🧀', label: 'Udang Keju Frozen', unit: 'Keranjang' },
    { key: 'siomayAyam', emoji: '🥟', label: 'Siomay Ayam', unit: 'Dandang' },
  ],
  [
    { key: 'lemonTea', emoji: '🍋', label: 'Lemon Tea', unit: 'Resep' },
    { key: 'orange', emoji: '🍊', label: 'Orange', unit: 'Resep' },
    { key: 'greentea', emoji: '🍵', label: 'Greentea', unit: 'Resep' },
    { key: 'thaitea', emoji: '🧋', label: 'Thaitea', unit: 'Resep' },
  ],
  [
    { key: 'teh', emoji: '🍶', label: 'Teh', unit: 'Resep' },
    { key: 'gula', emoji: '🍯', label: 'Gula', unit: 'Resep' },
  ],
  [
    { key: 'potonganStrawberry', emoji: '🍓', label: 'Potongan Strawberry', unit: 'Toples Kecil' },
    { key: 'potonganCincau', emoji: '🖤', label: 'Potongan Cincau', unit: 'Toples' },
  ],
  [
    { key: 'biangGobak', emoji: '🥣', label: 'Biang Gobak', unit: 'Resep' },
  ],
];

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function nowTimeStr(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export default function QCForm7Prepare() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const onBack = () => navigate('/qc');
  const showToast = (msg: string, _type?: string) => { console.log(msg); };
  const [tanggal, setTanggal] = useState(todayStr());
  const [jam, setJam] = useState(nowTimeStr());
  const [values, setValues] = useState<Record<string, string>>({});
  const [pangsitToples, setPangsitToples] = useState('');
  const [pangsitKeranjang, setPangsitKeranjang] = useState('');
  const [kerupukMie, setKerupukMie] = useState('');
  const [output, setOutput] = useState('');
  const [recordId, setRecordId] = useState('');

  useEffect(() => {
    if (editId) {
      const r = getReportById(editId);
      if (r) {
        const d = JSON.parse(r.data);
        setTanggal(d.tanggal || todayStr());
        setJam(d.jam || nowTimeStr());
        setValues(d.values || {});
        setPangsitToples(d.pangsitToples || '');
        setPangsitKeranjang(d.pangsitKeranjang || '');
        setKerupukMie(d.kerupukMie || '');
        setOutput(r.generated_text || '');
        setRecordId(r.id);
      }
    }
  }, [editId]);

  const setVal = (key: string, val: string) => setValues(prev => ({ ...prev, [key]: val }));

  const formatTanggal = (dateStr: string): string => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return fmtDate(d.toISOString());
  };

  const generate = () => {
    const lines: string[] = [];
    lines.push('📋 *Report Preparean*');
    lines.push(`🗓️ ${formatTanggal(tanggal)}`);
    lines.push(`🕗 ${jam || '-'}`);
    for (let gi = 0; gi < GROUPS.length; gi++) {
      lines.push('');
      for (const item of GROUPS[gi]) {
        lines.push(`${item.emoji} ${item.label}: ${values[item.key] || '-'} ${item.unit}  `);
      }
    }
    lines.push('');
    lines.push(`🥟 Pangsit Goreng: ${pangsitToples || '-'} Toples ${pangsitKeranjang || '-'} Keranjang  `);
    lines.push(`🍘 Kerupuk Mie: ${kerupukMie || '-'} Toples`);
    setOutput(lines.join('\n'));
    showToast('Report generated!', 'success');
  };

  const handleCopy = async () => {
    if (!output) { showToast('Generate report dulu', 'error'); return; }
    await copyText(output);
    showToast('Report copied successfully ✓', 'success');
  };

  const handleSave = () => {
    if (!output) { showToast('Generate report dulu', 'error'); return; }
    const id = recordId || genId();
    const data = JSON.stringify({ tanggal, jam, values, pangsitToples, pangsitKeranjang, kerupukMie });
    saveReport({ id, type: 'prepare', shift: '', data, generated_text: output, created_at: recordId ? '' : nowISO() });
    if (!recordId) setRecordId(id);
    showToast('Record saved ✓', 'success');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-neon-blue transition-all">
          <X size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <ChefHat size={20} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-['Orbitron'] text-sm">Report Preparean</h2>
            <p className="text-xs text-gray-500">Prepare Form</p>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-wider uppercase">📅 Tanggal</label>
          <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)}
            className="w-full bg-panel-dark/80 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-neon-blue/50 focus:outline-none transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-wider uppercase">🕗 Jam</label>
          <input type="time" value={jam} onChange={e => setJam(e.target.value)}
            className="w-full bg-panel-dark/80 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-neon-blue/50 focus:outline-none transition-all" />
        </div>
      </div>

      {/* Groups */}
      {GROUPS.map((group, gi) => (
        <motion.div key={gi} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: gi * 0.05 }}>
          {gi > 0 && <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mb-4" />}
          <div className="space-y-3">
            {group.map(item => (
              <div key={item.key}>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  {item.emoji} {item.label} <span className="opacity-50">({item.unit})</span>
                </label>
                <input type="text" value={values[item.key] || ''} onChange={e => setVal(item.key, e.target.value)} placeholder="-"
                  className="w-full bg-panel-dark/80 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-neon-blue/50 focus:outline-none transition-all" />
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Pangsit & Kerupuk */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-2">🥟 Pangsit Goreng</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input type="text" value={pangsitToples} onChange={e => setPangsitToples(e.target.value)} placeholder="-"
              className="w-full bg-panel-dark/80 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-neon-blue/50 focus:outline-none" />
            <p className="text-[10px] text-gray-500 text-center mt-1">Toples</p>
          </div>
          <div>
            <input type="text" value={pangsitKeranjang} onChange={e => setPangsitKeranjang(e.target.value)} placeholder="-"
              className="w-full bg-panel-dark/80 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-neon-blue/50 focus:outline-none" />
            <p className="text-[10px] text-gray-500 text-center mt-1">Keranjang</p>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-2">🍘 Kerupuk Mie <span className="opacity-50">(Toples)</span></label>
        <input type="text" value={kerupukMie} onChange={e => setKerupukMie(e.target.value)} placeholder="-"
          className="w-full bg-panel-dark/80 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-neon-blue/50 focus:outline-none" />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generate}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-neon-blue border border-neon-blue/30 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all">
          <FileText size={18} /> Generate Report
        </motion.button>
        <div className="grid grid-cols-2 gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-neon-green border border-neon-green/20 bg-neon-green/5 hover:bg-neon-green/10 transition-all">
            <Copy size={16} /> Copy WA
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-neon-pink border border-neon-pink/20 bg-neon-pink/5 hover:bg-neon-pink/10 transition-all">
            <Save size={16} /> Save
          </motion.button>
        </div>
      </div>

      {/* Output */}
      {output && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-wider uppercase">Generated Output</label>
          <div className="p-4 rounded-xl border border-neon-blue/15 bg-panel-dark/60 text-gray-300 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
            {output}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
