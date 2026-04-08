'use client';

import { useState } from 'react';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/templates', label: '模板中心' },
  { href: '/inspiration', label: '热点灵感' },
  { href: '/smart-square', label: '智能广场' },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-tech-blue to-tech-cyan bg-clip-text text-white">
              秒懂 AI
            </div>
            <span className="hidden md:inline text-sm text-gray-500">超级员工</span>
          </Link>

          {/* 导航菜单 - 桌面端显示 */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-tech-blue font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 搜索框 - 桌面端显示 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索功能、模板..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-tech-blue focus:outline-none focus:ring-2 focus:ring-tech-blue/20 transition-all"
              />
            </div>
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* 搜索按钮 - 移动端显示 */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Search size={20} className="text-gray-600" />
            </button>

            {/* 通知按钮 */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* 用户头像 */}
            <button className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tech-blue to-tech-cyan flex items-center justify-center text-white font-semibold text-sm">
                U
              </div>
            </button>

            {/* 汉堡菜单 - 移动端显示 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X size={20} className="text-gray-600" />
              ) : (
                <Menu size={20} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {/* 搜索框 */}
            <div className="relative mb-4">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索功能、模板..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-tech-blue focus:outline-none focus:ring-2 focus:ring-tech-blue/20 transition-all"
              />
            </div>

            {/* 导航链接 */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-tech-blue rounded-lg font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
