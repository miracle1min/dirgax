import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, WifiOff, Calendar, Clock, User, ChevronDown, FileSpreadsheet } from 'lucide-react';
import { getSetting, saveSetting } from '../db';

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const DEFAULT_SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1AP4auWVSrecGaloDDlkZeur38StRVupBCw6_tqY9GpM/edit';

interface CrewSchedule { role: string; nama: string; shifts: Record<string, string>; }
type CrewToday = CrewSchedule & { todayShift: string };

const SHIFT_COLORS: Record<string, { label: string; color: string; emoji: string }> = {
  '6':  { label: '06:00', color: '#00f7ff', emoji: '🌅' },
  '8':  { label: '08:00', color: '#4ade80', emoji: '🌤️' },
  '9':  { label: '09:00', color: '#4ade80', emoji: '🌤️' },
  '10': { label: '10:00', color: '#34d399', emoji: '☀️' },
  '11': { label: '11:00', color: '#facc15', emoji: '☀️' },
  '12': { label: '12:00', color: '#facc15', emoji: '🌞' },
  '13': { label: '13:00', color: '#fb923c', emoji: '🔥' },
  '14': { label: '14:00', color: '#fb923c', emoji: '🔥' },
  '15': { label: '15:00', color: '#f87171', emoji: '🌇' },
  '16': { label: '16:00', color: '#ff2bd6', emoji: '🌇' },
  '17': { label: '17:00', color: '#ff2bd6', emoji: '🌆' },
  '18': { label: '18:00', color: '#a855f7', emoji: '🌙' },
  '20': { label: '20:00', color: '#8b5cf6', emoji: '🌙' },
  '22': { label: '22:00', color: '#6366f1', emoji: '🌑' },
};

function getShiftInfo(val: string) {
  const trimmed = val.trim();
  if (!trimmed || trimmed === '-') return { label: 'OFF', color: '#555', emoji: '😴' };
  if (trimmed.toUpperCase() === 'OFF') return { label: 'OFF', color: '#555', emoji: '😴' };
  const num = trimmed.replace(/[^0-9]/g, '');
  if (SHIFT_COLORS[num]) return SHIFT_COLORS[num];
  if (/^\d{1,2}$/.test(num)) return { label: `${num.padStart(2,'0')}:00`, color: '#888', emoji: '⏰' };
  return { label: trimmed, color: '#888', emoji: '⏰' };
}

function generateSheetNames(): string[] {
  const now = new Date();
  const sheets: string[] = [];
  for (let offset = -12; offset <= 2; offset++) {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const nextM = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    sheets.push(`${MONTHS[d.getMonth()]} - ${MONTHS[nextM.getMonth()]} ${nextM.getFullYear() % 100}`);
  }
  return sheets;
}

