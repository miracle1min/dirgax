import { motion } from 'framer-motion';
import { LogIn, FileText, RefreshCw, Database, Shield, Zap, AlertTriangle, UserPlus, Key, Server } from 'lucide-react';
import NeonPanel from '../components/NeonPanel';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const allActivities = [
  { id: 1, icon: LogIn, text: 'User authentication successful', detail: 'operator@cybercore.sys', time: '2 min ago', color: '#00FFA3', category: 'Auth' },
  { id: 2, icon: AlertTriangle, text: 'Intrusion attempt blocked', detail: 'IP: 192.168.77.13 — Port scan detected', time: '5 min ago', color: '#FF2BD6', category: 'Security' },
  { id: 3, icon: FileText, text: 'Report generated', detail: 'Q4_analytics_2077.pdf — 2.4MB', time: '15 min ago', color: '#00F0FF', category: 'System' },
  { id: 4, icon: UserPlus, text: 'New user registered', detail: 'ghost_runner_44@darknet.io', time: '22 min ago', color: '#9D00FF', category: 'Auth' },
  { id: 5, icon: RefreshCw, text: 'System update deployed', detail: 'Core module v2.0.77 — Patch applied', time: '1 hour ago', color: '#9D00FF', category: 'System' },
  { id: 6, icon: Database, text: 'Database backup completed', detail: 'neural_net_dataset_08 — 847GB', time: '2 hours ago', color: '#00F0FF', category: 'Data' },
  { id: 7, icon: Key, text: 'API key rotated', detail: 'Service: CyberLink Protocol', time: '3 hours ago', color: '#00FFA3', category: 'Security' },
  { id: 8, icon: Shield, text: 'Security scan completed', detail: 'No threats detected — All clear', time: '5 hours ago', color: '#00FFA3', category: 'Security' },
  { id: 9, icon: Zap, text: 'Performance optimization', detail: 'Neural pathways recalibrated — +12% throughput', time: '6 hours ago', color: '#FF2BD6', category: 'System' },
  { id: 10, icon: Server, text: 'Server cluster rebalanced', detail: 'Nodes: 12 active, 2 standby', time: '8 hours ago', color: '#00F0FF', category: 'System' },
];

export default function ActivityPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <p className="text-xs font-['Share_Tech_Mono'] text-neon-green/60 mb-1">
          // ACTIVITY.LOG
        </p>
        <h1 className="text-2xl lg:text-3xl font-bold font-['Orbitron'] tracking-wider text-white">
          ACTIVITY LOG
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          System-wide event timeline and audit trail
        </p>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={itemVariants}>
        <NeonPanel title="Event Timeline" variant="green">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-neon-blue/20 via-neon-purple/20 to-transparent" />

            <div className="space-y-1">
              {allActivities.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="relative flex items-start gap-4 p-3 rounded-lg hover:bg-white/[0.015] transition-colors group"
                  >
                    {/* Node */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/5"
                        style={{ background: `${item.color}10` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-300 group-hover:text-gray-100 transition-colors">
                            {item.text}
                          </p>
                          <p className="text-xs font-['Share_Tech_Mono'] text-gray-600 truncate mt-0.5">
                            {item.detail}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span
                            className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md"
                            style={{ color: item.color, background: `${item.color}15` }}
                          >
                            {item.category}
                          </span>
                          <span className="text-[10px] font-['Share_Tech_Mono'] text-gray-700 whitespace-nowrap">
                            {item.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </NeonPanel>
      </motion.div>
    </motion.div>
  );
}
