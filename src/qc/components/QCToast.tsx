import { motion, AnimatePresence } from 'framer-motion';
import { ToastMsg } from '../types';

interface Props {
  toasts: ToastMsg[];
}

const colorMap = {
  success: { bg: 'bg-[#00F0FF]/10', border: 'border-[#00F0FF]/50', text: 'text-[#00F0FF]' },
  error: { bg: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400' },
  info: { bg: 'bg-[#FF2BD6]/10', border: 'border-[#FF2BD6]/50', text: 'text-[#FF2BD6]' },
};

export const QCToast: React.FC<Props> = ({ toasts }) => (
  <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-2 pointer-events-none w-[88%] max-w-[360px]">
    <AnimatePresence>
      {toasts.map((t) => {
        const c = colorMap[t.type];
        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`${c.bg} ${c.border} ${c.text} border rounded-xl px-5 py-3 text-sm font-medium text-center`}
          >
            {t.message}
          </motion.div>
        );
      })}
    </AnimatePresence>
  </div>
);
