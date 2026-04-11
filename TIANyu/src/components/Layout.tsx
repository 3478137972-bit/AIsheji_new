import React, { useState } from 'react';
import { Tabs } from './Tabs';
import { Button } from './Button';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = true,
  onBack,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E0E0E0]">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-[#FAF3E0] rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="text-xl font-bold text-[#333333]">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export const TabBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  const tabs = [
    { id: 'home', label: '首页', icon: '🏠' },
    { id: 'hot', label: '热点灵感', icon: '🔥' },
    { id: 'ai', label: '智能广场', icon: '🤖' },
    { id: 'mine', label: '我的', icon: '😊' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] pb-safe">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex flex-col items-center gap-1
                transition-colors duration-200
                ${activeTab === tab.id ? 'text-[#E67E22]' : 'text-gray-400'}
              `}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;
