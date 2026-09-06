import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { UserRole } from '../types';
import {
  ShoppingBag,
  MapPin,
  Truck,
  Building2,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Layers,
  Database,
} from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAuth: (initialRole?: UserRole, initialMode?: 'login' | 'signup') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenApiStatus?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenAuth,
  activeTab,
  setActiveTab,
  onOpenApiStatus,
}) => {
  const {
    currentUser,
    currentRole,
    logout,
    cart,
    getCartTotal,
  } = useMarket();

  const [showUserMenu, setShowUserMenu] = useState(false);

  const { totalWeightKg } = getCartTotal();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantityKg, 0);

  const roleMeta: Record<
    UserRole,
    { label: string; tag: string; icon: React.ReactNode; color: string; badge: string }
  > = {
    consumer: {
      label: 'Consumer',
      tag: 'Household Fresh (Max 10kg/item)',
      icon: <ShoppingBag className="w-4 h-4 text-[#0c831f] dark:text-emerald-400" />,
      color: 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    },
    bulk_buyer: {
      label: 'Bulk Buyer',
      tag: 'Wholesale & Commercial (No Limits)',
      icon: <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      color: 'text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
    },
    fpo: {
      label: 'FPO Collective',
      tag: 'Farmer Hub & Tamil Nadu Produce',
      icon: <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      color: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    },
    logistics: {
      label: 'Logistics Partner',
      tag: 'Delivery Fleet & Dispatches',
      icon: <Truck className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      color: 'text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40',
      badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300',
    },
    admin: {
      label: 'State Admin',
      tag: 'Combined Government Oversight',
      icon: <ShieldCheck className="w-4 h-4 text-slate-700 dark:text-slate-300" />,
      color: 'text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700',
      badge: 'bg-slate-200 text-slate-800 dark:bg-zinc-700 dark:text-zinc-200',
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#18181c]/95 border-b border-slate-200/90 dark:border-zinc-800/80 backdrop-blur-md transition-colors duration-200 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab(currentRole === 'consumer' || currentRole === 'bulk_buyer' ? 'catalog' : 'overview')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform shrink-0 border border-emerald-500/30">
              <img
                src="/farmer_logo.svg"
                alt="E-Uzhavar Sandhai Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                  E-Uzhavar
                </span>
                <span className="font-bold text-lg sm:text-xl tracking-tight text-[#0c831f] dark:text-emerald-400 leading-none">
                  Sandhai
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 hidden sm:block leading-tight mt-0.5">
                Tamil Nadu Farmers Direct Digital Marketplace
              </p>
            </div>
          </button>
        </div>

        {/* Center: Address Bar (if user logged in & has address) */}
        {currentUser?.address && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/60 text-xs text-slate-700 dark:text-zinc-300 max-w-xs">
            <MapPin className="w-4 h-4 text-[#0c831f] dark:text-emerald-400 shrink-0" />
            <div className="truncate text-left">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-semibold uppercase tracking-wider">
                {currentRole === 'fpo' ? 'FPO Hub' : 'Delivery Address'}
              </span>
              <span className="truncate block font-medium text-slate-800 dark:text-zinc-200">
                {currentUser.district || 'Tamil Nadu'}: {currentUser.address}
              </span>
            </div>
          </div>
        )}

        {/* Right Actions: Cart, Role Changer, DB Status, User Menu / Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Live Full-Stack API & DB Status Pill (Restricted to Admin login only) */}
          {onOpenApiStatus && currentUser?.role === 'admin' && (
            <button
              id="admin-api-db-status-btn"
              onClick={onOpenApiStatus}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80 text-xs font-semibold cursor-pointer transition-all shadow-2xs active:scale-95"
              title="Admin: View REST API & Database Diagnostics"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="hidden sm:inline text-[11px]">API &amp; DB Live</span>
            </button>
          )}

          {/* Cart Pill for Consumer and Bulk Buyer (Blinkit style) */}
          {currentUser && (currentRole === 'consumer' || currentRole === 'bulk_buyer') && (
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-semibold text-xs sm:text-sm cursor-pointer transition-all shadow-sm active:scale-95"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-white shrink-0" />
              <div className="text-left hidden sm:block leading-tight">
                <span className="text-[11px] block font-medium text-emerald-100">
                  {currentRole === 'consumer' ? 'My Basket' : 'Bulk Cart'}
                </span>
                <span className="text-xs font-bold">
                  {cart.length > 0 ? `${cart.length} items (${totalWeightKg}kg)` : 'Empty'}
                </span>
              </div>
              {cart.length > 0 && (
                <span className="sm:hidden px-1.5 py-0.5 rounded-full bg-white text-[#0c831f] font-bold text-xs">
                  {cart.length}
                </span>
              )}
            </button>
          )}

          {/* Active Role Indicator - Non-changeable after login */}
          {currentUser && (
            <div
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-xs font-semibold ${roleMeta[currentRole].color} shadow-2xs select-none`}
              id="header-role-badge"
              title={`Active role: ${roleMeta[currentRole].label}`}
            >
              <span className="shrink-0">{roleMeta[currentRole].icon}</span>
              <span className="hidden md:inline font-semibold">
                {roleMeta[currentRole].label}
              </span>
            </div>
          )}

          {/* User Account Controls */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 border border-slate-200 dark:border-zinc-700 text-xs cursor-pointer transition-all"
                id="header-user-menu-btn"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${currentUser.avatarColor || 'bg-[#0c831f]'} text-white font-bold flex items-center justify-center text-xs shadow-xs`}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-slate-900 dark:text-zinc-100 font-semibold text-xs leading-tight truncate max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                    {roleMeta[currentRole].label}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#1c1c20] border border-slate-200 dark:border-zinc-700 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="pb-2.5 mb-2.5 border-b border-slate-100 dark:border-zinc-800">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{currentUser.name}</div>
                    <div className="text-xs text-slate-500 dark:text-zinc-400 truncate">{currentUser.email}</div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-[#0c831f] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                        {roleMeta[currentRole].label}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                        &bull; {currentUser.district || 'Tamil Nadu'}
                      </span>
                    </div>
                  </div>

                  {currentUser.address && (
                    <div className="text-xs text-slate-700 dark:text-zinc-300 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 mb-2.5">
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider block mb-0.5">
                        Stored Address:
                      </span>
                      <p className="text-xs leading-relaxed font-medium">
                        {currentUser.address}, {currentUser.district} - {currentUser.pincode}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition-colors"
                      id="header-signout-btn"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth(currentRole, 'login')}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-800 dark:text-zinc-200 cursor-pointer transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth(currentRole, 'signup')}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
