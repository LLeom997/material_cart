
import React from 'react';
import { Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { Product } from '../../types';

interface TableProductsProps {
  data: Product[];
  setModal: (m: any) => void;
  onRemove: (id: string) => void;
}

const TableProducts: React.FC<TableProductsProps> = ({ data, setModal, onRemove }) => (
  <div className="bg-white border rounded-[2rem] shadow-sm overflow-hidden animate-fade-in">
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <tr>
          <th className="px-8 py-5">Material</th>
          <th className="px-8 py-5">SKU</th>
          <th className="px-8 py-5">Stock</th>
          <th className="px-8 py-5 text-right">Price</th>
          <th className="px-8 py-5 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {data.map(p => (
          <tr key={p.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group" onClick={() => setModal({ type: 'entity', entityType: 'product', table: 'products', data: p })}>
            <td className="px-8 py-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border">
                  {p.image ? <img src={p.image} className="w-full h-full object-contain p-1" alt={p.name} /> : <ImageIcon size={16} className="text-slate-300" />}
                </div>
                <span className="font-bold text-slate-900 uppercase tracking-tighter">{p.name}</span>
              </div>
            </td>
            <td className="px-8 py-5 text-slate-400 font-mono text-xs">{p.sku || '-'}</td>
            <td className="px-8 py-5 font-black text-slate-600">{p.stock_quantity || 0} {p.uom}</td>
            <td className="px-8 py-5 text-right font-black text-brand-600">{p.price_range}</td>
            <td className="px-8 py-5 text-right space-x-1" onClick={e => e.stopPropagation()}>
              <button onClick={() => setModal({ type: 'entity', entityType: 'product', table: 'products', data: p })} className="p-2.5 text-slate-300 hover:text-slate-900 transition-all"><Edit2 size={14}/></button>
              <button onClick={() => onRemove(p.id)} className="p-2.5 text-slate-300 hover:text-accent transition-all"><Trash2 size={14}/></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TableProducts;
