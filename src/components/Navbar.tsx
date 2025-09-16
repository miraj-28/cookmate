'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiHome, FiSearch, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Don't show navbar on login/signup pages
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const navItems = [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '/search', label: 'Search Recipes', icon: FiSearch },
    { href: '/favorites', label: 'Favorites', icon: FiHeart },
  ];

  return (
    <nav className="bg-orange-500 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-yellow-100 drop-shadow-lg">
                CookMate
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-yellow-100 bg-opacity-30 text-yellow-900 shadow-lg'
                      : 'text-yellow-100 text-opacity-90 hover:text-yellow-900 hover:bg-yellow-100 hover:bg-opacity-30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/profile"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-yellow-100 text-opacity-90 hover:text-yellow-900 hover:bg-yellow-100 hover:bg-opacity-30 transition-all duration-200"
            >
              <FiUser className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-yellow-100 text-opacity-90 hover:text-yellow-900 hover:bg-yellow-100 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-100 focus:ring-opacity-50 transition-all duration-200"
            >
              {isMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white bg-opacity-10 backdrop-blur-sm border-t border-white border-opacity-20">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-yellow-100 bg-opacity-30 text-yellow-900 shadow-lg'
                        : 'text-yellow-100 text-opacity-90 hover:text-yellow-900 hover:bg-yellow-100 hover:bg-opacity-30'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-yellow-100 text-opacity-90 hover:text-yellow-900 hover:bg-yellow-100 hover:bg-opacity-30 transition-all duration-200"
              >
                <FiUser className="w-5 h-5" />
                <span>Profile</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}