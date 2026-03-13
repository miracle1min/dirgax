import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: ReactNode;
  variant?: 'blue' | 'purple' | 'pink' | 'green';
}

const variants = {
  blue: {
    iconBg: 'bg-neon-blue/10',
    iconColor: 'text-neon-blue',
    border: 'border-neon-blue/10 hover:border-neon-blue/30',
    glow: 'hover:shadow-neon-blue',
    valueShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
    accentGradient: 'from-neon-blue/20 to-transparent',
  },
  purple: {
    iconBg: 'bg-neon-purple/10',
    iconColor: 'text-neon-purple',
    border: 'border-neon-purple/10 hover:border-neon-purple/30',
    glow: 'hover:shadow-neon-purple',
    valueShadow: '0 0 20px rgba(157, 0, 255, 0.3)',
    accentGradient: 'from-neon-purple/20 to-transparent',
  },
  pink: {
    iconBg: 'bg-neon-pink/10',
    iconColor: 'text-neon-pink',
    border: 'border-neon-pink/10 hover:border-neon-pink/30',
    glow: 'hover:shadow-neon-pink',
    valueShadow: '0 0 20px rgba(255, 43, 214, 0.3)',
    accentGradient: 'from-neon-pink/20 to-transparent',
  },
  green: {
    iconBg: 'bg-neon-green/10',
    iconColor: 'text-neon-green',
    border: 'border-neon-green/10 hover:border-neon-green/30',
    glow: 'hover:shadow-neon-green',
    valueShadow: '0 0 20px rgba(0, 255, 163, 0.3)',
    accentGradient: 'from-neon-green/20 to-transparent',
  },
};

export default function StatCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  variant = 'blue',
}: StatCardProps) {
  const style = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={`
        relative overflow-hidden glass-panel border rounded-xl p-5
        transition-all duration-300 cursor-default
        ${style.border} ${style.glow}
      `}
    >
      {/* Top accent gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${style.accentGradient}`} />

      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${style.iconBg}`}>
          <div className={style.iconColor}>{icon}</div>
        </div>
        {change && (
          <span className={`text-xs font-semibold font-['Share_Tech_Mono'] px-2 py-1 rounded-md ${
            changeType === 'positive'
              ? 'text-neon-green bg-neon-green/10'
              : 'text-neon-pink bg-neon-pink/10'
          }`}>
            {changeType === 'positive' ? '↑' : '↓'} {change}
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
        {title}
      </p>
      <p
        className="text-2xl font-bold font-['Orbitron'] text-white"
        style={{ textShadow: style.valueShadow }}
      >
        {value}
      </p>

      {/* Bottom corner decoration */}
      <div className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl ${style.accentGradient} opacity-30 rounded-tl-full`} />
    </motion.div>
  );
}
