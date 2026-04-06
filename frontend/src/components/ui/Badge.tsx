import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className = '',
}: BadgeProps) {
  const variants = {
    default: 'bg-[#f3f3f6] text-[#444749]',
    primary: 'bg-[#d8e2ff] bg-opacity-30 text-[#191c1e]',
    secondary: 'bg-[#e8e8ea] text-[#444749]',
    accent: 'bg-[#007AFF] bg-opacity-10 text-[#007AFF]',
    success: 'bg-emerald-500 bg-opacity-10 text-emerald-500',
    warning: 'bg-amber-500 bg-opacity-10 text-amber-500',
    error: 'bg-red-500 bg-opacity-10 text-red-500',
  };
  
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
