import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { TAMIL_NADU_DISTRICTS } from '../../types';
import brinjalImg from '../../assets/brinjal.jpg';
import jackfruitImg from '../../assets/jackfruit.jpg';
import tenderCoconutImg from '../../assets/tender_coconut.jpg';

const salemMangoImg = 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80';
import {
  Search,
  ShoppingBag,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Plus,
  Minus,
  Truck,
  Package,
  Layers,
  Leaf,
  CheckCircle2,
} from 'lucide-react';

interface ConsumerDashboardProps {
  onOpenCart: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ConsumerDashboard: React.FC<ConsumerDashboardProps> = ({
  onOpenCart,
  activeTab,
  setActiveTab,
}) => {
  const {
    produceList,
    cart,
    orders,
    addToCart,
    updateCartQuantity,
    currentUser,
  } = useMarket();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [onlyOrganic, setOnlyOrganic] = useState(false);

  // Filter produce
  const filteredProduce = produceList.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (onlyOrganic && !item.isOrganic) return false;
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

  // Filter consumer orders
  const consumerOrders = orders.filter((o) => {
    if (o.buyerType !== 'consumer') return false;
    if (!currentUser) return true;
    return (
      o.buyerId === currentUser.id ||
      o.buyerPhone === currentUser.phone ||
      o.buyerId === 'guest' ||
      !o.buyerId
    );
  });

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Fresh', icon: '🌾' },
    { id: 'vegetables', label: 'Daily Vegetables', icon: '🥦' },
    { id: 'fruits', label: 'Fresh Fruits', icon: '🍎' },
    { id: 'leafy_greens', label: 'Delta Greens (Keerai)', icon: '🥬' },
    { id: 'tubers_roots', label: 'Roots & Tubers', icon: '🥕' },
  ];

  const getItemCartQuantity = (produceId: string) => {
    const found = cart.find((c) => c.produceId === produceId);
    return found ? found.quantityKg : 0;
  };

  const getFourWordDescription = (item: { id: string; name: string; description?: string }) => {
    if (item.id === 'prod_3' || item.name.toLowerCase().includes('mango')) {
      return 'Sweet aromatic Salem mangoes';
    }
    if (!item.description) return '';
    const words = item.description.trim().split(/\s+/);
    return words.slice(0, 4).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Zomato / Blinkit Style Fresh Produce Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-amber-500/10 dark:from-emerald-950/30 dark:via-zinc-900/60 dark:to-amber-950/20 border border-emerald-200/80 dark:border-zinc-800 p-5 sm:p-7 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0c831f] text-white flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Consumer Fresh Direct
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Fair Quota: Max 10kg Per Item
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
            Fresh Vegetables &amp; Fruits from Tamil Nadu Farms
          </h1>

          <p id="consumer-hero-subtitle" className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            Freshly Harvested and Delivered to your doorstep.
          </p>

          {currentUser?.address && (
            <div className="pt-1 flex items-center gap-2 text-xs text-[#0c831f] dark:text-emerald-400 font-medium">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>
                Delivering to: <strong className="text-slate-800 dark:text-zinc-200">{currentUser.address}, {currentUser.district}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs: Catalog vs My Orders */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[#0c831f] text-white shadow-sm'
                : 'bg-white dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700/80 border border-slate-200 dark:border-zinc-700'
            }`}
          >
            Produce Catalog ({filteredProduce.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#0c831f] text-white shadow-sm'
                : 'bg-white dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700/80 border border-slate-200 dark:border-zinc-700'
            }`}
          >
            My Orders &amp; Tracking
            {consumerOrders.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'orders' ? 'bg-white text-[#0c831f]' : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200'}`}>
                {consumerOrders.length}
              </span>
            )}
          </button>
        </div>

