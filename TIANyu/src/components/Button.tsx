import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cream' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'rounded-button font-semibold transition-all duration-200 ease-out cursor-pointer';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#E67E22] to-[#D35400] text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-white text-[#E67E22] border-2 border-[#E67E22] hover:bg-[#FAF3E0] hover:border-[#D35400]',
    cream: 'bg-[#FAF3E0] text-[#E67E22] hover:bg-[#F5E6D3]',
    ghost: 'bg-transparent text-[#E67E22] hover:bg-[#FAF3E0]/50',
  };
  
  const sizeStyles = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-8 text-base',
    lg: 'h-14 px-10 text-lg',
  };
  
  const disabledStyles = 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed shadow-none hover:shadow-none hover:translate-y-0';
  
  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled || loading ? disabledStyles : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          加载中...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
