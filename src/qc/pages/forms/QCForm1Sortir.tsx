import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Copy, Save } from 'lucide-react';
import { QCPageHeader } from '../../components/QCPageHeader';
import { SHIFT_OPTIONS } from '../../types';
import { genId, nowISO, reportFooter, copyText, formatDateInput, fmtDate } from '../../helpers';
import { getReportById, saveReport } from '../../db';

export const QCForm1Sortir = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [shift, setShift] = useState('');
  const [kodeProduksi, setKodeProduksi] = useState('');
  const [kodeExpired, setKodeExpired] = useState('');
  const [kodeLot, setKodeLot] = useState('');
  const [qtyPack, setQtyPack] = useState('');
  const [temuan, setTemuan] = useState('');
  const [output, setOutput] = useState('');
  const [recordId, setRecordId] = useState('');
  const [feedback, setFeedback] = useState('');

  const flash = (msg: string) => { setFeedback(msg); setTimeout(() => setFeedback(''), 2500); };

  useEffect(() => {
    if (editId) {
      const r = getReportById(editId);
      if (r) {
        const d = JSON.parse(r.data);
        setShift(d.shift || ''); setKodeProduksi(d.kodeProduksi || '');
        setKodeExpired(d.kodeExpired || ''); setKodeLot(d.kodeLot || '');
        setQtyPack(d.qtyPack || ''); setTemuan(d.temuan || '');
        setOutput(r.generated_text || ''); setRecordId(r.id);
      }
    }
  }, [editId]);

  const generate = () => {
    if (!shift) { flash('Pilih Shift dulu'); return; }
    const kp = kodeProduksi ? fmtDate(new Date(kodeProduksi).toISOString()) : '-';
    const text = `*_REPORT SORTIR BAWANG GORENG_*\n\n🕐 Shift : ${shift}\n📅 Kode Produksi : ${kp}\n⏳ Kode Expired : ${formatDateInput(kodeExpired)}\n🏷️ Kode LOT : ${formatDateInput(kodeLot)}\n📦 Qty Pack : ${qtyPack || '-'}\n🔍 Temuan QC :\n  ${temuan || '-'}\n${reportFooter()}`;
    setOutput(text); flash('Report generated!');
  };

  const handleCopy = async () => {
    if (!output) { flash('Generate report dulu'); return; }
    await copyText(output); flash('Copied! ✓');
  };

  const handleSave = () => {
    if (!output) { flash('Generate report dulu'); return; }
    const id = recordId || genId();
    const data = JSON.stringify({ shift, kodeProduksi, kodeExpired, kodeLot, qtyPack, temuan });
    saveReport({ id, type: 'sortir_bawang', shift, data, generated_text: output, created_at: recordId ? '' : nowISO() });
    if (!recordId) setRecordId(id);
    flash('Record saved ✓');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-4">
      <QCPageHeader title="Sortir Bawang Goreng" subtitle="Report Form" onBack={() => navigate('/qc')} />

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
        <input type="date" className="w-full bg-[#0D0D1A]/60 border border-[#00F0FF]/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00F0FF] transition-all" value={kodeProduksi} onChange={e => setKodeProduksi(e.target.value)} />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">Kode Expired</label>
        <input type="date" className="w-full bg-[#0D0D1A]/60 border border-[#00F0FF]/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00F0FF] transition-all" value={kodeExpired} onChange={e => setKodeExpired(e.target.value)} />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">Kode LOT</label>
        <input type="date" className="w-full bg-[#0D0D1A]/60 border border-[#00F0FF]/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00F0FF] transition-all" value={kodeLot} onChange={e => setKodeLot(e.target.value)} />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">Qty Pack</label>
        <input type="number" className="w-full bg-[#0D0D1A]/60 border border-[#00F0FF]/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00F0FF] transition-all placeholder:text-white/30" value={qtyPack} onChange={e => setQtyPack(e.target.value)} placeholder="0" />
      </div>

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

export default QCForm1Sortir;
