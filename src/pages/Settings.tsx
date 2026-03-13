import { motion } from 'framer-motion';
import { Shield, Bell, Palette, Globe, Database, Terminal } from 'lucide-react';
import NeonPanel from '../components/NeonPanel';
import NeonButton from '../components/NeonButton';
import GlowInput from '../components/GlowInput';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ToggleSwitch({ enabled }: { enabled: boolean }) {
  return (
    <div className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-300 ${enabled ? 'bg-neon-blue/20' : 'bg-panel-dark'} border ${enabled ? 'border-neon-blue/30' : 'border-white/10'}`}>
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
          enabled
            ? 'left-[22px] bg-neon-blue shadow-[0_0_8px_rgba(0,240,255,0.5)]'
            : 'left-0.5 bg-gray-600'
        }`}
      />
    </div>
  );
}

const settingGroups = [
  {
    title: 'Security',
    icon: Shield,
    variant: 'blue' as const,
    settings: [
      { label: 'Two-factor authentication', desc: 'Require 2FA for all logins', enabled: true },
      { label: 'Biometric lock', desc: 'Use neural interface for auth', enabled: false },
      { label: 'Auto-logout', desc: 'Disconnect after 30 min idle', enabled: true },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    variant: 'purple' as const,
    settings: [
      { label: 'System alerts', desc: 'Critical system notifications', enabled: true },
      { label: 'Security warnings', desc: 'Intrusion and threat alerts', enabled: true },
      { label: 'Report completion', desc: 'Notify when reports finish', enabled: false },
    ],
  },
  {
    title: 'Interface',
    icon: Palette,
    variant: 'pink' as const,
    settings: [
      { label: 'Scanline overlay', desc: 'CRT-style visual effect', enabled: true },
      { label: 'Particle effects', desc: 'Animated background particles', enabled: true },
      { label: 'Reduced motion', desc: 'Minimize UI animations', enabled: false },
    ],
  },
];

export default function SettingsPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <p className="text-xs font-['Share_Tech_Mono'] text-neon-blue/60 mb-1">
          // SYSTEM.CONFIG
        </p>
        <h1 className="text-2xl lg:text-3xl font-bold font-['Orbitron'] tracking-wider text-white">
          SETTINGS
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          System configuration and preferences
        </p>
      </motion.div>

      {/* Profile section */}
      <motion.div variants={itemVariants}>
        <NeonPanel title="Operator Profile" variant="blue">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/20 flex items-center justify-center">
                <Terminal className="w-8 h-8 text-neon-blue" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <GlowInput placeholder="Display name" value="Operator" />
                <GlowInput placeholder="Email" value="operator@cybercore.sys" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <GlowInput placeholder="Node ID" value="NC-ALPHA-001" icon={<Globe className="w-4 h-4" />} />
                <GlowInput placeholder="Clearance Level" value="ADMIN" icon={<Database className="w-4 h-4" />} />
              </div>
              <div className="pt-2">
                <NeonButton variant="blue" size="sm">Save Changes</NeonButton>
              </div>
            </div>
          </div>
        </NeonPanel>
      </motion.div>

      {/* Setting groups */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {settingGroups.map((group) => {
          return (
            <NeonPanel key={group.title} title={group.title} variant={group.variant}>
              <div className="space-y-4">
                {group.settings.map((setting) => (
                  <div key={setting.label} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-300">{setting.label}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{setting.desc}</p>
                    </div>
                    <ToggleSwitch enabled={setting.enabled} />
                  </div>
                ))}
              </div>
            </NeonPanel>
          );
        })}
      </motion.div>

      {/* System info */}
      <motion.div variants={itemVariants}>
        <NeonPanel title="System Information" variant="green">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Version', value: 'v2.0.77' },
              { label: 'Build', value: '2077.03.15' },
              { label: 'Runtime', value: 'CyberVM 4.2' },
              { label: 'License', value: 'ENTERPRISE' },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-lg bg-panel-dark/50 border border-white/5">
                <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-sm font-['Share_Tech_Mono'] text-neon-green">{item.value}</p>
              </div>
            ))}
          </div>
        </NeonPanel>
      </motion.div>
    </motion.div>
  );
}
