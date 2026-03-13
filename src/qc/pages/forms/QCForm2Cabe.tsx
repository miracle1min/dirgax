import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Copy, Save, Scale } from 'lucide-react';
import { QCPageHeader } from '../../components/QCPageHeader';
import { SHIFT_OPTIONS } from '../../types';
import { genId, nowISO, copyText, formatDateTimeInput } from '../../helpers';
import { getReportById, saveReport } from '../../db';

const TARE_OPTIONS = [
  { label: 'Pakai Tutup', value: 185 },
  { label: 'Tanpa Tutup', value: 125 },
] as const;

export const QCForm2Cabe = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [shift, setShift] = useState('');
  const [kodeProduksi, setKodeProduksi] = useState('');
  const [beratKotor, setBeratKotor] = useState('');
  const [tareType, setTareType] = useState<'tutup' | 'tanpa'>('tutup');
  const [temuan, setTemuan] = useState('');
  const [output, setOutput] = useState('');
  const [recordId, setRecordId] = useState('');
  const [feedback, setFeedback] = useState('');

  const tareWeight = tareType === 'tutup' ? 185 : 125;
  const beratBersih = beratKotor ? Math.max(0, Number(beratKotor) - tareWeight) : 0;

  const flash = (msg: string) => { setFeedback(msg); setTimeout(() => setFeedback(''), 2500); };

  useEffect(() => {
    if (editId) {
      const r = getReportById(editId);
      if (r) {
        const d = JSON.parse(r.data);
        setShift(d.shift || ''); setKodeProduksi(d.kodeProduksi || '');
        setBeratKotor(d.beratKotor || d.qty || '');
        setTareType(d.tareType || 'tutup');
        setTemuan(d.temuan || '');
        setOutput(r.generated_text || ''); setRecordId(r.id);
      }
    }
  }, [editId]);

  const generate = () => {
    if (!shift) { flash('Pilih Shift dulu'); return; }
    const text = `*CABE GILING*\nShift: ${shift}\nKode: ${formatDateTimeInput(kodeProduksi)}\nBerat: ${beratKotor ? beratBersih : '-'} g (nett)\nTemuan: ${temuan || '-'}`;
    setOutput(text); flash('Report generated!');
  };

  const handleCopy = async () => {
    if (!output) { flash('Generate report dulu'); return; }
    await copyText(output); flash('Copied! ✓');
  };

  const handleSave = () => {
    if (!output) { flash('Generate report dulu'); return; }
    const id = recordId || genId();
    const data = JSON.stringify({ shift, kodeProduksi, beratKotor, tareType, temuan });
    saveReport({ id, type: 'cabe_giling', shift, data, generated_text: output, created_at: recordId ? '' : nowISO() });
    if (!recordId) setRecordId(id);
    flash('Record saved ✓');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-4">
      <QCPageHeader title="Cabe Giling" subtitle="Report Form" onBack={() => navigate('/qc')} />

      {feedback && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF] px-4 py-2 rounded-xl text-sm text-center font-medium"
        >{feedback}</motion.div>
      )}

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">Shift</label>
        <select className="w-full bg-[#0D0D1A]/60 border border-[#00F0FF]/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00F0FF] transition-all" value={shift} onChange={e => setShift(e.target.value)}>
          <option value="" className="bg-[#0D0D1A]">— Pilih Shift —</option>
          {SHIFT_OPTIONS.map(s => <option key={s} value={s} className="bg-[#0D0D1A]">{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">Kode Produksi</label>
        <input type="datetime-local" className="w-full bg-[#0D0D1A]/60 border border-[#00F0FF]/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00F0FF] transition-all" value={kodeProduksi} onChange={e => setKodeProduksi(e.target.value)} />
      </div>

      {/* Tare Type Selector */}
      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold flex items-center gap-1.5">
          <Scale size={12} /> Jenis Wadah
        </label>
        <div className="grid grid-cols-2 gap-3">
          {TARE_OPTIONS.map(opt => {
            const isActive = (opt.label === 'Pakai Tutup' && tareType === 'tutup') || (opt.label === 'Tanpa Tutup' && tareType === 'tanpa');
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => setTareType(opt.label === 'Pakai Tutup' ? 'tutup' : 'tanpa')}
                className={`relative py-3 px-4 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                  isActive
                    ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-[#0D0D1A]/60 border-white/10 text-white/50 hover:border-white/25 hover:text-white/70'
                }`}
              >
                <div>{opt.label}</div>
                <div className={`text-xs mt-0.5 ${isActive ? 'text-[#00F0FF]/70' : 'text-white/30'}`}>
                  −{opt.value} gram
                </div>
                {isActive && (
                  <motion.div
                    layoutId="tare-indicator"
                    className="absolute inset-0 rounded-xl border-2 border-[#00F0FF] pointer-events-none"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Berat Kotor Input */}
      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">Berat Kotor (gram)</label>
        <input
          type="number"
          className="w-full bg-[#0D0D1A]/60 border border-[#00F0FF]/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00F0FF] transition-all placeholder:text-white/30"
          value={beratKotor}
          onChange={e => setBeratKotor(e.target.value)}
          placeholder="Masukkan berat timbangan..."
        />
      </div>

      {/* Berat Bersih Display */}
      {beratKotor && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#00FFA3]/5 border border-[#00FFA3]/30 rounded-xl p-4"
        >
          <div className="text-xs text-[#00FFA3]/60 uppercase tracking-wider font-semibold mb-1">Berat Bersih</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#00FFA3] font-mono">{beratBersih}</span>
            <span className="text-sm text-[#00FFA3]/50">gram</span>
          </div>
          <div className="text-xs text-white/30 mt-1">
            {beratKotor}g − {tareWeight}g ({tareType === 'tutup' ? 'pakai tutup' : 'tanpa tutup'})
          </div>
        </motion.div>
      )}

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">Temuan QC</label>
        <textarea className="w-full bg-[#0D0D1A]/60 border border-[#00F0FF]/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00F0FF] transition-all resize-y min-h-[80px] placeholder:text-white/30" value={temuan} onChange={e => setTemuan(e.target.value)} placeholder="Temuan..." rows={3} />
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

export default QCForm2Cabe;
