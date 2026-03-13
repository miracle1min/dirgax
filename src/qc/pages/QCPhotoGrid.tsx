import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Download, X, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { ToastMsg } from '../types';

interface Props {
  onBack: () => void;
  showToast: (msg: string, type?: ToastMsg['type']) => void;
}

interface PhotoItem { id: string; file: File; url: string; }

const GRID_COLS = 3;
const CELL_SIZE = 400;
const GAP = 8;
const BG_COLOR = '#050510';

export default function QCPhotoGrid({ onBack, showToast }: Props) {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<string | null>(null);

  const addPhotos = useCallback((files: FileList | File[]) => {
    const newPhotos: PhotoItem[] = [];
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      newPhotos.push({ id: crypto.randomUUID(), file, url: URL.createObjectURL(file) });
    });
    if (newPhotos.length === 0) { showToast('Pilih file gambar (JPG/PNG)', 'error'); return; }
    setPhotos(prev => [...prev, ...newPhotos]);
    showToast(`${newPhotos.length} foto ditambahkan`, 'success');
  }, [showToast]);

  const removePhoto = useCallback((id: string) => {
    setPhotos(prev => {
      const p = prev.find(x => x.id === id);
      if (p) URL.revokeObjectURL(p.url);
      return prev.filter(x => x.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    photos.forEach(p => URL.revokeObjectURL(p.url));
    setPhotos([]);
    showToast('Semua foto dihapus', 'info');
  }, [photos, showToast]);

  const handleDragStart = (id: string) => { dragItem.current = id; };
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (dragItem.current && dragItem.current !== id) setDragOverId(id);
  };
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);
    if (!dragItem.current || dragItem.current === targetId) return;
    setPhotos(prev => {
      const arr = [...prev];
      const fromIdx = arr.findIndex(x => x.id === dragItem.current);
      const toIdx = arr.findIndex(x => x.id === targetId);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const [item] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, item);
      return arr;
    });
    dragItem.current = null;
  };

  const handleDropZone = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) addPhotos(e.dataTransfer.files);
  };

  const downloadGrid = useCallback(async () => {
    if (photos.length === 0) return;
    setDownloading(true);
    try {
      const rows = Math.ceil(photos.length / GRID_COLS);
      const padding = GAP * 2;
      const canvasW = GRID_COLS * CELL_SIZE + (GRID_COLS - 1) * GAP + padding * 2;
      const canvasH = rows * CELL_SIZE + (rows - 1) * GAP + padding * 2;
      const canvas = document.createElement('canvas');
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, canvasW, canvasH);

      const loadImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = url;
        });

      const images = await Promise.all(photos.map(p => loadImage(p.url)));
      images.forEach((img, i) => {
        const col = i % GRID_COLS;
        const row = Math.floor(i / GRID_COLS);
        const x = padding + col * (CELL_SIZE + GAP);
        const y = padding + row * (CELL_SIZE + GAP);
        ctx.fillStyle = '#0D0D1A';
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        const scale = Math.max(CELL_SIZE / img.width, CELL_SIZE / img.height);
        const sw = CELL_SIZE / scale, sh = CELL_SIZE / scale;
        const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, CELL_SIZE, CELL_SIZE);
        ctx.clip();
        ctx.drawImage(img, sx, sy, sw, sh, x, y, CELL_SIZE, CELL_SIZE);
        ctx.restore();
        ctx.strokeStyle = 'rgba(0,240,255,0.15)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
      });

      const link = document.createElement('a');
      link.download = `photo-grid-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Grid berhasil di-download! 📸', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal generate grid', 'error');
    } finally {
      setDownloading(false);
    }
  }, [photos, showToast]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-neon-blue transition-all">
          <X size={18} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <LayoutGrid size={20} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-['Orbitron'] text-sm">📸 Photo Grid</h2>
            <p className="text-xs text-gray-500">Upload → Grid 3 Kolom → Download</p>
          </div>
        </div>
        {photos.length > 0 && (
          <button onClick={clearAll} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all">
            <Trash2 size={12} /> Clear
          </button>
        )}
      </div>

      {/* Upload Zone */}
      <div onClick={() => fileInputRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={handleDropZone}
        className="border-2 border-dashed border-neon-blue/25 rounded-2xl p-8 text-center cursor-pointer bg-neon-blue/[0.03] hover:bg-neon-blue/[0.06] hover:border-neon-blue/40 transition-all">
        <Upload size={28} className="text-neon-blue/50 mx-auto mb-2" />
        <p className="text-sm font-semibold text-gray-300">Tap untuk pilih foto</p>
        <p className="text-xs text-gray-500 mt-1">atau drag & drop ke sini • JPG, PNG</p>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => { if (e.target.files) addPhotos(e.target.files); e.target.value = ''; }} />
      </div>

      {/* Photo count */}
      {photos.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-semibold">{photos.length} foto • {Math.ceil(photos.length / GRID_COLS)} baris</span>
          <span className="text-[11px] text-gray-600">hold & drag untuk reorder</span>
        </div>
      )}

      {/* Grid Preview */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5">
          <AnimatePresence>
            {photos.map((photo, idx) => (
              <motion.div key={photo.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                draggable onDragStart={() => handleDragStart(photo.id)} onDragOver={e => handleDragOver(e, photo.id)}
                onDrop={e => handleDrop(e, photo.id)} onDragEnd={() => setDragOverId(null)}
                className={`relative aspect-square rounded-lg overflow-hidden cursor-grab border transition-all ${
                  dragOverId === photo.id ? 'border-2 border-neon-blue/60' : 'border border-white/8'
                }`}>
                <img src={photo.url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 bg-black/60 rounded px-1.5 py-0.5 text-[10px] font-bold text-neon-blue backdrop-blur-sm">
                  {idx + 1}
                </div>
                <button onClick={e => { e.stopPropagation(); removePhoto(photo.id); }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/70 flex items-center justify-center text-white backdrop-blur-sm hover:bg-red-500 transition-all">
                  <X size={10} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty state */}
      {photos.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          <ImageIcon size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">Belum ada foto</p>
          <p className="text-xs mt-1">Upload foto untuk mulai bikin grid</p>
        </div>
      )}

      {/* Download Button */}
      {photos.length > 0 && (
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={downloadGrid} disabled={downloading}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${
            downloading
              ? 'bg-neon-blue/10 text-neon-blue/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-neon-blue/20 to-neon-pink/20 text-neon-blue border border-neon-blue/30 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]'
          }`}>
          {downloading ? '⏳ Generating...' : <><Download size={18} /> Download Grid ({photos.length} foto)</>}
        </motion.button>
      )}
    </motion.div>
  );
}