function getCurrentSheet(): string {
  const now = new Date();
  const day = now.getDate();
  const startMonth = day >= 21 ? new Date(now.getFullYear(), now.getMonth(), 1) : new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endMonth = new Date(startMonth.getFullYear(), startMonth.getMonth() + 1, 1);
  return `${MONTHS[startMonth.getMonth()]} - ${MONTHS[endMonth.getMonth()]} ${endMonth.getFullYear() % 100}`;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = false;
      } else current += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { result.push(current.trim()); current = ''; }
      else current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export default function QCSchedule() {
  const [crew, setCrew] = useState<CrewSchedule[]>([]);
  const [dateColumns, setDateColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');
  const [viewMode, setViewMode] = useState<'today' | 'full'>('today');
  const [sheetNames] = useState<string[]>(generateSheetNames);
  const [selectedSheet, setSelectedSheet] = useState<string>(getCurrentSheet);
  const [showSheetPicker, setShowSheetPicker] = useState(false);

  const today = useMemo(() => new Date().getDate().toString(), []);

  const extractSpreadsheetId = (rawUrl: string): string | null => {
    const match = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const buildFetchUrl = useCallback((rawUrl: string, sheet: string): string | null => {
    const id = extractSpreadsheetId(rawUrl);
    if (!id) return null;
    return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`;
  }, []);

  function processScheduleData(rows: string[][]) {
    if (rows.length < 2) { setError('Data tidak cukup di sheet ini'); return; }
    let headerIdx = -1;
    for (let i = 0; i < Math.min(rows.length, 10); i++) {
      const rowUpper = rows[i].map(c => c.toUpperCase());
      if (rowUpper.some(c => c.includes('CKRBUL') || c.includes('JABATAN'))) { headerIdx = i; break; }
    }
    if (headerIdx < 0) { setError('Header CKRBUL/JABATAN tidak ditemukan'); return; }

    const header = rows[headerIdx];
    let roleColIdx = 0;
    let nameColIdx = 1;
    for (let c = 0; c < header.length; c++) {
      const val = header[c].toUpperCase();
      if (val.includes('CKRBUL') || val.includes('JABATAN')) roleColIdx = c;
      if (val.includes('NAMA')) nameColIdx = c;
    }
    const dateCols: { idx: number; date: string }[] = [];
    for (let c = 0; c < header.length; c++) {
      const val = header[c].trim().replace(/^"|"$/g, '');
      if (/^\d{1,2}$/.test(val) && parseInt(val) >= 1 && parseInt(val) <= 31) dateCols.push({ idx: c, date: val });
    }
    if (dateCols.length === 0) { setError('Kolom tanggal tidak ditemukan'); return; }
    setDateColumns(dateCols.map(d => d.date));

    const crewList: CrewSchedule[] = [];
    let lastRole = '';
    for (let r = headerIdx + 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length < 3) continue;
      const roleVal = row[roleColIdx]?.trim() || '';
      const nama = row[nameColIdx]?.trim() || '';
      if (!nama || nama.toUpperCase() === 'NAMA') continue;
      const role = roleVal || lastRole;
      if (roleVal) lastRole = roleVal;
      const shifts: Record<string, string> = {};
      dateCols.forEach(dc => { shifts[dc.date] = row[dc.idx]?.trim().replace(/^"|"$/g, '') || ''; });
      crewList.push({ role, nama, shifts });
    }
    setCrew(crewList);
    if (crewList.length === 0) setError('Tidak ada data crew ditemukan');
  }

  const fetchSchedule = useCallback(async (sheetOverride?: string) => {
    const sheetName = sheetOverride || selectedSheet;
    const activeUrl = url || DEFAULT_SPREADSHEET_URL;
    const fetchUrl = buildFetchUrl(activeUrl, sheetName);
    if (!fetchUrl) { setError('URL Spreadsheet tidak valid'); return; }
    setLoading(true); setError(''); setCrew([]);
    try {
      const resp = await fetch(fetchUrl);
      const text = await resp.text();
      if (text && text.includes(',')) {
        const csvRows = text.split('\n').filter(l => l.trim()).map(l => parseCSVLine(l));
        processScheduleData(csvRows);
      } else { setError(`Sheet "${sheetName}" tidak ditemukan atau kosong.`); }
    } catch { setError('Gagal mengambil data. Periksa koneksi internet.'); }
    finally { setLoading(false); }
  }, [url, selectedSheet, buildFetchUrl]);

  useEffect(() => {
    const savedUrl = getSetting('scheduleUrl');
    if (savedUrl) setUrl(savedUrl);
    const savedSheet = getSetting('selectedSheet');
    if (savedSheet) setSelectedSheet(savedSheet);
  }, []);

  useEffect(() => { fetchSchedule(); }, [url, selectedSheet]);

  const handleSheetSelect = (sheet: string) => {
    setSelectedSheet(sheet);
    setShowSheetPicker(false);
    saveSetting('selectedSheet', sheet);
  };

  const todaySchedule = useMemo((): CrewToday[] => {
    return crew
      .map(c => ({ ...c, todayShift: c.shifts[today] || '' }))
      .filter(c => c.todayShift !== '' && c.todayShift.toUpperCase() !== 'OFF')
      .sort((a, b) => (parseInt(a.todayShift) || 99) - (parseInt(b.todayShift) || 99));
  }, [crew, today]);

  const offToday = useMemo(() => {
    return crew.filter(c => { const val = c.shifts[today] || ''; return !val || val.toUpperCase() === 'OFF'; });
  }, [crew, today]);

  const groupedToday = useMemo(() => {
    const groups: Record<string, CrewToday[]> = {};
    todaySchedule.forEach(c => {
      const key = c.role || 'Other';
      if (!groups[key]) groups[key] = [];
      groups[key].push(c);
    });
    return groups;
  }, [todaySchedule]);

  const todayDate = useMemo(() => {
    const d = new Date();
    const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    return `${days[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-white font-['Orbitron'] text-sm tracking-wider flex items-center gap-2">
          <Calendar size={18} className="text-neon-blue" /> SCHEDULE
        </h2>
        <p className="text-xs text-gray-500 mt-1">Jadwal Crew</p>
      </div>

      {/* Sheet Picker */}
      <div className="relative">
        <div onClick={() => setShowSheetPicker(!showSheetPicker)}
          className="flex items-center justify-between p-3 rounded-xl border border-neon-blue/20 bg-panel-dark/50 cursor-pointer hover:bg-panel-dark/80 transition-all">
          <div className="flex items-center gap-3">
            <FileSpreadsheet size={16} className="text-neon-blue" />
            <div>
              <div className="text-[10px] text-gray-500">Sheet Aktif</div>
              <div className="text-sm font-semibold text-white">{selectedSheet}</div>
            </div>
          </div>
          <ChevronDown size={16} className={`text-gray-500 transition-transform ${showSheetPicker ? 'rotate-180' : ''}`} />
        </div>
        {showSheetPicker && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
            className="absolute z-20 w-full mt-2 max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-panel-dark/95 backdrop-blur-md shadow-xl">
            {sheetNames.map(s => (
              <div key={s} onClick={() => handleSheetSelect(s)}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-all ${
                  s === selectedSheet ? 'bg-neon-blue/10 text-neon-blue' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}>{s}</div>
            ))}
          </motion.div>
        )}
      </div>

      {/* View Toggle + Refresh */}
      <div className="flex gap-2">
        {(['today', 'full'] as const).map(m => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all border ${
              viewMode === m ? 'bg-neon-blue/15 text-neon-blue border-neon-blue/30' : 'bg-white/[0.03] text-gray-500 border-white/5'
            }`}>
            {m === 'today' ? `📅 Hari Ini (${today})` : '📊 Full Tabel'}
          </button>
        ))}
        <button onClick={() => fetchSchedule()}
          className="px-3 py-2 rounded-lg text-neon-blue border border-neon-blue/20 bg-neon-blue/5 hover:bg-neon-blue/10 transition-all">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw size={24} className="mx-auto text-neon-blue animate-spin mb-2" />
          <p className="text-sm text-gray-400">Loading schedule...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center gap-3">
          <WifiOff size={18} className="text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Today View */}
      {!loading && !error && viewMode === 'today' && crew.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 font-medium">{todayDate}</p>

          {Object.entries(groupedToday).map(([role, members]) => (
            <div key={role}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-3 rounded bg-neon-blue" />
                <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">{role}</span>
                <span className="text-[10px] text-gray-600">({members.length})</span>
              </div>
              <div className="space-y-1.5">
                {members.map(c => {
                  const info = getShiftInfo(c.todayShift);
                  return (
                    <motion.div key={c.nama} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-3">
                        <User size={14} className="text-gray-500" />
                        <span className="text-sm text-white font-medium">{c.nama}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold"
                        style={{ background: `${info.color}15`, color: info.color, border: `1px solid ${info.color}25` }}>
                        <Clock size={12} />
                        <span>{info.emoji} {info.label}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* OFF */}
          {offToday.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-3 rounded bg-gray-600" />
                <span className="text-[10px] font-bold text-gray-600 tracking-wider uppercase">OFF</span>
                <span className="text-[10px] text-gray-700">({offToday.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {offToday.map(c => (
                  <span key={c.nama} className="px-2.5 py-1 rounded-lg text-xs text-gray-500 bg-white/[0.03] border border-white/5">
                    😴 {c.nama}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Table View */}
      {!loading && !error && viewMode === 'full' && crew.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/8">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8">
                <th className="sticky left-0 z-10 bg-panel-dark px-3 py-2 text-left text-gray-500 font-semibold">Nama</th>
                {dateColumns.map(d => (
                  <th key={d} className={`px-2 py-2 text-center font-semibold min-w-[40px] ${
                    d === today ? 'text-neon-blue bg-neon-blue/5' : 'text-gray-500'
                  }`}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {crew.map((c, idx) => (
                <tr key={idx} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="sticky left-0 z-10 bg-[#050510] px-3 py-2 text-white font-medium whitespace-nowrap">{c.nama}</td>
                  {dateColumns.map(d => {
                    const val = c.shifts[d] || '';
                    const info = getShiftInfo(val);
                    return (
                      <td key={d} className={`px-2 py-2 text-center ${d === today ? 'bg-neon-blue/[0.03]' : ''}`}>
                        <span className="text-[10px] font-bold" style={{ color: info.color }}>
                          {val || '-'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
