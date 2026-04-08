'use client';

import React from 'react';
import { History, Sparkles } from 'lucide-react';

interface FormCardProps {
  children: React.ReactNode;
  className?: string;
}

export const FormCard: React.FC<FormCardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl p-4 shadow-card ${className}`}>
    {children}
  </div>
);

interface FormLabelProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  required?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({ children, icon, required }) => (
  <label className="font-semibold text-gray-800 flex items-center mb-2">
    {icon && <span className="mr-2">{icon}</span>}
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

interface FormInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  required = false,
  type = 'text'
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-tech-blue"
  />
);

interface FormTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  rows = 4,
  required = false
}) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    required={required}
    className="w-full p-3 bg-gray-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-tech-blue"
  />
);

interface FormSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={onChange}
    className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-tech-blue"
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

interface RadioGroupProps {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ options, selected, onChange }) => (
  <div className="space-y-2">
    {options.map((opt) => (
      <label key={opt.value} className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="radio-group"
          value={opt.value}
          checked={selected === opt.value}
          onChange={(e) => onChange(e.target.value)}
          className="accent-tech-blue"
        />
        <span className="text-gray-700">{opt.label}</span>
      </label>
    ))}
  </div>
);

interface ActionButtonsProps {
  onHistory?: () => void;
  onGenerate: () => void;
  generateLabel?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onHistory,
  onGenerate,
  generateLabel = '立刻生成',
  disabled = false,
  loading = false
}) => (
  <div className="flex space-x-3">
    {onHistory && (
      <button
        onClick={onHistory}
        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center space-x-2"
      >
        <History size={20} />
        <span>历史记录</span>
      </button>
    )}
    <button
      onClick={onGenerate}
      disabled={disabled || loading}
      className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all ${
        disabled || loading
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-gradient-to-r from-tech-blue to-tech-cyan text-white shadow-glow hover:shadow-lg'
      }`}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>生成中...</span>
        </>
      ) : (
        <>
          <Sparkles size={20} />
          <span>{generateLabel}</span>
        </>
      )}
    </button>
  </div>
);

interface BottomNoteProps {
  text: string;
}

export const BottomNote: React.FC<BottomNoteProps> = ({ text }) => (
  <p className="text-center text-xs text-gray-500 mt-2">{text}</p>
);

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => (
  <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
    <div className="px-4 py-4">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  </header>
);
