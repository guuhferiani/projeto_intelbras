import React from 'react';

interface SenaiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SenaiLogo: React.FC<SenaiLogoProps> = ({ 
  className = '',
  size = 'md' 
}) => {
  const heights = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* SENAI Official Red Banner with White Lettering */}
      <svg 
        viewBox="0 0 160 52" 
        className={`${heights[size]} w-auto shadow-md rounded`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Red Background Box */}
        <rect width="160" height="52" rx="4" fill="#E30613" />
        
        {/* White Border Inner Line */}
        <rect x="6" y="6" width="148" height="40" rx="2" stroke="#FFFFFF" strokeWidth="2.5" />
        
        {/* SENAI Italic Block Typography */}
        <g fill="#FFFFFF">
          {/* 'S' */}
          <path d="M22 17H38V24H28V26H38V35H22V28H32V26H22V17Z" />
          
          {/* 'E' */}
          <path d="M44 17H60V23H52V24H58V29H52V30H60V35H44V17Z" />
          
          {/* 'N' */}
          <path d="M66 17H74L80 27V17H86V35H78L72 25V35H66V17Z" />
          
          {/* 'A' */}
          <path d="M92 17H106L112 35H104L102.5 30H95.5L94 35H86L92 17ZM97 25H101L99 19.5L97 25Z" />
          
          {/* 'I' */}
          <path d="M118 17H126V35H118V17Z" />
          
          {/* Decorative Lines Right */}
          <rect x="132" y="17" width="3" height="18" fill="#FFFFFF" />
          <rect x="138" y="17" width="3" height="18" fill="#FFFFFF" />
          <rect x="144" y="17" width="3" height="18" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};
