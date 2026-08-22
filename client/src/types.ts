export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Service Advisor' | 'Mechanic' | 'Inventory Manager' | 'Receptionist' | 'Customer';
  avatar: string;
  status: 'Active' | 'Inactive';
  branchId: string;
  twoFactorEnabled: boolean;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  phone: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  loyaltyPoints: number;
  tags: string[];
  group: string;
  notes: CustomerNote[];
  documents: Attachment[];
  createdAt: string;
}

export interface CustomerNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string; // 'pdf' | 'image' | 'doc'
  size: string;
  url: string;
  uploadedAt: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  customerName?: string;
  vin: string;
  engineNumber?: string;
  licensePlate: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  color: string;
  fuelType: 'Petrol' | 'Diesel' | 'EV' | 'Hybrid';
  transmission: 'Automatic' | 'Manual';
  mileage: number;
  insuranceExpiry: string;
  warrantyExpiry: string;
  status: 'In Service' | 'Ready for Pickup' | 'Completed' | 'Pending';
  images: string[];
  accidentHistory: AccidentRecord[];
}

export interface AccidentRecord {
  id: string;
  date: string;
  description: string;
  severity: 'Minor' | 'Moderate' | 'Major';
}

export interface ServiceBooking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  mechanicId?: string;
  mechanicName?: string;
  serviceType: 'Oil Change' | 'General Repair' | 'Brake Service' | 'AC Tuning' | 'Battery Diagnostic' | 'Warranty Claim' | 'Full Service';
  bookingDate: string; // 'YYYY-MM-DD'
  bookingTime: string; // 'HH:MM'
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Inspection' | 'Ready' | 'Completed';
  estimatedCost: number;
  estimatedTimeHours: number;
  pickupRequired: boolean;
  dropRequired: boolean;
  checklist: ChecklistItem[];
  customerNotes?: string;
  mechanicNotes?: string;
  digitalSignature?: string; // Base64 signature
  invoiceId?: string;
  beforeImages?: string[];
  afterImages?: string[];
}

export interface ChecklistItem {
  id: string;
  item: string;
  checked: boolean;
}

export interface SparePart {
  id: string;
  name: string;
  sku: string;
  category: 'Engine' | 'Brakes' | 'Electrical' | 'Suspension' | 'Filters' | 'Fluids';
  stock: number;
  minStock: number;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  warehouseLocation: string;
  compatibleVehicles: string[]; // e.g., "BMW 3 Series, Audi A4"
  qrCode?: string;
  image?: string;
}

export interface Mechanic {
  id: string;
  name: string;
  email: string;
  skills: string[];
  status: 'Available' | 'Busy' | 'Off Duty';
  rating: number;
  completedJobs: number;
  workingHours: string;
  currentBookingId?: string;
  attendanceStatus: 'Present' | 'Absent' | 'Late';
  efficiencyScore?: number;
  activeJobsCount?: number;
}

export interface Warranty {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  coverageType: string; // 'Bumper-to-Bumper' | 'Powertrain' | 'Battery'
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired';
  partsCovered: string[];
  laborCovered: boolean;
}

export interface WarrantyClaim {
  id: string;
  warrantyId: string;
  customerName: string;
  vehicleName: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  estimatedCost: number;
  createdAt: string;
}

export interface Invoice {
  id: string;
  bookingId: string;
  customerId: string;
  vehicleId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  vehicleName: string;
  licensePlate?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate?: number; // e.g. 0.15
  tax?: number;
  discount?: number;
  discountAmount?: number;
  couponCode?: string;
  total?: number;
  totalAmount?: number;
  dueDate?: string;
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Partially Paid';
  paymentMethod?: 'Credit Card' | 'Cash' | 'Bank Transfer' | 'Apple Pay';
  paymentDate?: string;
  createdAt?: string;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  type?: 'Part' | 'Labor';
  totalPrice?: number;
}

export interface Reminder {
  id: string;
  customerId: string;
  customerName: string;
  type: 'Oil Change' | 'Insurance' | 'Warranty' | 'Service Due' | 'Registration';
  dueDate: string;
  status: 'Sent' | 'Pending';
  channel: 'SMS' | 'Email' | 'WhatsApp' | 'Push';
}

export interface CRMNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'stock' | 'warranty' | 'system';
  createdAt: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}

export interface SystemSettings {
  companyName: string;
  taxRate: number;
  currency: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  aiAutoAnalyze: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
}

export interface DashboardStats {
  todayBookingsCount: number;
  vehiclesInServiceCount: number;
  completedServicesCount: number;
  revenuePaid: number;
  monthlyRevenue: { month: string; revenue: number; bookings: number }[];
  serviceTrend: { type: string; count: number }[];
}

export interface WarrantyPolicy {
  id: string;
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  customerId: string;
  customerName: string;
  policyNumber: string;
  policyType: string;
  startDate: string;
  durationMonths: number;
  coverageCapPrice: number;
  deductible: number;
  status: 'Active' | 'Expired';
  claims: WarrantyClaimPolicy[];
}

export interface WarrantyClaimPolicy {
  id: string;
  partName: string;
  description: string;
  cost: number;
  claimDate: string;
  status: string;
}
