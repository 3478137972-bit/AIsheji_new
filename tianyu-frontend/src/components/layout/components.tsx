'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/button'
import { Menu, X, Moon, Sun } from 'lucide-react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cool-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary-600">
            TIANyu
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/dashboard" className="text-sm font-medium text-cool-600 hover:text-primary-600">
            Dashboard
          </Link>
          <Link href="/projects" className="text-sm font-medium text-cool-600 hover:text-primary-600">
            Projects
          </Link>
          <Link href="/team" className="text-sm font-medium text-cool-600 hover:text-primary-600">
            Team
          </Link>
          <Link href="/settings" className="text-sm font-medium text-cool-600 hover:text-primary-600">
            Settings
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="secondary" size="sm">
            Sign In
          </Button>
          <Button size="sm">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-cool-200 bg-white">
          <div className="container mx-auto flex flex-col px-4 py-4 space-y-2">
            <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-cool-600 hover:bg-cream-100 rounded-md">
              Dashboard
            </Link>
            <Link href="/projects" className="px-3 py-2 text-sm font-medium text-cool-600 hover:bg-cream-100 rounded-md">
              Projects
            </Link>
            <Link href="/team" className="px-3 py-2 text-sm font-medium text-cool-600 hover:bg-cream-100 rounded-md">
              Team
            </Link>
            <Link href="/settings" className="px-3 py-2 text-sm font-medium text-cool-600 hover:bg-cream-100 rounded-md">
              Settings
            </Link>
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm text-cool-600">
                {isDarkMode ? 'Dark' : 'Light'} Mode
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleTheme}
              >
                {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
              </Button>
            </div>
            <div className="flex space-x-2 pt-2">
              <Button variant="outline" className="flex-1">Sign In</Button>
              <Button className="flex-1">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
