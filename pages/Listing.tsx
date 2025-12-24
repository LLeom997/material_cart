import React, { useMemo, useState } from 'react';
import * as reactRouterDom from 'react-router-dom';
const { useSearchParams, Link } = reactRouterDom as any;
import { PRODUCTS, CATEGORIES, CITIES } from '../constants';
import * as Icons from 'lucide-react';
import { useApp } from '../App';
import { Product } from '../types';

const ProductDetailsDialog = ({ product, onClose, onAdd, inCart }: { product: Product, onClose: () => void, onAdd: (p: Product) => void, inCart: boolean }) => {
  const [qty, setQty] = useState(1);
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12 animate-fadeIn font-sans">
      <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden animate-slideInUp flex flex-col md:flex-row max-h-[90vh]">
        <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-slate-50 text-slate-400 hover:text-brand-900 rounded-2xl hover:bg-slate-100 transition-all z-20 border border-slate-100 shadow-sm active:scale-90">
          <Icons.X size={24} strokeWidth={2.5}/>
        </button>
        
        {/* Gallery Preview Section */}
        <div className="w-full md:w-1/2 bg-slate-50 flex items-center justify-center p-12 md:p-20 border-b md:border-b-0 md:border-r border-slate-100 relative overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-auto object-contain max-h-[350px] md:max-h-[500px] drop-shadow-2xl hover:scale-105 transition-transform duration-700" />
          <div className="absolute bottom-10 left-10">
            <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200">Factory Direct</span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-brand-900 text-brand-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Premium Grade</span>
              <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{product.subCategory}</span>
            </div>
            <h2 className="text-4xl font-black text-brand-900 leading-[1] mb-4 tracking-tighter uppercase">{product.name}</h2>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-black text-brand-600 tracking-tighter">{product.priceRange.split('-')[0]}</span>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest opacity-80">/ {product.uom}</span>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed font-medium italic border-l-4 border-brand-500/20 pl-6 py-1">
              "{product.description}"
            </p>
          </div>

          <div className="space-y-10">
            {/* Tech Specs Block */}
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Icons.Activity size={14} className="text-brand-500"/> Laboratory Audit Specs
              </h3>
              <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="group">
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-2 tracking-widest group-hover:text-brand-500 transition-colors">{spec.label}</p>
                    <p className="text-lg font-black text-brand-900 tracking-tight">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-auto pt-12">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4 bg-slate-100 p-2.5 rounded-2xl border border-slate-200 shadow-inner">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-90 border border-slate-100"><Icons.Minus size={20} /></button>
                  <span className="font-black text-xl w-8 text-center tabular-nums">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-90 border border-slate-100"><Icons.Plus size={20} /></button>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">Market Parity Index</p>
                  <p className="text-2xl font-black text-brand-900">Get Quote</p>
                </div>
             </div>
             <button 
               disabled={inCart}
               onClick={() => {
                 onAdd(product);
                 onClose();
               }}
               className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 ${inCart ? 'bg-green-50 text-green-700' : 'bg-brand-900 text-white hover:bg-brand-500 hover:text-brand-900 shadow-brand-900/10'}`}
             >
               {inCart ? <><Icons.CheckCircle size={20} strokeWidth={3}/> ITEM ADDED</> : <><Icons.ShoppingBag size={20}/> ADD TO PROCUREMENT LIST</>}
             </button>
             <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.2em] mt-6 opacity-60">Rates confirmed on lock-in call based on Sangli Mandi daily indices.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Listing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { addToCart, cart } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const citySlug = searchParams.get('city') || CITIES[0].slug;
  const categorySlug = searchParams.get('category');

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;
    if (categorySlug) {
      const cat = CATEGORIES.find(c => c.slug === categorySlug);
      if (cat) list = list.filter(p => p.categoryId === cat.id);
    }
    if (searchTerm) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.subCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return list;
  }, [categorySlug, searchTerm]);

  const activeCity = CITIES.find(c => c.slug === citySlug);
  const activeCategory = CATEGORIES.find(c => c.slug === categorySlug);

  const handleAdd = (p: Product) => {
    addToCart({
      productId: p.id,
      productName: p.name,
      quantity: 1,
      uom: p.uom
    });
  };

  return (
    <div className="w-full animate-fadeIn bg-brand-50 font-sans">
      {/* Dynamic Filter Ribbon */}
      <div className="bg-white border-b py-5 sticky top-[68px] md:top-[74px] z-40 shadow-sm backdrop-blur-md bg-white/95">
        <div className="full-width-container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Delivering To</span>
              <div className="flex items-center gap-2 text-brand-900 font-black">
                <Icons.MapPin size={16} className="text-brand-500" />
                <span className="text-sm tracking-tighter uppercase">{activeCity?.name} District</span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
            <div className="flex flex-col hidden md:flex">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Department</span>
              <div className="flex items-center gap-2">
                 <span className="text-sm text-brand-900 font-extrabold tracking-tighter uppercase">{activeCategory?.name || 'Full Inventory'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative group flex-grow md:w-96">
               <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
               <input 
                 type="text" 
                 placeholder="Search brands, materials, specifications..."
                 className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all text-xs font-bold placeholder:text-slate-300"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <div className="hidden sm:flex items-center gap-2 text-[10px] font-black bg-brand-900 text-white px-4 py-2 rounded-xl uppercase tracking-widest whitespace-nowrap shadow-lg">
               <Icons.Layers size={14} className="text-brand-500"/> {filteredProducts.length} Results
             </div>
          </div>
        </div>
      </div>

      <div className="full-width-container mx-auto py-10 md:py-16 flex flex-col lg:flex-row gap-12">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-44 space-y-10">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl">
              <div className="px-8 py-6 border-b bg-slate-50/50">
                <h3 className="text-[10px] font-black text-brand-900 uppercase tracking-[0.3em]">Supply Verticals</h3>
              </div>
              <nav className="p-4 space-y-2">
                <Link 
                  to={`/listing?city=${citySlug}`}
                  className={`flex items-center justify-between px-6 h-14 rounded-2xl text-xs font-black uppercase tracking-widest transition-all group ${!categorySlug ? 'bg-brand-900 text-white shadow-2xl' : 'text-slate-500 hover:bg-slate-50 hover:text-brand-900'}`}
                >
                  <span className="tracking-tight">Marketplace Home</span>
                  <Icons.LayoutGrid size={16} className={`transition-opacity ${!categorySlug ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'}`}/>
                </Link>
                {CATEGORIES.map(cat => {
                  const Icon = ((Icons as any)[cat.icon] || Icons.Box) as React.ElementType;
                  const isSelected = categorySlug === cat.slug;
                  return (
                    <Link 
                      key={cat.id}
                      to={`/listing?city=${citySlug}&category=${cat.slug}`}
                      className={`flex items-center justify-between px-6 h-14 rounded-2xl text-xs font-black uppercase tracking-widest transition-all group ${isSelected ? 'bg-brand-900 text-white shadow-2xl' : 'text-slate-500 hover:bg-slate-50 hover:text-brand-900'}`}
                    >
                      <div className="flex items-center gap-4">
                        <Icon size={18} strokeWidth={isSelected ? 3 : 2} className={isSelected ? 'text-brand-500' : 'text-slate-300 group-hover:text-brand-500'}/>
                        <span className="tracking-tighter">{cat.name}</span>
                      </div>
                      <Icons.ChevronRight size={16} className={`transition-opacity ${isSelected ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'}`}/>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Verification Badge */}
            <div className="p-10 bg-brand-900 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl border border-white/5">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 pointer-events-none">
                 <Icons.ShieldCheck size={240} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-brand-500/20 rounded-2xl flex items-center justify-center text-brand-500 mb-6 border border-brand-500/20 shadow-lg">
                   <Icons.Verified size={24} />
                </div>
                <h4 className="text-[11px] font-black text-brand-500 uppercase tracking-[0.3em] mb-4">MaterialCart Labs</h4>
                <p className="text-[14px] text-slate-400 font-medium leading-relaxed italic opacity-90">
                  "All batches are verified against structural compliance standards for the Sangli SMK district belt."
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Industrial Grade Product Grid */}
        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
            {filteredProducts.map(product => {
              const inCart = cart.some(c => c.productId === product.id);
              return (
                <div 
                  key={product.id} 
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:border-brand-500/40 transition-all flex flex-col group cursor-pointer animate-fadeIn active:scale-[0.98] border-b-4 border-b-slate-100 hover:border-b-brand-500"
                >
                  <div className="relative aspect-[16/11] bg-slate-50/50 overflow-hidden flex items-center justify-center group-hover:bg-white transition-colors p-8">
                    <img src={product.image} alt={product.name} className="w-full h-auto object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-1000 ease-out" />
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <span className="bg-brand-900/95 backdrop-blur px-3 py-1.5 rounded-xl text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-lg border border-white/10">
                        {product.brand || 'Premium Grade'}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-brand-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                       <div className="bg-white text-brand-900 px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                         <Icons.Maximize size={18} /> Quick Procure
                       </div>
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="mb-3">
                      <span className="text-[10px] font-black text-brand-500 uppercase tracking-[0.3em] leading-none opacity-80">{product.subCategory}</span>
                    </div>
                    <h3 className="text-xl font-black text-brand-900 mb-4 leading-tight tracking-tight uppercase group-hover:text-brand-500 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-baseline gap-2 mb-8">
                      <span className="text-3xl font-black text-brand-900 tracking-tighter">{product.priceRange.split('-')[0]}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">/ {product.uom}</span>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <Icons.Package size={14} className="text-slate-300" />
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Ready to Deliver</span>
                      </div>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${inCart ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-900 group-hover:text-brand-500 group-hover:shadow-lg'}`}>
                         {inCart ? <Icons.Check size={20} strokeWidth={3}/> : <Icons.Plus size={20} strokeWidth={3}/>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
              <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 text-slate-200 border border-slate-100 shadow-inner">
                 <Icons.SearchX size={56} />
              </div>
              <h3 className="text-4xl font-black text-brand-900 mb-4 tracking-tighter uppercase">Inventory Not Sourced</h3>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] max-w-md mx-auto leading-relaxed">We are constantly vetting more regional suppliers. Try an alternate category or contact the sourcing desk.</p>
              <button onClick={() => setSearchTerm('')} className="mt-12 bg-brand-900 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-brand-500 hover:text-brand-900 transition-all shadow-2xl active:scale-95">Reset Catalog</button>
            </div>
          )}
        </div>
      </div>

      {/* Corporate Quick View Modal */}
      {selectedProduct && (
        <ProductDetailsDialog 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAdd={handleAdd}
          inCart={cart.some(c => c.productId === selectedProduct.id)}
        />
      )}
    </div>
  );
};

export default Listing;