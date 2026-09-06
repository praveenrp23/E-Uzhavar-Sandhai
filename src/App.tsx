import React, { useState } from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Header } from './components/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { ConsumerDashboard } from './components/consumer/ConsumerDashboard';
import { BulkBuyerDashboard } from './components/bulk/BulkBuyerDashboard';
import { FpoDashboard } from './components/fpo/FpoDashboard';
import { LogisticsDashboard } from './components/logistics/LogisticsDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LandingHome } from './components/home/LandingHome';
import { ThemeToggle } from './components/common/ThemeToggle';
import { ApiDatabaseStatusModal } from './components/common/ApiDatabaseStatusModal';
import { UserRole } from './types';
import { ShoppingBag, ShieldCheck, Heart, Database } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentRole, currentUser, refreshData } = useMarket();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isApiStatusOpen, setIsApiStatusOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog');
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    role?: UserRole;
    mode?: 'login' | 'signup';
  }>({
    isOpen: false,
    role: 'consumer',
    mode: 'login',
  });

  const handleOpenAuth = (role: UserRole = currentRole, mode: 'login' | 'signup' = 'login') => {
    setAuthModal({
      isOpen: true,
      role,
      mode,
    });
  };

  const handleCloseAuth = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8] dark:bg-[#111215] text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Header */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={handleOpenAuth}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiStatus={() => setIsApiStatusOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {!currentUser ? (
          <LandingHome onOpenAuth={handleOpenAuth} />
        ) : (
          <>
            {currentRole === 'consumer' && (
              <ConsumerDashboard
                onOpenCart={() => setIsCartOpen(true)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}

            {currentRole === 'bulk_buyer' && (
              <BulkBuyerDashboard
                onOpenCart={() => setIsCartOpen(true)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}

            {currentRole === 'fpo' && <FpoDashboard />}

            {currentRole === 'logistics' && <LogisticsDashboard />}

            {currentRole === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* Modern Blinkit/Zomato Style Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#18181c] py-8 px-4 sm:px-6 mt-12 text-xs text-slate-500 dark:text-zinc-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm shrink-0 border border-emerald-500/30">
                <img
                  src="/farmer_logo.svg"
                  alt="E-Uzhavar Sandhai Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    E-Uzhavar Sandhai
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    Tamil Nadu
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Connecting Tamil Nadu Farmers &amp; FPOs directly to Consumers and Bulk Buyers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-zinc-300">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> 100% Direct Farm Fresh
              </span>
              <span>&bull;</span>
              <span>No Middlemen Fees</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 dark:text-zinc-500">
            <div>
              &copy; {new Date().getFullYear()} E-Uzhavar Sandhai &bull; Digital Farmers Market Initiative, Tamil Nadu.
            </div>
            <div className="flex items-center gap-2">
              <span>Fresh produce delivered direct from FPO clusters</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onViewOrders={() => {
          setIsCartOpen(false);
          setActiveTab('orders');
        }}
      />

      {/* Dedicated Role Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={handleCloseAuth}
        initialRole={authModal.role}
        initialMode={authModal.mode}
      />

      {/* Real-time Full-Stack Database & REST API Diagnostics Modal */}
      <ApiDatabaseStatusModal
        isOpen={isApiStatusOpen}
        onClose={() => setIsApiStatusOpen(false)}
        onRefreshData={refreshData}
      />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Floating Theme Toggle (Light & Dark Mode) */}
      <ThemeToggle />
    </div>
  );
};

export default function App() {
  return (
    <MarketProvider>
      <MainLayout />
    </MarketProvider>
  );
}
