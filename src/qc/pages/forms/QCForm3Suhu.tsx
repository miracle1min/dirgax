import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Copy, Save, Plus, X } from 'lucide-react';
import { QCPageHeader } from '../../components/QCPageHeader';
import { SHIFT_OPTIONS } from '../../types';
import { genId, nowISO, reportFooter, copyText } from '../../helpers';
import { getReportById, saveReport } from '../../db';

export const QCForm3Suhu = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [shift, setShift] = useState('');
  const [fryer, setFryer] = useState('');
  const [boiler, setBoiler] = useState('');
  const [griddle, setGriddle] = useState('');
  const [kompor, setKompor] = useState('');
  const [keterangan, setKeterangan] = useState<string[]>(['']);
  const [output, setOutput] = useState('');
  const [recordId, setRecordId] = useState('');
  const [feedback, setFeedback] = useState('');

  const flash = (msg: string) => { setFeedback(msg); setTimeout(() => setFeedback(''), 2500); };

  useEffect(() => {
    if (editId) {
      const r = getReportById(editId);
      if (r) {
        const d = JSON.parse(r.data);
        setShift(d.shift || ''); setFryer(d.fryer || ''); setBoiler(d.boiler || '');
        setGriddle(d.griddle || ''); setKompor(d.kompor || '');
        setKeterangan(d.keterangan?.length ? d.keterangan : ['']);
        setOutput(r.generated_text || ''); setRecordId(r.id);
      }
    }
  }, [editId]);

  const addKet = () => setKeterangan(prev => [...prev, '']);
  const removeKet = (i: number) => setKeterangan(prev => prev.filter((_, idx) => idx !== i));
  const updateKet = (i: number, v: string) => setKeterangan(prev => prev.map((item, idx) => idx === i ? v : item));

  const generate = () => {
    if (!shift) { flash('Pilih Shift dulu'); return; }
    const ketList = keterangan.filter(k => k.trim()).map(k => `• ${k}`).join('\n');
    const text = `*_SUHU ALL EQUIPMENTS (°C)_*\n\n🕐 Shift : ${shift}\n🍳 Fryer Dimsum : ${fryer || '-'}°C\n♨️ Boiler : ${boiler || '-'}°C\n🔥 Griddle : ${griddle || '-'}°C\n🍲 Kompor Produksi : ${kompor || '-'}°C\n\n📝 Keterangan :\n${ketList || '• -'}\n${reportFooter()}`;
    setOutput(text); flash('Report generated!');
  };

  const handleCopy = async () => {
    if (!output) { flash('Generate report dulu'); return; }
    await copyText(output); flash('Copied! ✓');
  };

  const handleSave = () => {
    if (!output) { flash('Generate report dulu'); return; }
    const id = recordId || genId();
    const data = JSON.stringify({ shift, fryer, boiler, griddle, kompor, keterangan });
    saveReport({ id, type: 'suhu_equipment', shift, data, generated_text: output, created_at: recordId ? '' : nowISO() });
    if (!recordId) setRecordId(id);
    flash('Record saved ✓');
  };

  const inputCls = "w-full bg-[#0D0D1A]/60 border border-[#00F0FF]/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00F0FF] transition-all placeholder:text-white/30";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-4">
      <QCPageHeader title="Suhu Equipment" subtitle="All Equipments (°C)" onBack={() => navigate('/qc')} />

      {feedback && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF] px-4 py-2 rounded-xl text-sm text-center font-medium"
        >{feedback}</motion.div>
      )}

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">Shift</label>
        <select className={inputCls} value={shift} onChange={e => setShift(e.target.value)}>
          <option value="" className="bg-[#0D0D1A]">— Pilih Shift —</option>
          {SHIFT_OPTIONS.map(s => <option key={s} value={s} className="bg-[#0D0D1A]">{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">🍳 Fryer Dimsum (°C)</label>
        <input type="number" className={inputCls} value={fryer} onChange={e => setFryer(e.target.value)} placeholder="0" />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">♨️ Boiler (°C)</label>
        <input type="number" className={inputCls} value={boiler} onChange={e => setBoiler(e.target.value)} placeholder="0" />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">🔥 Griddle (°C)</label>
        <input type="number" className={inputCls} value={griddle} onChange={e => setGriddle(e.target.value)} placeholder="0" />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">🍲 Kompor Produksi (°C)</label>
        <input type="number" className={inputCls} value={kompor} onChange={e => setKompor(e.target.value)} placeholder="0" />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">Keterangan</label>
        <div className="space-y-2">
          {keterangan.map((ket, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/[0.03] rounded-xl px-3 py-2">
              <span className="text-[#00F0FF] font-bold text-sm">•</span>
              <input className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder:text-white/30" value={ket} onChange={e => updateKet(i, e.target.value)} placeholder="Keterangan..." />
              {keterangan.length > 1 && (
                <button onClick={() => removeKet(i)} className="text-red-400 hover:text-red-300 p-1"><X size={16} /></button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addKet} className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all">
          <Plus size={14} /> Add Keterangan
        </button>
      </div>

      <div className="space-y-3 pt-2">
        <button onClick={generate} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold bg-[#00F0FF] text-black hover:opacity-90 transition-all">
          <FileText size={18} /> Generate Report
        </button>
        <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all">
          <Copy size={18} /> Copy to WhatsApp
        </button>
        <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-[#FF2BD6] text-[#FF2BD6] hover:bg-[#FF2BD6]/10 transition-all">
          <Save size={18} /> Save Record
        </button>
      </div>

      {output && (
        <div>
          <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">Generated Output</label>
          <div className="bg-black/30 border border-[#00F0FF]/10 rounded-xl p-4 font-mono text-xs text-white/70 whitespace-pre-wrap leading-relaxed">{output}</div>
        </div>
      )}
    </motion.div>
  );
};

export default QCForm3Suhu;
