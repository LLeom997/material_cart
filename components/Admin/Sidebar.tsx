
import React, { useState } from 'react';
import { Package, Users, Store, Truck, Wallet, ShieldAlert, ChevronLeft, Database } from 'lucide-react';

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package, desc: 'Sales Pipeline' },
    { id: 'clients', label: 'Clients', icon: Users, desc: 'Client Hub' },
    { id: 'suppliers', label: 'Suppliers', icon: Store, desc: 'Source Registry' },
    { id: 'stock', label: 'Stock', icon: Truck, desc: 'Inventory' },
    { id: 'books', label: 'Books', icon: Wallet, desc: 'Finances' },
    { id: 'logs', label: 'Logs', icon: ShieldAlert, desc: 'System Audit' },
  ];

  return (
    <aside className={`border-r bg-white transition-all duration-300 flex flex-col shrink-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-20 border-b flex items-center px-6 gap-3 shrink-0">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-brand-500 font-bold shrink-0">
          <Database size={22} />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="font-black text-xs text-slate-900 tracking-widest uppercase leading-none">Management</span>
            <span className="text-[8px] font-black text-brand-600 uppercase tracking-[0.2em]">MaterialCart</span>
          </div>
        )}
      </div>
      
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`w-full group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${active === tab.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <div className={`p-2 rounded-xl transition-colors ${active === tab.id ? 'bg-slate-800 text-brand-500' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
              <tab.icon size={18} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col items-start text-left">
                <span className="text-xs font-black uppercase tracking-widest leading-none mb-1">{tab.label}</span>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${active === tab.id ? 'text-slate-500' : 'text-slate-300'}`}>{tab.desc}</span>
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="w-full flex items-center justify-center p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
        >
          <ChevronLeft size={18} className={isCollapsed ? 'rotate-180' : ''} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
