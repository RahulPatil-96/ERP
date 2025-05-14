import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void; // Added onClick prop
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div className={`bg-white dark:bg-dark-700 shadow-md rounded-lg p-4 ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};
