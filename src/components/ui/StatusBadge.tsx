'use client';

import React from 'react';

export type StatusBadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'forest'
  | 'accent';

interface StatusBadgeProps {
  label: string;
  variant?: StatusBadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles: Record<StatusBadgeVariant, string> = {
    success: 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]',
    warning: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
    danger: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]',
    neutral: 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]',
    forest: 'bg-[#0A261D] text-[#4ADE80] border-[#103E2E]',
    accent: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
  };

  const dotStyles: Record<StatusBadgeVariant, string> = {
    success: 'bg-[#16A34A]',
    warning: 'bg-[#D97706]',
    danger: 'bg-[#DC2626]',
    neutral: 'bg-[#6B7280]',
    forest: 'bg-[#4ADE80]',
    accent: 'bg-[#10B981]',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-0.5 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant]} ${sizeStyles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />}
      <span>{label}</span>
    </span>
  );
};
