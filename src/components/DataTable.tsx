import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import NeonPanel from './NeonPanel';

interface DataRow {
  id: string;
  name: string;
  status: 'Active' | 'Pending' | 'Offline' | 'Error';
  date: string;
  type: string;
}

const tableData: DataRow[] = [
  { id: 'NC-001', name: 'Neural Cortex Alpha', status: 'Active', date: '2077-03-15', type: 'Core' },
  { id: 'NC-002', name: 'Synapse Bridge V2', status: 'Active', date: '2077-03-14', type: 'Module' },
  { id: 'NC-003', name: 'Quantum Mesh Node', status: 'Pending', date: '2077-03-14', type: 'Network' },
  { id: 'NC-004', name: 'CyberLink Protocol', status: 'Active', date: '2077-03-13', type: 'Protocol' },
  { id: 'NC-005', name: 'NetRunner Daemon', status: 'Offline', date: '2077-03-12', type: 'Service' },
  { id: 'NC-006', name: 'ICE Breaker v3', status: 'Error', date: '2077-03-11', type: 'Security' },
  { id: 'NC-007', name: 'DataStream Handler', status: 'Active', date: '2077-03-10', type: 'Core' },
  { id: 'NC-008', name: 'Ghost Protocol', status: 'Pending', date: '2077-03-09', type: 'Stealth' },
];

const statusStyles: Record<string, { text: string; bg: string; glow: string }> = {
  Active: { text: 'text-neon-green', bg: 'bg-neon-green/10', glow: '#00FFA3' },
  Pending: { text: 'text-yellow-400', bg: 'bg-yellow-400/10', glow: '#FBBF24' },
  Offline: { text: 'text-gray-500', bg: 'bg-gray-500/10', glow: '#6B7280' },
  Error: { text: 'text-neon-pink', bg: 'bg-neon-pink/10', glow: '#FF2BD6' },
};

export default function DataTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const paginatedData = tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <NeonPanel title="System Registry" variant="blue">
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full min-w-[540px]">
          <thead>
            <tr className="border-b border-white/5">
              {['ID', 'Name', 'Type', 'Status', 'Date', ''].map((header) => (
                <th
                  key={header}
                  className="text-left text-[10px] font-['Orbitron'] tracking-widest text-gray-600 uppercase pb-3 px-2 first:pl-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, i) => {
              const status = statusStyles[row.status];
              return (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/[0.02] hover:bg-neon-blue/[0.02] transition-colors group"
                >
                  <td className="py-3 px-2 first:pl-0">
                    <span className="text-xs font-['Share_Tech_Mono'] text-neon-blue">
                      {row.id}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                      {row.name}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-xs font-['Share_Tech_Mono'] text-gray-500">
                      {row.type}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md ${status.text} ${status.bg}`}>
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: status.glow, boxShadow: `0 0 4px ${status.glow}` }}
                      />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-xs font-['Share_Tech_Mono'] text-gray-600">
                      {row.date}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button className="p-1 text-gray-600 hover:text-neon-blue transition-colors cursor-pointer opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
        <p className="text-[10px] font-['Share_Tech_Mono'] text-gray-600">
          SHOWING {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, tableData.length)} OF {tableData.length}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md text-gray-600 hover:text-neon-blue hover:bg-neon-blue/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-7 h-7 rounded-md text-xs font-['Share_Tech_Mono'] transition-all cursor-pointer ${
                currentPage === i + 1
                  ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                  : 'text-gray-600 hover:text-gray-400 hover:bg-white/[0.02]'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md text-gray-600 hover:text-neon-blue hover:bg-neon-blue/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </NeonPanel>
  );
}
