import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { TAMIL_NADU_DISTRICTS } from '../../types';
import brinjalImg from '../../assets/brinjal.jpg';
import jackfruitImg from '../../assets/jackfruit.jpg';
import tenderCoconutImg from '../../assets/tender_coconut.jpg';

const salemMangoImg = 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80';
import {
  Search,
  Building2,
  MapPin,
  Sparkles,
  ShoppingBag,
  Plus,
  Truck,
  Package,
  Layers,
  Percent,
  TrendingDown,
} from 'lucide-react';

interface BulkBuyerDashboardProps {
  onOpenCart: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BulkBuyerDashboard: React.FC<BulkBuyerDashboardProps> = ({
  onOpenCart,
  activeTab,
  setActiveTab,
}) => {
  const {
    produceList,
    cart,
    orders,
    addToCart,
    currentUser,
  } = useMarket();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customLotKg, setCustomLotKg] = useState<Record<string, number>>({});

  const filteredProduce = produceList.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedDistrict !== 'all' && item.originDistrict !== selectedDistrict) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchTamil = item.tamilName.toLowerCase().includes(q);
      const matchPlace = item.originPlace.toLowerCase().includes(q);
      const matchDistrict = item.originDistrict.toLowerCase().includes(q);
      if (!matchName && !matchTamil && !matchPlace && !matchDistrict) return false;
    }
    return true;
  });

  const bulkOrders = orders.filter(
    (o) => o.buyerType === 'bulk_buyer' && (currentUser ? o.buyerId === currentUser.id || o.buyerPhone === currentUser.phone : true)
  );

  const getItemCartQuantity = (produceId: string) => {
    const found = cart.find((c) => c.produceId === produceId);
    return found ? found.quantityKg : 0;
  };

  const handleAddCustomLot = (itemId: string, defaultLot: number = 50) => {
    const qty = customLotKg[itemId] || defaultLot;
    const item = produceList.find((p) => p.id === itemId);
    if (item && qty > 0) {
      addToCart(item, qty);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bulk Buyer Wholesale Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/10 via-amber-500/5 to-emerald-500/10 dark:from-blue-950/30 dark:via-zinc-900/60 dark:to-emerald-950/20 border border-blue-200/80 dark:border-zinc-800 p-5 sm:p-7 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white flex items-center gap-1.5 shadow-xs">
              <Building2 className="w-3.5 h-3.5" />
              Institutional Bulk Procurement
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Unrestricted Quota (50kg – 5,000kg+)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
            Wholesale Farm Sourcing for Supermarkets &amp; Commercial Buyers
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            Directly procure truckloads and pallet crates from Tamil Nadu FPO farming clusters with tiered wholesale pricing. Pre-scheduled reefer logistics and farm-to-warehouse dispatch.
          </p>

          {/* Wholesale Discount Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="px-3 py-1 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs text-slate-700 dark:text-zinc-300 flex items-center gap-1.5 font-medium shadow-2xs">
              <TrendingDown className="w-4 h-4 text-amber-500" />
              100kg+ Lot: <strong className="text-slate-900 dark:text-white">10% Instant Rebate</strong>
            </div>
            <div className="px-3 py-1 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs text-slate-700 dark:text-zinc-300 flex items-center gap-1.5 font-medium shadow-2xs">
              <Percent className="w-4 h-4 text-[#0c831f] dark:text-emerald-400" />
              300kg+ Lot: <strong className="text-slate-900 dark:text-white">15% Commercial Rebate</strong>
            </div>
          </div>

          {currentUser?.address && (
            <div className="pt-2 flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400 font-medium">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>
                Receiving Dock:{' '}
                <strong className="text-slate-800 dark:text-zinc-200">{currentUser.businessName || currentUser.name} &bull; {currentUser.address}, {currentUser.district}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[#0c831f] text-white shadow-sm'
                : 'bg-white dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700'
            }`}
          >
            Wholesale Catalog ({filteredProduce.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#0c831f] text-white shadow-sm'
                : 'bg-white dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700'
            }`}
          >
            Purchase Orders
            {bulkOrders.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'orders' ? 'bg-white text-[#0c831f]' : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200'}`}>
                {bulkOrders.length}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={onOpenCart}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 cursor-pointer shadow-xs"
        >
          <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Wholesale Cart</span>
          {cart.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold">
              {cart.reduce((s, i) => s + i.quantityKg, 0)} kg
            </span>
          )}
        </button>
      </div>

      {activeTab === 'catalog' ? (
        <div className="space-y-5">
          {/* Filters Toolbar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-3 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search wholesale produce, Tamil origin, FPO name..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="sm:w-60">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs sm:text-sm text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer font-medium"
              >
                <option value="all">All Tamil Nadu Regions</option>
                {TAMIL_NADU_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist} FPO Hubs
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Wholesale Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {filteredProduce.map((item) => {
              const inCartQty = getItemCartQuantity(item.id);
              const customVal = customLotKg[item.id] || 50;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white dark:bg-[#1c1c20] border border-slate-200/90 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-600/50 hover:shadow-md p-4 sm:p-5 flex flex-col sm:flex-row gap-4 transition-all shadow-xs"
                >
                  <div className="sm:w-44 h-40 sm:h-auto rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-900 relative shrink-0">
                    <img
                      src={
                        item.id === 'prod_3' || item.name.toLowerCase().includes('mango')
                          ? salemMangoImg
                          : item.id === 'prod_8'
                          ? brinjalImg
                          : item.id === 'prod_10'
                          ? jackfruitImg
                          : item.id === 'prod_6'
                          ? tenderCoconutImg
                          : item.imageUrl
                      }
                      alt={item.id === 'prod_3' || item.name.toLowerCase().includes('mango') ? 'Salem Mango' : item.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        if (item.id === 'prod_3' || item.name.toLowerCase().includes('mango')) {
                          e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Hapus_Mango.jpg/500px-Hapus_Mango.jpg';
                        } else if (item.id === 'prod_8') {
                          e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/An_Indian_Purple_Eggplant_%28Brinjal%29.jpg/500px-An_Indian_Purple_Eggplant_%28Brinjal%29.jpg';
                        } else if (item.id === 'prod_10') {
                          e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/The_jackfruit_is_holding_on_to_the_tree.jpg/500px-The_jackfruit_is_holding_on_to_the_tree.jpg';
                        } else if (item.id === 'prod_6') {
                          e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Tender_coconut_image.jpg/500px-Tender_coconut_image.jpg';
                        } else {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80';
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 dark:bg-black/80 backdrop-blur border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      {item.id === 'prod_3' || item.name.toLowerCase().includes('mango') ? 'Salem' : item.originDistrict}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">
                            {item.id === 'prod_3' || item.name.toLowerCase().includes('mango') ? 'Salem Mango' : item.name}
                          </h3>
                          <div className="text-xs text-blue-700 dark:text-blue-400 font-medium mt-0.5">
                            {item.id === 'prod_3' || item.name.toLowerCase().includes('mango') ? 'சேலம் மாம்பழம்' : item.tamilName} &bull; {item.originPlace}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold block">Wholesale Rate</span>
                          <span className="text-lg font-bold text-slate-900 dark:text-white">
                            ₹{item.pricePerKg} <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">/kg</span>
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-slate-600 dark:text-zinc-300 flex items-center gap-2 font-medium">
                        <Layers className="w-3.5 h-3.5 text-[#0c831f] dark:text-emerald-400 shrink-0" />
                        <span className="truncate">{item.fpoName}</span>
                      </div>

                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
                        <span>Harvest: {item.harvestDate}</span>
                        <span>Available: <strong className="text-[#0c831f] dark:text-emerald-400 font-semibold">{item.availableKg} kg</strong></span>
                      </div>
                    </div>

                    {/* Bulk Quantity Input & Presets */}
                    <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Custom Lot:</span>
                          <input
                            type="number"
                            min={1}
                            max={item.availableKg}
                            value={customVal}
                            onChange={(e) =>
                              setCustomLotKg({
                                ...customLotKg,
                                [item.id]: Math.max(1, parseInt(e.target.value) || 1),
                              })
                            }
                            className="w-20 px-2 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-center font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                          />
                          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">kg</span>
                        </div>

                        <button
                          onClick={() => handleAddCustomLot(item.id, customVal)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add {customVal}kg
                        </button>
                      </div>

                      {/* Quick lot increment buttons */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">Quick Lots:</span>
                        {[25, 50, 100, 250, 500].map((lot) => (
                          <button
                            key={lot}
                            onClick={() => addToCart(item, lot)}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-zinc-800 dark:hover:bg-blue-950/40 text-[11px] font-semibold text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-zinc-700 cursor-pointer transition-colors"
                          >
                            +{lot}kg
                          </button>
                        ))}
                      </div>

                      {inCartQty > 0 && (
                        <div className="text-xs text-[#0c831f] dark:text-emerald-400 font-semibold flex items-center justify-between pt-1">
                          <span>In Wholesale Cart: {inCartQty} kg</span>
                          <span>(₹{inCartQty * item.pricePerKg})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Orders View */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 flex items-center justify-between shadow-xs">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">Commercial Purchase Orders</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Institutional procurement records &amp; freight dispatch status.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('catalog')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-800 dark:text-zinc-200 cursor-pointer"
            >
              Back to Catalog
            </button>
          </div>

          {bulkOrders.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 p-8 space-y-3 shadow-xs">
              <Package className="w-12 h-12 mx-auto text-slate-400 dark:text-zinc-600" />
              <p className="text-slate-800 dark:text-zinc-200 font-semibold text-base">No wholesale purchase orders yet</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Add large volume lots to your cart and confirm via Virtual AgriCredit PO to simulate.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bulkOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#1c1c20] border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-900 dark:text-white">
                          PO #{order.orderNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800/60">
                          Commercial Dispatch &bull; {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                        Placed: {new Date(order.createdAt).toLocaleDateString()} &bull; Total Freight Weight:{' '}
                        <strong className="text-slate-900 dark:text-white font-semibold">{order.totalWeightKg} kg</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold block">Total Invoice</span>
                      <span className="text-lg font-bold text-[#0c831f] dark:text-emerald-400">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60">
                      <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-2">Crate Allocations:</span>
                      <div className="space-y-1.5">
                        {order.items.map((i) => (
                          <div key={i.produceId} className="flex justify-between text-slate-700 dark:text-zinc-300">
                            <span>
                              {i.item.name} ({i.quantityKg}kg)
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-zinc-100">₹{i.item.pricePerKg * i.quantityKg}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60">
                      <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Receiving Dock:</span>
                      <p className="text-slate-800 dark:text-zinc-200 font-medium">{order.buyerName} &bull; {order.buyerPhone}</p>
                      <p className="text-slate-600 dark:text-zinc-400 mt-0.5">{order.deliveryAddress}, {order.deliveryDistrict}</p>
                      {order.vehicleNumber && (
                        <div className="mt-2 text-purple-700 dark:text-purple-300 flex items-center gap-1.5 text-xs font-medium">
                          <Truck className="w-4 h-4" />
                          Logistics: {order.logisticsPartnerName} ({order.vehicleNumber})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
