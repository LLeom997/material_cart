
import React from 'react';
import { ShoppingCart, Edit2, Trash2 } from 'lucide-react';
import { Enquiry } from '../../types';

interface TableOrdersProps {
  data: Enquiry[];
  setModal: (m: any) => void;
  onRemove: (id: string) => void;
}

const TableOrders: React.FC<TableOrdersProps> = ({ data, setModal, onRemove }) => (
  <div className="bg-white border rounded-[2rem] shadow-sm overflow-hidden animate-fade-in">
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <tr>
          <th className="px-8 py-5">Status</th>
          <th className="px-8 py-5">Manifest ID</th>
          <th className="px-8 py-5">Client</th>
          <th className="px-8 py-5 text-right">Volume</th>
          <th className="px-8 py-5 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {data.map(order => (
          <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setModal({ type: 'status', order })}>
            <td className="px-8 py-5">
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${
                order.status === 'Pending' ? 'bg-amber-50 border-amber-100 text-amber-600' : 
                order.status === 'Delivered' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                'bg-slate-50 border-slate-100 text-slate-600'
              }`}>
                {order.status}
              </span>
            </td>
            <td className="px-8 py-5 font-mono font-black text-slate-900 text-xs">{order.id}</td>
            <td className="px-8 py-5 font-bold text-slate-900">{order.customerName}</td>
            <td className="px-8 py-5 text-right font-black text-slate-900 text-sm">₹{(order.total_amount || 0).toLocaleString()}</td>
            <td className="px-8 py-5 text-right space-x-1" onClick={e => e.stopPropagation()}>
              <button onClick={() => setModal({ type: 'items', order_id: order.id, items: [...order.items] })} className="p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"><ShoppingCart size={14}/></button>
              <button onClick={() => setModal({ type: 'status', order })} className="p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"><Edit2 size={14}/></button>
              <button onClick={() => onRemove(order.id)} className="p-2.5 text-slate-400 hover:text-accent bg-slate-50 rounded-xl hover:bg-accent/5 transition-all"><Trash2 size={14}/></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TableOrders;
