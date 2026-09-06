export type UserRole = 'consumer' | 'bulk_buyer' | 'fpo' | 'logistics' | 'admin';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  address?: string;
  district?: string;
  pincode?: string;
  // Specific role attributes
  businessName?: string; // bulk buyer
  gstNumber?: string; // bulk buyer
  fpoName?: string; // fpo
  fpoRegNo?: string; // fpo
  originDistrict?: string; // fpo
  logisticsCompany?: string; // logistics
  vehicleType?: string; // logistics
  vehicleNumber?: string; // logistics
  avatarColor?: string;
}

export type ProduceCategory = 'vegetables' | 'fruits' | 'leafy_greens' | 'tubers_roots';

export interface ProduceItem {
  id: string;
  name: string;
  tamilName: string;
  category: ProduceCategory;
  pricePerKg: number;
  availableKg: number;
  originDistrict: string;
  originPlace: string;
  fpoId: string;
  fpoName: string;
  harvestDate: string;
  isOrganic: boolean;
  grade: 'Grade A Export' | 'Grade A Premium' | 'Grade B Standard';
  imageUrl: string;
  description: string;
  shelfLifeDays: number;
}

export interface CartItem {
  produceId: string;
  item: ProduceItem;
  quantityKg: number;
}

export type OrderStatus =
  | 'placed'
  | 'assigned_logistics'
  | 'picked_up_fpo'
  | 'in_transit'
  | 'delivered';

export interface Order {
  id: string;
  orderNumber: string;
  buyerType: 'consumer' | 'bulk_buyer';
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  deliveryAddress: string;
  deliveryDistrict: string;
  deliveryPincode: string;
  items: CartItem[];
  totalWeightKg: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  paymentConfirmation: {
    status: 'UI_CONFIRMED';
    method: 'Simulated COD / Direct Farmer Remittance' | 'Virtual AgriCredit PO';
    referenceId: string;
    confirmedAt: string;
  };
  logisticsPartnerId?: string;
  logisticsPartnerName?: string;
  vehicleNumber?: string;
  trackingHistory: {
    status: OrderStatus;
    label: string;
    timestamp: string;
    locationNote: string;
  }[];
}

export const TAMIL_NADU_DISTRICTS = [
  'Ariyalur',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Kallakurichi',
  'Kanchipuram',
  'Kanyakumari',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Namakkal',
  'Nilgiris',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Ranipet',
  'Salem',
  'Sivaganga',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukudi (Tuticorin)',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tirupathur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar',
] as const;
