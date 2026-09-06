import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import {
  Truck,
  MapPin,
  Package,
  CheckCircle2,
  ShieldCheck,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const LogisticsDashboard: React.FC = () => {
  const {
    orders,
    acceptDelivery,
    updateDeliveryStatus,
    currentUser,
  } = useMarket();

  const [activeSubTab, setActiveSubTab] = useState<'available' | 'active' | 'completed'>('available');

  // Available requests: status === 'placed'
  const availableRequests = orders.filter((o) => o.status === 'placed');

  // Active shipments: assigned to this partner or any active non-delivered
  const activeShipments = orders.filter(
    (o) => o.status !== 'placed' && o.status !== 'delivered'
  );

  // Completed shipments
  const completedShipments = orders.filter((o) => o.status === 'delivered');

  const totalCargoHandledKg = orders
    .filter((o) => o.status !== 'placed')
    .reduce((sum, o) => sum + o.totalWeightKg, 0);

  return (
    <div className="space-y-6">
      {/* Logistics Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-amber-500/5 to-purple-500/10 dark:from-emerald-950/30 dark:via-zinc-900/60 dark:to-purple-950/20 border border-emerald-200/80 dark:border-zinc-800 p-5 sm:p-7 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0c831f] text-white flex items-center gap-1.5 shadow-xs">
              <Truck className="w-3.5 h-3.5" />
              Logistics &amp; Fleet Partner
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60">
              {currentUser?.logisticsCompany || 'Kaveri Green Agri-Logistics Fleet'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
            Accept &amp; Fulfill Regional Transit Shipments
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            Connect directly with FPO aggregation farm centers across Tamil Nadu to collect verified fruits and vegetables, transport along cold-chain corridors, and deliver to Consumers and Bulk Wholesalers.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300 font-medium">
              <Truck className="w-4 h-4 text-[#0c831f] dark:text-emerald-400" />
              Vehicle: <strong className="text-slate-900 dark:text-white">{currentUser?.vehicleType || 'Tata Ace 1.5T Reefer'}</strong>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300 font-medium">
              Reg Number: <strong className="text-slate-900 dark:text-white">{currentUser?.vehicleNumber || 'TN-57-AZ-4820'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
            <span>Available Requests</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {availableRequests.length} <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">Shipments</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Ready for pickup</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
            <span>In Transit</span>
            <Truck className="w-4 h-4 text-[#0c831f] dark:text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {activeShipments.length} <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">Dispatches</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">On highway routes</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
            <span>Total Hauled</span>
            <CheckCircle2 className="w-4 h-4 text-[#0c831f] dark:text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {totalCargoHandledKg} <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">kg</span>
          </div>
          <div className="text-xs text-[#0c831f] dark:text-emerald-400 mt-0.5 font-semibold">{(totalCargoHandledKg / 1000).toFixed(2)} Tonnes</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
            <span>Completed Trips</span>
            <Sparkles className="w-4 h-4 text-[#0c831f] dark:text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#0c831f] dark:text-emerald-400 mt-1">
            {completedShipments.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">UI Confirmed Handover</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3">
        <button
          onClick={() => setActiveSubTab('available')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'available'
              ? 'bg-[#0c831f] text-white shadow-sm'
              : 'bg-white dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700'
          }`}
        >
          Available Requests
          {availableRequests.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeSubTab === 'available' ? 'bg-white text-[#0c831f]' : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200'}`}>
              {availableRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('active')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'active'
              ? 'bg-[#0c831f] text-white shadow-sm'
              : 'bg-white dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700'
          }`}
        >
          Active Dispatches ({activeShipments.length})
        </button>

        <button
          onClick={() => setActiveSubTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeSubTab === 'completed'
              ? 'bg-[#0c831f] text-white shadow-sm'
              : 'bg-white dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700'
          }`}
        >
          Completed Trips ({completedShipments.length})
        </button>
      </div>

      {/* Available Requests Board */}
      {activeSubTab === 'available' && (
        <div className="space-y-4">
          {availableRequests.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 p-8 space-y-3 shadow-xs">
              <Package className="w-12 h-12 mx-auto text-slate-400 dark:text-zinc-600" />
              <p className="text-slate-900 dark:text-zinc-100 font-bold text-base">No new delivery requests awaiting dispatch</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                New delivery orders placed by Consumers or Bulk Buyers will appear here for fleet pickup.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {availableRequests.map((order) => {
                const fpoHubOrigins = Array.from(
                  new Set((order.items || []).map((i) => i.item?.originPlace || `${i.item?.originDistrict || 'Tamil Nadu'} Hub`))
                ).join(', ');

                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#1c1c20] border border-slate-200/90 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-600/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-slate-900 dark:text-white">
                            #{order.orderNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              order.buyerType === 'bulk_buyer'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800/60'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60'
                            }`}
                          >
                            {order.buyerType === 'bulk_buyer' ? 'Bulk Buyer Shipment' : 'Consumer Basket'}
                          </span>
                        </div>
                        <span className="font-bold text-xs text-slate-800 dark:text-zinc-200">
                          Cargo: {order.totalWeightKg} kg
                        </span>
                      </div>

                      {/* Route Path */}
                      <div className="mt-3 space-y-3 text-xs">
                        {/* Pickup */}
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#0c831f] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shrink-0 mt-0.5">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold block">
                              Pickup FPO Aggregation Hubs (Tamil Nadu)
                            </span>
                            <span className="text-slate-800 dark:text-zinc-200 font-medium">{fpoHubOrigins}</span>
                          </div>
                        </div>

                        {/* Dropoff */}
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold block">
                              Dropoff Destination
                            </span>
                            <span className="text-slate-800 dark:text-zinc-200 font-medium">
                              {order.deliveryAddress}, {order.deliveryDistrict} - {order.deliveryPincode}
                            </span>
                            <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                              Recipient: {order.buyerName} &bull; {order.buyerPhone}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Produce Manifest Summary */}
                      <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 text-xs text-slate-700 dark:text-zinc-300">
                        <span className="text-slate-500 dark:text-zinc-400 block mb-1.5 font-semibold text-[11px] uppercase">Produce in Manifest:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(order.items || []).map((i, idx) => (
                            <span key={i.produceId || idx} className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 text-slate-800 dark:text-zinc-200 font-medium text-xs">
                              {i.item?.name || 'Produce Item'} ({i.quantityKg}kg)
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Payment Notice */}
                      <div className="mt-2.5 flex items-center justify-between text-xs pt-1">
                        <span className="flex items-center gap-1 text-[#0c831f] dark:text-emerald-400 font-medium">
                          <ShieldCheck className="w-4 h-4" />
                          Payment: {order.paymentConfirmation.status} (MVP Simulated)
                        </span>
                        <span className="text-slate-900 dark:text-zinc-100 font-semibold">
                          Delivery Fee: ₹{order.deliveryFee}
                        </span>
                      </div>
                    </div>

                    {/* Accept Request Action */}
                    <button
                      onClick={() => acceptDelivery(order.id, currentUser?.vehicleNumber)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Truck className="w-4 h-4" />
                      Accept Delivery &bull; Assign Fleet
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Active Dispatches Board with Status Updates */}
      {activeSubTab === 'active' && (
        <div className="space-y-4">
          {activeShipments.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 p-8 space-y-3 shadow-xs">
              <Truck className="w-12 h-12 mx-auto text-slate-400 dark:text-zinc-600" />
              <p className="text-slate-900 dark:text-zinc-100 font-bold text-base">No shipments currently in transit</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Go to "Available Requests" and click Accept to start a delivery trip.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeShipments.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#1c1c20] border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-900 dark:text-white">
                          Shipment #{order.orderNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 uppercase">
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                        Cargo: {order.totalWeightKg} kg &bull; Destination: {order.deliveryDistrict}
                      </div>
                    </div>

                    <div className="text-xs font-medium text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-zinc-700">
                      Fleet: {order.vehicleNumber || currentUser?.vehicleNumber || 'TN-57-AZ-4820'}
                    </div>
                  </div>

                  {/* Route & Recipient */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-zinc-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-700/60">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold block">Dropoff Address:</span>
                      <p className="text-slate-800 dark:text-zinc-200 font-medium">{order.deliveryAddress}, {order.deliveryDistrict}</p>
                      <p className="text-slate-500 dark:text-zinc-400 mt-0.5">{order.buyerName} &bull; {order.buyerPhone}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold block">Payment Status:</span>
                      <p className="text-[#0c831f] dark:text-emerald-400 font-semibold">{order.paymentConfirmation.status} &bull; {order.paymentConfirmation.referenceId}</p>
                      <p className="text-slate-500 dark:text-zinc-400 mt-0.5">
                        Method: {order.paymentConfirmation.method} (Doorstep UI Confirmed)
                      </p>
                    </div>
                  </div>

                  {/* Step-by-Step Status Controls */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">
                      Advance Logistics Dispatch Milestone:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        onClick={() =>
                          updateDeliveryStatus(
                            order.id,
                            'picked_up_fpo',
                            `Produce crates loaded into vehicle ${currentUser?.vehicleNumber || 'TN-57-AZ-4820'} at FPO collection center`
                          )
                        }
                        disabled={order.status === 'picked_up_fpo' || order.status === 'in_transit'}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                          order.status === 'picked_up_fpo'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-[#0c831f] dark:text-emerald-300'
                            : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>1. Picked Up from FPO</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          updateDeliveryStatus(
                            order.id,
                            'in_transit',
                            `Vehicle moving along Tamil Nadu highway corridor towards ${order.deliveryDistrict}`
                          )
                        }
                        disabled={order.status === 'in_transit'}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                          order.status === 'in_transit'
                            ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                            : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>2. In Transit / Out for Delivery</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          updateDeliveryStatus(
                            order.id,
                            'delivered',
                            `Successfully handed over at destination. Doorstep recipient confirmed.`
                          )
                        }
                        className="p-3 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-[#0c831f] dark:text-emerald-300 text-xs font-bold flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span>3. Mark as Delivered (UI Done)</span>
                        <CheckCircle2 className="w-4 h-4 text-[#0c831f] dark:text-emerald-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completed Board */}
      {activeSubTab === 'completed' && (
        <div className="space-y-3">
          {completedShipments.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 p-8 space-y-3 shadow-xs">
              <CheckCircle2 className="w-12 h-12 mx-auto text-slate-400 dark:text-zinc-600" />
              <p className="text-slate-900 dark:text-zinc-100 font-bold text-base">No completed trips yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedShipments.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#1c1c20] border border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Order #{order.orderNumber}</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60">
                        Delivered
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-zinc-400 mt-0.5">
                      Destination: {order.deliveryAddress}, {order.deliveryDistrict} &bull; Cargo: {order.totalWeightKg} kg
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[#0c831f] dark:text-emerald-400 font-bold text-base">₹{order.totalAmount}</span>
                    <div className="text-[10px] text-slate-400 dark:text-zinc-500">UI Confirmed Handover</div>
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
