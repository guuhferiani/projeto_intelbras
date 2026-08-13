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
      <img 
        src="/SENAI_sem_assinatura_cor.png" 
        alt="SENAI"
        className={`${heights[size]} w-auto object-contain drop-shadow-sm`} 
      />
    </div>
  );
};
