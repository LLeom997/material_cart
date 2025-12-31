
import React, { useMemo, useState, useEffect } from 'react';
import * as reactRouterDom from 'react-router-dom';
import { CITIES } from '../constants';
import * as Icons from 'lucide-react';
import { useApp } from '../App';
import { Product, Category, Vendor } from '../types';
import { supabase, supabaseKey } from '../lib/supabase';

const { useSearchParams, Link } = reactRouterDom as any;

type ViewMode = 'grid' | 'table';

const API_URL = 'https://skjzrdibumjhoohaqckm.supabase.co/functions/v1/get-products';
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8fafc'/%3E%3Cpath d='M200 130a20 20 0 1 0 0 40 20 20 0 0 0 0-40z' fill='%23e2e8f0'/%3E%3C/svg%3E";

interface ProductCardProps {
  product: Product;
  cart: any[];
  vendorName: string;
  onUpdateQuantity: (p: Product, q: number) => void;
  onViewDetails: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, cart, vendorName, onUpdateQuantity, onViewDetails }) => {
  const cartItem = cart.find(c => c.productId === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  
  return (
    <article className="flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:border-brand-500/20 transition-all duration-500 animate-fade-in relative">
      <div className="absolute inset-0 z-0 cursor-pointer" onClick={() => onViewDetails(product)} />

      <div className="relative aspect-[1.2] bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
           <span className="px-2 py-0.5 rounded-lg bg-white text-slate-900 text-[8px] font-black uppercase tracking-widest border shadow-sm">Grade A Structural</span>
           {product.brand && <span className="px-2 py-0.5 rounded-lg bg-brand-500 text-slate-900 text-[8px] font-black uppercase tracking-widest border border-brand-600/10 shadow-sm">{product.brand}</span>}
        </div>
        <img 
          src={product.image || PLACEHOLDER_IMAGE} 
          alt={product.name}
          className="max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-500" />
      </div>

      <div className="p-6 flex flex-col flex-grow relative z-10 pointer-events-none">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tighter">{product.name}</h3>
            <div className="flex items-center gap-1 text-brand-500 bg-slate-900 px-2 py-0.5 rounded-lg">
               <Icons.Star size={10} fill="currentColor" />
               <span className="text-[10px] font-black">4.9</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.categoryName || 'Sourced Material'}</p>
        </div>

        <div className="flex items-baseline gap-1.5 mb-6">
          <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">₹{product.price_range.replace('₹', '')}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">/ {product.uom}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pointer-events-auto">
          <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 h-10 px-1 overflow-hidden transition-all focus-within:ring-4 focus-within:ring-slate-100">
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateQuantity(product, quantity - 1); }}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:bg-white rounded-lg"
            >
              <Icons.Minus size={14} strokeWidth={3} />
            </button>
            <span className="w-8 text-center text-xs font-black text-slate-900">{quantity}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateQuantity(product, quantity + 1); }}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:bg-white rounded-lg"
            >
              <Icons.Plus size={14} strokeWidth={3} />
            </button>
          </div>
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-slate-900 transition-colors">
            SPEC SHEET
          </div>
        </div>
      </div>
    </article>
  );
};

