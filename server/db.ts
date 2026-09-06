import fs from 'fs';
import path from 'path';

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
  businessName?: string;
  gstNumber?: string;
  fpoName?: string;
  fpoRegNo?: string;
  originDistrict?: string;
  logisticsCompany?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  avatarColor?: string;
  createdAt?: string;
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

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  role: string;
  details: string;
}

export interface MarketPrice {
  id: string;
  cropName: string;
  tamilName: string;
  category: string;
  mandiPriceMin: number;
  mandiPriceMax: number;
  modalPrice: number;
  eUzhavarPrice: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  majorMandi: string;
  updatedDate: string;
}

export interface DatabaseSchema {
  version: number;
  lastUpdated: string;
  users: Record<string, UserProfile>;
  produce: ProduceItem[];
  orders: Order[];
  activityLogs: ActivityLog[];
  marketPrices: MarketPrice[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'market_db.json');

const INITIAL_USERS: Record<string, UserProfile> = {
  consumer: {
    id: 'usr_c_01',
    role: 'consumer',
    name: 'Verified Consumer',
    email: 'consumer@euzhavar.tn.gov.in',
    phone: '+91 98402 11200',
    address: 'Plot 42, 2nd Cross, Anna Nagar West Extension',
    district: 'Chennai',
    pincode: '600101',
    avatarColor: 'bg-emerald-500',
    createdAt: new Date().toISOString(),
  },
  bulk_buyer: {
    id: 'usr_b_01',
    role: 'bulk_buyer',
    name: 'Wholesale Commercial Buyer',
    businessName: 'Wholesale Agri Buyer & Catering Hub',
    email: 'wholesale@euzhavar.tn.gov.in',
    phone: '+91 94441 55670',
    gstNumber: '33AABCS1429B1Z8',
    address: 'Bay #14, Wholesale Aggregation Yard, Koyambedu',
    district: 'Chennai',
    pincode: '600092',
    avatarColor: 'bg-amber-500',
    createdAt: new Date().toISOString(),
  },
  fpo: {
    id: 'fpo_01',
    role: 'fpo',
    name: 'FPO Director',
    fpoName: 'Farmers Producer Collective (Dindigul)',
    fpoRegNo: 'TN-COOP-FPO-2021-994',
    originDistrict: 'Dindigul',
    email: 'fpo.dindigul@euzhavar.tn.gov.in',
    phone: '+91 97880 23411',
    address: 'Survey 114/2, Agro Industrial Estate, Oddanchatram',
    district: 'Dindigul',
    pincode: '624619',
    avatarColor: 'bg-teal-500',
    createdAt: new Date().toISOString(),
  },
  logistics: {
    id: 'log_01',
    role: 'logistics',
    name: 'Logistics Fleet Dispatcher',
    logisticsCompany: 'Kaveri Green Agri-Logistics Fleet',
    vehicleType: 'Tata Ace 1.5 Ton Reefer (Chilled Temp)',
    vehicleNumber: 'TN-57-AZ-4820',
    email: 'logistics@euzhavar.tn.gov.in',
    phone: '+91 98940 33819',
    address: 'Hub 3, Dindigul-Trichy National Highway Bypass',
    district: 'Dindigul',
    pincode: '624005',
    avatarColor: 'bg-cyan-500',
    createdAt: new Date().toISOString(),
  },
  admin: {
    id: 'adm_01',
    role: 'admin',
    name: 'State Agrimarket Administrator',
    email: 'admin@euzhavar.tn.gov.in',
    phone: '+91 44 2250 8890',
    address: 'Agriculture Directorate Complex, Guindy',
    district: 'Chennai',
    pincode: '600032',
    avatarColor: 'bg-indigo-500',
    createdAt: new Date().toISOString(),
  },
};

const INITIAL_PRODUCE: ProduceItem[] = [
  {
    id: 'prod_1',
    name: 'TN Famous Red Onion',
    tamilName: 'சின்ன வெங்காயம்',
    category: 'vegetables',
    pricePerKg: 58,
    availableKg: 1250,
    originDistrict: 'Dindigul',
    originPlace: 'Oddanchatram Market Hub',
    fpoId: 'fpo_01',
    fpoName: 'Dindigul Agro Producers Collective',
    harvestDate: '2025-05-10',
    isOrganic: true,
    grade: 'Grade A Export',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    description: 'Pungent, authentic country shallots (chinna vengayam). Directly sun-cured and packed from Reddiyarchatram farms.',
    shelfLifeDays: 28,
  },
  {
    id: 'prod_2',
    name: 'Country Bush Tomato (Nattu Thakkali)',
    tamilName: 'நாட்டு தக்காளி',
    category: 'vegetables',
    pricePerKg: 28,
    availableKg: 2400,
    originDistrict: 'Krishnagiri',
    originPlace: 'Rayakottai Belt',
    fpoId: 'fpo_02',
    fpoName: 'Krishnagiri Horticulture Fed',
    harvestDate: '2025-05-11',
    isOrganic: true,
    grade: 'Grade A Premium',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    description: 'Juicy, pleasantly sour heritage country tomatoes, perfect for authentic Tamil rasam and gravies.',
    shelfLifeDays: 7,
  },
  {
    id: 'prod_3',
    name: 'Salem Mango',
    tamilName: 'சேலம் மாம்பழம்',
    category: 'fruits',
    pricePerKg: 85,
    availableKg: 1200,
    originDistrict: 'Salem',
    originPlace: 'Salem Mango Belt Orchards',
    fpoId: 'fpo_03',
    fpoName: 'Salem Agri Growers Collective',
    harvestDate: '2026-09-06',
    isOrganic: true,
    grade: 'Grade A Export',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80',
    description: 'Sweet aromatic Salem mangoes',
    shelfLifeDays: 10,
  },
  {
    id: 'prod_4',
    name: 'Kothagiri Crisp Mountain Carrots',
    tamilName: 'மலை கேரட்',
    category: 'tubers_roots',
    pricePerKg: 52,
    availableKg: 950,
    originDistrict: 'Nilgiris',
    originPlace: 'Kothagiri Hill Valley',
    fpoId: 'fpo_04',
    fpoName: 'Nilgiris Organic Hill Farmers Fed',
    harvestDate: '2025-05-09',
    isOrganic: true,
    grade: 'Grade A Export',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
    description: 'Crisp mountain sweet carrots',
    shelfLifeDays: 14,
  },
  {
    id: 'prod_5',
    name: 'Sirumalai Hill Baby Bananas (Malai Vazhai)',
    tamilName: 'சிறுமலை வாழை',
    category: 'fruits',
    pricePerKg: 95,
    availableKg: 620,
    originDistrict: 'Dindigul',
    originPlace: 'Sirumalai Hills Upper Valley',
    fpoId: 'fpo_01',
    fpoName: 'Dindigul Agro Producers Collective',
    harvestDate: '2025-05-10',
    isOrganic: true,
    grade: 'Grade A Export',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
    description: 'Naturally ripened sweet bananas',
    shelfLifeDays: 6,
  },
  {
    id: 'prod_6',
    name: 'Pollachi Sweet Tender Coconuts (Sevvila Neer)',
    tamilName: 'பொள்ளாச்சி இளநீர்',
    category: 'fruits',
    pricePerKg: 38,
    availableKg: 1800,
    originDistrict: 'Coimbatore',
    originPlace: 'Anamalai Foothills, Pollachi',
    fpoId: 'fpo_05',
    fpoName: 'Pollachi Coconut Growers Producer Co',
    harvestDate: '2025-05-11',
    isOrganic: true,
    grade: 'Grade A Premium',
    imageUrl: '/tender_coconut.jpg',
    description: 'World-famous Pollachi tender coconuts with 450ml+ natural electrolyte water and tender coconut cream.',
    shelfLifeDays: 12,
  },
  {
    id: 'prod_7',
    name: 'Delta Fresh Palak & Keerai Greens Bundle',
    tamilName: 'பசலை & நாட்டு கீரை',
    category: 'leafy_greens',
    pricePerKg: 24,
    availableKg: 420,
    originDistrict: 'Thanjavur',
    originPlace: 'Kallanai River Basin',
    fpoId: 'fpo_06',
    fpoName: 'Chola Nadu Natural Farmers Forum',
    harvestDate: '2025-05-11',
    isOrganic: true,
    grade: 'Grade A Premium',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
    description: 'Freshly harvested country greens nourished by Kaveri river silts, pesticide-free and ultra-crisp.',
    shelfLifeDays: 3,
  },
  {
    id: 'prod_8',
    name: 'Alangulam Striped Purple Brinjal',
    tamilName: 'வரி கத்தரிக்காய்',
    category: 'vegetables',
    pricePerKg: 36,
    availableKg: 1100,
    originDistrict: 'Tenkasi',
    originPlace: 'Alangulam Village Hub',
    fpoId: 'fpo_07',
    fpoName: 'Western Ghats Agro Producers',
    harvestDate: '2025-05-10',
    isOrganic: true,
    grade: 'Grade A Premium',
    imageUrl: '/brinjal.jpg',
    description: 'Tender seedless striped brinjals with buttery melting texture, ideal for authentic Ennai Kathirikai.',
    shelfLifeDays: 9,
  },
  {
    id: 'prod_9',
    name: 'Salem Malgoa Mangoes (GI Tagged)',
    tamilName: 'சேலம் மல்கோவா மாம்பழம்',
    category: 'fruits',
    pricePerKg: 140,
    availableKg: 780,
    originDistrict: 'Salem',
    originPlace: 'Yercaud Foothills Orchards',
    fpoId: 'fpo_03',
    fpoName: 'Kongu Agri Collective',
    harvestDate: '2025-05-09',
    isOrganic: true,
    grade: 'Grade A Export',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80',
    description: 'Renowned thick-pulp Salem Malgoa table mangoes, naturally straw-ripened without carbide chemicals.',
    shelfLifeDays: 10,
  },
  {
    id: 'prod_10',
    name: 'Panruti GI Sweet Jackfruit',
    tamilName: 'பண்ருட்டி பலாப்பழம்',
    category: 'fruits',
    pricePerKg: 65,
    availableKg: 890,
    originDistrict: 'Cuddalore',
    originPlace: 'Panruti Sandstone Valley',
    fpoId: 'fpo_08',
    fpoName: 'Panruti Jackfruit & Cashew FPO',
    harvestDate: '2025-05-10',
    isOrganic: true,
    grade: 'Grade A Export',
    imageUrl: '/jackfruit.jpg',
    description: 'Deep honey-yellow bulbs with unmatched aroma and sweetness. Famed Panruti variety with GI recognition.',
    shelfLifeDays: 8,
  },
  {
    id: 'prod_11',
    name: 'Oddanchatram Sambar White Pumpkin (Poosanikkai)',
    tamilName: 'வெள்ளைப் பூசணி',
    category: 'vegetables',
    pricePerKg: 22,
    availableKg: 3100,
    originDistrict: 'Dindigul',
    originPlace: 'Palani Valley Belt',
    fpoId: 'fpo_01',
    fpoName: 'Dindigul Agro Producers Collective',
    harvestDate: '2025-05-08',
    isOrganic: false,
    grade: 'Grade A Premium',
    imageUrl: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=600&auto=format&fit=crop&q=80',
    description: 'Firm, heavy ash gourds with cooling properties, long storage life, and dense flesh.',
    shelfLifeDays: 45,
  },
  {
    id: 'prod_12',
    name: 'Kallakurichi Sweet Tapioca (Maravalli Kizhangu)',
    tamilName: 'மரவள்ளிக் கிழங்கு',
    category: 'tubers_roots',
    pricePerKg: 26,
    availableKg: 2800,
    originDistrict: 'Kallakurichi',
    originPlace: 'Chinna Salem Farmlands',
    fpoId: 'fpo_09',
    fpoName: 'Manimuktha Farmers Producer Co',
    harvestDate: '2025-05-11',
    isOrganic: true,
    grade: 'Grade A Premium',
    imageUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&auto=format&fit=crop&q=80',
    description: 'High starch, easy-to-boil fresh country cassava harvested fresh for table cooking and bulk snacks.',
    shelfLifeDays: 10,
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_101',
    orderNumber: 'EUS-TN-7821',
    buyerType: 'consumer',
    buyerId: 'usr_c_01',
    buyerName: 'Verified Consumer',
    buyerPhone: '+91 98402 11200',
    deliveryAddress: 'Plot 42, 2nd Cross, Anna Nagar West Extension',
    deliveryDistrict: 'Chennai',
    deliveryPincode: '600101',
    items: [
      {
        produceId: 'prod_1',
        item: INITIAL_PRODUCE[0],
        quantityKg: 4,
      },
      {
        produceId: 'prod_2',
        item: INITIAL_PRODUCE[1],
        quantityKg: 5,
      },
      {
        produceId: 'prod_6',
        item: INITIAL_PRODUCE[5],
        quantityKg: 6,
      },
    ],
    totalWeightKg: 15,
    subtotal: 600,
    deliveryFee: 40,
    discount: 0,
    totalAmount: 640,
    status: 'in_transit',
    createdAt: '2025-05-11T07:30:00.000Z',
    estimatedDelivery: 'Today within 2 hours',
    paymentConfirmation: {
      status: 'UI_CONFIRMED',
      method: 'Simulated COD / Direct Farmer Remittance',
      referenceId: 'CONF-TN9841',
      confirmedAt: '2025-05-11T07:30:00.000Z',
    },
    logisticsPartnerId: 'log_01',
    logisticsPartnerName: 'Kaveri Green Agri-Logistics Fleet',
    vehicleNumber: 'TN-57-AZ-4820',
    trackingHistory: [
      {
        status: 'placed',
        label: 'Order Verified & Produce Allocated',
        timestamp: '07:30 AM',
        locationNote: 'Directly allocated from Dindigul FPO Hub and Coimbatore Hub',
      },
      {
        status: 'assigned_logistics',
        label: 'Logistics Partner Assigned',
        timestamp: '07:45 AM',
        locationNote: 'Vehicle TN-57-AZ-4820 assigned for farm gate pickup',
      },
      {
        status: 'picked_up_fpo',
        label: 'Picked up from FPO Farm Hub',
        timestamp: '08:20 AM',
        locationNote: 'Temperature-controlled reefer crate loaded at Oddanchatram',
      },
      {
        status: 'in_transit',
        label: 'Out for Delivery to Chennai Anna Nagar',
        timestamp: '09:40 AM',
        locationNote: 'Direct express transit via NH-45 agri corridor',
      },
    ],
  },
  {
    id: 'ord_102',
    orderNumber: 'EUS-TN-9904',
    buyerType: 'bulk_buyer',
    buyerId: 'usr_b_01',
    buyerName: 'Wholesale Commercial Buyer',
    buyerPhone: '+91 94441 55670',
    deliveryAddress: 'Bay #14, Wholesale Aggregation Yard, Koyambedu',
    deliveryDistrict: 'Chennai',
    deliveryPincode: '600092',
    items: [
      {
        produceId: 'prod_1',
        item: INITIAL_PRODUCE[0],
        quantityKg: 200,
      },
      {
        produceId: 'prod_2',
        item: INITIAL_PRODUCE[1],
        quantityKg: 350,
      },
    ],
    totalWeightKg: 550,
    subtotal: 21400,
    deliveryFee: 1375,
    discount: 3210, // 15% bulk discount for >300kg
    totalAmount: 19565,
    status: 'assigned_logistics',
    createdAt: '2025-05-11T08:15:00.000Z',
    estimatedDelivery: 'Next Morning 6:00 AM Direct Dispatch',
    paymentConfirmation: {
      status: 'UI_CONFIRMED',
      method: 'Virtual AgriCredit PO',
      referenceId: 'PO-CORP-4821',
      confirmedAt: '2025-05-11T08:15:00.000Z',
    },
    logisticsPartnerId: 'log_01',
    logisticsPartnerName: 'Kaveri Green Agri-Logistics Fleet',
    vehicleNumber: 'TN-57-AZ-4820',
    trackingHistory: [
      {
        status: 'placed',
        label: 'Bulk Purchase Order Verified',
        timestamp: '08:15 AM',
        locationNote: 'Bulk inventory locked at Rayakottai & Oddanchatram aggregation yards',
      },
      {
        status: 'assigned_logistics',
        label: 'Freight Dispatch Booked',
        timestamp: '08:35 AM',
        locationNote: 'Dedicated 3-Ton freight carrier booked for direct farm gate pickup',
      },
    ],
  },
];

const INITIAL_PRICES: MarketPrice[] = [
  {
    id: 'mp_1',
    cropName: 'Small Red Onion (Chinna Vengayam)',
    tamilName: 'சின்ன வெங்காயம்',
    category: 'vegetables',
    mandiPriceMin: 48,
    mandiPriceMax: 68,
    modalPrice: 62,
    eUzhavarPrice: 58,
    unit: '₹ / kg',
    trend: 'stable',
    majorMandi: 'Oddanchatram / Dindigul APMC',
    updatedDate: 'Today',
  },
  {
    id: 'mp_2',
    cropName: 'Country Tomato (Nattu Thakkali)',
    tamilName: 'நாட்டு தக்காளி',
    category: 'vegetables',
    mandiPriceMin: 22,
    mandiPriceMax: 35,
    modalPrice: 32,
    eUzhavarPrice: 28,
    unit: '₹ / kg',
    trend: 'down',
    majorMandi: 'Rayakottai / Hosur Market',
    updatedDate: 'Today',
  },
  {
    id: 'mp_3',
    cropName: 'Salem Moringa Drumsticks',
    tamilName: 'முருங்கைக்காய்',
    category: 'vegetables',
    mandiPriceMin: 35,
    mandiPriceMax: 50,
    modalPrice: 46,
    eUzhavarPrice: 42,
    unit: '₹ / kg',
    trend: 'up',
    majorMandi: 'Aravakurichi / Salem APMC',
    updatedDate: 'Today',
  },
  {
    id: 'mp_4',
    cropName: 'Pollachi Tender Coconut',
    tamilName: 'இளநீர்',
    category: 'fruits',
    mandiPriceMin: 35,
    mandiPriceMax: 45,
    modalPrice: 42,
    eUzhavarPrice: 38,
    unit: '₹ / piece',
    trend: 'stable',
    majorMandi: 'Pollachi Coconut Yard',
    updatedDate: 'Today',
  },
  {
    id: 'mp_5',
    cropName: 'Hill Bananas (Sirumalai Vazhai)',
    tamilName: 'மலை வாழைப்பழம்',
    category: 'fruits',
    mandiPriceMin: 85,
    mandiPriceMax: 110,
    modalPrice: 105,
    eUzhavarPrice: 95,
    unit: '₹ / kg',
    trend: 'stable',
    majorMandi: 'Dindigul Fruit Market',
    updatedDate: 'Today',
  },
  {
    id: 'mp_6',
    cropName: 'Panruti Jackfruit',
    tamilName: 'பலாப்பழம்',
    category: 'fruits',
    mandiPriceMin: 55,
    mandiPriceMax: 75,
    modalPrice: 70,
    eUzhavarPrice: 65,
    unit: '₹ / kg',
    trend: 'up',
    majorMandi: 'Panruti Sandstone Yard',
    updatedDate: 'Today',
  },
];

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log_seed_1',
    timestamp: new Date().toISOString(),
    action: 'DATABASE_INITIALIZATION',
    actor: 'System Bootstrapper',
    role: 'system',
    details: 'Database initialized with 12 Tamil Nadu fresh produce listings, 5 verified user roles, and active orders.',
  },
  {
    id: 'log_seed_2',
    timestamp: new Date().toISOString(),
    action: 'LOGISTICS_DISPATCH_CONFIRMED',
    actor: 'Kaveri Green Agri-Logistics Fleet',
    role: 'logistics',
    details: 'Reefer vehicle TN-57-AZ-4820 assigned to Order #EUS-TN-7821 for Anna Nagar, Chennai.',
  },
];

