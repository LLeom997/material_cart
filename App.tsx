
import React, { useState, createContext, useContext, useEffect } from 'react';
import * as reactRouterDom from 'react-router-dom';
const { Routes, Route, Link, useLocation, useNavigate, Navigate } = reactRouterDom as any;
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
  User
} from 'lucide-react';
import { BUSINESS_PHONE } from './constants';

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
      const userRole = currentUser.email?.includes('admin') ? 'admin' : 'client';
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
      user, role, isAdmin: role === 'admin', signOut, enquiries, fetchEnquiries 
    }}>
      <div className="min-h-screen flex flex-col bg-brand-50 text-slate-900 font-sans tracking-tight">
        <div role="complementary" className="bg-slate-900 text-white text-[10px] font-bold py-2 px-4 md:px-8 flex justify-between items-center tracking-wider z-[60]">
          <div className="flex items-center gap-6">
             <span className="opacity-70 uppercase">Regional Hub: Sangli</span>
             {user && <span className="text-brand-500 uppercase">Role: {role}</span>}
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${BUSINESS_PHONE}`} className="flex items-center gap-1.5 hover:text-brand-500 transition-colors">
              <Phone size={10} /> {BUSINESS_PHONE}
            </a>
          </div>
        </div>

        <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="full-width-container mx-auto py-3 flex items-center justify-between gap-8">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-brand-500 transition-all">
                <ShieldCheck size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-black tracking-tighter uppercase">Material</span>
                <span className="text-[8px] font-extrabold text-brand-600 tracking-[0.3em] uppercase">Cart</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 ml-auto">
              {role === 'admin' ? (
                <Link to="/admin" className="text-xs font-bold text-brand-600 hover:text-slate-900 transition-colors uppercase tracking-widest">Admin Desk</Link>
              ) : (
                <>
                  <Link to="/listing" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-widest">Catalog</Link>
                  <Link to="/track" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-widest">My Orders</Link>
                </>
              )}
              <div className="h-4 w-px bg-slate-200"></div>
              <div className="flex items-center gap-4">
                <Link to="/enquiry" className="relative p-2 bg-slate-100 text-slate-900 rounded-xl hover:bg-brand-500 transition-all group">
                  <ShoppingCart size={18} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                      {cart.length}
                    </span>
                  )}
                </Link>
                
                {user ? (
                  <button onClick={signOut} className="flex items-center gap-2 pl-4 py-1 border-l border-slate-100">
                    <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-brand-500 font-bold text-[10px] uppercase">
                      {user.email?.[0]}
                    </div>
                    <LogOut size={16} className="text-slate-300 hover:text-accent transition-colors cursor-pointer" />
                  </button>
                ) : (
                  <Link to="/auth" className="text-[10px] font-black uppercase tracking-widest text-slate-900 border border-slate-900 px-4 py-2 rounded-lg hover:bg-slate-900 hover:text-white transition-all">
                    Sign In
                  </Link>
                )}
              </div>
            </nav>

            <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        <main id="main-content" className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listing" element={<Listing />} />
            <Route path="/enquiry" element={<EnquiryPage />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/auth" />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;
