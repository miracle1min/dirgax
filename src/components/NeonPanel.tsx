import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface NeonPanelProps {
  children: ReactNode;
  title?: string;
  variant?: 'blue' | 'purple' | 'pink' | 'green';
  className?: string;
  headerAction?: ReactNode;
}

const borderColors = {
  blue: 'border-neon-blue/10 hover:border-neon-blue/20',
  purple: 'border-neon-purple/10 hover:border-neon-purple/20',
  pink: 'border-neon-pink/10 hover:border-neon-pink/20',
  green: 'border-neon-green/10 hover:border-neon-green/20',
};

const titleColors = {
  blue: 'text-neon-blue',
  purple: 'text-neon-purple',
  pink: 'text-neon-pink',
  green: 'text-neon-green',
};

const glowColors = {
  blue: 'rgba(0, 240, 255, 0.03)',
  purple: 'rgba(157, 0, 255, 0.03)',
  pink: 'rgba(255, 43, 214, 0.03)',
  green: 'rgba(0, 255, 163, 0.03)',
};

export default function NeonPanel({
  children,
  title,
  variant = 'blue',
  className = '',
  headerAction,
}: NeonPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        glass-panel border rounded-xl transition-all duration-300
        ${borderColors[variant]}
        ${className}
      `}
      style={{
        background: `linear-gradient(135deg, rgba(13,13,26,0.8), rgba(13,13,26,0.6))`,
        boxShadow: `inset 0 0 40px ${glowColors[variant]}`,
      }}
    >
      {title && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
          <h3 className={`text-sm font-semibold tracking-widest uppercase font-['Orbitron'] ${titleColors[variant]}`}>
            {title}
          </h3>
          {headerAction}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </motion.div>
  );
}
