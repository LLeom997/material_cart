
import React from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { OrderStatus } from '../../../types';

interface ModalStatusProps {
  modal: any;
  close: () => void;
  onUpdate: (id: string, status: OrderStatus) => void;
}

const ModalStatus: React.FC<ModalStatusProps> = ({ modal, close, onUpdate }) => {
  const order = modal.order;
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={close}></div>
      <div className="relative bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-10 space-y-8 border animate-slideInUp">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="font-black text-[12px] uppercase tracking-[0.2em] text-slate-900">Pipeline Stage: {order.id}</h3>
          <button onClick={close} className="p-2 border rounded-full"><X size={18}/></button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {[OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED].map(st => (
            <button 
              key={st}
              onClick={() => onUpdate(order.id, st as OrderStatus)}
              className={`w-full py-4 rounded-2xl text-[11px] font-black flex items-center justify-between px-6 transition-all uppercase tracking-widest ${order.status === st ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-[1.02]' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
            >
              {st}
              {order.status === st && <CheckCircle2 size={16} className="text-brand-500" />}
            </button>
          ))}
        </div>
        <div className="p-5 bg-amber-50 border-2 border-amber-100 rounded-2xl flex gap-4">
          <AlertCircle size={20} className="text-amber-600 shrink-0" />
          <p className="text-[10px] font-black text-amber-800 leading-relaxed uppercase tracking-tight">Status transitions automatically trigger system audit logs for administrative transparency.</p>
        </div>
      </div>
    </div>
  );
};

export default ModalStatus;
