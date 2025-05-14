import React from 'react';

interface BadgeProps {
  variant: 'success' | 'warning' | 'destructive' | 'info' | 'neutral';
  className?: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant, className, children }) => {
  const variantClasses = {
    success: 'bg-green-200 text-green-800',
    warning: 'bg-yellow-200 text-yellow-800',
    destructive: 'bg-red-200 text-red-800',
    info: 'bg-blue-200 text-blue-800',
    neutral: 'bg-gray-200 text-gray-800',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export { Badge };
