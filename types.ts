
export enum OrderStatus {
  PENDING = 'Pending',
  CALLED = 'Called',
  CONFIRMED = 'Confirmed',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

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

export interface Product {
  id: string;
  categoryId: string;
  subCategory?: string;
  name: string;
  priceRange: string;
  uom: string;
  image: string;
  description: string;
  specifications: Specification[];
  brand?: string;
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

export interface CartState {
  items: EnquiryItem[];
}
