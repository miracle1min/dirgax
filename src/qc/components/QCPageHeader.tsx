import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  onBack?: () => void;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export const QCPageHeader: React.FC<Props> = ({ title, onBack, subtitle, rightAction }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 px-1 pt-2 pb-4"
  >
    {onBack && (
      <button
        onClick={onBack}
        className="p-1 -ml-1 text-[#00F0FF] hover:text-[#00F0FF]/80 transition-colors"
      >
        <ChevronLeft size={26} />
      </button>
    )}
    <div className="flex-1 min-w-0">
      <h1 className="text-lg font-bold text-[#00F0FF] tracking-wide font-[Orbitron] m-0">{title}</h1>
      {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
    </div>
    {rightAction && <div>{rightAction}</div>}
  </motion.div>
);
