import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className = '', 
  label = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div 
      role="status" 
      aria-label={label}
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div className="relative">
        {/* Outer glowing halo ring */}
        <div 
          className={`${sizeClasses[size]} rounded-full border-cyan-500/20 animate-pulse`} 
        />
        {/* Spinning gradient ring */}
        <div 
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-t-cyan-400 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin`} 
        />
        {/* Center glowing core */}
        <div className="absolute inset-1/4 rounded-full bg-cyan-400/20 blur-xs" />
      </div>
      {label && size !== 'sm' && (
        <span className="text-xs font-mono text-slate-400 tracking-wider animate-pulse">
          {label}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
};
