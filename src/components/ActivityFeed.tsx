import { motion } from 'framer-motion';
import { LogIn, FileText, RefreshCw, Database, Shield, Zap } from 'lucide-react';
import NeonPanel from './NeonPanel';

const activities = [
  {
    id: 1,
    icon: LogIn,
    text: 'User authentication successful',
    detail: 'operator@cybercore.sys',
    time: '2 min ago',
    color: 'text-neon-green',
    dotColor: 'bg-neon-green',
    glowColor: '#00FFA3',
  },
  {
    id: 2,
    icon: FileText,
    text: 'Report generated',
    detail: 'Q4_analytics_2077.pdf',
    time: '15 min ago',
    color: 'text-neon-blue',
    dotColor: 'bg-neon-blue',
    glowColor: '#00F0FF',
  },
  {
    id: 3,
    icon: RefreshCw,
    text: 'System update deployed',
    detail: 'Core module v2.0.77',
    time: '1 hour ago',
    color: 'text-neon-purple',
    dotColor: 'bg-neon-purple',
    glowColor: '#9D00FF',
  },
  {
    id: 4,
    icon: Database,
    text: 'New data record added',
    detail: 'neural_net_dataset_08',
    time: '3 hours ago',
    color: 'text-neon-blue',
    dotColor: 'bg-neon-blue',
    glowColor: '#00F0FF',
  },
  {
    id: 5,
    icon: Shield,
    text: 'Security scan completed',
    detail: 'No threats detected',
    time: '5 hours ago',
    color: 'text-neon-green',
    dotColor: 'bg-neon-green',
    glowColor: '#00FFA3',
  },
  {
    id: 6,
    icon: Zap,
    text: 'Performance optimization',
    detail: 'Neural pathways recalibrated',
    time: '8 hours ago',
    color: 'text-neon-pink',
    dotColor: 'bg-neon-pink',
    glowColor: '#FF2BD6',
  },
];

export default function ActivityFeed() {
  return (
    <NeonPanel title="Activity Feed" variant="purple">
      <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
        {activities.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.015] transition-colors group"
            >
              {/* Timeline line */}
              {index < activities.length - 1 && (
                <div className="absolute left-[22px] top-12 w-[1px] h-[calc(100%-16px)] bg-gradient-to-b from-white/5 to-transparent" />
              )}

              {/* Dot + Icon */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-lg bg-panel-dark border border-white/5 flex items-center justify-center ${item.color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div
                  className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${item.dotColor}`}
                  style={{ boxShadow: `0 0 6px ${item.glowColor}` }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                  {item.text}
                </p>
                <p className="text-xs font-['Share_Tech_Mono'] text-gray-600 truncate mt-0.5">
                  {item.detail}
                </p>
              </div>

              {/* Time */}
              <span className="text-[10px] font-['Share_Tech_Mono'] text-gray-700 whitespace-nowrap flex-shrink-0">
                {item.time}
              </span>
            </motion.div>
          );
        })}
      </div>
    </NeonPanel>
  );
}
