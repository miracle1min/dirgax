import { motion } from 'framer-motion';
import { Users, Activity, DollarSign, Cpu, FileBarChart, PlusCircle, RefreshCw, Download } from 'lucide-react';
import StatCard from '../components/StatCard';
import ActivityFeed from '../components/ActivityFeed';
import DataTable from '../components/DataTable';
import NeonButton from '../components/NeonButton';
import NeonPanel from '../components/NeonPanel';

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

export default function Dashboard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-['Share_Tech_Mono'] text-neon-blue/60 mb-1">
            // SYSTEM.DASHBOARD.MAIN
          </p>
          <h1
            className="text-2xl lg:text-3xl font-bold font-['Orbitron'] tracking-wider text-white glitch"
            data-text="COMMAND CENTER"
          >
            COMMAND CENTER
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time system monitoring and control interface
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NeonButton variant="blue" size="sm" icon={<RefreshCw className="w-4 h-4" />}>
            Sync
          </NeonButton>
          <NeonButton variant="purple" size="sm" icon={<Download className="w-4 h-4" />}>
            Export
          </NeonButton>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value="24,847"
          change="12.5%"
          changeType="positive"
          icon={<Users className="w-5 h-5" />}
          variant="blue"
        />
        <StatCard
          title="Daily Activity"
          value="1,429"
          change="8.2%"
          changeType="positive"
          icon={<Activity className="w-5 h-5" />}
          variant="purple"
        />
        <StatCard
          title="Revenue"
          value="$89,241"
          change="3.1%"
          changeType="negative"
          icon={<DollarSign className="w-5 h-5" />}
          variant="pink"
        />
        <StatCard
          title="System Load"
          value="67.3%"
          change="2.4%"
          changeType="positive"
          icon={<Cpu className="w-5 h-5" />}
          variant="green"
        />
      </motion.div>

      {/* Main content grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Data Table - takes 2 cols */}
        <div className="xl:col-span-2">
          <DataTable />
        </div>

        {/* Activity Feed */}
        <div className="xl:col-span-1">
          <ActivityFeed />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <NeonPanel title="Quick Actions" variant="green">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <NeonButton variant="blue" icon={<FileBarChart className="w-4 h-4" />}>
              Generate Report
            </NeonButton>
            <NeonButton variant="purple" icon={<PlusCircle className="w-4 h-4" />}>
              Create Entry
            </NeonButton>
            <NeonButton variant="green" icon={<RefreshCw className="w-4 h-4" />}>
              Sync Data
            </NeonButton>
            <NeonButton variant="pink" icon={<Download className="w-4 h-4" />}>
              Export File
            </NeonButton>
          </div>
        </NeonPanel>
      </motion.div>
    </motion.div>
  );
}
