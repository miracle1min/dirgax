import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Hexagon,
  X,
  ClipboardCheck,
  CalendarDays,
  History,
  StickyNote,
  Cog,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/activity', icon: Activity, label: 'Activity' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const qcNavItems = [
  { path: '/qc', icon: ClipboardCheck, label: 'QC Forms' },
  { path: '/qc/schedule', icon: CalendarDays, label: 'Schedule' },
  { path: '/qc/history', icon: History, label: 'History' },
  { path: '/qc/notes', icon: StickyNote, label: 'Notes' },
  { path: '/qc/settings', icon: Cog, label: 'QC Settings' },
];

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const sidebarContent = (
    <div className={`flex flex-col h-full ${collapsed ? 'items-center' : ''}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-6 border-b border-white/5 ${collapsed ? 'justify-center' : ''}`}>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Hexagon className="w-8 h-8 text-neon-blue" strokeWidth={1.5} />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col"
            >
              <span className="text-lg font-bold tracking-[0.15em] font-['Orbitron'] neon-text-blue">
                DirghaX
              </span>
              <span className="text-[10px] tracking-[0.3em] text-gray-500 font-['Share_Tech_Mono']">
                QC SYSTEM
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className="block"
            >
              <motion.div
                whileHover={{ x: collapsed ? 0 : 4 }}
                className={`
                  relative flex items-center gap-3 rounded-lg px-3 py-2.5
                  transition-all duration-300 group
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'bg-neon-blue/10 text-neon-blue'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-neon-blue rounded-r"
                    style={{ boxShadow: '0 0 8px #00F0FF' }}
                  />
                )}
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-all duration-300 ${
                    isActive ? 'drop-shadow-[0_0_6px_rgba(0,240,255,0.6)]' : 'group-hover:text-neon-blue/60'
                  }`}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className={`text-sm font-semibold tracking-wider ${
                        isActive ? "font-['Orbitron'] text-xs" : "font-['Rajdhani']"
                      }`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-panel-dark border border-neon-blue/20 rounded text-xs text-neon-blue whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none font-['Share_Tech_Mono']">
                    {item.label}
                  </div>
                )}
              </motion.div>
            </NavLink>
          );
        })}

        {/* QC Report Section */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-4 pb-2 px-1"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-[3px] h-3 rounded bg-gradient-to-b from-neon-green to-neon-blue" />
                <span className="text-[9px] font-bold text-gray-600 tracking-[0.15em] uppercase font-['Share_Tech_Mono']">
                  QC REPORT
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && <div className="h-px bg-white/5 my-3 mx-2" />}

        {qcNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className="block"
            >
              <motion.div
                whileHover={{ x: collapsed ? 0 : 4 }}
                className={`
                  relative flex items-center gap-3 rounded-lg px-3 py-2.5
                  transition-all duration-300 group
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'bg-neon-green/10 text-neon-green'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicatorQC"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-neon-green rounded-r"
                    style={{ boxShadow: '0 0 8px #00FFA3' }}
                  />
                )}
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-all duration-300 ${
                    isActive ? 'drop-shadow-[0_0_6px_rgba(0,255,163,0.6)]' : 'group-hover:text-neon-green/60'
                  }`}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className={`text-sm font-semibold tracking-wider ${
                        isActive ? "font-['Orbitron'] text-xs" : "font-['Rajdhani']"
                      }`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-panel-dark border border-neon-green/20 rounded text-xs text-neon-green whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none font-['Share_Tech_Mono']">
                    {item.label}
                  </div>
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle - desktop only */}
      <div className="hidden lg:block p-3 border-t border-white/5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-neon-blue hover:bg-neon-blue/5 transition-all duration-300 cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* System status */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-['Share_Tech_Mono'] text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            SYS.STATUS: ONLINE
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:block fixed left-0 top-0 h-screen z-40 bg-panel-darker/90 backdrop-blur-xl border-r border-white/5"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-[260px] z-50 bg-panel-darker/95 backdrop-blur-xl border-r border-neon-blue/10"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-neon-blue transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
