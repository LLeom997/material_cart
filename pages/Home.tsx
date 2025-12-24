import React, { useState } from 'react';
import * as reactRouterDom from 'react-router-dom';
const { Link, useNavigate } = reactRouterDom as any;
import { CITIES, CATEGORIES, BUSINESS_PHONE } from '../constants';
import * as Icons from 'lucide-react';

const Home: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState(CITIES[0].slug);
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/listing?city=${selectedCity}`);
  };

  return (
    <div className="w-full">
      {/* High-Impact Hero */}
      <section className="bg-white border-b px-4 md:px-12 py-16 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2/5 h-full bg-slate-50 -skew-x-12 translate-x-1/2 pointer-events-none hidden lg:block opacity-40"></div>
        
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center gap-20 relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-100/80 text-slate-900 text-[11px] font-bold uppercase tracking-[0.25em] mb-10 border border-slate-200 backdrop-blur-sm">
              <Icons.ShieldCheck size={14} className="text-brand-500" /> Professional Grade Procurement • Sangli
            </div>
            <h1 className="text-5xl md:text-[5.5rem] font-extrabold text-slate-900 mb-8 leading-[0.92] tracking-[-0.04em] uppercase font-display">
              Build with <br className="hidden md:block"/>
              <span className="text-brand-500 italic">Material</span>Cart.
            </h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium mb-14 max-w-2xl leading-relaxed mx-auto lg:mx-0 opacity-80">
              Industrial grade building materials for Sangli's top contractors. Batch-verified quality meets direct Mandi-locked pricing.
            </p>
            
            <div className="w-full max-w-2xl mx-auto lg:mx-0 bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] p-3.5 flex flex-col md:flex-row gap-5 border border-slate-100">
              <div className="flex-grow flex items-center gap-4 px-7 py-4 md:py-3.5 bg-slate-50 rounded-[1.75rem] border border-slate-100 group transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-500/10 focus-within:border-brand-500/30">
                <Icons.MapPin className="text-brand-500" size={24} />
                <div className="flex flex-col items-start flex-grow">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Service Region</span>
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-transparent w-full font-bold text-slate-900 outline-none appearance-none cursor-pointer text-base font-display"
                  >
                    {CITIES.map(c => <option key={c.id} value={c.slug}>{c.name} District</option>)}
                  </select>
                </div>
                <Icons.ChevronDown size={14} className="text-slate-300" />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-slate-900 text-white px-12 py-5 rounded-[1.75rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-500 hover:text-slate-900 transition-all flex items-center justify-center gap-4 group shadow-xl active:scale-[0.97]"
              >
                OPEN CATALOG <Icons.ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-7 w-[500px]">
             {[
               { icon: Icons.HardHat, label: 'Quality Verified', sub: 'Lab Tested Batches' },
               { icon: Icons.Truck, label: 'Swift Delivery', sub: '24Hr Site Response' },
               { icon: Icons.BarChart3, label: 'Mandi Rates', sub: 'No Brokerage Costs' },
               { icon: Icons.Layers, label: 'Project Ready', sub: 'Large Volume Stock' }
             ].map((stat, i) => (
               <div key={i} className={`p-10 rounded-[3rem] border transition-all hover:scale-105 duration-500 ${i === 1 ? 'bg-slate-900 text-white shadow-2xl ring-8 ring-brand-50/50' : 'bg-white text-slate-900 border-slate-100 shadow-xl shadow-slate-200/50'}`}>
                  <stat.icon size={36} className={`mb-8 ${i === 1 ? 'text-brand-500' : 'text-brand-500'}`} strokeWidth={1.5} />
                  <h3 className="font-extrabold text-base uppercase tracking-tight leading-none mb-1.5 font-display">{stat.label}</h3>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${i === 1 ? 'text-slate-500' : 'text-slate-400'}`}>{stat.sub}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-slate-50/50 py-24 border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-900 mb-8 transition-all group-hover:-translate-y-2 group-hover:bg-slate-900 group-hover:text-brand-500 shadow-sm border border-slate-100">
              <Icons.ShieldCheck size={32} strokeWidth={1.5}/>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-5 uppercase tracking-tighter font-display">Industrial Grade</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-[15px] max-w-sm">
              We vet every supplier. Only batch-verified materials reach our site-ready inventory, ensuring the highest regional structural integrity.
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-900 mb-8 transition-all group-hover:-translate-y-2 group-hover:bg-slate-900 group-hover:text-brand-500 shadow-sm border border-slate-100">
              <Icons.Zap size={32} strokeWidth={1.5}/>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-5 uppercase tracking-tighter font-display">Hyper-Local Speed</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-[15px] max-w-sm">
              Our network covers the entire Sangli SMK industrial cluster, promising direct delivery within 24 hours to keep your masonry teams moving.
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-900 mb-8 transition-all group-hover:-translate-y-2 group-hover:bg-slate-900 group-hover:text-brand-500 shadow-sm border border-slate-100">
              <Icons.Gem size={32} strokeWidth={1.5}/>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-5 uppercase tracking-tighter font-display">Price Protection</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-[15px] max-w-sm">
              Zero hidden brokerages. We lock the best Sangli Mandi rates at confirmation, shielding your project from market volatility.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Entry */}
      <section className="bg-white py-28">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-4xl md:text-[3.5rem] font-extrabold text-slate-900 mb-6 uppercase tracking-tighter leading-none font-display">Supply Verticals</h2>
              <p className="text-slate-500 font-medium text-lg max-w-xl opacity-80">Everything you need for structural and finishing stages, sourced from verified industrial plants.</p>
            </div>
            <Link to="/listing" className="text-xs font-black text-brand-600 flex items-center gap-2.5 uppercase tracking-[0.25em] border-b-2 border-brand-500/20 pb-2 hover:border-brand-500 transition-all group">
              VIEW ALL INVENTORY <Icons.ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {CATEGORIES.map(cat => {
              const DynamicIcon = ((Icons as any)[cat.icon] || Icons.Box) as React.ElementType;
              return (
                <Link 
                  key={cat.id}
                  to={`/listing?city=${selectedCity}&category=${cat.slug}`}
                  className="bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100 hover:border-brand-500/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all group text-center flex flex-col items-center"
                >
                  <div className="bg-white w-20 h-20 rounded-[1.75rem] flex items-center justify-center mb-8 group-hover:bg-slate-900 group-hover:text-brand-500 transition-all shadow-sm border border-slate-100">
                    <DynamicIcon size={36} strokeWidth={1.25} />
                  </div>
                  <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em] leading-tight font-display">{cat.name}</h4>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Large Scale CTA */}
      <section className="bg-slate-900 py-32 md:py-48 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <Icons.Building2 size={800} className="absolute -bottom-40 -right-40 text-brand-500" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-[5rem] font-extrabold text-white mb-10 tracking-[-0.03em] uppercase leading-[0.95] font-display">Scale with <br/><span className="text-brand-500 italic">Material</span>Cart.</h2>
          <p className="text-slate-400 text-lg md:text-xl mb-16 font-medium max-w-2xl mx-auto leading-relaxed opacity-90">Partner with our project desk for bulk logistics contracts and site-wise material auditing.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-7">
            <Link to="/listing" className="bg-brand-500 text-slate-900 px-16 py-6 rounded-2xl font-black uppercase tracking-[0.25em] text-xs hover:bg-white transition-all shadow-2xl active:scale-[0.97]">Procurement Desk</Link>
            <a href={`tel:${BUSINESS_PHONE}`} className="bg-white/5 text-white border border-white/20 px-16 py-6 rounded-2xl font-black uppercase tracking-[0.25em] text-xs flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-[0.97]">
              <Icons.Phone size={20} /> Site Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;