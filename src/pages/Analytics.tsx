import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, Globe, Server, Eye } from 'lucide-react';
import NeonPanel from '../components/NeonPanel';
import StatCard from '../components/StatCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const metrics = [
  { label: 'Page Views', value: '847K', change: '+12.3%', up: true },
  { label: 'Bounce Rate', value: '23.1%', change: '-4.2%', up: true },
  { label: 'Avg. Session', value: '4m 32s', change: '+8.7%', up: true },
  { label: 'Conversions', value: '3,241', change: '-1.8%', up: false },
];

const chartBars = [
  { label: 'Mon', value: 65, color: '#00F0FF' },
  { label: 'Tue', value: 82, color: '#9D00FF' },
  { label: 'Wed', value: 45, color: '#00F0FF' },
  { label: 'Thu', value: 93, color: '#FF2BD6' },
  { label: 'Fri', value: 71, color: '#00FFA3' },
  { label: 'Sat', value: 56, color: '#9D00FF' },
  { label: 'Sun', value: 38, color: '#00F0FF' },
];

const trafficSources = [
  { source: 'Direct', percentage: 42, color: '#00F0FF' },
  { source: 'Neural Net', percentage: 28, color: '#9D00FF' },
  { source: 'Datalink', percentage: 18, color: '#FF2BD6' },
  { source: 'CyberSearch', percentage: 12, color: '#00FFA3' },
];

export default function Analytics() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <p className="text-xs font-['Share_Tech_Mono'] text-neon-purple/60 mb-1">
          // ANALYTICS.MODULE
        </p>
        <h1 className="text-2xl lg:text-3xl font-bold font-['Orbitron'] tracking-wider text-white">
          ANALYTICS
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Network performance and data flow analysis
        </p>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Network Nodes" value="1,284" change="5.2%" changeType="positive" icon={<Globe className="w-5 h-5" />} variant="blue" />
        <StatCard title="Throughput" value="847 GB" change="12.1%" changeType="positive" icon={<Zap className="w-5 h-5" />} variant="purple" />
        <StatCard title="Uptime" value="99.97%" change="0.02%" changeType="positive" icon={<Server className="w-5 h-5" />} variant="green" />
        <StatCard title="Active Streams" value="3,847" change="8.4%" changeType="negative" icon={<Eye className="w-5 h-5" />} variant="pink" />
      </motion.div>

      {/* Charts row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Bar chart */}
        <NeonPanel title="Weekly Traffic" variant="blue">
          <div className="flex items-end justify-between gap-3 h-48 mt-4">
            {chartBars.map((bar, i) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${bar.value}%` }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                  className="w-full max-w-[40px] rounded-t-md relative group cursor-pointer"
                  style={{
                    background: `linear-gradient(180deg, ${bar.color}, ${bar.color}20)`,
                    boxShadow: `0 0 10px ${bar.color}30`,
                  }}
                >
                  <div
                    className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-['Share_Tech_Mono'] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    style={{ color: bar.color }}
                  >
                    {bar.value}%
                  </div>
                </motion.div>
                <span className="text-[10px] font-['Share_Tech_Mono'] text-gray-600">{bar.label}</span>
              </div>
            ))}
          </div>
        </NeonPanel>

        {/* Traffic sources */}
        <NeonPanel title="Traffic Sources" variant="purple">
          <div className="space-y-4 mt-2">
            {trafficSources.map((item, i) => (
              <motion.div
                key={item.source}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-400">{item.source}</span>
                  <span className="text-xs font-['Share_Tech_Mono']" style={{ color: item.color }}>
                    {item.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-panel-dark rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: i * 0.15, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${item.color}80, ${item.color})`,
                      boxShadow: `0 0 8px ${item.color}40`,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </NeonPanel>
      </motion.div>

      {/* Metrics grid */}
      <motion.div variants={itemVariants}>
        <NeonPanel title="Performance Metrics" variant="green">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-4 rounded-lg bg-panel-dark/50 border border-white/5 hover:border-neon-blue/10 transition-colors"
              >
                <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">{m.label}</p>
                <p className="text-xl font-bold font-['Orbitron'] text-white mb-1">{m.value}</p>
                <div className={`flex items-center justify-center gap-1 text-xs font-['Share_Tech_Mono'] ${m.up ? 'text-neon-green' : 'text-neon-pink'}`}>
                  {m.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {m.change}
                </div>
              </motion.div>
            ))}
          </div>
        </NeonPanel>
      </motion.div>
    </motion.div>
  );
}
