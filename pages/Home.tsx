import React, { useState } from 'react';
import * as reactRouterDom from 'react-router-dom';
import { CITIES, CATEGORIES, BUSINESS_PHONE } from '../constants';
import * as Icons from 'lucide-react';

const { Link, useNavigate } = reactRouterDom as any;

export default function Home() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0].slug);
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/listing?city=${selectedCity}`);
  };

  return (
    <div className="w-full">
      {/* High-Impact Hero */}
      <section className="bg-white border-b px-4 md:px-12 py-12 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2/5 h-full bg-slate-50 -skew-x-12 translate-x-1/2 pointer-events-none hidden lg:block opacity-40"></div>
        
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-8 border border-slate-200">
              <Icons.ShieldCheck size={12} className="text-brand-500" /> Authorized Supply Chain
            </div>
            <h1 className="text-4xl md:text-[5.5rem] font-extrabold text-slate-900 mb-6 leading-[1] tracking-tight uppercase font-display">
              Build with <br className="hidden md:block"/>
              <span className="text-brand-500 italic">Material</span>Cart.
            </h1>
            <p className="text-slate-500 text-base md:text-xl font-medium mb-10 max-w-2xl leading-relaxed mx-auto lg:mx-0 opacity-80">
              Industrial grade building materials for Sangli's top contractors. Direct Mandi pricing, authenticated quality.
            </p>
            
            <div className="w-full max-w-2xl mx-auto lg:mx-0 bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-3 border border-slate-100">
              <div className="flex-grow flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-xl border border-slate-100">
                <Icons.MapPin className="text-brand-500" size={18} />
                <div className="flex flex-col items-start flex-grow">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Service Area</span>
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-transparent w-full font-bold text-slate-900 outline-none appearance-none cursor-pointer text-sm"
                  >
                    {CITIES.map(c => <option key={c.id} value={c.slug}>{c.name} District</option>)}
                  </select>
                </div>
              </div>
              <button 
                onClick={handleSearch}
                className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-[11px] hover:bg-brand-500 hover:text-slate-900 transition-all flex items-center justify-center gap-3 shadow-lg"
              >
                OPEN CATALOG <Icons.ArrowRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-4 w-[450px]">
             {[
               { icon: Icons.HardHat, label: 'Quality Verified', sub: 'Lab Tested Stock' },
               { icon: Icons.Truck, label: 'Swift Delivery', sub: '24Hr Response' },
               { icon: Icons.BarChart3, label: 'Mandi Rates', sub: 'Zero Brokerage' },
               { icon: Icons.Layers, label: 'Project Ready', sub: 'Bulk Inventory' }
             ].map((stat, i) => (
               <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <stat.icon size={24} className="mb-4 text-brand-500" strokeWidth={1.5} />
                  <h3 className="font-bold text-sm text-slate-900 mb-1">{stat.label}</h3>
                  <p className="text-[10px] font-medium text-slate-400">{stat.sub}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Supply Verticals */}
      <section className="bg-white py-12 md:py-20 border-b border-slate-50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight uppercase font-display">Supply Verticals</h2>
              <p className="text-slate-400 font-semibold text-xs opacity-80">Industrial grade sourcing channels</p>
            </div>
            <Link to="/listing" className="text-sm font-bold text-brand-600 flex items-center gap-1.5 hover:gap-3 transition-all">
              View All <Icons.ArrowRight size={14}/>
            </Link>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-6">
            {CATEGORIES.map(cat => {
              const DynamicIcon = ((Icons as any)[cat.icon] || Icons.Box) as React.ElementType;
              return (
                <Link 
                  key={cat.id}
                  to={`/listing?city=${selectedCity}&category=${cat.slug}`}
                  className="bg-slate-50/50 p-3 md:p-8 rounded-xl md:rounded-3xl border border-slate-100 hover:border-brand-500/50 hover:bg-white hover:shadow-lg transition-all group text-center flex flex-col items-center"
                >
                  <div className="bg-white w-10 h-10 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-2 md:mb-6 group-hover:bg-slate-900 group-hover:text-brand-500 transition-all border border-slate-100 shadow-sm">
                    <DynamicIcon size={20} className="md:size-28" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-[10px] md:text-sm tracking-tight leading-tight">{cat.name}</h4>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Action CTA */}
      <section className="bg-slate-900 py-16 md:py-32 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-6xl font-extrabold text-white mb-6 tracking-tight uppercase font-display">Scale with <span className="text-brand-500">Material</span>Cart.</h2>
          <p className="text-slate-400 text-sm md:text-lg mb-10 font-medium max-w-xl mx-auto leading-relaxed">Partner with our project desk for bulk logistics and site-wise material auditing in the Sangli district.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/listing" className="bg-brand-500 text-slate-900 px-10 py-4 rounded-xl font-bold uppercase tracking-wider text-[11px] shadow-xl">Procurement Desk</Link>
            <a href={`tel:${BUSINESS_PHONE}`} className="bg-white/5 text-white border border-white/20 px-10 py-4 rounded-xl font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-2">
              <Icons.Phone size={16} /> Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}