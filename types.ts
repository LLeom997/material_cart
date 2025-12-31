
export enum OrderStatus {
  PENDING = 'Pending',
  CALLED = 'Called',
  CONFIRMED = 'Confirmed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export type UserRole = 
  | 'MASTER_ADMIN' 
  | 'ADMIN' 
  | 'MANAGER' 
  | 'ACCOUNTANT' 
  | 'STOCK_OPS' 
  | 'SUPPLIER_USER' 
  | 'CLIENT_USER' 
  | 'DELIVERY_PARTNER';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface SupplierPerformance {
  deliverySuccessRate: number;
  qualityRating: number;
  speedRank: number;
}

export interface LogisticsPartner {
  id: string;
  name: string;
  base_rate: number;
  per_km_rate: number;
}

export interface Vendor {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  rating?: number;
  isActive: boolean;
  performance?: SupplierPerformance;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  vendorId?: string;
  name: string;
  price_range: string;
  uom: string;
  image: string;
  description: string;
  specifications: { label: string; value: string }[];
  brand?: string;
  stock_quantity?: number;
  gst_percentage: number;
  sku?: string;
}

export interface LedgerEntry {
  id: string;
  order_id: string;
  type: 'PURCHASE' | 'SALE' | 'LOGISTICS' | 'GST';
  amount: number;
  gst_amount: number;
  margin: number;
  created_at: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource: string;
  metadata: any;
  created_at: string;
}

export interface EnquiryItem {
  productId: string;
  productName: string;
  quantity: number;
  uom: string;
  price?: number;
}

export interface Enquiry {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  location: string;
  projectType: string;
  items: EnquiryItem[];
  status: OrderStatus;
  createdAt: string;
  adminNotes?: string;
  total_amount?: number;
}
