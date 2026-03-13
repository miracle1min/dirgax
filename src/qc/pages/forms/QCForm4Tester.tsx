import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Copy, Save, CheckCircle, Edit3 } from 'lucide-react';
import { QCPageHeader } from '../../components/QCPageHeader';
import { SHIFT_OPTIONS } from '../../types';
import { genId, nowISO, reportFooter, copyText } from '../../helpers';
import { getReportById, saveReport } from '../../db';

export const QCForm4Tester = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [shift, setShift] = useState('');
  const [statusMode, setStatusMode] = useState<'auto' | 'manual'>('auto');
  const [manualText, setManualText] = useState('');
  const [output, setOutput] = useState('');
  const [recordId, setRecordId] = useState('');
  const [feedback, setFeedback] = useState('');

  const AUTO_TEXT = '✅ All Produk Aman & Approved untuk di proses';
  const flash = (msg: string) => { setFeedback(msg); setTimeout(() => setFeedback(''), 2500); };

  useEffect(() => {
    if (editId) {
      const r = getReportById(editId);
      if (r) {
        const d = JSON.parse(r.data);
        setShift(d.shift || ''); setStatusMode(d.statusMode || 'auto');
        setManualText(d.manualText || '');
        setOutput(r.generated_text || ''); setRecordId(r.id);
      }
    }
  }, [editId]);

  const generate = () => {
    if (!shift) { flash('Pilih Shift dulu'); return; }
    const ketText = statusMode === 'auto' ? AUTO_TEXT : (manualText || '-');
    const text = `*_TESTER BAHAN & PRODUK SISA SEMALAM_*\n\n🕐 Shift : ${shift}\n📝 Keterangan :\n  ${ketText}\n${reportFooter()}`;
    setOutput(text); flash('Report generated!');
  };

  const handleCopy = async () => {
    if (!output) { flash('Generate report dulu'); return; }
    await copyText(output); flash('Copied! ✓');
  };

  const handleSave = () => {
    if (!output) { flash('Generate report dulu'); return; }
    const id = recordId || genId();
    const data = JSON.stringify({ shift, statusMode, manualText });
    saveReport({ id, type: 'tester_bahan', shift, data, generated_text: output, created_at: recordId ? '' : nowISO() });
    if (!recordId) setRecordId(id);
    flash('Record saved ✓');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-4">
      <QCPageHeader title="Tester Bahan" subtitle="Produk Sisa Semalam" onBack={() => navigate('/qc')} />

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
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">Status</label>
        <div className="space-y-3">
          <div
            onClick={() => setStatusMode('auto')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusMode === 'auto'
                ? 'bg-[#00F0FF]/[0.06] border-[#00F0FF]/40'
                : 'bg-[#0D0D1A]/40 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className={statusMode === 'auto' ? 'text-[#00F0FF]' : 'text-white/30'} />
              <div>
                <div className="text-sm font-semibold text-white">All Produk Aman</div>
                <div className="text-xs text-white/40">Approved untuk di proses</div>
              </div>
            </div>
          </div>
          <div
            onClick={() => setStatusMode('manual')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusMode === 'manual'
                ? 'bg-[#00F0FF]/[0.06] border-[#00F0FF]/40'
                : 'bg-[#0D0D1A]/40 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <Edit3 size={20} className={statusMode === 'manual' ? 'text-[#00F0FF]' : 'text-white/30'} />
              <div>
                <div className="text-sm font-semibold text-white">Manual Input</div>
                <div className="text-xs text-white/40">Tulis keterangan manual</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {statusMode === 'manual' && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
          <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">Keterangan Manual</label>
          <textarea className="w-full bg-[#0D0D1A]/60 border border-[#00F0FF]/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00F0FF] transition-all resize-y min-h-[100px] placeholder:text-white/30" value={manualText} onChange={e => setManualText(e.target.value)} placeholder="Tulis keterangan..." rows={4} />
        </motion.div>
      )}

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

export default QCForm4Tester;
