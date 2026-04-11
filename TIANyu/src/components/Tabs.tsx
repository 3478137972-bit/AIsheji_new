import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'cream' | 'pills';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  className = '',
}) => {
  const baseStyles = 'flex gap-2';
  
  const variantStyles = {
    default: 'bg-[#F0F0F0] p-2 rounded-full w-fit',
    cream: 'bg-[#FAF3E0] p-2 rounded-full w-fit',
    pills: 'gap-4',
  };
  
  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            h-9 px-5 rounded-full text-sm font-medium
            transition-all duration-200 ease-out
            ${
              activeTab === tab.id
                ? 'bg-[#E67E22] text-white shadow-[0_2px_8px_rgba(230,126,34,0.2)]'
                : 'bg-transparent text-gray-600 hover:bg-[#E67E22]/10 hover:text-[#E67E22]'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

interface TabPanelProps {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  tabId,
  activeTab,
  children,
  className = '',
}) => {
  if (tabId !== activeTab) return null;
  
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default Tabs;
