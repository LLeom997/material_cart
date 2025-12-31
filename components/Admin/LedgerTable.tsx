
import React from 'react';
import { LedgerEntry } from '../../types';

interface LedgerTableProps {
  data: LedgerEntry[];
}

const LedgerTable: React.FC<LedgerTableProps> = ({ data }) => (
  <div className="bg-white border rounded-[2rem] shadow-sm overflow-hidden animate-fade-in">
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <tr>
          <th className="px-8 py-5">Date</th>
          <th className="px-8 py-5">Type</th>
          <th className="px-8 py-5">Reference</th>
          <th className="px-8 py-5 text-right">Revenue</th>
          <th className="px-8 py-5 text-right">Yield</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50 font-mono text-[11px]">
        {data.map(entry => (
          <tr key={entry.id} className="hover:bg-slate-50/30">
            <td className="px-8 py-5 text-slate-400">{new Date(entry.created_at).toLocaleDateString()}</td>
            <td className="px-8 py-5 uppercase font-black text-slate-600 text-[10px]">{entry.type}</td>
            <td className="px-8 py-5 font-bold text-slate-900 truncate max-w-[120px]">{entry.order_id || 'System Ops'}</td>
            <td className="px-8 py-5 text-right font-black text-slate-900">₹{(entry.amount || 0).toLocaleString()}</td>
            <td className="px-8 py-5 text-right font-black text-emerald-600">₹{(entry.margin || 0).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LedgerTable;
