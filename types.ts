
export enum OrderStatus {
  PENDING = 'Pending',
  CALLED = 'Called',
  CONFIRMED = 'Confirmed',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export type UserRole = 'admin' | 'client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  rating?: number;
}

export interface PurchaseBatch {
  id: string;
  product_id: string;
  vendor_id: string;
  quantity_purchased: number;
  quantity_remaining: number;
  unit_price: number;
  purchased_at: string;
  vendor_name?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  vendorId?: string;
  subCategory?: string;
  name: string;
  priceRange: string;
  originalPrice?: string;
  discountLabel?: string;
  uom: string;
  image: string;
  description: string;
  specifications: Specification[];
  brand?: string;
  stock_quantity?: number;
  rating?: number;
  ratingCount?: number;
}

export interface LedgerSummary {
  product_id: string;
  name: string;
  uom: string;
  total_pieces_purchased: number;
  total_pieces_remaining: number;
  total_pieces_sold: number;
  average_purchase_price: number;
}

export interface City {
  id: string;
  name: string;
  slug: string;
}

export interface EnquiryItem {
  productId: string;
  productName: string;
  quantity: number;
  uom: string;
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
}
