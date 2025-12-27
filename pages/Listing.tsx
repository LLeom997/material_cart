
import React, { useMemo, useState, useEffect } from 'react';
import * as reactRouterDom from 'react-router-dom';
const { useSearchParams, Link } = reactRouterDom as any;
import { CITIES } from '../constants';
import * as Icons from 'lucide-react';
import { useApp } from '../App';
import { Product, Category, Vendor } from '../types';
import { supabase } from '../lib/supabase';

type ViewMode = 'grid' | 'table';

const API_URL = 'https://skjzrdibumjhoohaqckm.supabase.co/functions/v1/get-products';
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8fafc'/%3E%3Cpath d='M200 130a20 20 0 1 0 0 40 20 20 0 0 0 0-40z' fill='%23e2e8f0'/%3E%3C/svg%3E";

interface ProductCardProps {
  product: Product;
  cart: any[];
  vendorName: string;
  onUpdateQuantity: (p: Product, q: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, cart, vendorName, onUpdateQuantity }) => {
  const cartItem = cart.find(c => c.productId === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  
  const [selectedVariant, setSelectedVariant] = useState(4); 
  const variants = [4, 6, 8];

  const dailyVolume = useMemo(() => Math.floor(Math.random() * 450) + 120, []);

  return (
    <article className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="relative aspect-[16/10] bg-gray-50 flex items-center justify-center p-4">
        <div className="absolute top-3 left-3 flex gap-1 z-10">
           <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-wider border border-blue-100">Grade A</span>
        </div>
        <img 
          src={product.image || PLACEHOLDER_IMAGE} 
          alt={product.name}
          className="max-h-full max-w-full object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105" 
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <div className="flex justify-between items-start mb-0.5">
            <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-1">{product.name}</h3>
            <div className="flex items-center gap-1 text-amber-500">
               <Icons.Star size={10} fill="currentColor" />
               <span className="text-[9px] font-bold">4.8</span>
            </div>
          </div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{product.brand || 'Local Graded'}</p>
        </div>

        <div className="flex gap-1.5 mb-3">
          {variants.map(v => (
            <button 
              key={v}
              onClick={() => setSelectedVariant(v)}
              className={`flex-1 py-1 rounded-md border text-[9px] font-black transition-all ${selectedVariant === v ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
            >
              {v} BRASS
            </button>
          ))}
        </div>

        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="text-base font-black text-gray-900">₹{product.priceRange.replace('₹', '')}</span>
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">per brass</span>
        </div>

        <div className="space-y-1 mb-4 py-2 border-y border-gray-50">
           <div className="flex justify-between items-center text-[9px] font-bold">
              <span className="text-gray-400 uppercase">Daily Supply</span>
              <span className="text-gray-900">{dailyVolume} Brass</span>
           </div>
           <div className="flex justify-between items-center text-[9px] font-bold">
              <span className="text-gray-400 uppercase">Source</span>
              <span className="text-gray-900 truncate max-w-[100px]">{vendorName}</span>
           </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 h-8 px-1 overflow-hidden">
            <button 
              onClick={() => onUpdateQuantity(product, quantity - 1)}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
            >
              <Icons.Minus size={12} />
            </button>
            <span className="w-6 text-center text-[10px] font-black text-gray-900">{quantity}</span>
            <button 
              onClick={() => onUpdateQuantity(product, quantity + 1)}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
            >
              <Icons.Plus size={12} />
            </button>
          </div>
          <div className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">
            ID-{product.id.substring(0, 4)}
          </div>
        </div>
      </div>
    </article>
  );
};

const SkeletonLoader = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
      <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 animate-pulse-subtle">
        <div className="aspect-[16/10] bg-gray-50 rounded-xl"></div>
        <div className="h-3 bg-gray-50 rounded w-3/4"></div>
        <div className="h-6 bg-gray-50 rounded-lg"></div>
        <div className="h-6 bg-gray-50 rounded-lg"></div>
      </div>
    ))}
  </div>
);

const Listing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { updateCartQuantity, cart } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const citySlug = searchParams.get('city') || CITIES[0].slug;
  const categorySlug = searchParams.get('category');

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      try {
        const [pResp, vResp] = await Promise.all([
          fetch(API_URL, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${supabase.supabaseKey}`,
              "apikey": supabase.supabaseKey
            }
          }),
          supabase.from('vendors').select('*')
        ]);

        const pData = await pResp.json();
        if (Array.isArray(pData)) {
          // Fix: Ensure all mandatory Product properties are provided in the mapping
          const mapped = pData.map((p: any) => ({
            id: p.id,
            name: p.name,
            subCategory: p.sub_category || 'General',
            priceRange: p.price_range || "₹0",
            originalPrice: (parseInt(p.price_range?.match(/\d+/)?.[0] || '0') * 1.2).toFixed(0),
            uom: p.uom || 'Brass',
            brand: p.brand || 'Local Graded',
            image: p.image || PLACEHOLDER_IMAGE,
            categoryId: p.category?.id,
            categoryName: p.category?.name,
            categorySlug: p.category?.slug,
            vendorId: p.vendor_id,
            description: p.description || '',
            specifications: p.specifications || []
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

        if (vResp.data) {
          setVendors(vResp.data);
        }
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    loadAll();
  }, []);

  const handleUpdateQuantity = (product: Product, q: number) => {
    updateCartQuantity(product.id, Math.max(0, q), product.name, product.uom);
  };

  const filteredProducts = useMemo(() => {
    let list = products;
    if (categorySlug) list = list.filter(p => p.categorySlug === categorySlug);
    if (searchTerm) {
      list = list.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return list;
  }, [categorySlug, searchTerm, products]);

  const vendorMap = useMemo(() => {
    const map: Record<string, string> = {};
    vendors.forEach(v => { map[v.id] = v.name; });
    return map;
  }, [vendors]);

  return (
    <div className="w-full bg-white pb-12 min-h-screen">
      <div className="bg-white border-b sticky top-[60px] md:top-[68px] z-40">
        <div className="full-width-container mx-auto py-3 flex items-center justify-between gap-6">
          <div className="flex-grow max-w-lg relative group">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input 
              type="text" 
              placeholder="Quick search catalog..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-gray-200 text-xs transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-slate-900' : 'text-gray-300'}`}>
              <Icons.LayoutGrid size={18} />
            </button>
            <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-gray-100 text-slate-900' : 'text-gray-300'}`}>
              <Icons.List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="full-width-container mx-auto py-8 flex flex-col lg:flex-row gap-12">
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-40 space-y-8">
            <div>
              <h2 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-6">Market index</h2>
              <ul className="space-y-3">
                <li>
                  <Link to={`/listing?city=${citySlug}`} className={`text-xs font-bold uppercase transition-all ${!categorySlug ? 'text-slate-900' : 'text-gray-300 hover:text-slate-900'}`}>Full Catalog</Link>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link to={`/listing?city=${citySlug}&category=${cat.slug}`} className={`text-xs font-bold uppercase transition-all ${categorySlug === cat.slug ? 'text-slate-900' : 'text-gray-300 hover:text-slate-900'}`}>{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </aside>

        <div className="flex-grow">
          {isLoading ? (
            <SkeletonLoader />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  cart={cart} 
                  vendorName={vendorMap[product.vendorId || ''] || 'Regional Mandi'}
                  onUpdateQuantity={handleUpdateQuantity} 
                />
              ))}
            </div>
          ) : (
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[8px] font-black uppercase tracking-widest border-b border-gray-100">
                    <tr>
                       <th className="px-6 py-3">Material</th>
                       <th className="px-6 py-3">Vendor</th>
                       <th className="px-6 py-3 text-right">Price</th>
                       <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <img src={p.image} className="w-8 h-8 object-contain" alt="" />
                              <p className="text-xs font-bold text-gray-900">{p.name}</p>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-[10px] font-bold text-gray-400">
                          {vendorMap[p.vendorId || ''] || 'Regional Mandi'}
                        </td>
                        <td className="px-6 py-4 text-right font-black text-sm text-gray-900">
                          {p.priceRange}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => handleUpdateQuantity(p, 1)} className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-brand-500 transition-all">Select</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listing;