import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs sm:text-sm font-medium rounded-xl shadow-lg border border-slate-800">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-white text-xs cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
