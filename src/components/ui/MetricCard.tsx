'use client';

import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'danger' | 'neutral' | 'accent';
  };
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'surface' | 'forest' | 'danger' | 'accent';
  footer?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  badge,
  icon: Icon,
  variant = 'surface',
  footer,
  onClick,
  className = '',
}) => {
  const isClickable = Boolean(onClick);

  const variantStyles = {
    surface: 'bg-white text-[#111827] border border-[#E5E7EB]',
    forest: 'bg-gradient-to-br from-[#0A261D] via-[#103E2E] to-[#154E3A] text-white border border-[#14533D]',
    danger: 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]',
    accent: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
  }[variant];

  const badgeStyles = {
    success: 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]',
    warning: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
    danger: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]',
    neutral: 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]',
    accent: 'bg-[#4ADE80]/20 text-[#4ADE80] border-[#4ADE80]/30',
  }[badge?.variant || 'neutral'];

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`rounded-[18px] p-5 flex flex-col justify-between transition-all duration-200 ${
        isClickable ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : 'shadow-xs'
      } ${variantStyles} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${
            variant === 'forest' ? 'text-white/70' : 'text-[#6B7280]'
          }`}
        >
          {label}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {badge && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyles}`}
            >
              {badge.text}
            </span>
          )}
          {Icon && (
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                variant === 'forest' ? 'bg-white/10 text-[#4ADE80]' : 'bg-[#F3F4F6] text-[#103E2E]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      <div className="my-3">
        <div
          className={`text-2xl sm:text-3xl font-extrabold font-mono-metrics tracking-tight ${
            variant === 'forest' ? 'text-[#4ADE80]' : 'text-[#111827]'
          }`}
        >
          {value}
        </div>
        {subValue && (
          <div
            className={`text-xs mt-1 ${
              variant === 'forest' ? 'text-white/80' : 'text-[#6B7280]'
            }`}
          >
            {subValue}
          </div>
        )}
      </div>

      {footer && (
        <div
          className={`pt-3 border-t text-xs ${
            variant === 'forest' ? 'border-white/10 text-white/60' : 'border-[#E5E7EB] text-[#6B7280]'
          }`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
