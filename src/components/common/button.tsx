import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = '',
  variant = 'default',
  disabled = false,
  size = 'md',
}) => {
  const baseStyles = 'rounded-lg transition-colors duration-200';

  // Define styles for the variants
  const variantStyles: Record<string, string> = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-700',
    outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-100',
    ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-100',
    destructive: 'bg-red-600 text-white hover:bg-red-700', // Added missing 'destructive' variant
  };

  // Define styles for sizes
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Handle disabled styles to disable interaction and update appearance
  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : '';

  // Combine all styles into a final string
  const buttonClassName = `${baseStyles} ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size]} ${disabledStyles} ${className}`;

  return (
    <button
      onClick={!disabled ? onClick : undefined} // Prevent click when disabled
      className={buttonClassName}
      disabled={disabled}
      aria-disabled={disabled} // Accessibility: Indicate that the button is disabled
    >
      {children}
    </button>
  );
};
