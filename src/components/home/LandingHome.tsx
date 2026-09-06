import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { UserRole } from '../../types';
import tenderCoconutImg from '../../assets/tender_coconut.jpg';
import brinjalImg from '../../assets/brinjal.jpg';
import jackfruitImg from '../../assets/jackfruit.jpg';
import {
  ShoppingBag,
  Building2,
  Layers,
  Truck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  Clock,
  MapPin,
  Leaf,
  HeartHandshake,
  LogIn,
  UserPlus,
  Zap,
  Award,
  ChevronRight,
} from 'lucide-react';

interface LandingHomeProps {
  onOpenAuth: (role?: UserRole, mode?: 'login' | 'signup') => void;
}

export const LandingHome: React.FC<LandingHomeProps> = ({ onOpenAuth }) => {
  const { produceList, showToast } = useMarket();
  const [activeTab, setActiveTab] = useState<'all' | 'consumer' | 'bulk' | 'fpo' | 'logistics'>('all');

  const liveFeeds = [
    { text: 'Harvested 45 mins ago: 400kg Pollachi Green Tender Coconuts dispatched to Coimbatore', district: 'Coimbatore', tag: 'Fresh Dispatch' },
    { text: 'Oddanchatram Red Shallots benchmark rate pegged at ₹58/kg (30% below retail store prices)', district: 'Dindigul', tag: 'Fair Price' },
    { text: 'Ooty Mountain Dew-Washed Carrots Grade A certified by Nilgiris Horticulture Society', district: 'Nilgiris', tag: 'GI Quality' },
    { text: 'Theni Banana Farmers Collective completed ₹1.4L direct digital payout with zero commission', district: 'Theni', tag: 'Farmer Payout' },
    { text: 'Thanjavur Delta Keerai morning cut packed in eco-ventilated crates for Trichy doorstep run', district: 'Thanjavur', tag: 'Same-Day Delivery' },
  ];

  const showcaseProduce = produceList.slice(0, 6);

  const rolesConfig = [
    {
      role: 'consumer' as UserRole,
      title: 'Consumers & Households',
      tamil: 'இல்லத்தரசிகள் & பொதுமக்கள்',
      icon: <ShoppingBag className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      tag: 'Fresh Kitchen Basket',
      color: 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
      desc: 'Order fresh farm-picked vegetables, fruits and Kaveri delta greens directly from local FPO hubs straight to your home doorstep.',
      bullets: [
        'Max 10kg quota per item ensures equal consumer access',
        'Morning harvested, zero cold-storage stagnation',
        'Fair farm-gate prices (save 20–30% vs retail marts)',
        'Full origin traceability down to the grower district',
      ],
      ctaText: 'Shop as Consumer',
    },
    {
      role: 'bulk_buyer' as UserRole,
      title: 'Commercial Bulk Buyers',
      tamil: 'மொத்த கொள்முதல் & உணவகங்கள்',
      icon: <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      tag: 'B2B Wholesale Procurement',
      color: 'border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-950/20',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
      desc: 'Sourcing solution for restaurants, hotels, hostels, caterers, and supermarkets. Buy directly in 50kg–1000kg agricultural lots.',
      bullets: [
        'Tiered volume discounts: 10% off >100kg, 15% off >300kg',
        'Official GST invoices with verified farm origin certificates',
        'Dedicated freight logistics with tamper-evident lot tracking',
        'No broker commissions or hidden mandi terminal fees',
      ],
      ctaText: 'Procure Bulk Produce',
    },
    {
      role: 'fpo' as UserRole,
      title: 'FPO & Farmer Collectives',
      tamil: 'உழவர் உற்பத்தியாளர் நிறுவனங்கள்',
      icon: <Layers className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      tag: 'Direct Market Access',
      color: 'border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
      desc: 'Empowering 140+ registered Farmer Producer Organizations across Tamil Nadu to list harvests and reach urban buyers directly.',
      bullets: [
        'Instant produce listing with APMC benchmark pricing guidance',
        '100% farm-gate realization directly into collective accounts',
        'Eliminate 3 to 5 layers of commission agents & aggregators',
        'Real-time demand visibility across all 38 districts',
      ],
      ctaText: 'FPO Farm Portal',
    },
    {
      role: 'logistics' as UserRole,
      title: 'Logistics Fleet Partners',
      tamil: 'போக்குவரத்து & விநியோகம்',
      icon: <Truck className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      tag: 'Kaveri Green Fleet',
      color: 'border-purple-200 dark:border-purple-800/60 bg-purple-50/50 dark:bg-purple-950/20',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300',
      desc: 'Accept dispatch requests from rural FPO farm clusters and execute doorstep deliveries across Tamil Nadu highway transit corridors.',
      bullets: [
        'Dedicated dispatch orders with pickup and drop GPS routes',
        'Optimized multi-hub loading for agricultural freshness',
        'Verified delivery confirmation with digital transit tokens',
        'Integrated fleet performance & mileage compensation',
      ],
      ctaText: 'Logistics Dispatch',
    },
  ];

  const filteredRoles = activeTab === 'all'
    ? rolesConfig
    : rolesConfig.filter((r) => r.role === activeTab);

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-300">
      {/* 1. Live Active Agricultural Ticker */}
      <div className="bg-gradient-to-r from-emerald-700 via-[#0c831f] to-teal-800 text-white rounded-2xl p-3 sm:p-4 shadow-lg shadow-emerald-900/10 flex flex-col md:flex-row items-center justify-between gap-3 overflow-hidden">
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-200"></span>
          </span>
          <span className="font-bold text-xs uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-md text-emerald-100">
            Live TN Farm Activity
          </span>
        </div>

        <div className="flex-1 w-full overflow-x-auto text-xs text-emerald-50 flex items-center gap-6 scrollbar-none">
          {liveFeeds.map((feed, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/20 text-white">
                {feed.district}
              </span>
              <span>{feed.text}</span>
              {idx < liveFeeds.length - 1 && <span className="text-emerald-300/40">&bull;</span>}
            </div>
          ))}
        </div>

        <div className="shrink-0 hidden lg:flex items-center gap-2 text-[11px] text-emerald-100 bg-white/10 px-2.5 py-1 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          <span>Dawn Harvest Cycle Active</span>
        </div>
      </div>

      {/* 2. Vibrant Hero Section with Login/Register Action Center */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50/30 dark:from-[#151c16] dark:via-[#18181c] dark:to-[#1a1712] border border-emerald-200/80 dark:border-zinc-800 p-6 sm:p-10 shadow-xl">
        {/* Subtle decorative background circles */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mission & About Website */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Government of Tamil Nadu &bull; Farmers Direct Digital Marketplace</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Fresh From Tamil Nadu Farms{' '}
                <span className="text-[#0c831f] dark:text-emerald-400 block sm:inline">
                  Direct to Your Doorstep.
                </span>
              </h1>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400 mt-1">
                தமிழ்நாடு உழவர் சந்தை &bull; இடைத்தரகர்கள் இல்லாத நேரடி மின்னணு சந்தை
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
              <strong>E-Uzhavar Sandhai</strong> bridges Tamil Nadu’s 140+ registered Farmer Producer Organizations (FPOs) directly with kitchen consumers and bulk commercial buyers. We eliminate commission brokers, guaranteeing fair farm-gate revenue to rural growers while delivering morning-harvested produce in just hours.
            </p>

            {/* Value Checkpoints */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>0% Middleman Commission</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Daily APMC Fair Pricing</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>38 Districts Connected</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Dawn Harvest Freshness</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Wholesale &amp; Retail Portals</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Direct Farmer Bank Remittance</span>
              </div>
            </div>

            {/* Role Login Access */}
            <div className="pt-2 border-t border-slate-200 dark:border-zinc-800">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onOpenAuth('consumer', 'login')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-xs font-semibold cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                  title="Sign in as Consumer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#0c831f]" />
                  <span>Consumer</span>
                </button>

                <button
                  onClick={() => onOpenAuth('bulk_buyer', 'login')}
                  className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/80 dark:hover:bg-blue-900 text-blue-900 dark:text-blue-200 text-xs font-semibold cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                  title="Sign in as Bulk Buyer"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Bulk Buyer</span>
                </button>

                <button
                  onClick={() => onOpenAuth('fpo', 'login')}
                  className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 text-xs font-semibold cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                  title="Sign in as FPO Collective"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>FPO Collective</span>
                </button>

                <button
                  onClick={() => onOpenAuth('logistics', 'login')}
                  className="px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/80 dark:hover:bg-purple-900 text-purple-900 dark:text-purple-200 text-xs font-semibold cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                  title="Sign in as Logistics Partner"
                >
                  <Truck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Logistics Partner</span>
                </button>

                <button
                  onClick={() => onOpenAuth('admin', 'login')}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-semibold cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                  title="Sign in as State Admin"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>State Admin</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dedicated Login / Register Action Center */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#1f1f24] rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-2xl p-6 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#0c831f] text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/30">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Welcome to E-Uzhavar Sandhai
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Sign in or create your free account to access daily fresh farm harvests, wholesale catalogs, or FPO listings.
                </p>
              </div>

              {/* Primary Dual Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => onOpenAuth('consumer', 'login')}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-bold text-sm shadow-md shadow-emerald-700/20 cursor-pointer transition-all hover:scale-[1.01] active:scale-95"
                  id="landing-signin-btn"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Your Account</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => onOpenAuth('consumer', 'signup')}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border-2 border-slate-300 dark:border-zinc-600 hover:border-[#0c831f] dark:hover:border-emerald-500 bg-slate-50 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-bold text-sm cursor-pointer transition-all hover:scale-[1.01] active:scale-95"
                  id="landing-register-btn"
                >
                  <UserPlus className="w-4 h-4 text-[#0c831f] dark:text-emerald-400" />
                  <span>Create New Account / Register</span>
                </button>
              </div>

              {/* Role Select Quick Launch */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-2.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block text-center">
                  Or Sign In by User Category:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenAuth('consumer', 'login')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-left text-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-zinc-200 leading-tight">Household</div>
                      <div className="text-[10px] text-slate-500">Max 10kg quota</div>
                    </div>
                  </button>

                  <button
                    onClick={() => onOpenAuth('bulk_buyer', 'login')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-left text-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-zinc-200 leading-tight">Bulk Buyer</div>
                      <div className="text-[10px] text-slate-500">50kg+ lots</div>
                    </div>
                  </button>

                  <button
                    onClick={() => onOpenAuth('fpo', 'login')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 text-left text-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-zinc-200 leading-tight">FPO Hub</div>
                      <div className="text-[10px] text-slate-500">List harvests</div>
                    </div>
                  </button>

                  <button
                    onClick={() => onOpenAuth('logistics', 'login')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 text-left text-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Truck className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-zinc-200 leading-tight">Logistics</div>
                      <div className="text-[10px] text-slate-500">Fleet transit</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="pt-2 text-center text-[11px] text-slate-500 dark:text-zinc-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Verified by Tamil Nadu Agricultural Marketing Department</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Key Impact Numbers (Active Stats) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-[#18181c] p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-[#0c831f] dark:text-emerald-400">
            38
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            Tamil Nadu Districts
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            Kaveri delta to Nilgiri mountain chains
          </p>
        </div>

        <div className="bg-white dark:bg-[#18181c] p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
            140+
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            Registered FPOs
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            Farmer collectives with direct trade linkage
          </p>
        </div>

        <div className="bg-white dark:bg-[#18181c] p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400">
            0%
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            Intermediary Cut
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            100% farm-gate realization to growers
          </p>
        </div>

        <div className="bg-white dark:bg-[#18181c] p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400">
            ₹4.8 Cr+
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            Direct Farmer Earnings
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            Remitted with zero middleman deductions
          </p>
        </div>
      </div>

      {/* 4. Live Produce Catalog Preview (Vibrant Grid) */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0c831f] dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Leaf className="w-4 h-4" />
              <span>Today's Morning Harvest Catalog</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Direct From Tamil Nadu Soil
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Compare direct farm-gate prices vs typical retail supermarket prices.
            </p>
          </div>

          <button
            onClick={() => onOpenAuth('consumer', 'login')}
            className="flex items-center gap-1 text-xs font-bold text-[#0c831f] dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <span>Sign in to view all items</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {showcaseProduce.map((item) => {
            const retailPrice = Math.round(item.pricePerKg * 1.35);
            return (
              <div
                key={item.id}
                onClick={() => onOpenAuth('consumer', 'login')}
                className="group bg-white dark:bg-[#18181c] rounded-2xl border border-slate-200/90 dark:border-zinc-800/80 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                  <img
                    src={
                      item.id === 'prod_6'
                        ? tenderCoconutImg
                        : item.id === 'prod_8'
                        ? brinjalImg
                        : item.id === 'prod_10'
                        ? jackfruitImg
                        : item.imageUrl
                    }
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {item.originDistrict}
                  </div>
                  {item.isOrganic && (
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                      ORGANIC
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-zinc-100 line-clamp-1 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium line-clamp-1">
                      {item.tamilName}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-baseline justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-[#0c831f] dark:text-emerald-400">
                        ₹{item.pricePerKg}
                        <span className="text-[10px] font-normal text-slate-500 dark:text-zinc-400">/kg</span>
                      </div>
                      <div className="text-[10px] text-slate-400 line-through">
                        ₹{retailPrice}/kg
                      </div>
                    </div>

                    <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                      Save 35%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Deep Dive into User Roles / Portals */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Tailored Portals for Every Participant
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Select your role to sign in or register with specialized portal tools.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-zinc-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              All Portals
            </button>
            <button
              onClick={() => setActiveTab('consumer')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'consumer'
                  ? 'bg-white dark:bg-zinc-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              Household
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'bulk'
                  ? 'bg-white dark:bg-zinc-700 text-blue-700 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              Bulk Buyer
            </button>
            <button
              onClick={() => setActiveTab('fpo')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'fpo'
                  ? 'bg-white dark:bg-zinc-700 text-amber-700 dark:text-amber-300 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              FPO Collective
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRoles.map((r) => (
            <div
              key={r.role}
              className={`rounded-2xl border p-6 flex flex-col justify-between shadow-xs transition-all hover:shadow-md ${r.color}`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 shadow-xs flex items-center justify-center">
                      {r.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {r.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">{r.tamil}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${r.badgeColor}`}>
                    {r.tag}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  {r.desc}
                </p>

                <ul className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-zinc-700/60">
                  {r.bullets.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0c831f] dark:text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-4 flex items-center gap-3">
                <button
                  onClick={() => onOpenAuth(r.role, 'login')}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login to {r.title.split(' ')[0]}</span>
                </button>

                <button
                  onClick={() => onOpenAuth(r.role, 'signup')}
                  className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white hover:bg-slate-50 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-all cursor-pointer"
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
