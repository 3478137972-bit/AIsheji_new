import React from 'react';
import Image from 'next/image';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  cream?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  cream = false,
  onClick,
}) => {
  const baseStyles = 'bg-white rounded-card p-4 border border-[#E0E0E0] shadow-sm';
  const hoverStyles = hover ? 'transition-all duration-200 ease-out hover:border-[#E67E22] hover:shadow-[0_4px_16px_rgba(230,126,34,0.1)] hover:-translate-y-0.5 cursor-pointer' : '';
  const creamStyles = cream ? 'bg-gradient-to-br from-white to-[#FAF3E0]' : '';
  
  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${creamStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface AIToolCardProps {
  image?: string;
  title: string;
  description?: string;
  badge?: {
    text: string;
    type: 'hot' | 'new' | 'premium' | 'green' | 'blue';
  };
  onClick?: () => void;
}

export const AIToolCard: React.FC<AIToolCardProps> = ({
  image,
  title,
  description,
  badge,
  onClick,
}) => {
  const badgeStyles = {
    hot: 'bg-[#FF6B35] text-white',
    new: 'bg-[#F1C40F] text-[#333333]',
    premium: 'bg-gradient-to-r from-[#FF6B35] to-[#FF4D4F] text-white',
    green: 'bg-[#52C41A] text-white',
    blue: 'bg-[#3498DB] text-white',
  };
  
  return (
    <div
      className={`
        bg-white rounded-[16px] p-4 border border-[#E0E0E0]
        shadow-sm transition-all duration-200 ease-out
        hover:border-[#E67E22] hover:shadow-[0_4px_16px_rgba(230,126,34,0.15)] hover:-translate-y-0.5
        cursor-pointer flex flex-col items-center gap-3
      `}
      onClick={onClick}
    >
      {image && (
        <Image
          src={image}
          alt={title}
          width={80}
          height={80}
          className="w-20 h-20 object-contain rounded-full"
        />
      )}
      {!image && (
        <div className="w-20 h-20 bg-gradient-to-br from-[#FAF3E0] to-[#F5E6D3] rounded-full flex items-center justify-center">
          <span className="text-3xl">🤖</span>
        </div>
      )}
      
      <h3 className="text-base font-bold text-[#333333] text-center">{title}</h3>
      
      {description && (
        <p className="text-xs text-gray-500 text-center line-clamp-2">{description}</p>
      )}
      
      {badge && (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeStyles[badge.type]}`}>
          {badge.text}
        </span>
      )}
    </div>
  );
};

export default Card;
