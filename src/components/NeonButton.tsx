import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface NeonButtonProps {
  children: ReactNode;
  variant?: 'blue' | 'purple' | 'pink' | 'green';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const variantStyles = {
  blue: {
    border: 'border-neon-blue/30',
    text: 'text-neon-blue',
    shadow: 'hover:shadow-neon-blue',
    bg: 'bg-neon-blue/5 hover:bg-neon-blue/10',
    glow: '#00F0FF',
  },
  purple: {
    border: 'border-neon-purple/30',
    text: 'text-neon-purple',
    shadow: 'hover:shadow-neon-purple',
    bg: 'bg-neon-purple/5 hover:bg-neon-purple/10',
    glow: '#9D00FF',
  },
  pink: {
    border: 'border-neon-pink/30',
    text: 'text-neon-pink',
    shadow: 'hover:shadow-neon-pink',
    bg: 'bg-neon-pink/5 hover:bg-neon-pink/10',
    glow: '#FF2BD6',
  },
  green: {
    border: 'border-neon-green/30',
    text: 'text-neon-green',
    shadow: 'hover:shadow-neon-green',
    bg: 'bg-neon-green/5 hover:bg-neon-green/10',
    glow: '#00FFA3',
  },
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export default function NeonButton({
  children,
  variant = 'blue',
  size = 'md',
  icon,
  onClick,
  className = '',
}: NeonButtonProps) {
  const style = variantStyles[variant];

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-lg border font-semibold font-['Rajdhani']
        tracking-wider uppercase transition-all duration-300 cursor-pointer
        ${style.border} ${style.text} ${style.shadow} ${style.bg}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center gap-2 justify-center">
        {icon && <span className="w-4 h-4">{icon}</span>}
        {children}
      </span>
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: `radial-gradient(circle at center, ${style.glow}15, transparent 70%)`,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
