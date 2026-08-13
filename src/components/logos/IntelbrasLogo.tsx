import React from 'react';

interface IntelbrasLogoProps {
  className?: string;
  variant?: 'white' | 'green' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const IntelbrasLogo: React.FC<IntelbrasLogoProps> = ({ 
  className = '', 
  variant = 'green',
  size = 'md' 
}) => {
  const heights = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };

  const fillColors = {
    white: '#FFFFFF',
    green: '#00A335',
    dark: '#1E293B'
  };

  const primaryColor = fillColors[variant];

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <img 
        src="/intelbras-logo.svg" 
        alt="Intelbras"
        className={`${heights[size]} w-auto object-contain transition-all`} 
      />
    </div>
  );
};
