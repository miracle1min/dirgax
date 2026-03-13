import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Trash2, Link, Info } from 'lucide-react';
import { QCPageHeader } from '../components/QCPageHeader';
import { getSetting, setSetting, exportAllData, importAllData, clearAllData } from '../db';

export const QCSettings = () => {
  const [scheduleUrl, setScheduleUrl] = useState('');
  const [urlSaved, setUrlSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => { setScheduleUrl(getSetting('scheduleUrl')); }, []);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };

  const saveUrl = () => {
    setSetting('scheduleUrl', scheduleUrl);
    setUrlSaved(true);
    setTimeout(() => setUrlSaved(false), 2000);
    showFeedback('Schedule URL saved ✓');
  };

  const handleExport = () => {
    try {
      const backup = exportAllData();
      const jsonStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qc-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showFeedback('Backup exported ✓');
    } catch {
      showFeedback('Export failed');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        importAllData(data);
        showFeedback(`Imported ${data.reports?.length || 0} reports, ${data.notes?.length || 0} notes ✓`);
      } catch {
        showFeedback('Import failed — invalid file');
      }
    };
    input.click();
  };

  const handleClear = () => {
    clearAllData();
    setShowClearConfirm(false);
    showFeedback('All data cleared');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-5">
      <QCPageHeader title="QC Settings" subtitle="App Configuration" />

      {/* Feedback toast */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 bg-[#00F0FF]/10 border border-[#00F0FF]/50 text-[#00F0FF] px-4 py-2 rounded-xl text-sm font-medium"
        >
          {feedback}
        </motion.div>
      )}

      {/* Schedule URL */}
      <div className="bg-[#0D0D1A]/60 backdrop-blur-xl border border-[#00F0FF]/10 rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <Link size={18} className="text-[#00F0FF]" />
          <span className="text-[15px] font-semibold text-white">Schedule Spreadsheet URL</span>
        </div>
        <input
          className="w-full bg-[#0D0D1A]/60 border border-[#00F0FF]/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00F0FF] focus:shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all placeholder:text-white/30"
          value={scheduleUrl}
          onChange={e => setScheduleUrl(e.target.value)}
          placeholder="https://docs.google.com/spreadsheets/d/..."
        />
        <button
          onClick={saveUrl}
          className="mt-3 px-4 py-2 rounded-xl text-xs font-bold border border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all"
        >
          {urlSaved ? '✓ Saved' : 'Save URL'}
        </button>
        <p className="text-[11px] text-white/30 mt-2">Paste Google Sheets URL — data diambil otomatis via CSV</p>
      </div>

      {/* Data Management */}
      <div className="bg-[#0D0D1A]/60 backdrop-blur-xl border border-[#00F0FF]/10 rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <Download size={18} className="text-[#00F0FF]" />
          <span className="text-[15px] font-semibold text-white">Data Management</span>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={handleExport} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all">
            <Download size={18} /> Export Backup (JSON)
          </button>
          <button onClick={handleImport} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-[#FF2BD6] text-[#FF2BD6] hover:bg-[#FF2BD6]/10 transition-all">
            <Upload size={18} /> Import Backup (JSON)
          </button>
          <div className="border-t border-white/5 my-2" />
          {showClearConfirm ? (
            <div className="flex gap-2">
              <button onClick={handleClear} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-red-500 text-red-400 hover:bg-red-500/10 transition-all">
                Yes, Clear All
              </button>
              <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/50 hover:border-white/20 transition-all">
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setShowClearConfirm(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all">
              <Trash2 size={18} /> Clear All Data
            </button>
          )}
        </div>
      </div>

      {/* About */}
      <div className="bg-[#0D0D1A]/60 backdrop-blur-xl border border-[#00F0FF]/10 rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <Info size={18} className="text-[#00F0FF]" />
          <span className="text-[15px] font-semibold text-white">About</span>
        </div>
        <div className="space-y-2">
          {[
            ['App Version', 'v1.1.0', true],
            ['Platform', 'QC Report PWA', false],
            ['Storage', 'JSON LocalStorage', false],
          ].map(([label, value, isNeon]) => (
            <div key={label as string} className="flex justify-between text-[13px]">
              <span className="text-white/40">{label as string}</span>
              <span className={isNeon ? 'text-[#00F0FF] font-semibold' : 'text-white/70'}>{value as string}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default QCSettings;
