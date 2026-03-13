import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Menu, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import GlowInput from './GlowInput';

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'System update deployed', time: '2m ago', type: 'info' },
    { id: 2, text: 'New user registered', time: '15m ago', type: 'success' },
    { id: 3, text: 'CPU usage spike detected', time: '1h ago', type: 'warning' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="glass-panel border-b border-white/5 px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 text-gray-400 hover:text-neon-blue transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand in header */}
            <span className="text-base font-bold tracking-[0.15em] font-['Orbitron'] neon-text-blue">
              DirghaX
            </span>

            <div className="hidden md:block w-72">
              <GlowInput
                placeholder="Search systems..."
                icon={<Search className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* System time */}
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-['Share_Tech_Mono'] text-gray-500 mr-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
              {new Date().toLocaleTimeString('en-US', { hour12: false })}
            </div>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowDropdown(false);
                }}
                className="relative p-2 rounded-lg text-gray-400 hover:text-neon-blue hover:bg-neon-blue/5 transition-all duration-300 cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-pink rounded-full" style={{ boxShadow: '0 0 6px #FF2BD6' }} />
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 glass-panel border border-neon-blue/10 rounded-xl overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-xs font-bold tracking-widest uppercase font-['Orbitron'] text-neon-blue">
                        Notifications
                      </p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="px-4 py-3 border-b border-white/5 hover:bg-neon-blue/5 transition-colors cursor-pointer"
                        >
                          <p className="text-sm text-gray-300">{n.text}</p>
                          <p className="text-[10px] font-['Share_Tech_Mono'] text-gray-600 mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User menu */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg hover:bg-white/[0.02] transition-all duration-300 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-neon-blue" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-gray-300">Operator</p>
                  <p className="text-[10px] font-['Share_Tech_Mono'] text-gray-600">LVL.ADMIN</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-52 glass-panel border border-neon-blue/10 rounded-xl overflow-hidden"
                  >
                    <div className="py-1">
                      {[
                        { icon: User, label: 'Profile', color: 'text-neon-blue' },
                        { icon: Settings, label: 'Settings', color: 'text-neon-purple' },
                        { icon: LogOut, label: 'Disconnect', color: 'text-neon-pink' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-white/[0.02] transition-all cursor-pointer"
                        >
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
