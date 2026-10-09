import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-soft-lg border flex items-center justify-between gap-3 transition-all animate-float-1 ${
            toast.type === 'success'
              ? 'bg-[#FFFFFF] dark:bg-[#1A2220] border-[#75A994] text-[#202421] dark:text-[#F0F4F2]'
              : toast.type === 'error'
              ? 'bg-[#FFFFFF] dark:bg-[#1A2220] border-[#D97979] text-[#202421] dark:text-[#F0F4F2]'
              : 'bg-[#FFFFFF] dark:bg-[#1A2220] border-[#73AFA0] text-[#202421] dark:text-[#F0F4F2]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#75A994] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#D97979] shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#73AFA0] shrink-0" />}
            <span className="text-xs font-semibold leading-snug">{toast.message}</span>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
