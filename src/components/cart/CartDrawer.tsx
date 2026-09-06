import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { Order, TAMIL_NADU_DISTRICTS } from '../../types';
import brinjalImg from '../../assets/brinjal.jpg';
import jackfruitImg from '../../assets/jackfruit.jpg';
import tenderCoconutImg from '../../assets/tender_coconut.jpg';
import {
  X,
  Plus,
  Minus,
  Trash2,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Package,
  Building2,
  Info,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onViewOrders: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onViewOrders,
}) => {
  const {
    cart,
    currentRole,
    currentUser,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    checkout,
  } = useMarket();

  // Address states (pre-populated from stored profile)
  const [address, setAddress] = useState(currentUser?.address || 'Plot 42, 2nd Cross, Anna Nagar West');
  const [district, setDistrict] = useState(currentUser?.district || 'Chennai');
  const [pincode, setPincode] = useState(currentUser?.pincode || '600101');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98402 11200');
  const [buyerName, setBuyerName] = useState(
    currentUser?.name || (currentRole === 'bulk_buyer' ? 'Wholesale Commercial Buyer' : 'Verified Consumer')
  );
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Simulated Payment Method
  const [paymentMethod, setPaymentMethod] = useState<
    'Simulated COD / Direct Farmer Remittance' | 'Virtual AgriCredit PO'
  >(
    currentRole === 'bulk_buyer'
      ? 'Virtual AgriCredit PO'
      : 'Simulated COD / Direct Farmer Remittance'
  );

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const { subtotal, totalWeightKg, discount, deliveryFee, total } = getCartTotal();

  const handlePlaceOrder = () => {
    const order = checkout({
      address,
      district,
      pincode,
      phone,
      buyerName,
      paymentMethod,
    });
    if (order) {
      setCompletedOrder(order);
    }
  };

  const handleCloseAndReset = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#18181c] border-l border-slate-200 dark:border-zinc-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#0c831f] dark:text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {currentRole === 'consumer' ? 'Consumer Produce Basket' : 'Bulk Wholesale Cart'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                {currentRole === 'consumer'
                  ? 'Strict 10kg quota per item for direct household freshness'
                  : 'Commercial volume supply (No limits)'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseAndReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Confirmed Screen */}
        {completedOrder ? (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#0c831f] dark:text-emerald-400 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-9 h-9 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#0c831f] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60">
                UI Confirmation Successful
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                Order #{completedOrder.orderNumber} Confirmed
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm">
                Your order has been verified and registered directly into the Tamil Nadu FPO aggregation schedule.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="w-full rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 p-4 text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-zinc-700">
                <span className="text-slate-500 dark:text-zinc-400">Confirmation Token</span>
                <span className="text-[#0c831f] dark:text-emerald-400 font-bold">
                  {completedOrder.paymentConfirmation.referenceId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-zinc-400">Payment Type</span>
                <span className="text-slate-800 dark:text-zinc-200 font-medium">
                  {completedOrder.paymentConfirmation.method} (UI Only)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-zinc-400">Total Produce Weight</span>
                <span className="text-slate-800 dark:text-zinc-200 font-medium">{completedOrder.totalWeightKg} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-zinc-400">Total Invoice Value</span>
                <span className="text-[#0c831f] dark:text-emerald-400 font-bold text-sm">₹{completedOrder.totalAmount}</span>
              </div>
              <div className="flex justify-between items-start pt-1 border-t border-slate-200 dark:border-zinc-700">
                <span className="text-slate-500 dark:text-zinc-400 shrink-0 mr-2">Delivery Address</span>
                <span className="text-slate-800 dark:text-zinc-200 text-right font-medium truncate">
                  {completedOrder.deliveryAddress}, {completedOrder.deliveryDistrict}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 text-xs text-slate-600 dark:text-zinc-300 text-left flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 dark:text-zinc-400 shrink-0 mt-0.5" />
              <span>
                Logistics fleet operators can now see this delivery request in the Logistics Partner Dashboard and dispatch produce directly from the FPO farm hubs.
              </span>
            </div>

            <div className="w-full flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  handleCloseAndReset();
                  onViewOrders();
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                Track Live Shipment Progress
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleCloseAndReset}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-semibold cursor-pointer transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              {/* Role Limit Banner */}
              {currentRole === 'consumer' ? (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#0c831f] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-zinc-100 block">Consumer 10kg Item Limit Active</span>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                      To safeguard household affordability and prevent hoardings, orders are capped at 10kg per produce item.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-zinc-100 block">Wholesale Bulk Buyer Privilege</span>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                      No weight limits. Volume discounts applied (10% off for 100kg+, 15% off for 300kg+).
                    </p>
                  </div>
                </div>
              )}

              {/* Items List */}
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500">
                    <Package className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Your basket is currently empty</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs mx-auto">
                    Browse authentic fresh vegetables and fruits sourced directly from Tamil Nadu FPO farmers.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#0c831f] text-white text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Browse Produce List
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-medium">
                    <span>
                      {cart.length} produce item{cart.length > 1 ? 's' : ''} &bull; {totalWeightKg} kg total
                    </span>
                    <button
                      onClick={clearCart}
                      className="text-slate-500 hover:text-rose-500 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear
                    </button>
                  </div>

                  {cart.map((c) => {
                    const isAtMaxConsumerLimit = currentRole === 'consumer' && c.quantityKg >= 10;
                    return (
                      <div
                        key={c.produceId}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 flex items-center gap-3"
                      >
                        <img
                          src={c.item.id === 'prod_8' ? brinjalImg : c.item.id === 'prod_10' ? jackfruitImg : c.item.id === 'prod_6' ? tenderCoconutImg : c.item.imageUrl}
                          alt={c.item.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            if (c.item.id === 'prod_8') {
                              e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/An_Indian_Purple_Eggplant_%28Brinjal%29.jpg/500px-An_Indian_Purple_Eggplant_%28Brinjal%29.jpg';
                            } else if (c.item.id === 'prod_10') {
                              e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/The_jackfruit_is_holding_on_to_the_tree.jpg/500px-The_jackfruit_is_holding_on_to_the_tree.jpg';
                            } else if (c.item.id === 'prod_6') {
                              e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Tender_coconut_image.jpg/500px-Tender_coconut_image.jpg';
                            } else {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80';
                            }
                          }}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100 dark:bg-zinc-800 shrink-0 border border-slate-200 dark:border-zinc-700"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">
                            {c.item.name}
                          </h4>
                          <p className="text-xs text-[#0c831f] dark:text-emerald-400 truncate font-medium">
                            {c.item.tamilName} &bull; {c.item.originPlace}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                              ₹{c.item.pricePerKg} / kg
                            </span>
                            <span className="text-xs text-slate-500 dark:text-zinc-400">
                              Total: ₹{c.item.pricePerKg * c.quantityKg}
                            </span>
                          </div>

                          {/* 10kg Limit warning tag */}
                          {currentRole === 'consumer' && (
                            <span
                              className={`text-[11px] inline-block mt-1 font-medium ${
                                isAtMaxConsumerLimit
                                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                                  : 'text-slate-500 dark:text-zinc-400'
                              }`}
                            >
                              {c.quantityKg} / 10 kg limit
                            </span>
                          )}
                        </div>

                        {/* Quantity controls */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 p-1 rounded-xl border border-slate-200 dark:border-zinc-700">
                            <button
                              onClick={() => updateCartQuantity(c.produceId, c.quantityKg - 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer font-bold"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                              {c.quantityKg}
                              <span className="text-[10px] font-normal text-slate-500 dark:text-zinc-400">kg</span>
                            </span>
                            <button
                              disabled={isAtMaxConsumerLimit}
                              onClick={() => updateCartQuantity(c.produceId, c.quantityKg + 1)}
                              className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer font-bold ${
                                isAtMaxConsumerLimit
                                  ? 'text-slate-300 dark:text-zinc-600 cursor-not-allowed'
                                  : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700'
                              }`}
                              title={isAtMaxConsumerLimit ? 'Max 10kg limit reached' : 'Add 1kg'}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Quick bulk buttons for bulk buyer */}
                          {currentRole === 'bulk_buyer' && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => updateCartQuantity(c.produceId, c.quantityKg + 50)}
                                className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-[10px] font-semibold text-blue-700 dark:text-blue-300"
                              >
                                +50kg
                              </button>
                              <button
                                onClick={() => updateCartQuantity(c.produceId, c.quantityKg + 100)}
                                className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-[10px] font-semibold text-blue-700 dark:text-blue-300"
                              >
                                +100kg
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Delivery Address Section (Stored & Pre-filled) */}
              {cart.length > 0 && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#1c1c20] border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#0c831f] dark:text-emerald-400" />
                      Delivery Destination (Stored from Account)
                    </span>
                    <button
                      onClick={() => setIsEditingAddress(!isEditingAddress)}
                      className="text-xs text-[#0c831f] dark:text-emerald-400 font-semibold underline cursor-pointer"
                    >
                      {isEditingAddress ? 'Done' : 'Change Address'}
                    </button>
                  </div>

                  {isEditingAddress ? (
                    <div className="space-y-2.5 pt-1">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1">Recipient Name</label>
                        <input
                          type="text"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1">Street Address</label>
                        <textarea
                          rows={2}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1">Tamil Nadu District</label>
                          <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 cursor-pointer"
                          >
                            {TAMIL_NADU_DISTRICTS.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1">Pincode</label>
                          <input
                            type="text"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed bg-slate-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-slate-200 dark:border-zinc-700/60">
                      <p className="font-bold text-slate-900 dark:text-white">{buyerName} &bull; {phone}</p>
                      <p className="text-slate-600 dark:text-zinc-400 mt-0.5">
                        {address}, {district} - {pincode}, Tamil Nadu
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Payment UI Confirmation Notice & Selector */}
              {cart.length > 0 && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#1c1c20] border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                    <ShieldCheck className="w-4 h-4 text-[#0c831f] dark:text-emerald-400" />
                    Payment Confirmation (MVP UI Confirmation)
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300">
                    <span className="font-bold block mb-0.5">
                      &bull; No Payment Gateway Required for MVP
                    </span>
                    Direct UI verification only. Simulates immediate cash-on-delivery settlement or virtual agri-credit authorization.
                  </div>

                  <div className="space-y-2">
                    <label
                      onClick={() => setPaymentMethod('Simulated COD / Direct Farmer Remittance')}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        paymentMethod === 'Simulated COD / Direct Farmer Remittance'
                          ? 'border-[#0c831f] bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-900 dark:text-zinc-100'
                          : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs">
                        <div className="font-semibold text-slate-900 dark:text-zinc-200">Cash on Delivery / Direct Farmer Remittance</div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400">UI verified upon doorstep produce handover</div>
                      </div>
                      <input
                        type="radio"
                        name="payment_opt"
                        checked={paymentMethod === 'Simulated COD / Direct Farmer Remittance'}
                        onChange={() => setPaymentMethod('Simulated COD / Direct Farmer Remittance')}
                        className="accent-[#0c831f]"
                      />
                    </label>

                    <label
                      onClick={() => setPaymentMethod('Virtual AgriCredit PO')}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        paymentMethod === 'Virtual AgriCredit PO'
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-slate-900 dark:text-zinc-100'
                          : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs">
                        <div className="font-semibold text-slate-900 dark:text-zinc-200">Virtual AgriCredit / Purchase Order Token</div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400">Instant digital trade voucher for institutional / bulk order</div>
                      </div>
                      <input
                        type="radio"
                        name="payment_opt"
                        checked={paymentMethod === 'Virtual AgriCredit PO'}
                        onChange={() => setPaymentMethod('Virtual AgriCredit PO')}
                        className="accent-blue-600"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Checkout Action & Price Breakdown */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                    <span>Produce Subtotal ({totalWeightKg} kg)</span>
                    <span className="text-slate-900 dark:text-zinc-200 font-medium">₹{subtotal}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-amber-600 dark:text-amber-400 font-medium">
                      <span>Wholesale Volume Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                    <span>Cold-Chain Logistics / Dispatch</span>
                    <span className="text-slate-900 dark:text-zinc-200 font-medium">₹{deliveryFee}</span>
                  </div>

                  <div className="flex justify-between text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-zinc-700 font-bold">
                    <span>Total Amount (UI Confirmed)</span>
                    <span className="text-[#0c831f] dark:text-emerald-400 text-lg">₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Place Order &bull; UI Confirm (₹{total})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
