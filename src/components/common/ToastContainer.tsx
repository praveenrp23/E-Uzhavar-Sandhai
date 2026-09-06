import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useMarket();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-[#0c831f] dark:text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" />,
          error: <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-200 dark:border-emerald-800 bg-white/95 dark:bg-[#18181c]/95 text-slate-800 dark:text-zinc-100',
          warning: 'border-amber-200 dark:border-amber-800 bg-white/95 dark:bg-[#18181c]/95 text-slate-800 dark:text-zinc-100',
          error: 'border-rose-200 dark:border-rose-800 bg-white/95 dark:bg-[#18181c]/95 text-slate-800 dark:text-zinc-100',
          info: 'border-slate-200 dark:border-zinc-700 bg-white/95 dark:bg-[#18181c]/95 text-slate-800 dark:text-zinc-100',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md text-xs transition-all duration-300 animate-in slide-in-from-bottom-2 ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="flex-1 text-slate-800 dark:text-zinc-100 text-xs font-medium leading-snug">
              {toast.message}
            </p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors p-0.5 rounded cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
