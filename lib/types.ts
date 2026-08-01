// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------
export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: string;
}

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------
export interface Category {
  id: string;
  name: string;
}

// ---------------------------------------------------------------------------
// Property
// ---------------------------------------------------------------------------
export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  rentAmount: number;
  bedrooms: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  landlordId: string;
  categoryId: string;
  category?: Category;
  landlord?: User;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Rental Request
// ---------------------------------------------------------------------------
export type RentalRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";

export interface RentalRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  status: RentalRequestStatus;
  moveInDate: string;
  duration: number;
  message?: string;
  tenant?: User;
  property?: Property;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Payment
// ---------------------------------------------------------------------------
export type PaymentStatus = "PENDING" | "COMPLETED";

export interface Payment {
  id: string;
  rentalRequestId: string;
  tenantId: string;
  landlordId: string;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  rentalRequest?: RentalRequest;
  tenant?: User;
  landlord?: User;
  createdAt: string;
// ---------------------------------------------------------------------------
// Review & Pagination
// ---------------------------------------------------------------------------
export interface Review {
  id: string;
  rating: number;
  comment: string;
  tenantId: string;
  propertyId: string;
  tenant?: User;
  createdAt: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPage?: number;
}

export interface PaginatedResult<T> {
  meta?: PaginatedMeta;
  data?: T[];
  result?: T[];
}

