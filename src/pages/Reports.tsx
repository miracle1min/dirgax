import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Filter, Clock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import NeonPanel from '../components/NeonPanel';
import NeonButton from '../components/NeonButton';

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

const reports = [
  {
    id: 'RPT-2077-001',
    name: 'Neural Network Performance',
    category: 'System',
    status: 'Completed',
    date: '2077-03-15',
    size: '2.4 MB',
    icon: CheckCircle2,
    statusColor: 'text-neon-green',
    statusBg: 'bg-neon-green/10',
  },
  {
    id: 'RPT-2077-002',
    name: 'Security Audit Report',
    category: 'Security',
    status: 'Completed',
    date: '2077-03-14',
    size: '5.1 MB',
    icon: CheckCircle2,
    statusColor: 'text-neon-green',
    statusBg: 'bg-neon-green/10',
  },
  {
    id: 'RPT-2077-003',
    name: 'Traffic Analysis Q4',
    category: 'Analytics',
    status: 'Processing',
    date: '2077-03-14',
    size: '—',
    icon: Clock,
    statusColor: 'text-yellow-400',
    statusBg: 'bg-yellow-400/10',
  },
  {
    id: 'RPT-2077-004',
    name: 'Anomaly Detection Log',
    category: 'Security',
    status: 'Warning',
    date: '2077-03-13',
    size: '1.8 MB',
    icon: AlertTriangle,
    statusColor: 'text-neon-pink',
    statusBg: 'bg-neon-pink/10',
  },
  {
    id: 'RPT-2077-005',
    name: 'Resource Allocation Map',
    category: 'System',
    status: 'Failed',
    date: '2077-03-12',
    size: '—',
    icon: XCircle,
    statusColor: 'text-red-500',
    statusBg: 'bg-red-500/10',
  },
  {
    id: 'RPT-2077-006',
    name: 'User Engagement Metrics',
    category: 'Analytics',
    status: 'Completed',
    date: '2077-03-11',
    size: '3.7 MB',
    icon: CheckCircle2,
    statusColor: 'text-neon-green',
    statusBg: 'bg-neon-green/10',
  },
];

export default function Reports() {
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
          <p className="text-xs font-['Share_Tech_Mono'] text-neon-pink/60 mb-1">
            // REPORTS.ARCHIVE
          </p>
          <h1 className="text-2xl lg:text-3xl font-bold font-['Orbitron'] tracking-wider text-white">
            REPORTS
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generated reports and system documentation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NeonButton variant="blue" size="sm" icon={<Filter className="w-4 h-4" />}>
            Filter
          </NeonButton>
          <NeonButton variant="purple" size="sm" icon={<Calendar className="w-4 h-4" />}>
            Date Range
          </NeonButton>
          <NeonButton variant="pink" size="sm" icon={<FileText className="w-4 h-4" />}>
            New Report
          </NeonButton>
        </div>
      </motion.div>

      {/* Reports list */}
      <motion.div variants={itemVariants}>
        <NeonPanel title="Report Archive" variant="pink">
          <div className="space-y-2">
            {reports.map((report, i) => {
              const StatusIcon = report.icon;
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.015] border border-transparent hover:border-white/5 transition-all group"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-panel-dark border border-white/5 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-gray-500 group-hover:text-neon-blue transition-colors" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-300 group-hover:text-gray-100 transition-colors truncate">
                      {report.name}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] font-['Share_Tech_Mono'] text-neon-blue/60">{report.id}</span>
                      <span className="text-[10px] text-gray-600">{report.category}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${report.statusColor} ${report.statusBg}`}>
                    <StatusIcon className="w-3 h-3" />
                    {report.status}
                  </div>

                  {/* Date */}
                  <span className="hidden md:block text-xs font-['Share_Tech_Mono'] text-gray-600 w-24 text-right">
                    {report.date}
                  </span>

                  {/* Size */}
                  <span className="hidden lg:block text-xs font-['Share_Tech_Mono'] text-gray-600 w-16 text-right">
                    {report.size}
                  </span>

                  {/* Action */}
                  <button
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      report.status === 'Completed'
                        ? 'text-gray-600 hover:text-neon-blue hover:bg-neon-blue/5'
                        : 'text-gray-800 cursor-not-allowed'
                    }`}
                    disabled={report.status !== 'Completed'}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </NeonPanel>
      </motion.div>
    </motion.div>
  );
}
