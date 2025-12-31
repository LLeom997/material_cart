
import React from 'react';
import { X } from 'lucide-react';
import { EnquiryItem, Product } from '../../../types';

interface ModalOrderItemsProps {
  modal: any;
  close: () => void;
  products: Product[];
  onSave: (payload: any) => void;
}

const ModalOrderItems: React.FC<ModalOrderItemsProps> = ({ modal, close, products, onSave }) => {
  const [items, setItems] = React.useState<EnquiryItem[]>(modal.items || []);

  const handleUpdateQuantity = (idx: number, quantity: number) => {
    const next = [...items];
    next[idx].quantity = Math.max(0, quantity);
    setItems(next);
  };

  const handleRemove = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleAddProduct = (productId: string) => {
    const p = products.find(prod => prod.id === productId);
    if (p) {
      setItems([...items, { productId: p.id, productName: p.name, quantity: 1, uom: p.uom }]);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={close}></div>
      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 border overflow-hidden animate-slideInUp">
        <h3 className="font-black text-[12px] uppercase tracking-[0.2em] text-slate-900 mb-8 border-b pb-4">Edit Procurement Manifest: {modal.order_id}</h3>
        <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-8 pr-2 custom-scrollbar">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
              <div className="flex-grow">
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.productName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.uom}</p>
              </div>
              <input 
                type="number" 
                className="w-20 border-2 rounded-xl p-2.5 text-sm font-black text-center outline-none focus:border-brand-500 transition-all" 
                value={item.quantity} 
                onChange={e => handleUpdateQuantity(idx, Number(e.target.value))} 
              />
              <button onClick={() => handleRemove(idx)} className="p-2 text-slate-300 hover:text-accent transition-colors"><X size={18}/></button>
            </div>
          ))}
          <div className="pt-4">
            <select className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-4 text-[11px] font-black uppercase tracking-widest outline-none hover:border-brand-500 transition-all cursor-pointer" onChange={e => handleAddProduct(e.target.value)}>
              <option value="">+ Append Material To Order</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={close} className="flex-1 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
          <button onClick={() => onSave({ order_id: modal.order_id, items })} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-brand-500 hover:text-slate-900 transition-all shadow-xl">Commit Updates</button>
        </div>
      </div>
    </div>
  );
};

export default ModalOrderItems;