class MarketDatabase {
  private db: DatabaseSchema;
  private initialized = false;

  constructor() {
    this.db = this.loadDatabase();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    this.ensureDirectory();

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.produce && parsed.orders && parsed.users) {
          this.initialized = true;
          return parsed;
        }
      } catch (err) {
        console.warn('Failed to parse database file, bootstrapping default dataset:', err);
      }
    }

    // Default Seed Dataset
    const initialData: DatabaseSchema = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      users: INITIAL_USERS,
      produce: INITIAL_PRODUCE,
      orders: INITIAL_ORDERS,
      activityLogs: INITIAL_LOGS,
      marketPrices: INITIAL_PRICES,
    };

    this.saveDatabase(initialData);
    this.initialized = true;
    return initialData;
  }

  private saveDatabase(data: DatabaseSchema) {
    try {
      this.ensureDirectory();
      data.lastUpdated = new Date().toISOString();
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
      this.db = data;
    } catch (err) {
      console.error('Database write error:', err);
    }
  }

  public getDbStats() {
    let sizeBytes = 0;
    try {
      if (fs.existsSync(DB_FILE)) {
        sizeBytes = fs.statSync(DB_FILE).size;
      }
    } catch {}

    return {
      status: 'connected',
      storageEngine: 'File-backed JSON Store with Atomic Commits',
      filePath: DB_FILE,
      sizeBytes,
      version: this.db.version,
      lastUpdated: this.db.lastUpdated,
      counts: {
        users: Object.keys(this.db.users).length,
        produce: this.db.produce.length,
        orders: this.db.orders.length,
        activityLogs: this.db.activityLogs.length,
        marketPrices: this.db.marketPrices.length,
      },
    };
  }

  public resetDatabase(): DatabaseSchema {
    const initialData: DatabaseSchema = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      users: INITIAL_USERS,
      produce: INITIAL_PRODUCE,
      orders: INITIAL_ORDERS,
      activityLogs: [
        {
          id: 'log_' + Date.now(),
          timestamp: new Date().toISOString(),
          action: 'DATABASE_RESET',
          actor: 'State Admin',
          role: 'admin',
          details: 'Full database reset performed. Re-seeded with official Tamil Nadu agricultural market state.',
        },
      ],
      marketPrices: INITIAL_PRICES,
    };
    this.saveDatabase(initialData);
    return initialData;
  }

  // --- Users & Auth ---
  public getUsers(): Record<string, UserProfile> {
    return this.db.users;
  }

  public getUserById(id: string): UserProfile | null {
    return Object.values(this.db.users).find((u) => u.id === id) || this.db.users[id] || null;
  }

  public authenticate(role: UserRole, email?: string): UserProfile {
    if (email) {
      const userList = Object.values(this.db.users);
      const found = userList.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role
      );
      if (found) return found;
    }

    if (this.db.users[role]) {
      return this.db.users[role];
    }

    return INITIAL_USERS[role] || INITIAL_USERS.consumer;
  }

  public registerUser(userData: Partial<UserProfile> & { role: UserRole }): UserProfile {
    const newId = 'usr_' + Date.now();
    const newUser: UserProfile = {
      id: newId,
      role: userData.role,
      name: userData.name || 'Agri Platform Member',
      email: userData.email || `user_${newId}@tamilagri.in`,
      phone: userData.phone || '+91 90000 00000',
      address: userData.address || 'Tamil Nadu',
      district: userData.district || 'Chennai',
      pincode: userData.pincode || '600001',
      businessName: userData.businessName,
      gstNumber: userData.gstNumber,
      fpoName: userData.fpoName,
      fpoRegNo: userData.fpoRegNo,
      originDistrict: userData.originDistrict,
      logisticsCompany: userData.logisticsCompany,
      vehicleType: userData.vehicleType,
      vehicleNumber: userData.vehicleNumber,
      avatarColor:
        userData.role === 'consumer'
          ? 'bg-emerald-500'
          : userData.role === 'bulk_buyer'
          ? 'bg-amber-500'
          : userData.role === 'fpo'
          ? 'bg-teal-500'
          : userData.role === 'logistics'
          ? 'bg-cyan-500'
          : 'bg-indigo-500',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = {
      ...this.db.users,
      [newId]: newUser,
      [userData.role]: newUser,
    };

    const newLogs: ActivityLog[] = [
      {
        id: 'log_' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'USER_REGISTERED',
        actor: newUser.name,
        role: newUser.role,
        details: `New account registered as ${newUser.role.toUpperCase()} from ${newUser.district}`,
      },
      ...this.db.activityLogs.slice(0, 49),
    ];

    this.saveDatabase({
      ...this.db,
      users: updatedUsers,
      activityLogs: newLogs,
    });

    return newUser;
  }

  public updateUser(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const existing = this.getUserById(id);
    if (!existing) return null;

    const updated: UserProfile = {
      ...existing,
      ...updates,
    };

    const updatedUsers = {
      ...this.db.users,
      [existing.id]: updated,
      [existing.role]: updated,
    };

    this.saveDatabase({
      ...this.db,
      users: updatedUsers,
    });

    return updated;
  }

  // --- Produce Catalog ---
  public getProduce(filters?: {
    category?: string;
    district?: string;
    organic?: boolean;
    search?: string;
    fpoId?: string;
  }): ProduceItem[] {
    let list = [...this.db.produce];

    if (!filters) return list;

    if (filters.category && filters.category !== 'all') {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters.organic) {
      list = list.filter((p) => p.isOrganic);
    }
    if (filters.district && filters.district !== 'all') {
      list = list.filter((p) => p.originDistrict.toLowerCase() === filters.district!.toLowerCase());
    }
    if (filters.fpoId) {
      list = list.filter((p) => p.fpoId === filters.fpoId);
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tamilName.toLowerCase().includes(q) ||
          p.originPlace.toLowerCase().includes(q) ||
          p.originDistrict.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public getProduceById(id: string): ProduceItem | null {
    return this.db.produce.find((p) => p.id === id) || null;
  }

  public createProduce(data: Omit<ProduceItem, 'id'>): ProduceItem {
    const newId = 'prod_' + Date.now();
    const item: ProduceItem = {
      ...data,
      id: newId,
    };

    const newProduce = [item, ...this.db.produce];
    const newLogs: ActivityLog[] = [
      {
        id: 'log_' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'PRODUCE_LISTED',
        actor: item.fpoName,
        role: 'fpo',
        details: `Listed ${item.name} (${item.availableKg}kg @ ₹${item.pricePerKg}/kg) from ${item.originDistrict}`,
      },
      ...this.db.activityLogs.slice(0, 49),
    ];

    this.saveDatabase({
      ...this.db,
      produce: newProduce,
      activityLogs: newLogs,
    });

    return item;
  }

  public updateProduce(id: string, updates: Partial<ProduceItem>): ProduceItem | null {
    const index = this.db.produce.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updated = { ...this.db.produce[index], ...updates };
    const newProduce = [...this.db.produce];
    newProduce[index] = updated;

    this.saveDatabase({
      ...this.db,
      produce: newProduce,
    });

    return updated;
  }

  public deleteProduce(id: string): boolean {
    const exists = this.db.produce.some((p) => p.id === id);
    if (!exists) return false;

    const newProduce = this.db.produce.filter((p) => p.id !== id);
    this.saveDatabase({
      ...this.db,
      produce: newProduce,
    });

    return true;
  }

  // --- Orders ---
  public getOrders(filters?: {
    buyerId?: string;
    buyerType?: string;
    status?: string;
    logisticsPartnerId?: string;
  }): Order[] {
    let list = [...this.db.orders];

    if (!filters) return list;

    if (filters.buyerId) {
      list = list.filter((o) => o.buyerId === filters.buyerId);
    }
    if (filters.buyerType && filters.buyerType !== 'all') {
      list = list.filter((o) => o.buyerType === filters.buyerType);
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter((o) => o.status === filters.status);
    }
    if (filters.logisticsPartnerId) {
      list = list.filter((o) => o.logisticsPartnerId === filters.logisticsPartnerId);
    }

    return list;
  }

  public getOrderById(id: string): Order | null {
    return this.db.orders.find((o) => o.id === id || o.orderNumber === id) || null;
  }

  public createOrder(payload: {
    buyerType: 'consumer' | 'bulk_buyer';
    buyerId: string;
    buyerName: string;
    buyerPhone: string;
    deliveryAddress: string;
    deliveryDistrict: string;
    deliveryPincode: string;
    items: CartItem[];
    paymentMethod: 'Simulated COD / Direct Farmer Remittance' | 'Virtual AgriCredit PO';
  }): { success: boolean; order?: Order; message?: string } {
    if (!payload.items || payload.items.length === 0) {
      return { success: false, message: 'Cart items cannot be empty' };
    }

    // Consumer limit validation
    if (payload.buyerType === 'consumer') {
      for (const cartItem of payload.items) {
        if (cartItem.quantityKg > 10) {
          return {
            success: false,
            message: `Consumer quota exceeded: ${cartItem.item.name} has ${cartItem.quantityKg}kg (Max 10kg allowed per item).`,
          };
        }
      }
    }

    // Availability validation & atomic stock check
    for (const cartItem of payload.items) {
      const liveItem = this.db.produce.find((p) => p.id === cartItem.produceId);
      if (!liveItem) {
        return {
          success: false,
          message: `Item ${cartItem.item.name} is no longer available in the marketplace catalog.`,
        };
      }
      if (liveItem.availableKg < cartItem.quantityKg) {
        return {
          success: false,
          message: `Insufficient stock for ${liveItem.name}: requested ${cartItem.quantityKg}kg, only ${liveItem.availableKg}kg available.`,
        };
      }
    }

    // Calculate totals
    const subtotal = payload.items.reduce(
      (sum, c) => sum + c.item.pricePerKg * c.quantityKg,
      0
    );
    const totalWeightKg = payload.items.reduce((sum, c) => sum + c.quantityKg, 0);

    let discount = 0;
    if (payload.buyerType === 'bulk_buyer') {
      if (totalWeightKg >= 300) {
        discount = Math.round(subtotal * 0.15);
      } else if (totalWeightKg >= 100) {
        discount = Math.round(subtotal * 0.1);
      }
    }

    let deliveryFee = 0;
    if (payload.buyerType === 'consumer') {
      deliveryFee = totalWeightKg > 5 ? 40 : 25;
    } else {
      deliveryFee = Math.max(500, Math.round(totalWeightKg * 2.5));
    }

    const totalAmount = Math.max(0, subtotal - discount + deliveryFee);
    const orderNum = `EUS-TN-${Math.floor(1000 + Math.random() * 9000)}`;
    const refNum = `CONF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      orderNumber: orderNum,
      buyerType: payload.buyerType,
      buyerId: payload.buyerId,
      buyerName: payload.buyerName,
      buyerPhone: payload.buyerPhone,
      deliveryAddress: payload.deliveryAddress,
      deliveryDistrict: payload.deliveryDistrict,
      deliveryPincode: payload.deliveryPincode,
      items: payload.items,
      totalWeightKg,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      status: 'placed',
      createdAt: new Date().toISOString(),
      estimatedDelivery:
        payload.buyerType === 'consumer'
          ? 'Today within 3-4 hours'
          : 'Next Morning 6:00 AM Direct Dispatch',
      paymentConfirmation: {
        status: 'UI_CONFIRMED',
        method: payload.paymentMethod,
        referenceId: refNum,
        confirmedAt: new Date().toISOString(),
      },
      trackingHistory: [
        {
          status: 'placed',
          label: `${payload.buyerType === 'bulk_buyer' ? 'Bulk Purchase Order' : 'Fresh Basket Order'} Verified & Produce Allocated`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          locationNote: `Allocated directly from respective Tamil Nadu FPO regional hubs`,
        },
      ],
    };

    // Deduct stock atomically
    const updatedProduce = this.db.produce.map((p) => {
      const inCart = payload.items.find((c) => c.produceId === p.id);
      if (inCart) {
        return {
          ...p,
          availableKg: Math.max(0, p.availableKg - inCart.quantityKg),
        };
      }
      return p;
    });

    const newOrders = [newOrder, ...this.db.orders];
    const newLogs: ActivityLog[] = [
      {
        id: 'log_' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'ORDER_PLACED',
        actor: payload.buyerName,
        role: payload.buyerType,
        details: `Order #${orderNum} created for ${totalWeightKg}kg produce (₹${totalAmount}) to ${payload.deliveryDistrict}`,
      },
      ...this.db.activityLogs.slice(0, 49),
    ];

    this.saveDatabase({
      ...this.db,
      produce: updatedProduce,
      orders: newOrders,
      activityLogs: newLogs,
    });

    return { success: true, order: newOrder };
  }

  public updateOrderStatus(orderId: string, status: OrderStatus, note?: string, updatedBy?: string): Order | null {
    const index = this.db.orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    const labelMap: Record<OrderStatus, string> = {
      placed: 'Order Placed & Produce Allocated',
      assigned_logistics: 'Logistics Partner Assigned',
      picked_up_fpo: 'Produce Picked Up from FPO Farm Hub',
      in_transit: 'Out for Delivery / Regional Transit Corridor',
      delivered: 'Delivered to Buyer (Direct Farm Verification Complete)',
    };

    const order = this.db.orders[index];
    const newTracking = [
      ...order.trackingHistory,
      {
        status,
        label: labelMap[status],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        locationNote: note || `Tamil Nadu Transit Corridor milestone: ${status.replace('_', ' ')}`,
      },
    ];

    const updatedOrder: Order = {
      ...order,
      status,
      trackingHistory: newTracking,
    };

    const newOrders = [...this.db.orders];
    newOrders[index] = updatedOrder;

    const newLogs: ActivityLog[] = [
      {
        id: 'log_' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'ORDER_STATUS_UPDATE',
        actor: updatedBy || 'Logistics Partner',
        role: 'logistics',
        details: `Order #${order.orderNumber} updated to ${labelMap[status]}`,
      },
      ...this.db.activityLogs.slice(0, 49),
    ];

    this.saveDatabase({
      ...this.db,
      orders: newOrders,
      activityLogs: newLogs,
    });

    return updatedOrder;
  }

  public assignLogistics(
    orderId: string,
    logisticsPartnerId: string,
    logisticsCompany: string,
    vehicleNumber: string
  ): Order | null {
    const index = this.db.orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    const order = this.db.orders[index];
    const newTracking = [
      ...order.trackingHistory,
      {
        status: 'assigned_logistics' as OrderStatus,
        label: `Logistics Partner Accepted (${logisticsCompany})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        locationNote: `Vehicle ${vehicleNumber} dispatched for FPO Farm Hub collection`,
      },
    ];

    const updatedOrder: Order = {
      ...order,
      status: 'assigned_logistics',
      logisticsPartnerId,
      logisticsPartnerName: logisticsCompany,
      vehicleNumber,
      trackingHistory: newTracking,
    };

    const newOrders = [...this.db.orders];
    newOrders[index] = updatedOrder;

    const newLogs: ActivityLog[] = [
      {
        id: 'log_' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'LOGISTICS_ASSIGNED',
        actor: logisticsCompany,
        role: 'logistics',
        details: `Order #${order.orderNumber} assigned to vehicle ${vehicleNumber}`,
      },
      ...this.db.activityLogs.slice(0, 49),
    ];

    this.saveDatabase({
      ...this.db,
      orders: newOrders,
      activityLogs: newLogs,
    });

    return updatedOrder;
  }

  // --- Analytics & Prices ---
  public getAnalytics() {
    const orders = this.db.orders;
    const produce = this.db.produce;

    const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalVolumeKg = orders.reduce((sum, o) => sum + o.totalWeightKg, 0);
    const totalStockInFPOsKg = produce.reduce((sum, p) => sum + p.availableKg, 0);

    const consumerOrders = orders.filter((o) => o.buyerType === 'consumer');
    const bulkOrders = orders.filter((o) => o.buyerType === 'bulk_buyer');
    const activeDispatches = orders.filter((o) => o.status !== 'placed' && o.status !== 'delivered');
    const deliveredOrders = orders.filter((o) => o.status === 'delivered');

    // District breakdown
    const districtMap: Record<string, { produceCount: number; stockKg: number; ordersCount: number }> = {};
    produce.forEach((p) => {
      const dist = p.originDistrict || 'Other';
      if (!districtMap[dist]) {
        districtMap[dist] = { produceCount: 0, stockKg: 0, ordersCount: 0 };
      }
      districtMap[dist].produceCount += 1;
      districtMap[dist].stockKg += p.availableKg;
    });

    orders.forEach((o) => {
      o.items.forEach((i) => {
        const dist = i.item.originDistrict || 'Other';
        if (districtMap[dist]) {
          districtMap[dist].ordersCount += 1;
        }
      });
    });

    return {
      totalGMV,
      totalVolumeKg,
      totalStockInFPOsKg,
      totalOrders: orders.length,
      consumerOrdersCount: consumerOrders.length,
      bulkOrdersCount: bulkOrders.length,
      activeDispatchesCount: activeDispatches.length,
      deliveredOrdersCount: deliveredOrders.length,
      districts: Object.entries(districtMap).sort((a, b) => b[1].stockKg - a[1].stockKg),
    };
  }

  public getMarketPrices(): MarketPrice[] {
    return this.db.marketPrices;
  }

  public getActivityLogs(): ActivityLog[] {
    return this.db.activityLogs;
  }
}

export const db = new MarketDatabase();
