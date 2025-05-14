interface SelectProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    children: React.ReactNode;
  }
  
  export function Select({ 
    label, 
    value, 
    onChange, 
    className = '', 
    children 
  }: SelectProps) {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        >
          {children}
        </select>
      </div>
    );
  }