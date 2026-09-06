import React, { useState, useEffect } from 'react';
import { useMarket } from '../../context/MarketContext';
import { UserRole, TAMIL_NADU_DISTRICTS } from '../../types';
import {
  X,
  ShoppingBag,
  Building2,
  Layers,
  Truck,
  ShieldCheck,
  Check,
  Sparkles,
  MapPin,
  Lock,
  Mail,
  User,
  Phone,
  Hash,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'consumer',
  initialMode = 'login',
}) => {
  const { login, signup, users } = useMarket();

  const [role, setRole] = useState<UserRole>(initialRole);
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState<string>('Chennai');
  const [pincode, setPincode] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [fpoName, setFpoName] = useState('');
  const [fpoRegNo, setFpoRegNo] = useState('');
  const [logisticsCompany, setLogisticsCompany] = useState('');
  const [vehicleType, setVehicleType] = useState('Tata Ace 1.5 Ton Reefer');
  const [vehicleNumber, setVehicleNumber] = useState('');

  useEffect(() => {
    setRole(initialRole);
    setMode(initialMode);
  }, [initialRole, initialMode, isOpen]);

  if (!isOpen) return null;

  const roleDetails: Record<
    UserRole,
    { title: string; subtitle: string; icon: React.ReactNode; color: string }
  > = {
    consumer: {
      title: 'Consumer Portal (Type 1)',
      subtitle: 'Household fresh fruits & vegetables (Max 10kg quota per item)',
      icon: <ShoppingBag className="w-5 h-5 text-[#0c831f] dark:text-emerald-400" />,
      color: 'border-emerald-500 text-[#0c831f]',
    },
    bulk_buyer: {
      title: 'Bulk Buyer Portal (Type 2)',
      subtitle: 'Wholesale orders for caterers, hotels & marts (No quantity limit)',
      icon: <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      color: 'border-blue-500 text-blue-600',
    },
    fpo: {
      title: 'FPO Collective Portal (Type 3)',
      subtitle: 'List available produce & origin regions across Tamil Nadu',
      icon: <Layers className="w-5 h-5 text-[#0c831f] dark:text-emerald-400" />,
      color: 'border-emerald-500 text-[#0c831f]',
    },
    logistics: {
      title: 'Logistics Partner Portal (Type 4)',
      subtitle: 'Accept dispatch requests & deliver produce across Tamil Nadu corridors',
      icon: <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      color: 'border-amber-500 text-amber-600',
    },
    admin: {
      title: 'State Admin Portal',
      subtitle: 'Oversee all combined real-time marketplace & logistics data',
      icon: <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      color: 'border-purple-500 text-purple-600',
    },
  };

  const handleDemoFill = () => {
    const demoUser = users[role];
    if (demoUser) {
      setEmail(demoUser.email);
      setPassword('demo1234');
      setName(demoUser.name);
      setPhone(demoUser.phone);
      setAddress(demoUser.address || 'Tamil Nadu');
      setDistrict(demoUser.district || 'Chennai');
      setPincode(demoUser.pincode || '600001');
      if (demoUser.businessName) setBusinessName(demoUser.businessName);
      if (demoUser.gstNumber) setGstNumber(demoUser.gstNumber);
      if (demoUser.fpoName) setFpoName(demoUser.fpoName);
      if (demoUser.fpoRegNo) setFpoRegNo(demoUser.fpoRegNo);
      if (demoUser.logisticsCompany) setLogisticsCompany(demoUser.logisticsCompany);
      if (demoUser.vehicleNumber) setVehicleNumber(demoUser.vehicleNumber);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      login(role, email);
      onClose();
    } else {
      signup({
        role,
        name: name || (role === 'fpo' ? fpoName : role === 'bulk_buyer' ? businessName : 'Agri User'),
        email: email || `${role}_${Date.now()}@euzhavar.tn.gov.in`,
        phone: phone || '+91 98000 12345',
        address: address || 'Tamil Nadu',
        district,
        pincode: pincode || '600001',
        businessName,
        gstNumber,
        fpoName,
        fpoRegNo,
        originDistrict: district,
        logisticsCompany,
        vehicleType,
        vehicleNumber,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60">
              {roleDetails[role].icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {roleDetails[role].title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">{roleDetails[role].subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Type Selection Tabs */}
        <div className="p-4 bg-white dark:bg-[#18181c] border-b border-slate-100 dark:border-zinc-800">
          <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-2">
            Step 1: Select Your Platform Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(['consumer', 'bulk_buyer', 'fpo', 'logistics', 'admin'] as UserRole[]).map((r) => {
              const active = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    if (r === 'admin') {
                      setMode('login');
                      setEmail('admin@euzhavar.tn.gov.in');
                      setPassword('admin2026');
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    active
                      ? 'border-[#0c831f] bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs ring-1 ring-[#0c831f]'
                      : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {roleDetails[r].icon}
                    {active && <Check className="w-3.5 h-3.5 text-[#0c831f] dark:text-emerald-400 font-bold" />}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 mt-1">
                    {r === 'consumer'
                      ? 'Consumer'
                      : r === 'bulk_buyer'
                      ? 'Bulk Buyer'
                      : r === 'fpo'
                      ? 'FPO Farmer'
                      : r === 'logistics'
                      ? 'Logistics'
                      : 'Admin'}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                    {r === 'consumer'
                      ? '10kg Quota'
                      : r === 'bulk_buyer'
                      ? 'No Limit'
                      : r === 'fpo'
                      ? 'TN Farms'
                      : r === 'logistics'
                      ? 'Transit'
                      : 'Monitor'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login / Sign Up Toggle */}
        {role !== 'admin' && (
          <div className="px-6 pt-4 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
            <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                Register
              </button>
            </div>

            <button
              type="button"
              onClick={handleDemoFill}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0c831f] dark:text-emerald-400 hover:underline px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Demo Autofill
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Admin Notice */}
          {role === 'admin' && (
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 space-y-1">
              <div className="text-xs font-bold flex items-center gap-2 text-purple-950 dark:text-purple-300">
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Unified State Admin Account
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                As per specification, the admin account oversees all combined real-time marketplace data, FPO listings, logistics fleets, and consumer/bulk orders across Tamil Nadu.
              </p>
              <div className="pt-1 font-semibold text-xs text-purple-900 dark:text-purple-200">
                Credential: admin@euzhavar.tn.gov.in / password: admin2026
              </div>
            </div>
          )}

          {/* Role specific notification banner for Consumer Address Mandate */}
          {role === 'consumer' && mode === 'signup' && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#0c831f] dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900 dark:text-zinc-100">Delivery Address Stored on Sign-up</span>
                <span className="text-xs text-slate-600 dark:text-zinc-400">
                  Your Tamil Nadu address will be automatically stored for household vegetable &amp; fruit orders (up to 10kg per item).
                </span>
              </div>
            </div>
          )}

          {/* Role specific notification banner for Bulk Buyer Address Mandate */}
          {role === 'bulk_buyer' && mode === 'signup' && (
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900 dark:text-zinc-100">Wholesale Facility &amp; Receiving Bay Address</span>
                <span className="text-xs text-slate-600 dark:text-zinc-400">
                  No quantity limits. Storing your bulk receiving dock address for freight delivery logistics.
                </span>
              </div>
            </div>
          )}

          {/* Sign-up specific inputs */}
          {mode === 'signup' && role !== 'admin' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {role === 'fpo'
                    ? 'Authorized FPO Director Name'
                    : role === 'bulk_buyer'
                    ? 'Procurement Officer Name'
                    : role === 'logistics'
                    ? 'Driver / Fleet Manager Name'
                    : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'consumer' ? 'e.g. Anand Kumar' : 'e.g. S. Murugesan'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98402 11200"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Role specific: Bulk Buyer */}
              {role === 'bulk_buyer' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Business / Catering / Mart Name
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Wholesale Fresh Mart & Catering Hub"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      GSTIN / Trade Registration No
                    </label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="33AABCS1429B1Z8"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              {/* Role specific: FPO */}
              {role === 'fpo' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      FPO Organization / Society Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fpoName}
                      onChange={(e) => setFpoName(e.target.value)}
                      placeholder="e.g. Oddanchatram Valley Farmers Co."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Co-operative Registration / FPO ID
                    </label>
                    <input
                      type="text"
                      value={fpoRegNo}
                      onChange={(e) => setFpoRegNo(e.target.value)}
                      placeholder="TN-COOP-FPO-2021-994"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              {/* Role specific: Logistics */}
              {role === 'logistics' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Transport / Fleet Operator Name
                    </label>
                    <input
                      type="text"
                      required
                      value={logisticsCompany}
                      onChange={(e) => setLogisticsCompany(e.target.value)}
                      placeholder="e.g. Kaveri Cold-Chain Fleet"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Vehicle Type
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Tata Ace 1.5 Ton Reefer (Chilled Temp)">Tata Ace 1.5 Ton Reefer</option>
                      <option value="Mahindra Bolero Maxi Truck (2 Ton)">Mahindra Bolero Maxi Truck (2 Ton)</option>
                      <option value="Eicher 4 Ton Temperature Controlled">Eicher 4 Ton Temp Controlled</option>
                      <option value="Heavy 10 Ton Interstate Hauler">Heavy 10 Ton Interstate Hauler</option>
                      <option value="3-Wheeler Electric Cargo EV">3-Wheeler Electric Cargo EV (Urban)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Vehicle Registration Number
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      placeholder="TN-57-AZ-4820"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              {/* Address Fields (Explicitly required & stored for Consumer, Bulk Buyer, FPO) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0c831f] dark:text-emerald-400" />
                  {role === 'consumer'
                    ? 'Delivery Street Address (Stored at signup)'
                    : role === 'bulk_buyer'
                    ? 'Warehouse / Delivery Bay Address (Stored at signup)'
                    : role === 'fpo'
                    ? 'FPO Agricultural Yard / Collection Hub Address'
                    : 'Base Operating Hub Address'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={
                    role === 'consumer'
                      ? 'Plot 42, 2nd Cross Street, Anna Nagar West'
                      : 'Bay #14, Wholesale Aggregation Yard, Koyambedu'
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* District & Pincode */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Tamil Nadu District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {TAMIL_NADU_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  Postal Pincode
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="600101"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Email & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address / User ID
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  role === 'admin'
                    ? 'admin@euzhavar.tn.gov.in'
                    : role === 'consumer'
                    ? 'consumer@euzhavar.tn.gov.in'
                    : `${role}@euzhavar.tn.gov.in`
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Password / Security PIN
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer bg-[#0c831f] hover:bg-[#0a6e1a] text-white shadow-md"
            >
              {mode === 'login' ? (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In to {role.replace('_', ' ').toUpperCase()} Dashboard
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Complete Registration &amp; Save Address
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
