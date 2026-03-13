import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import CyberBackground from '../components/CyberBackground';

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cyber-bg relative">
      <CyberBackground />

      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="lg:pl-[240px] min-h-screen flex flex-col">
        <Navbar onMenuToggle={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-white/5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-['Share_Tech_Mono'] text-gray-700">
              CYBERCORE.SYS v2.0.77 // ALL SYSTEMS NOMINAL
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                <span className="text-[10px] font-['Share_Tech_Mono'] text-gray-700">NET</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                <span className="text-[10px] font-['Share_Tech_Mono'] text-gray-700">DB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                <span className="text-[10px] font-['Share_Tech_Mono'] text-gray-700">API</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Scanline overlay */}
      <div className="scanline-overlay" />
    </div>
  );
}
