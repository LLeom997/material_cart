
import React, { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { useImageUpload } from '../../../hooks/useImageUpload';

interface ModalEntityFormProps {
  modal: any;
  close: () => void;
  onSave: (data: any) => void;
  logAction: any;
}

const ModalEntityForm: React.FC<ModalEntityFormProps> = ({ modal, close, onSave, logAction }) => {
  const [formData, setFormData] = useState({ ...modal.data });
  const { upload, loading: isUploading } = useImageUpload(logAction);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: any) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = async (e: any) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const url = await upload(e.dataTransfer.files[0], "product_images");
      if (url) setFormData({ ...formData, image: url });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={close}></div>
      <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 space-y-8 border animate-slideInUp max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="font-black text-[12px] uppercase tracking-[0.2em] text-slate-900">Sync {modal.entityType} Record</h3>
          <button type="button" onClick={close} className="p-2 border rounded-full"><X size={18}/></button>
        </div>
        
        <div className="space-y-6">
          {modal.entityType === 'product' && (
            <>
              <div 
                className={`relative border-2 border-dashed rounded-[2rem] p-8 transition-all flex flex-col items-center justify-center bg-slate-50 min-h-[220px] ${dragActive ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}
                onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-4 text-brand-600">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Uploading Visual...</p>
                  </div>
                ) : formData.image ? (
                  <div className="relative group w-full flex flex-col items-center">
                    <img src={formData.image} alt="" className="h-40 w-40 object-contain rounded-2xl border-2 bg-white p-4 shadow-sm" />
                    <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="mt-4 px-4 py-2 bg-accent/10 text-accent rounded-xl text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:text-white">Clear Visual</button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload size={32} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest leading-relaxed">Drop Material Image Here</p>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => { if(e.target.files?.[0]) { const url = await upload(e.target.files[0], "product_images"); if(url) setFormData({...formData, image: url}); } }} accept="image/*" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <input required placeholder="Material Label" className="w-full p-3.5 border-2 rounded-2xl text-xs font-black bg-slate-50 outline-none" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input placeholder="SKU" className="w-full p-3.5 border-2 rounded-2xl text-xs font-mono bg-slate-50 outline-none" value={formData.sku || ''} onChange={e => setFormData({...formData, sku: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <input required placeholder="Quantity" type="number" className="w-full p-3.5 border-2 rounded-2xl text-xs font-mono bg-slate-50 outline-none" value={formData.stock_quantity || 0} onChange={e => setFormData({...formData, stock_quantity: Number(e.target.value)})} />
                <input required placeholder="UOM (Unit)" className="w-full p-3.5 border-2 rounded-2xl text-xs font-black bg-slate-50 outline-none" value={formData.uom || ''} onChange={e => setFormData({...formData, uom: e.target.value})} />
              </div>
              <input required placeholder="Price Index (e.g. ₹5000)" className="w-full p-3.5 border-2 rounded-2xl text-xs font-black bg-slate-50 outline-none" value={formData.price_range || ''} onChange={e => setFormData({...formData, price_range: e.target.value})} />
            </>
          )}
          
          {modal.entityType === 'supplier' && (
             <>
               <input required placeholder="Enterprise Name" className="w-full p-4 border-2 rounded-2xl text-sm font-black bg-slate-50 outline-none" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
               <input placeholder="Contact Person" className="w-full p-4 border-2 rounded-2xl text-sm font-black bg-slate-50 outline-none" value={formData.contact_person || ''} onChange={e => setFormData({...formData, contact_person: e.target.value})} />
               <input placeholder="Mobile" className="w-full p-4 border-2 rounded-2xl text-sm font-black bg-slate-50 outline-none" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
               <textarea placeholder="Regional Address" className="w-full p-4 border-2 rounded-2xl text-sm font-black bg-slate-50 outline-none min-h-[100px]" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} />
             </>
          )}

          {modal.entityType === 'client' && (
            <>
               <input required placeholder="Full Name" className="w-full p-4 border-2 rounded-2xl text-sm font-black bg-slate-50 outline-none" value={formData.full_name || ''} onChange={e => setFormData({...formData, full_name: e.target.value})} />
               <input placeholder="Primary Phone" className="w-full p-4 border-2 rounded-2xl text-sm font-black bg-slate-50 outline-none" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={close} className="flex-1 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 rounded-2xl hover:bg-slate-200">Discard</button>
          <button type="submit" disabled={isUploading} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-brand-500 disabled:opacity-50">Confirm Changes</button>
        </div>
      </form>
    </div>
  );
};

export default ModalEntityForm;
