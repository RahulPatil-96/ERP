import React from 'react';

interface ProgressProps {
  value: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className = '' }) => {
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className={`w-full bg-gray-200 rounded-full ${className}`}>
      <div
        style={{ width: `${percentage}%` }}
        className="bg-indigo-600 h-2 rounded-full"
      />
    </div>
  );
};
