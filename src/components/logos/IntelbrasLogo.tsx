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
      {/* Intelbras Iconic Geometric SVG Logo */}
      <svg 
        viewBox="0 0 160 38" 
        className={`${heights[size]} w-auto transition-all`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 'i' */}
        <circle cx="10" cy="8" r="4.5" fill={primaryColor} />
        <rect x="5.5" y="16" width="9" height="20" rx="2" fill={primaryColor} />
        
        {/* 'n' */}
        <path d="M23 16H31V20.5C32.5 17.5 36.5 15.5 41 15.5C48 15.5 51 19.5 51 26.5V36H43V27.5C43 23.5 41.5 21.5 38 21.5C34.5 21.5 31 24 31 28V36H23V16Z" fill={primaryColor} />
        
        {/* 't' */}
        <path d="M59 10V16H55V21.5H59V31C59 34.5 61.5 36.5 66 36.5C68 36.5 70 36 71 35.5V30C70.2 30.5 69.2 30.5 68 30.5C66.8 30.5 66 30 66 28.5V21.5H71V16H66V10H59Z" fill={primaryColor} />
        
        {/* 'e' */}
        <path d="M85 15.5C77.5 15.5 72 20.8 72 26C72 32 77.5 36.5 86 36.5C90.5 36.5 94 35 96.5 33L93.5 28.5C91.5 29.8 89 31 86 31C82 31 79.5 29 79.5 26.5H97C97.2 25.5 97.5 24 97.5 22.8C97.5 18 92.5 15.5 85 15.5ZM79.5 22.5C80 20 82.2 18.5 85.5 18.5C88.8 18.5 90.8 20 91.2 22.5H79.5Z" fill={primaryColor} />
        
        {/* 'l' */}
        <rect x="104" y="6" width="8" height="30" rx="2" fill={primaryColor} />
        
        {/* 'b' */}
        <path d="M119 6H127V18C129 16.5 132.5 15.5 136 15.5C143.5 15.5 148.5 20.8 148.5 26C148.5 32 143.5 36.5 136 36.5C132.5 36.5 129 35.5 127 34V36H119V6ZM133.5 31C137.5 31 140.5 28.8 140.5 26C140.5 23.2 137.5 21 133.5 21C129.5 21 127 23.2 127 26C127 28.8 129.5 31 133.5 31Z" fill={primaryColor} />
        
        {/* 'ras' abbreviated graphic accent */}
        <circle cx="155" cy="32" r="3.5" fill="#00A335" />
      </svg>
    </div>
  );
};
