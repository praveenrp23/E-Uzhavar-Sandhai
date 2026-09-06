import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { ProduceItem, ProduceCategory, TAMIL_NADU_DISTRICTS } from '../../types';
import brinjalImg from '../../assets/brinjal.jpg';
import jackfruitImg from '../../assets/jackfruit.jpg';
import tenderCoconutImg from '../../assets/tender_coconut.jpg';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Leaf,
  Package,
  TrendingUp,
  CheckCircle2,
  X,
  Boxes,
} from 'lucide-react';

export const FpoDashboard: React.FC = () => {
  const {
    produceList,
    orders,
    addProduceListing,
    updateProduceListing,
    deleteProduceListing,
    currentUser,
  } = useMarket();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ProduceItem | null>(null);

  // Form states for adding/editing produce
  const [name, setName] = useState('');
  const [tamilName, setTamilName] = useState('');
  const [category, setCategory] = useState<ProduceCategory>('vegetables');
  const [pricePerKg, setPricePerKg] = useState<number>(45);
  const [availableKg, setAvailableKg] = useState<number>(500);
  const [originDistrict, setOriginDistrict] = useState<string>(currentUser?.district || 'Dindigul');
  const [originPlace, setOriginPlace] = useState('');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [isOrganic, setIsOrganic] = useState(false);
  const [grade, setGrade] = useState<'Grade A Export' | 'Grade A Premium' | 'Grade B Standard'>('Grade A Premium');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
  );

  // Listings associated with FPO
  const fpoListings = produceList;

  // Calculate metrics
  const totalStockKg = fpoListings.reduce((sum, item) => sum + item.availableKg, 0);
  const totalUniqueProduce = fpoListings.length;
  const totalDemandOrders = orders.filter((o) =>
    o.items.some((i) => fpoListings.some((f) => f.id === i.produceId))
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setTamilName('');
    setCategory('vegetables');
    setPricePerKg(45);
    setAvailableKg(500);
    setOriginDistrict(currentUser?.district || 'Dindigul');
    setOriginPlace(`Agro Aggregation Hub, ${currentUser?.district || 'Dindigul'}`);
    setHarvestDate(new Date().toISOString().split('T')[0]);
    setIsOrganic(true);
    setGrade('Grade A Premium');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80');
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: ProduceItem) => {
    setEditingItem(item);
    setName(item.name);
    setTamilName(item.tamilName);
    setCategory(item.category);
    setPricePerKg(item.pricePerKg);
    setAvailableKg(item.availableKg);
    setOriginDistrict(item.originDistrict);
    setOriginPlace(item.originPlace);
    setHarvestDate(item.harvestDate);
    setIsOrganic(item.isOrganic);
    setGrade(item.grade);
    setDescription(item.description);
    setImageUrl(item.imageUrl);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      updateProduceListing(editingItem.id, {
        name,
        tamilName,
        category,
        pricePerKg,
        availableKg,
        originDistrict,
        originPlace,
        harvestDate,
        isOrganic,
        grade,
        description,
        imageUrl,
      });
    } else {
      addProduceListing({
        name,
        tamilName,
        category,
        pricePerKg,
        availableKg,
        originDistrict,
        originPlace,
        harvestDate,
        isOrganic,
        grade,
        description: description || `Freshly harvested ${name} (${tamilName}) directly from ${originPlace}.`,
        imageUrl,
        fpoId: currentUser?.id || 'fpo-1',
        fpoName: currentUser?.fpoName || 'Tamil Nadu Uzhavar Producer Collective',
      });
    }

    setShowAddModal(false);
  };

  const presetImages = [
    { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80' },
    { label: 'Onions', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80' },
    { label: 'Carrots', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80' },
    { label: 'Bananas', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80' },
    { label: 'Grapes', url: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=600&auto=format&fit=crop&q=80' },
    { label: 'Coconut', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80' },
    { label: 'Greens', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="space-y-6">
      {/* FPO Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10 dark:from-emerald-950/30 dark:via-zinc-900/60 dark:to-teal-950/20 border border-emerald-200/80 dark:border-zinc-800 p-5 sm:p-7 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0c831f] text-white flex items-center gap-1.5 shadow-xs">
              <Layers className="w-3.5 h-3.5" />
              Farmer Producer Collective (FPO)
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60">
              {currentUser?.fpoName || 'Oddanchatram Valley Farmers Producer Co.'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
            Harvest Inventory &amp; Regional Mandi Listings
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            Specify vegetable and fruit availability from specific districts across Tamil Nadu (Nilgiris, Dindigul, Theni, Krishnagiri, Salem, Coimbatore). Synchronized live with Consumers, Bulk Buyers, and Logistics Fleets.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Produce Listing
            </button>
            <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
              Hub Location: <strong className="text-slate-900 dark:text-zinc-200">{currentUser?.originDistrict || currentUser?.district || 'Dindigul'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
            <span>Active Listings</span>
            <Boxes className="w-4 h-4 text-[#0c831f] dark:text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {totalUniqueProduce} <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">Varieties</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Farm-gate Active</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
            <span>Stock in Hubs</span>
            <Package className="w-4 h-4 text-[#0c831f] dark:text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {(totalStockKg / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">Tonnes</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{totalStockKg.toLocaleString()} kg total</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
            <span>Demand Inflows</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {totalDemandOrders.length} <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">Dispatches</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Consumer + Bulk</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
            <span>FPO Certification</span>
            <CheckCircle2 className="w-4 h-4 text-[#0c831f] dark:text-emerald-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-[#0c831f] dark:text-emerald-400 mt-1">
            Verified Co-op
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 truncate">
            {currentUser?.fpoRegNo || 'TN-COOP-FPO-2021'}
          </div>
        </div>
      </div>

      {/* Produce Listings Table & Management */}
      <div className="rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0c831f] dark:text-emerald-400" />
              Tamil Nadu Produce Inventory &amp; Regional Mandi Listings
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Update quantities, farm gate prices, and dispatch locations across Tamil Nadu districts.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Produce
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
            <thead className="bg-slate-50 dark:bg-zinc-800/60 text-slate-500 dark:text-zinc-400 uppercase font-semibold text-[11px] border-b border-slate-200 dark:border-zinc-700">
              <tr>
                <th className="py-3 px-4">Produce Details</th>
                <th className="py-3 px-4">TN Origin Place</th>
                <th className="py-3 px-4">Price / kg</th>
                <th className="py-3 px-4">Stock Available</th>
                <th className="py-3 px-4">Harvest Date</th>
                <th className="py-3 px-4">Certifications</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {fpoListings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.id === 'prod_8' ? brinjalImg : item.id === 'prod_10' ? jackfruitImg : item.id === 'prod_6' ? tenderCoconutImg : item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          if (item.id === 'prod_8') {
                            e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/An_Indian_Purple_Eggplant_%28Brinjal%29.jpg/500px-An_Indian_Purple_Eggplant_%28Brinjal%29.jpg';
                          } else if (item.id === 'prod_10') {
                            e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/The_jackfruit_is_holding_on_to_the_tree.jpg/500px-The_jackfruit_is_holding_on_to_the_tree.jpg';
                          } else if (item.id === 'prod_6') {
                            e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Tender_coconut_image.jpg/500px-Tender_coconut_image.jpg';
                          } else {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80';
                          }
                        }}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-zinc-800 shrink-0 border border-slate-200 dark:border-zinc-700"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">{item.name}</div>
                        <div className="text-xs text-[#0c831f] dark:text-emerald-400 font-medium">{item.tamilName}</div>
                        <span className="text-[11px] text-slate-500 dark:text-zinc-400 capitalize">{item.category.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-slate-900 dark:text-zinc-200 font-medium text-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#0c831f] dark:text-emerald-400 shrink-0" />
                      <span>{item.originDistrict}</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-zinc-400 truncate max-w-xs">{item.originPlace}</div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white text-sm">
                    ₹{item.pricePerKg} <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">/kg</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#0c831f] dark:text-emerald-400 text-sm">
                      {item.availableKg} kg
                    </div>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">In Hub</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-300 font-medium">
                    {item.harvestDate}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      {item.isOrganic ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 flex items-center gap-1">
                          <Leaf className="w-3 h-3 text-[#0c831f] dark:text-emerald-400" /> Organic
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400">
                          Conventional
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400">{item.grade}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                        title="Edit listing"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduceListing(item.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Produce Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#1c1c20] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#0c831f] dark:text-emerald-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {editingItem ? 'Edit Produce Listing' : 'Add New Produce Listing'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Specify harvest details and Tamil Nadu origin district
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Produce Name (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dindigul Small Onion (Shallots)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0c831f]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Tamil Name (தமிழ் பெயர்)
                  </label>
                  <input
                    type="text"
                    required
                    value={tamilName}
                    onChange={(e) => setTamilName(e.target.value)}
                    placeholder="e.g. சின்ன வெங்காயம்"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0c831f]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Produce Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProduceCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0c831f]/30 cursor-pointer font-medium"
                  >
                    <option value="vegetables">Daily Vegetables</option>
                    <option value="fruits">Fresh Fruits</option>
                    <option value="leafy_greens">Delta Greens (Keerai)</option>
                    <option value="tubers_roots">Tubers &amp; Roots</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Tamil Nadu Origin District
                  </label>
                  <select
                    value={originDistrict}
                    onChange={(e) => setOriginDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0c831f]/30 cursor-pointer font-medium"
                  >
                    {TAMIL_NADU_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Specific Origin Farm Hub / Place inside Tamil Nadu
                  </label>
                  <input
                    type="text"
                    required
                    value={originPlace}
                    onChange={(e) => setOriginPlace(e.target.value)}
                    placeholder="e.g. Oddanchatram Central Mandi Hub, Dindigul"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0c831f]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Price per kg (₹ INR)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0c831f]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Available Stock Quantity (kg)
                  </label>
                  <input
                    type="number"
                    min={10}
                    required
                    value={availableKg}
                    onChange={(e) => setAvailableKg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0c831f]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Harvest Date
                  </label>
                  <input
                    type="date"
                    required
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0c831f]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Quality Grading
                  </label>
                  <select
                    value={grade}
                    onChange={(e) =>
                      setGrade(e.target.value as 'Grade A Export' | 'Grade A Premium' | 'Grade B Standard')
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0c831f]/30 cursor-pointer font-medium"
                  >
                    <option value="Grade A Premium">Grade A Premium</option>
                    <option value="Grade A Export">Grade A Export Quality</option>
                    <option value="Grade B Standard">Grade B Standard</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={isOrganic}
                      onChange={(e) => setIsOrganic(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0c831f] focus:ring-[#0c831f] accent-[#0c831f]"
                    />
                    <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                      100% Certified Organic / Zero Chemical Residue
                    </span>
                  </label>
                </div>

                {/* Quick Photo Presets */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                    Select Produce Image Preset or Paste URL
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {presetImages.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setImageUrl(p.url)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer ${
                          imageUrl === p.url
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-[#0c831f] dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:bg-slate-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0c831f]/30"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  {editingItem ? 'Save Updates' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
