
import React from 'react';
import { AuditLog } from '../../types';

interface AuditLogPanelProps {
  data: AuditLog[];
}

const AuditLogPanel: React.FC<AuditLogPanelProps> = ({ data }) => (
  <div className="bg-slate-900 text-brand-500 rounded-[2.5rem] p-8 font-mono text-[11px] leading-relaxed border-2 border-slate-800 shadow-2xl max-h-[70vh] overflow-y-auto custom-scrollbar animate-fade-in">
    <div className="mb-6 text-white font-black uppercase tracking-[0.3em] border-b border-white/5 pb-4 flex items-center justify-between">
      <span>System Activity Registry</span>
      <span className="text-[10px] text-slate-500 font-bold">{data.length} Records</span>
    </div>
    {data.map(log => (
      <div key={log.id} className="mb-2 border-b border-white/5 pb-2 flex gap-4 group">
        <span className="text-slate-500 shrink-0 opacity-50">[{new Date(log.created_at).toISOString().split('T')[1].slice(0, 8)}]</span>
        <span className="text-white font-black uppercase tracking-widest group-hover:text-brand-400 transition-colors">{log.action}</span>
        <span className="text-blue-400 font-bold">{log.resource}</span>
        <span className="text-slate-500 truncate opacity-80">{JSON.stringify(log.metadata)}</span>
      </div>
    ))}
  </div>
);

export default AuditLogPanel;
