import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  type?: 'amber' | 'hot' | 'new' | 'premium' | 'green' | 'blue' | 'purple' | 'cream';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  type = 'amber',
  className = '',
}) => {
  const typeStyles = {
    amber: 'bg-[#E67E22] text-white',
    hot: 'bg-[#FF6B35] text-white',
    new: 'bg-[#F1C40F] text-[#333333]',
    premium: 'bg-gradient-to-r from-[#FF6B35] to-[#FF4D4F] text-white',
    green: 'bg-[#52C41A] text-white',
    blue: 'bg-[#3498DB] text-white',
    purple: 'bg-[#9B59B6] text-white',
    cream: 'bg-[#FAF3E0] text-[#E67E22] border border-[#E67E22]',
  };
  
  return (
    <span
      className={`
        inline-flex items-center justify-center
        h-5 px-2 rounded text-xs font-medium
        ${typeStyles[type]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
