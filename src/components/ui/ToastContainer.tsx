'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />,
          info: <Info className="w-4 h-4 text-[#2563EB] shrink-0" />,
        };

        const bgMap = {
          success: 'bg-[#DCFCE7] border-[#BBF7D0] text-[#14533D]',
          error: 'bg-[#FEE2E2] border-[#FECACA] text-[#7F1D1D]',
          info: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E3A8A]',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl border shadow-md text-xs font-medium animate-fade-in ${
              bgMap[toast.type]
            }`}
          >
            <div className="flex items-center gap-2">
              {iconMap[toast.type]}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
