import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Flame, Thermometer, FlaskConical, PackageX, Database, ChevronRight, ClipboardCheck, PackageCheck } from 'lucide-react';
import { FormType } from '../types';

const MENU_ITEMS: { type: FormType; title: string; subtitle: string; icon: React.ReactNode; color: string; path: string }[] = [
  { type: 'sortir_bawang', title: 'Sortir Bawang', subtitle: 'QC Sorting', icon: <FileText size={20} />, color: '#00F0FF', path: '/qc/form/sortir' },
  { type: 'cabe_giling', title: 'Cabe Giling', subtitle: 'QC Grinding', icon: <Flame size={20} />, color: '#FF2BD6', path: '/qc/form/cabe' },
  { type: 'suhu_equipment', title: 'Suhu Equipment', subtitle: 'Temperature', icon: <Thermometer size={20} />, color: '#00FFA3', path: '/qc/form/suhu' },
  { type: 'tester_bahan', title: 'Tester Bahan', subtitle: 'Material Test', icon: <FlaskConical size={20} />, color: '#9D00FF', path: '/qc/form/tester' },
  { type: 'return_barang', title: 'Return Barang', subtitle: 'Returns', icon: <PackageX size={20} />, color: '#FF6B35', path: '/qc/form/return' },
  { type: 'suhu_datalogger', title: 'Data Logger', subtitle: 'Suhu Logger', icon: <Database size={20} />, color: '#00D4FF', path: '/qc/form/datalogger' },
  { type: 'prepare', title: 'Prepare', subtitle: 'Preparation', icon: <PackageCheck size={20} />, color: '#FFD700', path: '/qc/form/prepare' },
];

export default function QCMenu() {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
          <ClipboardCheck size={20} className="text-neon-blue" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white font-['Orbitron'] tracking-wider">QC REPORT</h2>
          <p className="text-[11px] text-gray-500">Pilih jenis laporan</p>
        </div>
      </div>

      {/* Section Label */}
      <div className="flex items-center gap-2">
        <div className="w-[3px] h-4 rounded bg-gradient-to-b from-neon-blue to-neon-pink" />
        <span className="text-[11px] font-bold text-gray-500 tracking-[0.08em] uppercase">Pilih Report</span>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-3">
        {MENU_ITEMS.map((item, index) => {
          const isLastOdd = MENU_ITEMS.length % 2 === 1 && index === MENU_ITEMS.length - 1;
          return (
            <motion.div key={item.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className={`relative rounded-2xl p-5 cursor-pointer border transition-all overflow-hidden flex flex-col min-h-[130px] group ${
                isLastOdd ? 'col-span-2' : ''
              }`}
              style={{
                background: `linear-gradient(135deg, ${item.color}12 0%, ${item.color}03 100%)`,
                borderColor: `${item.color}18`,
              }}
            >
              {/* Glow dot */}
              <div className="absolute -top-5 -right-5 w-16 h-16 rounded-full blur-xl opacity-20 pointer-events-none"
                style={{ background: item.color }} />

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border"
                style={{
                  background: `${item.color}15`,
                  borderColor: `${item.color}25`,
                  color: item.color,
                }}>
                {item.icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="text-sm font-bold text-white/90 mb-0.5">{item.title}</div>
                <div className="text-[11px] text-white/40 font-medium">{item.subtitle}</div>
              </div>

              {/* Arrow */}
              <div className="absolute bottom-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity" style={{ color: item.color }}>
                <ChevronRight size={16} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
