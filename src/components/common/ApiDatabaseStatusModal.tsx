import React, { useState, useEffect } from 'react';
import { api, DbStatusResponse } from '../../services/api';
import {
  Database,
  Server,
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Code,
  Layers,
  ShoppingBag,
  Truck,
  Users,
  Terminal,
  Zap,
} from 'lucide-react';

interface ApiDatabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData?: () => void;
}

export const ApiDatabaseStatusModal: React.FC<ApiDatabaseStatusModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
}) => {
  const [dbStatus, setDbStatus] = useState<DbStatusResponse | null>(null);
  const [health, setHealth] = useState<{ status: string; uptimeSeconds: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testEndpoint, setTestEndpoint] = useState<string>('/api/health');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const [dbData, healthData] = await Promise.all([
        api.getDbStatus(),
        api.checkHealth(),
      ]);
      const end = performance.now();
      setDbStatus(dbData);
      setHealth(healthData);
      setLatencyMs(Math.round(end - start));
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const handleTestApi = async (endpoint: string) => {
    setTestEndpoint(endpoint);
    setTestLoading(true);
    setTestResponse(null);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setTestResponse({
        status: res.status,
        statusText: res.statusText,
        data,
      });
    } catch (err: any) {
      setTestResponse({
        error: err?.message || 'Failed to call endpoint',
      });
    } finally {
      setTestLoading(false);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm('Reset database to fresh Tamil Nadu seed dataset? Current changes will be re-initialized.')) {
      return;
    }
    setLoading(true);
    try {
      const res = await api.resetDatabase();
      setDbStatus(res.stats);
      if (onRefreshData) onRefreshData();
      alert('Database reset successful! Re-seeded with fresh data.');
    } catch (err: any) {
      alert('Reset failed: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Full-Stack Architecture &amp; Database
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Express REST API
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Persistent server database engine, endpoints status &amp; diagnostics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title="Refresh status"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Top Server & DB Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-blue-500" /> Server Engine
              </span>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                Node / Express 4.x
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Port 3000 Active
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-emerald-500" /> Persistence
              </span>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                Atomic JSON DB
              </div>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">
                {dbStatus ? `${(dbStatus.sizeBytes / 1024).toFixed(1)} KB on disk` : 'Calculating...'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Ping Latency
              </span>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                {latencyMs !== null ? `${latencyMs} ms` : 'Testing...'}
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Ultra-fast Local Proxy
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-purple-500" /> Architecture
              </span>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                REST + Atomic DB
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Verified Direct Sandhai
              </span>
            </div>
          </div>

          {/* Database Collections breakdown */}
          {dbStatus && (
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700/70 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Database Collections &amp; Live Records
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  Schema v{dbStatus.version} &bull; {new Date(dbStatus.lastUpdated).toLocaleTimeString()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800">
                  <div className="text-slate-500 text-[10px] flex items-center justify-center gap-1 mb-0.5">
                    <Layers className="w-3 h-3 text-emerald-500" /> Produce
                  </div>
                  <div className="font-bold text-base text-slate-900 dark:text-white">
                    {dbStatus.counts.produce}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800">
                  <div className="text-slate-500 text-[10px] flex items-center justify-center gap-1 mb-0.5">
                    <ShoppingBag className="w-3 h-3 text-blue-500" /> Orders
                  </div>
                  <div className="font-bold text-base text-slate-900 dark:text-white">
                    {dbStatus.counts.orders}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800">
                  <div className="text-slate-500 text-[10px] flex items-center justify-center gap-1 mb-0.5">
                    <Users className="w-3 h-3 text-purple-500" /> Users
                  </div>
                  <div className="font-bold text-base text-slate-900 dark:text-white">
                    {dbStatus.counts.users}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800">
                  <div className="text-slate-500 text-[10px] flex items-center justify-center gap-1 mb-0.5">
                    <Activity className="w-3 h-3 text-amber-500" /> Audit Logs
                  </div>
                  <div className="font-bold text-base text-slate-900 dark:text-white">
                    {dbStatus.counts.activityLogs}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800">
                  <div className="text-slate-500 text-[10px] flex items-center justify-center gap-1 mb-0.5">
                    <Truck className="w-3 h-3 text-cyan-500" /> Mandi Rates
                  </div>
                  <div className="font-bold text-base text-slate-900 dark:text-white">
                    {dbStatus.counts.marketPrices}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive API Endpoint Tester */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                Live REST API Endpoint Tester
              </h4>
              <span className="text-[11px] text-slate-400">Click any route to test</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                '/api/health',
                '/api/db/status',
                '/api/produce',
                '/api/orders',
                '/api/analytics',
                '/api/prices',
                '/api/auth/users',
                '/api/audit-logs',
                '/api/endpoints',
              ].map((endpoint) => (
                <button
                  key={endpoint}
                  onClick={() => handleTestApi(endpoint)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                    testEndpoint === endpoint
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700'
                  }`}
                >
                  GET {endpoint}
                </button>
              ))}
            </div>

            {/* Test Output Box */}
            <div className="rounded-xl bg-slate-900 text-emerald-400 p-3 font-mono text-[11px] max-h-48 overflow-y-auto border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1 mb-2 text-[10px]">
                <span>Response for: {testEndpoint}</span>
                <span>{testLoading ? 'Fetching...' : testResponse?.status ? `HTTP ${testResponse.status}` : 'Ready'}</span>
              </div>
              {testLoading ? (
                <div className="text-slate-400 animate-pulse">Calling backend API route...</div>
              ) : testResponse ? (
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(testResponse.data || testResponse.error, null, 2)}
                </pre>
              ) : (
                <div className="text-slate-500">Click any of the API endpoints above to verify response data.</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/30">
          <button
            onClick={handleResetDb}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-semibold text-xs cursor-pointer transition-colors"
          >
            Reset to Seed Data
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer transition-colors"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
