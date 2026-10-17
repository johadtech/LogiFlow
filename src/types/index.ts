// ==================== CORE TYPES ====================

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  roleId: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
}

export interface Permission {
  id: string;
  name: string;
  slug: string;
  module: string;
  description: string;
}

// ==================== SHIPMENT TYPES ====================

export type ShipmentStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'picked_up' 
  | 'in_transit' 
  | 'customs_clearance' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled'
  | 'returned';

export type ShipmentType = 'air_freight' | 'sea_freight' | 'road_freight' | 'rail_freight' | 'express';

export interface Shipment {
  id: string;
  trackingNumber: string;
  type: ShipmentType;
  status: ShipmentStatus;
  origin: Location;
  destination: Location;
  sender: ContactInfo;
  receiver: ContactInfo;
  packages: Package[];
  weight: number;
  dimensions: Dimensions;
  declaredValue: number;
  currency: string;
  freightCharges: number;
  insuranceCharges: number;
  totalCharges: number;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  paymentMethod?: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  notes?: string;
  assignedDriver?: string;
  assignedVehicle?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Location {
  country: string;
  state: string;
  city: string;
  address: string;
  postalCode: string;
  coordinates?: { lat: number; lng: number };
}

export interface ContactInfo {
  name: string;
  company?: string;
  email: string;
  phone: string;
  address: string;
}

export interface Package {
  id: string;
  description: string;
  quantity: number;
  weight: number;
  dimensions: Dimensions;
  handlingInstructions?: string;
  isFragile: boolean;
  isHazardous: boolean;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

// ==================== TRACKING TYPES ====================

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  location: string;
  description: string;
  timestamp: string;
  operator?: string;
}

// ==================== FINANCIAL TYPES ====================

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
  status: 'active' | 'inactive';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  shipmentId: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ==================== SETTINGS TYPES ====================

export interface SystemSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyLogo?: string;
  defaultCurrency: string;
  defaultLanguage: string;
  timezone: string;
  dateFormat: string;
  weightUnit: 'kg' | 'lb';
  dimensionUnit: 'cm' | 'in';
  trackingNumberPrefix: string;
  autoAssignDriver: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  maintenanceMode: boolean;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
  status: 'active' | 'inactive';
  translations: Record<string, string>;
}

// ==================== DASHBOARD TYPES ====================

export interface DashboardStats {
  totalShipments: number;
  activeShipments: number;
  deliveredThisMonth: number;
  revenue: number;
  pendingShipments: number;
  cancelledShipments: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}