const ProductDetailModal: React.FC<{ 
  product: Product | null; 
  onClose: () => void;
  cart: any[];
  onUpdateQuantity: (p: Product, q: number) => void;
  vendorName: string;
}> = ({ product, onClose, cart, onUpdateQuantity, vendorName }) => {
  if (!product) return null;

  const cartItem = cart.find(c => c.productId === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/70 backdrop-blur-xl animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] relative z-10 flex flex-col md:flex-row border border-white/20">
        <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-full transition-all z-20 shadow-sm active:scale-95"><Icons.X size={20}/></button>

        <div className="w-full md:w-5/12 bg-slate-50 p-12 flex items-center justify-center relative">
          <div className="absolute top-12 left-12"><Icons.ShieldCheck size={48} className="text-slate-200" /></div>
          <img src={product.image || PLACEHOLDER_IMAGE} alt={product.name} className="max-w-full max-h-[500px] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)] animate-slideInUp" />
        </div>

        <div className="w-full md:w-7/12 p-12 md:p-16 flex flex-col">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
               <span className="px-4 py-1.5 bg-slate-900 text-brand-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg">{product.brand || 'Regional SMK Grade'}</span>
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ref: MC-{product.id.slice(0,6)}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase font-display leading-[0.9] mb-4">{product.name}</h2>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em]">{product.categoryName} Sector Pipeline</p>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12 border-y border-slate-100 py-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Base Procurement Rate</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 tracking-tighter uppercase">₹{product.price_range.replace('₹', '')}</span>
                <span className="text-slate-400 font-black text-xs uppercase tracking-widest">/ {product.uom}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Logistics Routing</p>
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase">
                 <Icons.Truck size={18} className="text-brand-600" /> Sangli Direct SMK Belt
              </div>
            </div>
          </div>

          <div className="space-y-10 mb-12">
            <div>
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 border-l-4 border-brand-500 pl-4">Structural Compliance</h4>
              <div className="grid grid-cols-2 gap-6">
                {(product.specifications || []).length > 0 ? (
                  product.specifications.map((spec, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{spec.label}</p>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{spec.value}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2">
                    <p className="text-xs text-slate-500 font-medium italic">Certified structural material compliant with regional Sangli district building standards.</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 border-l-4 border-brand-500 pl-4">Material Intelligence</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {product.description || `Industrial-grade ${product.name.toLowerCase()} sourced directly from verified manufacturers in the Sangli district. Validated for high-compression resilience and weather-resistance at the regional testing center.`}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
            <div className="flex items-center bg-slate-900 rounded-[1.5rem] p-1.5 h-16 shadow-xl shadow-slate-200">
              <button onClick={() => onUpdateQuantity(product, quantity - 1)} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white transition-all hover:bg-white/10 rounded-xl"><Icons.Minus size={20} strokeWidth={3} /></button>
              <span className="w-12 text-center text-xl font-black text-white">{quantity}</span>
              <button onClick={() => onUpdateQuantity(product, quantity + 1)} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white transition-all hover:bg-white/10 rounded-xl"><Icons.Plus size={20} strokeWidth={3} /></button>
            </div>
            <button onClick={() => { if (quantity === 0) onUpdateQuantity(product, 1); onClose(); }} className="flex-grow bg-brand-500 text-slate-900 h-16 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-slate-900 hover:text-brand-500 transition-all shadow-xl shadow-brand-200 active:scale-95">Secure Requirement</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Listing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { updateCartQuantity, cart } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const citySlug = searchParams.get('city') || CITIES[0].slug;
  const categorySlug = searchParams.get('category');

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      try {
        const [pResp, vResp] = await Promise.all([
          fetch(API_URL, {
            method: "GET",
            headers: { "Authorization": `Bearer ${supabaseKey}`, "apikey": supabaseKey }
          }),
          supabase.from('vendors').select('*')
        ]);
        const pData = await pResp.json();
        if (Array.isArray(pData)) {
          const mapped: Product[] = pData.map((p: any) => ({
            id: p.id,
            name: p.name,
            subCategory: p.sub_category || 'General',
            price_range: p.price_range || "₹0",
            uom: p.uom || 'Brass',
            brand: p.brand || 'Local Graded',
            image: p.image || PLACEHOLDER_IMAGE,
            categoryId: p.category?.id,
            categoryName: p.category?.name,
            categorySlug: p.category?.slug,
            vendorId: p.vendor_id,
            description: p.description || '',
            specifications: p.specifications || [],
            gst_percentage: p.gst_percentage || 18
          }));
          setProducts(mapped);
          const uniqueCats = new Map();
          mapped.forEach(p => {
            if (p.categoryId && !uniqueCats.has(p.categoryId)) {
              uniqueCats.set(p.categoryId, { id: p.categoryId, name: p.categoryName, slug: p.categorySlug });
            }
          });
          setCategories(Array.from(uniqueCats.values()));
        }
        if (vResp.data) setVendors(vResp.data);
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };
    loadAll();
  }, []);

  const handleUpdateQuantity = (product: Product, q: number) => {
    updateCartQuantity(product.id, Math.max(0, q), product.name, product.uom);
  };

  const filteredProducts = useMemo(() => {
    let list = products;
    if (categorySlug) list = list.filter(p => p.categorySlug === categorySlug);
    if (searchTerm) list = list.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return list;
  }, [categorySlug, searchTerm, products]);

  const vendorMap = useMemo(() => {
    const map: Record<string, string> = {};
    vendors.forEach(v => { map[v.id] = v.name; });
    return map;
  }, [vendors]);

  return (
    <div className="w-full bg-slate-50 pb-20 min-h-screen">
      <div className="bg-white border-b sticky top-16 z-40 transition-all duration-300">
        <div className="full-width-container mx-auto py-4 flex items-center justify-between gap-6">
          <div className="flex-grow max-w-xl relative group">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Quick search structural materials..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-[1.25rem] outline-none focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 text-xs font-black uppercase tracking-widest transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all shadow-sm ${viewMode === 'grid' ? 'bg-slate-900 text-brand-500' : 'bg-white text-slate-300 hover:text-slate-900 border'}`}><Icons.LayoutGrid size={20}/></button>
            <button onClick={() => setViewMode('table')} className={`p-2.5 rounded-xl transition-all shadow-sm ${viewMode === 'table' ? 'bg-slate-900 text-brand-500' : 'bg-white text-slate-300 hover:text-slate-900 border'}`}><Icons.List size={20}/></button>
          </div>
        </div>
      </div>

      <div className="full-width-container mx-auto py-12 flex flex-col lg:flex-row gap-16">
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-48 space-y-12">
            <div>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 pb-4 border-b">Supply Sectors</h2>
              <ul className="space-y-4">
                <li>
                  <Link to={`/listing?city=${citySlug}`} className={`text-xs font-black uppercase tracking-widest transition-all flex items-center justify-between group ${!categorySlug ? 'text-slate-900' : 'text-slate-300 hover:text-slate-900'}`}>
                    <span>Full Catalog</span>
                    {!categorySlug && <div className="w-1.5 h-1.5 bg-brand-500 rounded-full"></div>}
                  </Link>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link to={`/listing?city=${citySlug}&category=${cat.slug}`} className={`text-xs font-black uppercase tracking-widest transition-all flex items-center justify-between group ${categorySlug === cat.slug ? 'text-slate-900' : 'text-slate-300 hover:text-slate-900'}`}>
                      <span>{cat.name}</span>
                      {categorySlug === cat.slug && <div className="w-1.5 h-1.5 bg-brand-500 rounded-full"></div>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </aside>

        <div className="flex-grow">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"><SkeletonLoader /></div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  cart={cart} 
                  vendorName={vendorMap[product.vendorId || ''] || 'Regional Sangli Mandi'}
                  onUpdateQuantity={handleUpdateQuantity} 
                  onViewDetails={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            <div className="border border-slate-100 rounded-[2rem] overflow-hidden shadow-xl bg-white animate-fade-in">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.3em] border-b border-slate-100">
                    <tr>
                       <th className="px-10 py-6">Material Unit</th>
                       <th className="px-10 py-6">Origin</th>
                       <th className="px-10 py-6 text-right">Price Index</th>
                       <th className="px-10 py-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group" onClick={() => setSelectedProduct(p)}>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-5">
                              <img src={p.image || PLACEHOLDER_IMAGE} className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" alt="" />
                              <div>
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{p.name}</p>
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{p.brand || 'Regional SMK Grade'}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border">{vendorMap[p.vendorId || ''] || 'Regional Mandi'}</span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <span className="font-black text-base text-slate-900 uppercase tracking-tighter">{p.price_range}</span>
                          <span className="text-[9px] font-black text-slate-300 uppercase block">per {p.uom}</span>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(p, 1); }} 
                             className="bg-slate-900 text-brand-500 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 hover:text-slate-900 transition-all active:scale-95 shadow-lg"
                           >
                             Select
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}
        </div>
      </div>

      <ProductDetailModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        vendorName={vendorMap[selectedProduct?.vendorId || ''] || 'Regional Sangli Mandi'}
      />
    </div>
  );
};

const SkeletonLoader = () => (
  <>
    {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-6 animate-pulse-subtle">
        <div className="aspect-square bg-slate-50 rounded-[1.5rem]"></div>
        <div className="h-4 bg-slate-50 rounded-lg w-3/4"></div>
        <div className="h-8 bg-slate-50 rounded-xl"></div>
        <div className="h-8 bg-slate-50 rounded-xl"></div>
      </div>
    ))}
  </>
);

export default Listing;
