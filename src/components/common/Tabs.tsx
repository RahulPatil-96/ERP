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
          if ((child.type as any).displayName === 'TabsList') {
            return React.cloneElement(child, { value, onValueChange } as any);
          }
          if ((child.type as any).displayName === 'TabsContent') {
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

const TabsList = ({ children, value, onValueChange, className }: TabsListProps) => {
  return (
    <div className={cn('flex border-b border-gray-200', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && (child.type as any).displayName === 'TabsTrigger') {
          return React.cloneElement(child, { 
            active: value === child.props.value,
            onValueChange 
          } as any);
        }
        return child;
      })}
    </div>
  );
};
TabsList.displayName = 'TabsList';

interface TabsTriggerProps {
  value: string;
  active?: boolean;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

const TabsTrigger = ({ 
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
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

const TabsContent = ({ value, children, className }: TabsContentProps) => {
  return (
    <div className={cn('p-4', className)}>
      {children}
    </div>
  );
};
TabsContent.displayName = 'TabsContent';

export { TabsList, TabsTrigger, TabsContent };
