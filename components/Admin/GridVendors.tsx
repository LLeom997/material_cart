
import React from 'react';
import { MapPin, Edit2, Trash2 } from 'lucide-react';
import { Vendor } from '../../types';

interface GridVendorsProps {
  data: Vendor[];
  setModal: (m: any) => void;
  onRemove: (id: string) => void;
}

const GridVendors: React.FC<GridVendorsProps> = ({ data, setModal, onRemove }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
    {data.map(v => (
      <div key={v.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group hover:border-slate-300 transition-all cursor-pointer" onClick={() => setModal({ type: 'entity', entityType: 'supplier', table: 'vendors', data: v })}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-1">{v.name}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.contact_person || 'Industrial Representative'}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${v.isActive ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
            {v.isActive ? 'Active' : 'Halted'}
          </span>
        </div>
        <div className="text-[11px] font-bold text-slate-500 flex items-center gap-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <MapPin size={16} className="text-slate-300" /> {v.address || 'Regional Sangli SMK Belt'}
        </div>
        <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
          <button onClick={() => setModal({ type: 'entity', entityType: 'supplier', table: 'vendors', data: v })} className="bg-slate-900 text-white p-3 rounded-xl hover:bg-brand-500 hover:text-slate-900 transition-all"><Edit2 size={16}/></button>
          <button onClick={() => onRemove(v.id)} className="bg-slate-100 text-slate-400 p-3 rounded-xl hover:bg-accent/10 hover:text-accent transition-all"><Trash2 size={16}/></button>
        </div>
      </div>
    ))}
  </div>
);

export default GridVendors;
