
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../App';
import { OrderStatus, Enquiry, Product, Vendor, PurchaseBatch, LedgerSummary } from '../types';
import { 
  Plus, Search, RefreshCcw, MoreVertical, X, CheckSquare, 
  Trash2, Package, Truck, Users, LayoutDashboard, Loader2, Store, Edit3, Trash, Star,
  ChevronLeft, ChevronRight, Download, Upload, Filter, ArrowUpDown, AlertCircle, FileText,
  History, Wallet, TrendingUp, BarChart4
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CATEGORIES } from '../constants';

const API_URL = 'https://skjzrdibumjhoohaqckm.supabase.co/functions/v1/get-products';
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8fafc'/%3E%3Cpath d='M200 130a20 20 0 1 0 0 40 20 20 0 0 0 0-40z' fill='%23e2e8f0'/%3E%3C/svg%3E";

const AdminDashboard: React.FC = () => {
  const { isAdmin, fetchEnquiries, enquiries, user, role } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'vendors' | 'ledger'>('orders');
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [batches, setBatches] = useState<PurchaseBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Filtering & Sorting States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingVendor, setEditingVendor] = useState<Partial<Vendor> | null>(null);
  const [newBatch, setNewBatch] = useState<Partial<PurchaseBatch>>({ quantity_purchased: 0, unit_price: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([fetchEnquiries(), loadProducts(), loadVendors(), loadBatches()]);
    setIsLoading(false);
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${supabase.supabaseKey}`,
          "apikey": supabase.supabaseKey
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        // Fix: Added missing description and specifications properties to the product mapping to satisfy the Product interface.
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          subCategory: p.sub_category || 'General',
          priceRange: p.price_range || "₹0",
          uom: p.uom || 'Brass',
          brand: p.brand || 'Local Graded',
          image: p.image || PLACEHOLDER_IMAGE,
          categoryId: p.category?.id || p.category_id,
          vendorId: p.vendor_id,
          stock_quantity: p.stock_quantity || 0,
          description: p.description || '',
          specifications: p.specifications || []
        }));
        setProducts(mapped);
      }
    } catch (e) { console.error(e); }
  };

  const loadVendors = async () => {
    const { data } = await supabase.from('vendors').select('*').order('created_at', { ascending: false });
    if (data) setVendors(data);
  };

  const loadBatches = async () => {
    const { data } = await supabase.from('purchase_batches').select('*, vendors(name)').order('purchased_at', { ascending: false });
    if (data) {
      const mapped = data.map((b: any) => ({
        ...b,
        vendor_name: b.vendors?.name || 'Independent Source'
      }));
      setBatches(mapped);
    }
  };

  // KPI Calculations for the selected product (simulated Ledger Summary)
  const ledgerMetrics = useMemo(() => {
    const summaryMap: Record<string, LedgerSummary> = {};
    
    products.forEach(p => {
      summaryMap[p.id] = {
        product_id: p.id,
        name: p.name,
        uom: p.uom,
        total_pieces_purchased: 0,
        total_pieces_remaining: 0,
        total_pieces_sold: 0,
        average_purchase_price: 0
      };
    });

    batches.forEach(b => {
      if (summaryMap[b.product_id]) {
        const s = summaryMap[b.product_id];
        const prevTotal = s.total_pieces_purchased;
        const newTotal = prevTotal + b.quantity_purchased;
        
        s.average_purchase_price = newTotal > 0 
          ? (s.average_purchase_price * prevTotal + b.unit_price * b.quantity_purchased) / newTotal
          : 0;
        
        s.total_pieces_purchased += b.quantity_purchased;
        s.total_pieces_remaining += b.quantity_remaining;
        s.total_pieces_sold = s.total_pieces_purchased - s.total_pieces_remaining;
      }
    });

    return Object.values(summaryMap);
  }, [products, batches]);

  const saveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newBatch,
      quantity_remaining: newBatch.quantity_purchased // New batches start full
    };
    const { error } = await supabase.from('purchase_batches').insert([payload]);
    if (!error) {
      setIsBatchModalOpen(false);
      loadBatches();
    } else alert(error.message);
  };

  const handleExport = (type: 'csv' | 'pdf') => {
    if (type === 'pdf') window.print();
    else {
      const headers = ['Material', 'Purchased', 'Sold', 'Remaining', 'Avg Price'];
      const rows = ledgerMetrics.map(m => [m.name, m.total_pieces_purchased, m.total_pieces_sold, m.total_pieces_remaining, `₹${m.average_purchase_price.toFixed(2)}`]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(","))].join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", "inventory_ledger.csv");
      link.click();
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 animate-fadeIn flex flex-col min-h-screen">
      {/* Dynamic Header */}
      <div className="bg-white border border-gray-100 rounded-[2rem] p-5 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm no-print">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-brand-500 font-black text-xl">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">Logistics Hub</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Authorization: {role}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={loadData} className="p-3 bg-gray-50 text-gray-400 hover:text-slate-900 rounded-xl border border-gray-100 transition-all"><RefreshCcw size={18}/></button>
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-3 bg-slate-900 text-white rounded-xl shadow-lg"><ChevronLeft size={20}/></button>
        </div>
      </div>

      <div className="flex gap-8 flex-grow">
        {/* Sidebar */}
        <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 shrink-0 no-print hidden lg:block`}>
          <nav className="sticky top-28 space-y-2 p-2 bg-gray-50/50 rounded-[2rem] border border-gray-100">
             {[
               { id: 'orders', label: 'Shipments', icon: Package },
               { id: 'products', label: 'Inventory', icon: Truck },
               { id: 'ledger', label: 'Ledger', icon: Wallet },
               { id: 'vendors', label: 'Suppliers', icon: Store }
             ].map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)} 
                 className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-md border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <tab.icon size={18} /> {!isSidebarCollapsed && <span>{tab.label}</span>}
               </button>
             ))}
          </nav>
        </aside>

        {/* Workspace */}
        <div className="flex-grow space-y-6 min-w-0">
          
          {/* Main Ledger KPIs */}
          {activeTab === 'ledger' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 no-print">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Purchased (All)</p>
                <p className="text-3xl font-black text-slate-900">{ledgerMetrics.reduce((a, b) => a + b.total_pieces_purchased, 0)}</p>
                <div className="mt-2 text-[8px] font-bold text-blue-500 uppercase">Gross Procurement</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock Remaining</p>
                <p className="text-3xl font-black text-emerald-600">{ledgerMetrics.reduce((a, b) => a + b.total_pieces_remaining, 0)}</p>
                <div className="mt-2 text-[8px] font-bold text-emerald-500 uppercase">Current Asset Value</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Items Sold</p>
                <p className="text-3xl font-black text-slate-900">{ledgerMetrics.reduce((a, b) => a + b.total_pieces_sold, 0)}</p>
                <div className="mt-2 text-[8px] font-bold text-brand-500 uppercase">Fulfillment Velocity</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Portfolio Avg Price</p>
                <p className="text-3xl font-black text-slate-900">₹{(ledgerMetrics.reduce((a, b) => a + b.average_purchase_price, 0) / (ledgerMetrics.length || 1)).toFixed(0)}</p>
                <div className="mt-2 text-[8px] font-bold text-amber-500 uppercase">Cost Base Estimate</div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col flex-grow min-h-[500px]">
            {activeTab === 'ledger' ? (
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center no-print">
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2"><BarChart4 size={18} className="text-brand-500" /> Stage Inventory Ledger</h3>
                   <div className="flex gap-2">
                     <button onClick={() => handleExport('csv')} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-gray-100"><Download size={14}/> CSV</button>
                     <button onClick={() => setIsBatchModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-500 hover:text-slate-900 transition-all shadow-md"><Plus size={14}/> Record Purchase Batch</button>
                   </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                        <th className="px-6 py-4">Material (Site Asset)</th>
                        <th className="px-6 py-4 text-center">Total Bought</th>
                        <th className="px-6 py-4 text-center">Sold/Depleted</th>
                        <th className="px-6 py-4 text-center">Remaining Pieces</th>
                        <th className="px-6 py-4 text-right">Avg Purchase Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {ledgerMetrics.map(item => (
                        <tr key={item.product_id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-5">
                            <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.name}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Base Unit: {item.uom}</p>
                          </td>
                          <td className="px-6 py-5 text-center font-bold text-xs text-slate-900">{item.total_pieces_purchased}</td>
                          <td className="px-6 py-5 text-center font-bold text-xs text-brand-600">{item.total_pieces_sold}</td>
                          <td className="px-6 py-5 text-center">
                             <span className={`px-3 py-1 rounded-lg text-xs font-black ${item.total_pieces_remaining < 50 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-slate-900'}`}>
                               {item.total_pieces_remaining}
                             </span>
                          </td>
                          <td className="px-6 py-5 text-right font-black text-slate-900">
                             ₹{item.average_purchase_price.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center py-40 text-gray-300">
                 <Truck size={40} className="mx-auto mb-4 opacity-20" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Standard Workspace View</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Batch Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsBatchModalOpen(false)}></div>
          <form onSubmit={saveBatch} className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 animate-slideInUp space-y-8">
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Record Sourcing Event</h2>
                <button type="button" onClick={() => setIsBatchModalOpen(false)}><X size={24}/></button>
             </div>

             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Material</label>
                   <select required className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl text-xs font-bold outline-none" onChange={e => setNewBatch({...newBatch, product_id: e.target.value})}>
                      <option value="">Choose item...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.uom})</option>)}
                   </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity Bought</label>
                      <input type="number" required className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl text-xs font-bold outline-none" onChange={e => setNewBatch({...newBatch, quantity_purchased: parseInt(e.target.value)})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit Purchase Price</label>
                      <input type="number" step="0.01" required className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl text-xs font-bold outline-none" onChange={e => setNewBatch({...newBatch, unit_price: parseFloat(e.target.value)})} />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendor Partner</label>
                   <select required className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl text-xs font-bold outline-none" onChange={e => setNewBatch({...newBatch, vendor_id: e.target.value})}>
                      <option value="">Select Vendor...</option>
                      {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                   </select>
                </div>
             </div>

             <div className="flex gap-4">
                <button type="button" onClick={() => setIsBatchModalOpen(false)} className="flex-1 py-5 rounded-2xl font-black text-gray-400 text-[10px] uppercase border border-gray-100">Cancel</button>
                <button type="submit" className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-500 transition-all">Add to Ledger</button>
             </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
