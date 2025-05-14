import React, { ReactNode } from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

export const Tabs = ({ value, onValueChange, children }: TabsProps) => {
  return (
    <div className="flex flex-col">
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
}

export const TabsList = ({ children, value, onValueChange }: TabsListProps) => {
  return (
    <div className="flex border-b border-gray-200">
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
}

export const TabsTrigger = ({ 
  value, 
  active, 
  onValueChange, 
  children
}: TabsTriggerProps) => {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        active 
          ? 'border-b-2 border-primary text-primary' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
      onClick={() => onValueChange?.(value)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
}

export const TabsContent = ({ value, children }: TabsContentProps) => {
  return (
    <div className="p-4">
      {children}
    </div>
  );
};
