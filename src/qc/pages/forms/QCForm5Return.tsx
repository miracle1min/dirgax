import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PackageX, Copy, Save, Plus, Trash2 } from 'lucide-react';
import { QCPageHeader } from '../../components/QCPageHeader';
import { genId, nowISO, reportFooter, copyText, fmtDate } from '../../helpers';
import { getReportById, saveReport } from '../../db';

export const QCForm5Return = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [cabang, setCabang] = useState('');
  const [supplier, setSupplier] = useState('');
  const [namaBarang, setNamaBarang] = useState('');
  const [tglProduksi, setTglProduksi] = useState('');
  const [tglPengiriman, setTglPengiriman] = useState('');
  const [jumlahQty, setJumlahQty] = useState('');
  const [satuanQty, setSatuanQty] = useState<'pcs' | 'pack'>('pcs');
  const [detailLines, setDetailLines] = useState<string[]>(['']);
  const [generated, setGenerated] = useState('');
  const [feedback, setFeedback] = useState('');

  const flash = (msg: string) => { setFeedback(msg); setTimeout(() => setFeedback(''), 2500); };

  useEffect(() => {
    if (editId) {
      const r = getReportById(editId);
      if (r) {
        try {
          const d = JSON.parse(r.data);
          setCabang(d.cabang || ''); setSupplier(d.supplier || '');
          setNamaBarang(d.namaBarang || ''); setTglProduksi(d.tglProduksi || '');
          setTglPengiriman(d.tglPengiriman || ''); setJumlahQty(d.jumlahQty || '');
          setSatuanQty(d.satuanQty || 'pcs'); setDetailLines(d.detailLines || ['']);
          setGenerated(r.generated_text);
        } catch { /* ignore */ }
      }
    }
  }, [editId]);

  const addLine = () => setDetailLines([...detailLines, '']);
  const removeLine = (i: number) => {
    const n = [...detailLines]; n.splice(i, 1);
    setDetailLines(n.length ? n : ['']);
  };
  const updateLine = (i: number, v: string) => {
    const n = [...detailLines]; n[i] = v; setDetailLines(n);
  };

  const generate = () => {
    const tglProdFormatted = tglProduksi ? fmtDate(new Date(tglProduksi).toISOString()) : '-';
    const tglKirimFormatted = tglPengiriman ? fmtDate(new Date(tglPengiriman).toISOString()) : '-';
    const detailText = detailLines.filter(l => l.trim()).map(l => `  • ${l}`).join('\n') || '  • -';
    const text = `*_FORM RETURN_*\n\n🏪 Cabang Resto : ${cabang || '-'}\n🚚 Supplier : ${supplier || '-'}\n📦 Nama Barang : ${namaBarang || '-'}\n📅 Tgl Produksi : ${tglProdFormatted}\n🚛 Tgl Pengiriman : ${tglKirimFormatted}\n🔢 Jumlah Qty : ${jumlahQty || '-'} ${satuanQty}\n📝 Detail/Komplain :\n${detailText}\n${reportFooter()}`;
    setGenerated(text); flash('Report generated!');
  };

  const doCopy = async () => {
    if (!generated) return;
    const ok = await copyText(generated);
    flash(ok ? 'Copied! Paste to WhatsApp 📋' : 'Copy failed');
  };

  const doSave = () => {
    if (!generated) { flash('Generate report dulu!'); return; }
    const id = editId || genId();
    const data = JSON.stringify({ cabang, supplier, namaBarang, tglProduksi, tglPengiriman, jumlahQty, satuanQty, detailLines });
    saveReport({ id, type: 'return_barang', shift: '-', data, generated_text: generated, created_at: editId ? '' : nowISO() });
    flash(editId ? 'Updated! ✏️' : 'Saved! 💾');
  };

  const inputCls = "w-full bg-[#0D0D1A]/60 border border-[#00F0FF]/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00F0FF] transition-all placeholder:text-white/30";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-4">
      <QCPageHeader title="Form Return Barang" subtitle="Return ke Supplier" onBack={() => navigate('/qc')} />

      {feedback && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF] px-4 py-2 rounded-xl text-sm text-center font-medium"
        >{feedback}</motion.div>
      )}

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">🏪 Cabang Resto</label>
        <input className={inputCls} value={cabang} onChange={e => setCabang(e.target.value)} placeholder="Nama cabang..." />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">🚚 Supplier</label>
        <input className={inputCls} value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="Nama supplier..." />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">📦 Nama Barang</label>
        <input className={inputCls} value={namaBarang} onChange={e => setNamaBarang(e.target.value)} placeholder="Nama barang..." />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">📅 Tgl Produksi</label>
        <input type="date" className={inputCls} value={tglProduksi} onChange={e => setTglProduksi(e.target.value)} />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">🚛 Tgl Pengiriman</label>
        <input type="date" className={inputCls} value={tglPengiriman} onChange={e => setTglPengiriman(e.target.value)} />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">🔢 Jumlah Qty</label>
        <div className="flex gap-2">
          <input type="number" inputMode="numeric" className={`${inputCls} flex-1`} value={jumlahQty} onChange={e => setJumlahQty(e.target.value)} placeholder="0" />
          <div className="flex rounded-xl overflow-hidden border border-[#00F0FF]/15">
            {(['pcs', 'pack'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSatuanQty(s)}
                className={`px-4 py-2 text-sm font-semibold transition-all ${
                  satuanQty === s
                    ? 'bg-[#00F0FF]/15 text-[#00F0FF]'
                    : 'bg-transparent text-white/30 hover:text-white/50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-semibold">📝 Detail / Komplain</label>
        {detailLines.map((line, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <input className={`${inputCls} flex-1`} value={line} onChange={e => updateLine(i, e.target.value)} placeholder={`Detail ${i + 1}...`} />
            {detailLines.length > 1 && (
              <button onClick={() => removeLine(i)} className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all flex-shrink-0">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        <button onClick={addLine} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border border-dashed border-[#00F0FF]/20 bg-[#00F0FF]/[0.03] text-[#00F0FF] hover:bg-[#00F0FF]/[0.08] transition-all">
          <Plus size={14} /> Tambah Detail
        </button>
      </div>

      <div className="space-y-3 pt-2">
        <button onClick={generate} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold bg-[#00F0FF] text-black hover:opacity-90 transition-all">
          <PackageX size={16} /> Generate Report
        </button>
      </div>

      {generated && (
        <>
          <div className="bg-black/30 border border-[#00F0FF]/10 rounded-xl p-4 font-mono text-xs text-white/70 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
            {generated}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={doCopy} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all">
              <Copy size={16} /> Copy WA
            </button>
            <button onClick={doSave} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-[#FF2BD6] text-[#FF2BD6] hover:bg-[#FF2BD6]/10 transition-all">
              <Save size={16} /> Save
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default QCForm5Return;
