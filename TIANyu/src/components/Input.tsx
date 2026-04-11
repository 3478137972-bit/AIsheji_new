import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  fieldNumber?: number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required = false, fieldNumber, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="flex items-center gap-2 text-base font-bold text-[#333333]">
            {fieldNumber && (
              <span className="text-[#E67E22] font-bold">{fieldNumber}.</span>
            )}
            <span>{label}</span>
            {!required && (
              <span className="text-gray-400 text-sm font-normal">（选填）</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          className={`
            h-12 px-4 rounded-input border text-base text-[#333333]
            border-[#E0E0E0]
            focus:outline-none focus:border-[#E67E22] focus:shadow-[0_0_0_2px_rgba(230,126,34,0.1)]
            hover:border-[#D35400]
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
            placeholder:text-gray-400 placeholder:text-sm
            transition-all duration-200 ease-out
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-sm text-[#FF4D4F]">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