        {/* View Basket Button */}
        <button
          onClick={onOpenCart}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 cursor-pointer shadow-xs"
        >
          <ShoppingBag className="w-4 h-4 text-[#0c831f] dark:text-emerald-400" />
          <span className="hidden sm:inline">My Basket</span>
          {cart.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#0c831f] text-white text-xs font-bold">
              {cart.reduce((s, i) => s + i.quantityKg, 0)}kg
            </span>
          )}
        </button>
      </div>

      {/* Catalog View */}
      {activeTab === 'catalog' ? (
        <div className="space-y-5">
          {/* Filters & Search Toolbar (Blinkit Style) */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fresh vegetables, fruits, Tamil names (e.g. சின்ன வெங்காயம், Carrots)..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0c831f]/30"
                />
              </div>

              {/* District Filter */}
              <div className="sm:w-60">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs sm:text-sm text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0c831f]/30 cursor-pointer font-medium"
                >
                  <option value="all">All Tamil Nadu Districts</option>
                  {TAMIL_NADU_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist} Farms
                    </option>
                  ))}
                </select>
              </div>

              {/* Organic toggle */}
              <button
                type="button"
                onClick={() => setOnlyOrganic(!onlyOrganic)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  onlyOrganic
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 shadow-xs'
                    : 'bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700'
                }`}
              >
                <Leaf className="w-3.5 h-3.5 text-[#0c831f] dark:text-emerald-400" />
                Organic Only
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                      active
                        ? 'bg-[#0c831f] text-white font-semibold shadow-xs'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-transparent'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Produce Grid */}
          {filteredProduce.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 p-8 space-y-3 shadow-xs">
              <Package className="w-12 h-12 mx-auto text-slate-400 dark:text-zinc-600" />
              <p className="text-slate-800 dark:text-zinc-200 font-semibold text-base">No produce matched your filters</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Try resetting district filters or search query to browse available Tamil Nadu produce.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedDistrict('all');
                  setSearchQuery('');
                  setOnlyOrganic(false);
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-[#0c831f] text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredProduce.map((item) => {
                const cartQty = getItemCartQuantity(item.id);
                const isMaxLimit = cartQty >= 10;

                return (
                  <div
                    key={item.id}
                    className="group rounded-2xl bg-white dark:bg-[#1c1c20] border border-slate-200/90 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-600/50 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden shadow-xs"
                  >
                    {/* Image & Badges */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-zinc-900">
                      <img
                        id={`produce-card-img-${item.id}`}
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
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 dark:bg-black/80 backdrop-blur-md text-slate-800 dark:text-zinc-200 shadow-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0c831f] dark:text-emerald-400" />
                          {item.id === 'prod_3' || item.name.toLowerCase().includes('mango') ? 'Salem' : item.originDistrict}
                        </span>

                        {item.isOrganic && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0c831f] text-white flex items-center gap-1 shadow-xs">
                            <Leaf className="w-3 h-3" />
                            Organic
                          </span>
                        )}
                      </div>

                      {/* Bottom Image Info */}
                      <div className="absolute bottom-2 left-2.5 right-2.5">
                        <div className="text-xs font-semibold text-emerald-300 drop-shadow-md">
                          {item.id === 'prod_3' || item.name.toLowerCase().includes('mango') ? 'சேலம் மாம்பழம்' : item.tamilName}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 id={`produce-card-title-${item.id}`} className="font-bold text-base text-slate-900 dark:text-zinc-100 leading-snug">
                          {item.id === 'prod_3' || item.name.toLowerCase().includes('mango') ? 'Salem Mango' : item.name}
                        </h3>
                        <p id={`produce-card-desc-${item.id}`} className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-medium">
                          {getFourWordDescription(item)}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                          <span className="flex items-center gap-1 text-slate-700 dark:text-zinc-300 font-medium">
                            <Layers className="w-3.5 h-3.5 text-[#0c831f] dark:text-emerald-400" />
                            {item.fpoName}
                          </span>
                          <span className="font-medium text-slate-600 dark:text-zinc-400">
                            Available: <strong className="text-slate-800 dark:text-zinc-200">{item.availableKg}kg</strong>
                          </span>
                        </div>
                      </div>

                      {/* Price & Add to Cart Controls (Blinkit style) */}
                      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold">Direct Price</div>
                          <div className="text-lg font-bold text-slate-900 dark:text-white">
                            ₹{item.pricePerKg}
                            <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">/kg</span>
                          </div>
                        </div>

                        {/* Consumer 10kg Stepper or Add Button */}
                        {cartQty === 0 ? (
                          <button
                            onClick={() => addToCart(item, 1)}
                            className="px-4 py-2 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            ADD 1kg
                          </button>
                        ) : (
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-zinc-800 p-1 rounded-xl border border-emerald-200 dark:border-zinc-700">
                              <button
                                onClick={() => updateCartQuantity(item.id, cartQty - 1)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 dark:text-zinc-200 hover:bg-emerald-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer font-bold"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center font-bold text-xs text-[#0c831f] dark:text-emerald-400">
                                {cartQty}kg
                              </span>
                              <button
                                disabled={isMaxLimit}
                                onClick={() => updateCartQuantity(item.id, cartQty + 1)}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer font-bold ${
                                  isMaxLimit
                                    ? 'text-slate-300 dark:text-zinc-600 cursor-not-allowed'
                                    : 'text-slate-700 dark:text-zinc-200 hover:bg-emerald-200 dark:hover:bg-zinc-700'
                                }`}
                                title={isMaxLimit ? 'Consumer 10kg limit reached' : 'Add 1kg'}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 font-medium">
                              {isMaxLimit ? 'Max 10kg reached' : `${10 - cartQty}kg left in quota`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Consumer Orders & Live Tracking View */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 flex items-center justify-between shadow-xs">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">Orders &amp; Live Tracking</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Track your farm-to-table produce dispatch across Tamil Nadu logistics corridors.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('catalog')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-800 dark:text-zinc-200 cursor-pointer transition-colors"
            >
              Back to Catalog
            </button>
          </div>

          {consumerOrders.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 p-8 space-y-3 shadow-xs">
              <Clock className="w-12 h-12 mx-auto text-slate-400 dark:text-zinc-600" />
              <p className="text-slate-800 dark:text-zinc-200 font-semibold text-base">No orders placed yet</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Add fresh produce to your basket and complete simulated UI checkout confirmation to test!
              </p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="mt-2 px-4 py-2 rounded-xl bg-[#0c831f] text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {consumerOrders.map((order) => {
                const statusBadges: Record<string, { label: string; color: string }> = {
                  placed: { label: 'Produce Allocated & Verified', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60' },
                  assigned_logistics: { label: 'Logistics Partner Assigned', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800/60' },
                  picked_up_fpo: { label: 'Picked Up from FPO Farm Hub', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60' },
                  in_transit: { label: 'In Transit / Route Corridor', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800/60' },
                  delivered: { label: 'Delivered (Doorstep Handover)', color: 'bg-slate-200 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200 border border-slate-300 dark:border-zinc-700' },
                };

                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#1c1c20] border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-slate-900 dark:text-white">
                            Order #{order.orderNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusBadges[order.status]?.color || 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'
                            }`}
                          >
                            {statusBadges[order.status]?.label || order.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                          Placed on: {new Date(order.createdAt).toLocaleDateString()} at{' '}
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold">Total (UI Confirmed)</div>
                        <div className="text-lg font-bold text-[#0c831f] dark:text-emerald-400">
                          ₹{order.totalAmount}
                        </div>
                      </div>
                    </div>

                    {/* Timeline Steps */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 space-y-2">
                      <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">
                        Live Tracking History
                      </span>
                      <div className="space-y-2.5 text-xs">
                        {(order.trackingHistory || []).map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-[#0c831f] dark:bg-emerald-400 mt-1 shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-800 dark:text-zinc-200">{step.label}</span>
                                <span className="text-[11px] text-slate-400 dark:text-zinc-500">{step.timestamp}</span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-zinc-400">{step.locationNote}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Items Purchased & Delivery Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60">
                        <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-2">
                          Items in Basket ({order.totalWeightKg} kg):
                        </span>
                        <div className="space-y-1.5">
                          {(order.items || []).map((i, idx) => (
                            <div key={i.produceId || idx} className="flex justify-between text-slate-700 dark:text-zinc-300">
                              <span>
                                {i.item?.name || 'Produce Item'} ({i.quantityKg}kg)
                              </span>
                              <span className="font-semibold text-slate-900 dark:text-zinc-100">
                                ₹{(i.item?.pricePerKg || 0) * (i.quantityKg || 1)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60">
                        <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1.5">
                          Delivery Destination:
                        </span>
                        <p className="text-slate-800 dark:text-zinc-200 font-medium">{order.buyerName} &bull; {order.buyerPhone}</p>
                        <p className="text-slate-600 dark:text-zinc-400 mt-0.5">
                          {order.deliveryAddress}, {order.deliveryDistrict} - {order.deliveryPincode}
                        </p>
                        {order.vehicleNumber && (
                          <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-zinc-700 text-purple-700 dark:text-purple-300 flex items-center gap-1.5 text-xs font-medium">
                            <Truck className="w-4 h-4" />
                            Assigned Fleet: {order.logisticsPartnerName} ({order.vehicleNumber})
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
