import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export const Tabs = ({ value, onValueChange, children, className }: TabsProps) => {
  return (
    <div className={cn('flex flex-col', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === TabsList) {
            return React.cloneElement(child, { value, onValueChange });
          }
          if (child.type === TabsContent) {
            return child.props.value === value ? child : null;
          }
        }
        return child;
      })}
    </div>
  );
};

interface TabsListProps {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const TabsList = ({ children, value, onValueChange, className }: TabsListProps) => {
  return (
    <div className={cn('flex border-b border-gray-200', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsTrigger) {
          return React.cloneElement(child, { 
            active: value === child.props.value,
            onValueChange 
          });
        }
        return child;
      })}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  active?: boolean;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export const TabsTrigger = ({ 
  value, 
  active, 
  onValueChange, 
  children,
  className
}: TabsTriggerProps) => {
  return (
    <button
      className={cn(
        'px-4 py-2 text-sm font-medium transition-colors',
        active 
          ? 'border-b-2 border-primary text-primary' 
          : 'text-gray-500 hover:text-gray-700',
        className
      )}
      onClick={() => onValueChange?.(value)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsContent = ({ value, children, className }: TabsContentProps) => {
  return (
    <div className={cn('p-4', className)}>
      {children}
    </div>
  );
};
