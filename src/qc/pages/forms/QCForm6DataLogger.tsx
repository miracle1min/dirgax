import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Copy, Save, Plus, X, ThermometerSnowflake } from 'lucide-react';
import { SHIFT_OPTIONS } from '../../types';
import { genId, nowISO, reportFooter, copyText } from '../../helpers';
import { getReportById, saveReport } from '../../db';

const EQUIPMENT_LIST = [
  { key: 'chiller_dimsum', label: 'Chiller Dimsum', emoji: '🧊' },
  { key: 'chiller_noodle', label: 'Chiller Noodle', emoji: '🍜' },
  { key: 'chiller_bar', label: 'Chiller Bar', emoji: '🍹' },
  { key: 'chiller_produksi', label: 'Chiller Produksi', emoji: '⚙️' },
  { key: 'freezer_1', label: 'Freezer 1', emoji: '❄️' },
  { key: 'freezer_2', label: 'Freezer 2', emoji: '❄️' },
  { key: 'cold_storage', label: 'Cold Storage', emoji: '🏔️' },
] as const;

type EquipmentKey = typeof EQUIPMENT_LIST[number]['key'];

interface TempData { min: string; max: string; avg: string; }
const emptyTemp = (): TempData => ({ min: '', max: '', avg: '' });

export default function QCForm6DataLogger() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const onBack = () => navigate('/qc');
  const showToast = (msg: string, _type?: string) => { console.log(msg); };
  const [shift, setShift] = useState('');
  const [temps, setTemps] = useState<Record<EquipmentKey, TempData>>(
    () => Object.fromEntries(EQUIPMENT_LIST.map(e => [e.key, emptyTemp()])) as Record<EquipmentKey, TempData>
  );
  const [keterangan, setKeterangan] = useState<string[]>(['']);
  const [output, setOutput] = useState('');
  const [recordId, setRecordId] = useState('');

  useEffect(() => {
    if (editId) {
      const r = getReportById(editId);
      if (r) {
        const d = JSON.parse(r.data);
        setShift(d.shift || '');
        if (d.temps) setTemps(d.temps);
        setKeterangan(d.keterangan?.length ? d.keterangan : ['']);
        setOutput(r.generated_text || '');
        setRecordId(r.id);
      }
    }
  }, [editId]);

  const updateTemp = (key: EquipmentKey, field: keyof TempData, value: string) => {
    setTemps(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const addKet = () => setKeterangan(prev => [...prev, '']);
  const removeKet = (i: number) => setKeterangan(prev => prev.filter((_, idx) => idx !== i));
  const updateKet = (i: number, v: string) => setKeterangan(prev => prev.map((item, idx) => idx === i ? v : item));

  const generate = () => {
    if (!shift) { showToast('Pilih Shift dulu', 'error'); return; }
    const equipLines = EQUIPMENT_LIST.map(eq => {
      const t = temps[eq.key];
      return `${eq.emoji} *${eq.label}*\nMin : ${t.min || '-'}°C\nMax : ${t.max || '-'}°C\nAvg : ${t.avg || '-'}°C`;
    }).join('\n\n');
    const ketList = keterangan.filter(k => k.trim()).map(k => `• ${k}`).join('\n');
    const text = `*_SUHU DATA LOGGER (°C)_*\n\n🕐 Shift : ${shift}\n\n${equipLines}\n\n📝 Keterangan :\n${ketList || '• -'}\n${reportFooter()}`;
    setOutput(text);
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
    const data = JSON.stringify({ shift, temps, keterangan });
    saveReport({ id, type: 'suhu_datalogger', shift, data, generated_text: output, created_at: recordId ? '' : nowISO() });
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
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <ThermometerSnowflake size={20} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-['Orbitron'] text-sm">Suhu Data Logger</h2>
            <p className="text-xs text-gray-500">Chiller, Freezer & Cold Storage (°C)</p>
          </div>
        </div>
      </div>

      {/* Shift */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-wider uppercase">Shift</label>
        <select value={shift} onChange={e => setShift(e.target.value)}
          className="w-full bg-panel-dark/80 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-neon-blue/50 focus:outline-none transition-all">
          <option value="">— Pilih Shift —</option>
          {SHIFT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Equipment Cards */}
      {EQUIPMENT_LIST.map((eq, idx) => (
        <motion.div key={eq.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
          className="p-4 rounded-xl border border-neon-blue/15 bg-neon-blue/[0.03]">
          <label className="block text-sm font-semibold text-white mb-3">{eq.emoji} {eq.label}</label>
          <div className="grid grid-cols-3 gap-3">
            {(['min', 'max', 'avg'] as const).map(field => (
              <div key={field}>
                <label className={`block text-[10px] font-semibold mb-1 ${field === 'min' ? 'text-blue-400' : field === 'max' ? 'text-orange-400' : 'text-green-400'}`}>
                  {field.charAt(0).toUpperCase() + field.slice(1)} (°C)
                </label>
                <input type="number" step="0.1" value={temps[eq.key][field]}
                  onChange={e => updateTemp(eq.key, field, e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-panel-dark/80 border border-white/10 rounded-lg px-3 py-2 text-white text-sm text-center focus:border-neon-blue/50 focus:outline-none transition-all" />
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Keterangan */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-wider uppercase">Keterangan</label>
        <div className="space-y-2">
          {keterangan.map((ket, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-neon-blue font-bold">•</span>
              <input value={ket} onChange={e => updateKet(i, e.target.value)} placeholder="Keterangan..."
                className="flex-1 bg-panel-dark/80 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-blue/50 focus:outline-none" />
              {keterangan.length > 1 && (
                <button onClick={() => removeKet(i)} className="p-1 text-red-400 hover:text-red-300"><X size={16} /></button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addKet} className="mt-2 flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-neon-blue border border-neon-blue/20 rounded-lg bg-neon-blue/5 hover:bg-neon-blue/10 transition-all">
          <Plus size={14} /> Add Keterangan
        </button>
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
