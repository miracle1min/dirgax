import { useState } from 'react';
import { motion } from 'framer-motion';

interface GlowInputProps {
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function GlowInput({
  placeholder = 'Search...',
  icon,
  className = '',
  value,
  onChange,
}: GlowInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      className={`relative group ${className}`}
      animate={focused ? { scale: 1.01 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {icon && (
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused ? 'text-neon-blue' : 'text-gray-500'}`}>
          {icon}
        </div>
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          w-full bg-panel-dark/80 border rounded-lg
          font-['Rajdhani'] text-sm text-gray-200 placeholder-gray-600
          outline-none transition-all duration-300
          ${icon ? 'pl-10 pr-4' : 'px-4'} py-2.5
          ${focused
            ? 'border-neon-blue/40 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
            : 'border-white/5 hover:border-neon-blue/20'
          }
        `}
      />
      <div
        className={`absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300 ${focused ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 240, 255, 0.03), transparent 70%)',
        }}
      />
    </motion.div>
  );
}
