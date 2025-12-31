
import React, { useState, createContext, useContext, useEffect } from 'react';
import * as reactRouterDom from 'react-router-dom';
import { EnquiryItem, Enquiry, OrderStatus, UserRole } from './types';
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
  ShieldCheck,
  Menu,
  X,
  LogOut,
  ChevronRight,
  User,
  LayoutDashboard
} from 'lucide-react';
import { BUSINESS_PHONE } from './constants';

const { Routes, Route, Link, useLocation, useNavigate, Navigate } = reactRouterDom as any;

interface AppContextType {
  cart: EnquiryItem[];
  addToCart: (item: EnquiryItem) => void;
  updateCartQuantity: (productId: string, quantity: number, productName?: string, uom?: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  user: any;
  role: UserRole | null;
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
  const [role, setRole] = useState<UserRole | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthChange = (session: any) => {
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    if (currentUser) {
      const userRole: UserRole = currentUser.email?.includes('admin') ? 'ADMIN' : 'CLIENT_USER';
      setRole(userRole);
    } else {
      setRole(null);
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
        adminNotes: o.admin_notes,
        total_amount: o.total_amount
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

  const updateCartQuantity = (productId: string, quantity: number, productName?: string, uom?: string) => {
    setCart(prev => {
      if (quantity <= 0) return prev.filter(i => i.productId !== productId);
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, quantity } : i);
      }
      if (productName && uom) {
        return [...prev, { productId, productName, quantity, uom }];
      }
      return prev;
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.productId !== id));
  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{ 
      cart, addToCart, updateCartQuantity, removeFromCart, clearCart, 
      user, role, isAdmin: role === 'ADMIN', signOut, enquiries, fetchEnquiries 
    }}>
      <div className="min-h-screen flex flex-col bg-brand-50 text-slate-900 font-sans antialiased">
        <header className="bg-white border-b sticky top-0 z-50 shadow-sm transition-all duration-300">
          <div className="full-width-container mx-auto h-16 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-brand-500 group-hover:scale-105 transition-transform duration-300">
                <ShieldCheck size={22} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-black tracking-tighter uppercase text-slate-900">Material</span>
                <span className="text-[9px] font-black text-brand-600 tracking-[0.3em] uppercase">Cart</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/listing" className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">Catalog</Link>
              <Link to="/track" className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">Track Orders</Link>
              {role === 'ADMIN' && (
                <Link to="/admin" className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-widest bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100 transition-all">
                  <LayoutDashboard size={14} /> Admin Desk
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-3">
              <Link to="/enquiry" className="relative p-2.5 bg-slate-100 text-slate-900 rounded-xl hover:bg-brand-500 transition-all group active:scale-95">
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {cart.length}
                  </span>
                )}
              </Link>

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Welcome</p>
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{user.email}</p>
                  </div>
                  <button onClick={signOut} className="p-2.5 bg-slate-50 text-slate-400 hover:text-accent hover:bg-accent/5 rounded-xl transition-all group">
                    <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-white border-2 border-slate-900 px-5 py-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition-all active:scale-95 shadow-sm">
                  Sign In
                </Link>
              )}

              <button className="md:hidden p-2 text-slate-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] bg-white md:hidden animate-slideInLeft p-6 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-brand-500">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-lg font-black uppercase text-slate-900">MaterialCart</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 border rounded-full"><X size={20}/></button>
            </div>
            <nav className="flex flex-col gap-8 flex-grow">
              <Link to="/listing" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-tighter text-slate-900 border-b pb-4">Browse Catalog</Link>
              <Link to="/track" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-tighter text-slate-900 border-b pb-4">Track Orders</Link>
              {role === 'ADMIN' && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-tighter text-brand-600 border-b pb-4">Admin Dashboard</Link>
              )}
            </nav>
            <div className="mt-auto pt-8 border-t flex items-center justify-between">
              {user ? (
                 <button onClick={signOut} className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest"><LogOut size={16}/> Sign Out</button>
              ) : (
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl w-full text-center font-black uppercase tracking-widest text-xs">Sign In</Link>
              )}
            </div>
          </div>
        )}

        <main id="main-content" className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listing" element={<Listing />} />
            <Route path="/enquiry" element={<EnquiryPage />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/auth" />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <footer className="bg-white border-t py-12 px-6">
           <div className="full-width-container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-brand-500"><ShieldCheck size={18} /></div>
                  <span className="text-lg font-black uppercase text-slate-900">MaterialCart</span>
                </div>
                <p className="text-slate-500 font-medium max-w-sm mb-6 leading-relaxed">Industrialized structural materials marketplace for Sangli District. Graded quality, Mandi price parity, and localized logistics.</p>
                <div className="flex items-center gap-6">
                   <a href={`tel:${BUSINESS_PHONE}`} className="flex items-center gap-2 text-slate-900 font-bold hover:text-brand-600 transition-colors"><Phone size={14}/> {BUSINESS_PHONE}</a>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Market Hub</h4>
                <ul className="space-y-4">
                  <li><Link to="/listing" className="text-sm font-bold text-slate-900 hover:text-brand-600">Full Catalog</Link></li>
                  <li><Link to="/track" className="text-sm font-bold text-slate-900 hover:text-brand-600">Track Order</Link></li>
                  <li><Link to="/about" className="text-sm font-bold text-slate-900 hover:text-brand-600">Our Story</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Supply Chain</h4>
                <ul className="space-y-4">
                  <li><Link to="/auth" className="text-sm font-bold text-slate-900 hover:text-brand-600">Vendor Portal</Link></li>
                  <li><Link to="/contact" className="text-sm font-bold text-slate-900 hover:text-brand-600">Partner with us</Link></li>
                  <li><Link to="/contact" className="text-sm font-bold text-slate-900 hover:text-brand-600">Support Desk</Link></li>
                </ul>
              </div>
           </div>
           <div className="full-width-container mx-auto mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2024 MaterialCart Sangli. All Rights Reserved.</p>
              <div className="flex items-center gap-6">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ISO 9001:2015 Verified</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Privacy Policy</span>
              </div>
           </div>
        </footer>
      </div>
    </AppContext.Provider>
  );
};

export default App;
