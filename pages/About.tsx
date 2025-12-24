
import React from 'react';
import { ShieldEllipsis, ShieldCheck, MapPin, Target, Verified, Building2 } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-surface min-h-screen font-sans animate-fadeIn">
      <div className="max-w-6xl mx-auto px-4 py-20 md:py-32">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-[0.3em] mb-10 shadow-sm border border-slate-200">
            <Verified size={16} className="text-brand-500" /> Professional Infrastructure Partner
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-slate-900 mb-10 tracking-tighter uppercase leading-[0.85]">
            The <span className="text-brand-500 italic">Material</span><br/>Cart Story
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed opacity-80">
            "Eliminating volatility, ensuring integrity. Born in the heart of Sangli to shield every foundation built here."
          </p>
        </div>

        <div className="space-y-24">
          {/* Mission Block */}
          <section className="bg-white p-12 md:p-24 rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row gap-20 items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-black text-slate-900 mb-8 uppercase tracking-tighter leading-none">Our Sangli Roots</h2>
              <div className="space-y-8 text-slate-600 font-medium leading-relaxed text-lg">
                <p>
                  <strong className="text-slate-900">MaterialCart</strong> was founded with a singular objective: to industrialize the fragmented construction supply chain in the <strong className="text-slate-900 text-brand-600 italic">Sangli-Miraj-Kupwad</strong> cluster.
                </p>
                <p>
                  We identified a critical gap where developers were forced to accept inconsistent material grades at unpredictable prices. We bridged this by establishing a direct-audit marketplace, connecting site-ready inventory directly to your project coordinates.
                </p>
              </div>
            </div>
            <div className="w-full md:w-2/5 grid grid-cols-2 gap-5">
               <div className="aspect-square bg-brand-50 rounded-[3rem] flex flex-col items-center justify-center text-slate-900 border border-brand-100 shadow-sm group hover:bg-brand-500 transition-all duration-500">
                 <ShieldCheck size={40} className="mb-4 text-brand-600 group-hover:text-slate-900 transition-colors" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Graded</span>
               </div>
               <div className="aspect-square bg-slate-50 rounded-[3rem] flex flex-col items-center justify-center text-slate-900 border border-slate-100 shadow-sm group hover:bg-slate-900 hover:text-white transition-all duration-500">
                 <MapPin size={40} className="mb-4 text-brick group-hover:text-white transition-colors" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Local</span>
               </div>
               <div className="aspect-square bg-slate-900 rounded-[3rem] flex flex-col items-center justify-center text-white shadow-xl group hover:bg-brand-500 hover:text-slate-900 transition-all duration-500">
                 <Target size={40} className="mb-4 text-brand-400 group-hover:text-slate-900 transition-colors" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Precise</span>
               </div>
               <div className="aspect-square bg-white rounded-[3rem] flex flex-col items-center justify-center text-slate-900 border border-slate-100 shadow-sm group hover:bg-slate-900 hover:text-white transition-all duration-500">
                 <Building2 size={40} className="mb-4 text-brand-500 group-hover:text-white transition-colors" />
                 <span className="text-[10px] font-black uppercase tracking-widest">SMK Belt</span>
               </div>
            </div>
          </section>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section className="bg-slate-900 p-12 md:p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute bottom-[-40px] right-[-40px] opacity-[0.05] group-hover:opacity-10 transition-opacity pointer-events-none">
                 <Building2 size={280} />
              </div>
              <h3 className="text-3xl font-black mb-8 text-brand-500 uppercase tracking-tighter">The Sourcing Edge</h3>
              <p className="text-slate-400 font-medium leading-relaxed mb-10 text-base italic opacity-80">
                Exclusive focus on the Sangli industrial belt ensures a localized, high-speed logistics response that national players can't match.
              </p>
              <ul className="space-y-6">
                {[
                  "Verified Red Brick Kiln Audits",
                  "Factory-Direct OPC 53 Gradings",
                  "Automated M-Sand Particle Checks",
                  "Structural Grade TMT Verification"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] border-b border-white/5 pb-5">
                    <div className="w-2 h-2 bg-brand-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)]"></div> {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-brand-500 p-12 md:p-16 rounded-[4rem] text-slate-900 shadow-2xl relative">
              <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter">Operational Promise</h3>
              <div className="space-y-10">
                <div className="group">
                  <h4 className="font-black text-[11px] uppercase tracking-[0.3em] mb-2 pb-2 border-b border-slate-900/10 opacity-70">Laboratory Audits</h4>
                  <p className="text-slate-900 font-extrabold text-sm leading-relaxed tracking-tight">"Every ton of material delivered meets SMK district structural compliance."</p>
                </div>
                <div className="group">
                  <h4 className="font-black text-[11px] uppercase tracking-[0.3em] mb-2 pb-2 border-b border-slate-900/10 opacity-70">Rate Protection</h4>
                  <p className="text-slate-900 font-extrabold text-sm leading-relaxed tracking-tight">"We lock Sangli-Mandi pricing at order confirmation to shield your budget."</p>
                </div>
                <div className="group">
                  <h4 className="font-black text-[11px] uppercase tracking-[0.3em] mb-2 pb-2 border-b border-slate-900/10 opacity-70">Logistics Mastery</h4>
                  <p className="text-slate-900 font-extrabold text-sm leading-relaxed tracking-tight">"Local fleet utilization for site delivery within a 24-hour cycle."</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
