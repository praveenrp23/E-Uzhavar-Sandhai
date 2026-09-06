import {
  UserProfile,
  UserRole,
  ProduceItem,
  Order,
  OrderStatus,
  CartItem,
} from '../types';

export interface DbStatusResponse {
  status: string;
  storageEngine: string;
  filePath: string;
  sizeBytes: number;
  version: number;
  lastUpdated: string;
  counts: {
    users: number;
    produce: number;
    orders: number;
    activityLogs: number;
    marketPrices: number;
  };
  serverTime: string;
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

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  role: string;
  details: string;
}

export interface AnalyticsResponse {
  totalGMV: number;
  totalVolumeKg: number;
  totalStockInFPOsKg: number;
  totalOrders: number;
  consumerOrdersCount: number;
  bulkOrdersCount: number;
  activeDispatchesCount: number;
  deliveredOrdersCount: number;
  districts: [string, { produceCount: number; stockKg: number; ordersCount: number }][];
}

export const api = {
  // --- Health & Diagnostics ---
  async checkHealth(): Promise<{ status: string; uptimeSeconds: number }> {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return res.json();
  },

  async getDbStatus(): Promise<DbStatusResponse> {
    const res = await fetch('/api/db/status');
    if (!res.ok) throw new Error(`Failed to fetch database status: ${res.statusText}`);
    return res.json();
  },

  async resetDatabase(): Promise<{ success: boolean; message: string; stats: DbStatusResponse }> {
    const res = await fetch('/api/db/reset', { method: 'POST' });
    if (!res.ok) throw new Error(`Failed to reset database: ${res.statusText}`);
    return res.json();
  },

  // --- Auth & Users ---
  async login(role: UserRole, email?: string): Promise<UserProfile> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, email }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }
    return data.user;
  },

  async signup(userData: Partial<UserProfile> & { role: UserRole }): Promise<UserProfile> {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Registration failed');
    }
    return data.user;
  },

  async updateProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updates }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update profile');
    }
    return data.user;
  },

  async getUsers(): Promise<Record<string, UserProfile>> {
    const res = await fetch('/api/auth/users');
    if (!res.ok) throw new Error(`Failed to fetch users: ${res.statusText}`);
    const data = await res.json();
    return data.users;
  },

  // --- Produce Catalog ---
  async getProduce(params?: {
    category?: string;
    district?: string;
    organic?: boolean;
    search?: string;
    fpoId?: string;
  }): Promise<ProduceItem[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.district && params.district !== 'all') query.set('district', params.district);
    if (params?.organic) query.set('organic', 'true');
    if (params?.search) query.set('search', params.search);
    if (params?.fpoId) query.set('fpoId', params.fpoId);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`/api/produce${qs}`);
    if (!res.ok) throw new Error(`Failed to fetch produce: ${res.statusText}`);
    const data = await res.json();
    return data.produce || [];
  },

  async getProduceById(id: string): Promise<ProduceItem> {
    const res = await fetch(`/api/produce/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch item: ${res.statusText}`);
    const data = await res.json();
    return data.produce;
  },

  async createProduce(produceData: Omit<ProduceItem, 'id'>): Promise<ProduceItem> {
    const res = await fetch('/api/produce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produceData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to create produce listing');
    }
    return data.produce;
  },

  async updateProduce(id: string, updates: Partial<ProduceItem>): Promise<ProduceItem> {
    const res = await fetch(`/api/produce/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update produce listing');
    }
    return data.produce;
  },

  async deleteProduce(id: string): Promise<boolean> {
    const res = await fetch(`/api/produce/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete produce listing');
    }
    return true;
  },

  // --- Orders ---
  async getOrders(params?: {
    buyerId?: string;
    buyerType?: string;
    status?: string;
    logisticsPartnerId?: string;
  }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params?.buyerId) query.set('buyerId', params.buyerId);
    if (params?.buyerType && params.buyerType !== 'all') query.set('buyerType', params.buyerType);
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.logisticsPartnerId) query.set('logisticsPartnerId', params.logisticsPartnerId);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`/api/orders${qs}`);
    if (!res.ok) throw new Error(`Failed to fetch orders: ${res.statusText}`);
    const data = await res.json();
    return data.orders || [];
  },

  async createOrder(payload: {
    buyerType: 'consumer' | 'bulk_buyer';
    buyerId: string;
    buyerName: string;
    buyerPhone: string;
    deliveryAddress: string;
    deliveryDistrict: string;
    deliveryPincode: string;
    items: CartItem[];
    paymentMethod: 'Simulated COD / Direct Farmer Remittance' | 'Virtual AgriCredit PO';
  }): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Order checkout failed');
    }
    return data.order;
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    note?: string,
    updatedBy?: string
  ): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note, updatedBy }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update order status');
    }
    return data.order;
  },

  async assignLogistics(
    orderId: string,
    logisticsPartnerId: string,
    logisticsCompany: string,
    vehicleNumber: string
  ): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/assign-logistics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logisticsPartnerId, logisticsCompany, vehicleNumber }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to assign logistics partner');
    }
    return data.order;
  },

  // --- Analytics & Prices ---
  async getAnalytics(): Promise<AnalyticsResponse> {
    const res = await fetch('/api/analytics');
    if (!res.ok) throw new Error(`Failed to fetch analytics: ${res.statusText}`);
    const data = await res.json();
    return data.analytics;
  },

  async getMarketPrices(): Promise<MarketPrice[]> {
    const res = await fetch('/api/prices');
    if (!res.ok) throw new Error(`Failed to fetch prices: ${res.statusText}`);
    const data = await res.json();
    return data.prices || [];
  },

  async getAuditLogs(): Promise<ActivityLog[]> {
    const res = await fetch('/api/audit-logs');
    if (!res.ok) throw new Error(`Failed to fetch audit logs: ${res.statusText}`);
    const data = await res.json();
    return data.logs || [];
  },
};
