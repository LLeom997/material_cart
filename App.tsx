import React, { useState, createContext, useContext, useEffect } from 'react';
import * as reactRouterDom from 'react-router-dom';
const { Routes, Route, Link, useLocation, useNavigate, Navigate } = reactRouterDom as any;
import { EnquiryItem, Enquiry, OrderStatus } from './types';
import Home from './pages/Home';
import Listing from './pages/Listing';
import EnquiryPage from './pages/Enquiry';
import TrackOrder from './pages/TrackOrder';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import AuthPage from './pages/AuthPage';
import { supabase } from './lib/supabase';
import { 
  ShoppingCart, 
  Phone, 
  Home as HomeIcon, 
  Search, 
  ClipboardList, 
  User,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { BUSINESS_PHONE } from './constants';

interface AppContextType {
  cart: EnquiryItem[];
  addToCart: (item: EnquiryItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  user: any;
  isAdmin: boolean;
  signOut: () => void;
  enquiries: Enquiry[];
  fetchEnquiries: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const App: React.FC = () => {
  const [cart, setCart] = useState<EnquiryItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        checkAdminStatus(currentUser.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        checkAdminStatus(currentUser.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    // In this demo environment, we treat specific emails or metadata as Admin
    // For production, you would check a 'profiles' table with a 'role' column
    const { data } = await supabase.auth.getUser();
    if (data.user?.email?.includes('admin')) {
      setIsAdmin(true);
    }
  };

  const fetchEnquiries = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      const formatted = data.map(o => ({
        id: o.order_id,
        customerName: o.customer_name,
        phone: o.phone,
        city: o.city,
        location: o.location,
        projectType: o.project_type,
        items: o.items,
        status: o.status as OrderStatus,
        createdAt: o.created_at,
        adminNotes: o.admin_notes
      }));
      setEnquiries(formatted);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const addToCart = (newItem: EnquiryItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === newItem.productId);
      if (existing) {
        return prev.map(i => i.productId === newItem.productId 
          ? { ...i, quantity: i.quantity + newItem.quantity } 
          : i);
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.productId !== id));
  const clearCart = () => setCart([]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart, 
      user, isAdmin, signOut, enquiries, fetchEnquiries 
    }}>
      <div className="min-h-screen flex flex-col bg-brand-50 text-slate-900 font-sans tracking-tight">
        {/* Market Ribbon */}
        <div className="bg-slate-900 text-white text-[10px] font-bold py-2.5 px-4 md:px-8 flex justify-between items-center tracking-wider z-[60]">
          <div className="flex items-center gap-6">
             <span className="opacity-70 uppercase font-display">Regional Sourcing Hub: Sangli</span>
             <span className="hidden md:flex items-center gap-1.5 bg-brand-500/10 text-brand-500 px-2 py-0.5 rounded-full border border-brand-500/20">
               <ShieldCheck size={10} /> Certified Inventory
             </span>
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${BUSINESS_PHONE}`} className="flex items-center gap-1.5 hover:text-brand-500 transition-colors">
              <Phone size={11} /> Support: {BUSINESS_PHONE}
            </a>
          </div>
        </div>

        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="full-width-container mx-auto py-3.5 flex items-center justify-between gap-8">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-brand-500 transition-all group-hover:bg-brand-500 group-hover:text-slate-900 shadow-sm">
                <ShieldCheck size={26} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-2xl font-black tracking-tighter leading-none uppercase font-display">Material</span>
                <span className="text-[10px] font-extrabold text-brand-600 tracking-[0.4em] uppercase font-display">Cart</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 ml-auto">
              <div className="flex items-center gap-8">
                <Link to="/listing" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-wide">Catalog</Link>
                <Link to="/track" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-wide">Orders</Link>
                {isAdmin && <Link to="/admin" className="text-sm font-bold text-brand-600 hover:text-slate-900 transition-colors uppercase tracking-wide">Admin</Link>}
              </div>
              <div className="h-4 w-px bg-slate-200"></div>
              <div className="flex items-center gap-4">
                <Link to="/enquiry" className="relative p-2.5 bg-slate-900 text-white rounded-2xl hover:bg-brand-500 hover:text-slate-900 transition-all shadow-md group">
                  <ShoppingCart size={22} />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-fadeIn shadow-lg">
                      {cart.length}
                    </span>
                  )}
                </Link>
                
                {user ? (
                  <button onClick={signOut} className="flex items-center gap-2.5 pl-4 py-2 border-l border-slate-100 group transition-all">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase group-hover:bg-accent group-hover:text-white transition-colors">
                      {user.email?.[0]}
                    </div>
                    <LogOut size={18} className="text-slate-300 hover:text-accent transition-colors" />
                  </button>
                ) : (
                  <Link to="/auth" className="text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-brand-500 transition-colors border-2 border-slate-900 px-5 py-2.5 rounded-xl">
                    Log In
                  </Link>
                )}
              </div>
            </nav>

            <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={26}/> : <Menu size={26}/>}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b shadow-2xl p-6 animate-fadeIn">
              <nav className="flex flex-col gap-4">
                <Link to="/listing" className="text-base font-bold p-3 border-b border-slate-50 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>Catalog <ChevronRight size={18}/></Link>
                <Link to="/track" className="text-base font-bold p-3 border-b border-slate-50 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>Orders <ChevronRight size={18}/></Link>
                {isAdmin && <Link to="/admin" className="text-base font-bold p-3 border-b border-slate-50 text-brand-600 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel <ChevronRight size={18}/></Link>}
                {!user ? (
                  <Link to="/auth" className="bg-slate-900 text-white p-4 rounded-2xl text-center font-bold mt-4 shadow-xl" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                ) : (
                  <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="bg-accent/10 text-accent p-4 rounded-2xl text-center font-bold mt-4 border border-accent/20">Sign Out</button>
                )}
              </nav>
            </div>
          )}
        </header>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listing" element={<Listing />} />
            <Route path="/enquiry" element={<EnquiryPage />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Global Action Bar (Desktop) */}
        {cart.length > 0 && location.pathname !== '/enquiry' && (
          <div className="hidden lg:block fixed bottom-8 right-8 z-40 animate-slideInUp">
            <Link to="/enquiry" className="bg-slate-900 text-white pl-8 pr-5 py-5 rounded-[2rem] flex items-center gap-16 shadow-2xl hover:translate-y-[-6px] transition-all group border border-white/10 ring-8 ring-brand-50/20">
              <div className="flex items-center gap-5">
                <div className="bg-brand-500 text-slate-900 p-3 rounded-2xl">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-brand-500 uppercase tracking-[0.2em] leading-none mb-1.5">Quote Request</p>
                  <p className="text-xl font-black font-display tracking-tight">{cart.length} Selections</p>
                </div>
              </div>
              <div className="bg-white text-slate-900 px-8 py-4 rounded-[1.25rem] text-xs font-black uppercase tracking-widest group-hover:bg-brand-500 transition-colors">
                PROCEED
              </div>
            </Link>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;