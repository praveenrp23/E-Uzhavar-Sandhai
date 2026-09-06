import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserRole,
  UserProfile,
  ProduceItem,
  CartItem,
  Order,
  OrderStatus,
} from '../types';
import { INITIAL_USERS, INITIAL_PRODUCE, INITIAL_ORDERS } from '../data/mockData';
import { api } from '../services/api';
import brinjalImg from '../assets/brinjal.jpg';
import jackfruitImg from '../assets/jackfruit.jpg';
import tenderCoconutImg from '../assets/tender_coconut.jpg';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface MarketContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole;
  users: Record<string, UserProfile>;
  produceList: ProduceItem[];
  orders: Order[];
  cart: CartItem[];
  toasts: Toast[];
  apiConnected: boolean;
  isLoadingData: boolean;
  refreshData: () => Promise<void>;
  showToast: (message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  // Auth actions
  login: (role: UserRole, email?: string) => Promise<boolean> | boolean;
  signup: (userData: Partial<UserProfile> & { role: UserRole }) => Promise<void> | void;
  logout: () => void;
  updateCurrentUserProfile: (profile: Partial<UserProfile>) => Promise<void> | void;
  // Cart actions
  addToCart: (item: ProduceItem, quantityKg: number) => { success: boolean; message?: string };
  updateCartQuantity: (produceId: string, quantityKg: number) => boolean;
  removeFromCart: (produceId: string) => void;
  clearCart: () => void;
  getCartTotal: () => { subtotal: number; totalWeightKg: number; discount: number; deliveryFee: number; total: number };
  // Order actions
  checkout: (details: {
    address: string;
    district: string;
    pincode: string;
    phone: string;
    buyerName: string;
    paymentMethod: 'Simulated COD / Direct Farmer Remittance' | 'Virtual AgriCredit PO';
  }) => Promise<Order | null>;
  // FPO actions
  addProduceListing: (item: Omit<ProduceItem, 'id' | 'fpoId' | 'fpoName'>) => Promise<void> | void;
  updateProduceListing: (id: string, updates: Partial<ProduceItem>) => Promise<void> | void;
  deleteProduceListing: (id: string) => Promise<void> | void;
  // Logistics actions
  acceptDelivery: (orderId: string, vehicleInfo?: string) => Promise<void> | void;
  updateDeliveryStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void> | void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PRODUCE = 'euzhavar_produce_v9';
const LOCAL_STORAGE_KEY_ORDERS = 'euzhavar_orders_v3';
const LOCAL_STORAGE_KEY_USER = 'euzhavar_user_v3';
const LOCAL_STORAGE_KEY_USERS = 'euzhavar_all_users_v3';

const sanitizeProduce = (items: ProduceItem[]): ProduceItem[] => {
  return items.map((item) => {
    let updated = { ...item };
    if (item.id === 'prod_3' || item.name.toLowerCase().includes('mango') || item.name.includes('Moringa') || item.name.includes('Panneer Grapes')) {
      updated.name = 'Salem Mango';
      updated.tamilName = 'சேலம் மாம்பழம்';
      updated.category = 'fruits';
      updated.originDistrict = 'Salem';
      updated.originPlace = 'Salem Mango Belt Orchards';
      updated.fpoName = 'Salem Agri Growers Collective';
      updated.imageUrl = 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80';
      updated.description = 'Sweet aromatic Salem mangoes';
    } else if (item.id === 'prod_6' || item.name.includes('Tender Coconut')) {
      updated.imageUrl = tenderCoconutImg;
    } else if (item.id === 'prod_8' || item.name.includes('Brinjal')) {
      updated.imageUrl = brinjalImg;
    } else if (item.id === 'prod_10' || item.name.includes('Jackfruit')) {
      updated.imageUrl = jackfruitImg;
    }
    return updated;
  });
};

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<Record<string, UserProfile>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      if (!saved || saved === 'null' || saved === 'signed_out') return null;
      const parsed = JSON.parse(saved);
      if (parsed?.name === 'Raja Praveen' || parsed?.id === 'usr_c_01') {
        localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [produceList, setProduceList] = useState<ProduceItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCE);
      return saved ? sanitizeProduce(JSON.parse(saved)) : sanitizeProduce(INITIAL_PRODUCE);
    } catch {
      return sanitizeProduce(INITIAL_PRODUCE);
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [apiConnected, setApiConnected] = useState<boolean>(true);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // Sync state from backend Express API on initial load
  const refreshData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [fetchedProduce, fetchedOrders, fetchedUsers] = await Promise.all([
        api.getProduce(),
        api.getOrders(),
        api.getUsers(),
      ]);

      if (fetchedProduce && fetchedProduce.length > 0) {
        setProduceList(sanitizeProduce(fetchedProduce));
      }
      if (fetchedOrders && fetchedOrders.length > 0) {
        setOrders(fetchedOrders);
      }
      if (fetchedUsers && Object.keys(fetchedUsers).length > 0) {
        setUsers(fetchedUsers);
      }
      setApiConnected(true);
    } catch (err) {
      console.warn('Backend API synchronization notice (using local offline cache):', err);
      setApiConnected(false);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Sync to localStorage as offline fallback cache
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCE, JSON.stringify(produceList));
    } catch {}
  }, [produceList]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY_USER, 'signed_out');
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(users));
    } catch {}
  }, [users]);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const currentRole: UserRole = currentUser?.role || 'consumer';

  const login = async (role: UserRole, email?: string): Promise<boolean> => {
    try {
      // Call backend API login
      const serverUser = await api.login(role, email);
      setCurrentUser(serverUser);
      setCart([]);
      showToast(`Welcome back, ${serverUser.name}! (${role.toUpperCase()})`, 'success');
      return true;
    } catch (err: any) {
      // Offline fallback
      if (email) {
        const userList = Object.values(users) as UserProfile[];
        const found = userList.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role
        );
        if (found) {
          setCurrentUser(found);
          setCart([]);
          showToast(`Welcome back, ${found.name}!`, 'success');
          return true;
        }
      }
      const defaultUser = INITIAL_USERS[role];
      setCurrentUser(defaultUser);
      setCart([]);
      showToast(`Logged in as ${defaultUser.name} (${role.toUpperCase()})`, 'success');
      return true;
    }
  };

  const signup = async (userData: Partial<UserProfile> & { role: UserRole }) => {
    try {
      const registeredUser = await api.signup(userData);
      setUsers((prev) => ({
        ...prev,
        [registeredUser.id]: registeredUser,
        [registeredUser.role]: registeredUser,
      }));
      setCurrentUser(registeredUser);
      setCart([]);
      showToast(`Account registered in Tamil Nadu database as ${userData.role.replace('_', ' ').toUpperCase()}!`, 'success');
    } catch (err: any) {
      // Offline fallback
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
      };
      setUsers((prev) => ({ ...prev, [newId]: newUser, [userData.role]: newUser }));
      setCurrentUser(newUser);
      setCart([]);
      showToast(`Account registered as ${userData.role.replace('_', ' ').toUpperCase()}!`, 'success');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    showToast('Signed out of session', 'info');
  };

  const updateCurrentUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers((prev) => ({ ...prev, [updated.id]: updated, [updated.role]: updated }));

    try {
      await api.updateProfile(currentUser.id, updates);
      showToast('Profile information synced to server database', 'success');
    } catch {
      showToast('Profile updated locally', 'success');
    }
  };

  // Cart operations
  const addToCart = (item: ProduceItem, quantityKg: number) => {
    if (quantityKg <= 0) return { success: false, message: 'Invalid quantity' };

    const existingIndex = cart.findIndex((c) => c.produceId === item.id);
    const currentQty = existingIndex > -1 ? cart[existingIndex].quantityKg : 0;
    const newTotalQty = currentQty + quantityKg;

    // Consumer limit constraint: max 10kg per item
    if (currentRole === 'consumer') {
      if (newTotalQty > 10) {
        showToast(`Consumer limit: Max 10kg allowed per item for ${item.name}!`, 'warning');
        return {
          success: false,
          message: `Consumer order limit is restricted to 10kg per item. (Already in cart: ${currentQty}kg)`,
        };
      }
    }

    // Check availability
    if (newTotalQty > item.availableKg) {
      showToast(`Only ${item.availableKg}kg available in stock from ${item.fpoName}`, 'warning');
      return { success: false, message: `Only ${item.availableKg}kg available in stock.` };
    }

    if (existingIndex > -1) {
      setCart((prev) =>
        prev.map((c, i) => (i === existingIndex ? { ...c, quantityKg: newTotalQty } : c))
      );
    } else {
      setCart((prev) => [...prev, { produceId: item.id, item, quantityKg }]);
    }

    showToast(`Added ${quantityKg}kg of ${item.name} to cart`, 'success');
    return { success: true };
  };

  const updateCartQuantity = (produceId: string, quantityKg: number) => {
    if (quantityKg <= 0) {
      removeFromCart(produceId);
      return true;
    }

    const itemObj = cart.find((c) => c.produceId === produceId)?.item;
    if (!itemObj) return false;

    if (currentRole === 'consumer' && quantityKg > 10) {
      showToast(`Consumer limit is 10kg maximum per item!`, 'warning');
      return false;
    }

    if (quantityKg > itemObj.availableKg) {
      showToast(`Only ${itemObj.availableKg}kg available in stock`, 'warning');
      return false;
    }

    setCart((prev) =>
      prev.map((c) => (c.produceId === produceId ? { ...c, quantityKg } : c))
    );
    return true;
  };

  const removeFromCart = (produceId: string) => {
    setCart((prev) => prev.filter((c) => c.produceId !== produceId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, c) => sum + c.item.pricePerKg * c.quantityKg, 0);
    const totalWeightKg = cart.reduce((sum, c) => sum + c.quantityKg, 0);

    let discount = 0;
    if (currentRole === 'bulk_buyer') {
      if (totalWeightKg >= 300) {
        discount = Math.round(subtotal * 0.15);
      } else if (totalWeightKg >= 100) {
        discount = Math.round(subtotal * 0.1);
      }
    }

    let deliveryFee = 0;
    if (cart.length > 0) {
      if (currentRole === 'consumer') {
        deliveryFee = totalWeightKg > 5 ? 40 : 25;
      } else {
        deliveryFee = Math.max(500, Math.round(totalWeightKg * 2.5));
      }
    }

    const total = Math.max(0, subtotal - discount + deliveryFee);
    return { subtotal, totalWeightKg, discount, deliveryFee, total };
  };

  // Checkout with Server Database Integration
  const checkout = async (details: {
    address: string;
    district: string;
    pincode: string;
    phone: string;
    buyerName: string;
    paymentMethod: 'Simulated COD / Direct Farmer Remittance' | 'Virtual AgriCredit PO';
  }): Promise<Order | null> => {
    if (cart.length === 0) {
      showToast('Cart is empty', 'error');
      return null;
    }

    try {
      // Call backend API checkout
      const createdOrder = await api.createOrder({
        buyerType: currentRole === 'bulk_buyer' ? 'bulk_buyer' : 'consumer',
        buyerId: currentUser?.id || 'guest',
        buyerName: details.buyerName,
        buyerPhone: details.phone,
        deliveryAddress: details.address,
        deliveryDistrict: details.district,
        deliveryPincode: details.pincode,
        items: [...cart],
        paymentMethod: details.paymentMethod,
      });

      // Update local state
      setOrders((prev) => [createdOrder, ...prev]);

      // Deduct stock locally
      setProduceList((prev) =>
        prev.map((item) => {
          const foundInCart = cart.find((c) => c.produceId === item.id);
          if (foundInCart) {
            return {
              ...item,
              availableKg: Math.max(0, item.availableKg - foundInCart.quantityKg),
            };
          }
          return item;
        })
      );

      clearCart();

      if (currentUser && (!currentUser.address || currentUser.address.length < 5)) {
        updateCurrentUserProfile({
          address: details.address,
          district: details.district,
          pincode: details.pincode,
          phone: details.phone,
        });
      }

      showToast(
        `Order #${createdOrder.orderNumber} confirmed & persisted to database! (Ref: ${createdOrder.paymentConfirmation.referenceId})`,
        'success'
      );
      return createdOrder;
    } catch (err: any) {
      // Offline fallback handling
      console.warn('API checkout failed, performing local checkout:', err);
      const { subtotal, totalWeightKg, discount, deliveryFee, total } = getCartTotal();
      const orderNum = `EUS-TN-${Math.floor(1000 + Math.random() * 9000)}`;
      const refNum = `CONF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const fallbackOrder: Order = {
        id: 'ord_' + Date.now(),
        orderNumber: orderNum,
        buyerType: currentRole === 'bulk_buyer' ? 'bulk_buyer' : 'consumer',
        buyerId: currentUser?.id || 'guest',
        buyerName: details.buyerName,
        buyerPhone: details.phone,
        deliveryAddress: details.address,
        deliveryDistrict: details.district,
        deliveryPincode: details.pincode,
        items: [...cart],
        totalWeightKg,
        subtotal,
        deliveryFee,
        discount,
        totalAmount: total,
        status: 'placed',
        createdAt: new Date().toISOString(),
        estimatedDelivery:
          currentRole === 'consumer' ? 'Today within 4 hours' : 'Next Morning 6:00 AM Direct Dispatch',
        paymentConfirmation: {
          status: 'UI_CONFIRMED',
          method: details.paymentMethod,
          referenceId: refNum,
          confirmedAt: new Date().toISOString(),
        },
        trackingHistory: [
          {
            status: 'placed',
            label: `${currentRole === 'bulk_buyer' ? 'Bulk Purchase Order' : 'Fresh Basket Order'} Verified & Produce Allocated`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            locationNote: `Allocated directly from respective Tamil Nadu FPO hubs`,
          },
        ],
      };

      setProduceList((prev) =>
        prev.map((item) => {
          const foundInCart = cart.find((c) => c.produceId === item.id);
          if (foundInCart) {
            return {
              ...item,
              availableKg: Math.max(0, item.availableKg - foundInCart.quantityKg),
            };
          }
          return item;
        })
      );

      setOrders((prev) => [fallbackOrder, ...prev]);
      clearCart();
      showToast(`Order #${orderNum} confirmed!`, 'success');
      return fallbackOrder;
    }
  };

  // FPO management
  const addProduceListing = async (itemData: Omit<ProduceItem, 'id' | 'fpoId' | 'fpoName'>) => {
    const fpoUser = currentUser?.role === 'fpo' ? currentUser : INITIAL_USERS.fpo;

    const payload = {
      ...itemData,
      fpoId: fpoUser.id,
      fpoName: fpoUser.fpoName || 'Tamil Nadu Agri Collective FPO',
    };

    try {
      const createdItem = await api.createProduce(payload);
      setProduceList((prev) => [sanitizeProduce([createdItem])[0], ...prev]);
      showToast(`Added ${createdItem.name} (${createdItem.availableKg}kg) to server catalog!`, 'success');
    } catch {
      const localItem: ProduceItem = {
        ...payload,
        id: 'prod_' + Date.now(),
      };
      setProduceList((prev) => [sanitizeProduce([localItem])[0], ...prev]);
      showToast(`Added ${localItem.name} to produce catalog!`, 'success');
    }
  };

  const updateProduceListing = async (id: string, updates: Partial<ProduceItem>) => {
    setProduceList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    try {
      await api.updateProduce(id, updates);
      showToast('Produce listing updated in database', 'success');
    } catch {
      showToast('Produce listing updated', 'success');
    }
  };

  const deleteProduceListing = async (id: string) => {
    setProduceList((prev) => prev.filter((item) => item.id !== id));

    try {
      await api.deleteProduce(id);
      showToast('Listing removed from database', 'info');
    } catch {
      showToast('Listing removed', 'info');
    }
  };

  // Logistics partner operations
  const acceptDelivery = async (orderId: string, vehicleInfo?: string) => {
    const logisticsUser = currentUser?.role === 'logistics' ? currentUser : INITIAL_USERS.logistics;
    const vehicle = vehicleInfo || logisticsUser.vehicleNumber || 'TN-57-AZ-4820';
    const company = logisticsUser.logisticsCompany || logisticsUser.name || 'Kaveri Green Fleet';

    try {
      const updatedOrder = await api.assignLogistics(orderId, logisticsUser.id, company, vehicle);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
      showToast(`Delivery request accepted by ${company}!`, 'success');
    } catch {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id === orderId) {
            return {
              ...order,
              status: 'assigned_logistics',
              logisticsPartnerId: logisticsUser.id,
              logisticsPartnerName: company,
              vehicleNumber: vehicle,
              trackingHistory: [
                ...order.trackingHistory,
                {
                  status: 'assigned_logistics',
                  label: `Logistics Partner Accepted (${company})`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  locationNote: `Vehicle ${vehicle} dispatched for FPO Farm Hub collection`,
                },
              ],
            };
          }
          return order;
        })
      );
      showToast(`Delivery request accepted!`, 'success');
    }
  };

  const updateDeliveryStatus = async (orderId: string, status: OrderStatus, note?: string) => {
    const labelMap: Record<OrderStatus, string> = {
      placed: 'Order Placed',
      assigned_logistics: 'Logistics Partner Assigned',
      picked_up_fpo: 'Produce Picked Up from FPO Farm Hub',
      in_transit: 'Out for Delivery / Transit Hub',
      delivered: 'Delivered to Buyer (UI Confirmed)',
    };

    try {
      const updatedOrder = await api.updateOrderStatus(orderId, status, note, currentUser?.name);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
      showToast(`Order status updated to: ${labelMap[status]} in database`, 'info');
    } catch {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id === orderId) {
            return {
              ...order,
              status,
              trackingHistory: [
                ...order.trackingHistory,
                {
                  status,
                  label: labelMap[status],
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  locationNote: note || `Tamil Nadu Transit Corridor update: ${status.replace('_', ' ')}`,
                },
              ],
            };
          }
          return order;
        })
      );
      showToast(`Order status updated to: ${labelMap[status]}`, 'info');
    }
  };

  return (
    <MarketContext.Provider
      value={{
        currentUser,
        currentRole,
        users,
        produceList,
        orders,
        cart,
        toasts,
        apiConnected,
        isLoadingData,
        refreshData,
        showToast,
        dismissToast,
        login,
        signup,
        logout,
        updateCurrentUserProfile,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        checkout,
        addProduceListing,
        updateProduceListing,
        deleteProduceListing,
        acceptDelivery,
        updateDeliveryStatus,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
