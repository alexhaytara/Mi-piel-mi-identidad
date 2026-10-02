  import React from 'react';
import fondoImg from '../assets/fondo.png';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`relative rounded-3xl p-6 sm:p-8 shadow-sm border border-purple-100/70 overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), url(${fondoImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'local'
      }}
    >
      {children}
    </div>
  );
};