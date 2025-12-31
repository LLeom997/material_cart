
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Profile } from '../../types';

interface TableCustomersProps {
  data: Profile[];
  setModal: (m: any) => void;
  onRemove: (id: string) => void;
}

const TableCustomers: React.FC<TableCustomersProps> = ({ data, setModal, onRemove }) => (
  <div className="bg-white border rounded-[2rem] shadow-sm overflow-hidden animate-fade-in">
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <tr>
          <th className="px-8 py-5">Verified Name</th>
          <th className="px-8 py-5">Contact</th>
          <th className="px-8 py-5">Role</th>
          <th className="px-8 py-5 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {data.map(c => (
          <tr key={c.id} className="hover:bg-slate-50/50 cursor-pointer group" onClick={() => setModal({ type: 'entity', entityType: 'client', table: 'profiles', data: c })}>
            <td className="px-8 py-5 font-bold text-slate-900">{c.full_name}</td>
            <td className="px-8 py-5 text-xs text-slate-500">{c.phone || c.email}</td>
            <td className="px-8 py-5 uppercase text-[9px] font-black tracking-widest">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{c.role}</span>
            </td>
            <td className="px-8 py-5 text-right space-x-1" onClick={e => e.stopPropagation()}>
              <button onClick={() => setModal({ type: 'entity', entityType: 'client', table: 'profiles', data: c })} className="p-2.5 text-slate-300 hover:text-slate-900 transition-all">
                <Edit2 size={14}/>
              </button>
              <button onClick={() => onRemove(c.id)} className="p-2.5 text-slate-300 hover:text-accent transition-all">
                <Trash2 size={14}/>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TableCustomers;
