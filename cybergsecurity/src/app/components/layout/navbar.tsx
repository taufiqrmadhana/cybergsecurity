'use client'; 

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  email: string;
  role: string;
  exp: number;
}

const navLinks = [
  { name: 'Dashboard', href: '/pages/dashboard' },
  { name: 'Storage', href: '/pages/storage' },
  { name: 'Review', href: '/pages/review' },
];

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);

        const userEmail = decoded.email || 'User';
        const userRole = decoded.role || 'Guest';

        setUser({
          name: userEmail.split('@')[0],
          role: userRole.charAt(0).toUpperCase() + userRole.slice(1),
        });

      } catch (error) {
        localStorage.removeItem('access_token');
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    
    setUser(null);

    router.push('/auth/login');
  };

  const userName = user?.name || 'User';
  const userRole = user?.role || '...';

  return (
    <nav className="relative bg-[var(--color-blue-darkest)] text-white shadow-md">
      <div className="w-full px-10 py-3 flex justify-between items-center">
        
        <Link href="/pages/dashboard" className="flex items-center gap-3">
          <Image 
            src="/images/logo2.svg" 
            alt="NeoContract Logo"
            width={32}
            height={32}
            className='h-10 w-auto'
          />
        </Link>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-12">
          {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                  <div key={link.name} className="relative">
                      {isActive && (
                          <span 
                              className="absolute inset-0 bg-white opacity-20 rounded-full transition-all duration-300 ease-in-out"
                              aria-hidden="true" 
                          ></span>
                      )}
                      
                      <Link
                          href={link.href}
                          className={`relative z-10 px-3 py-2 text-md font-semibold transition-colors duration-200
                              ${
                                  isActive
                                      ? 'text-white font-bold' 
                                      : 'text-gray-300 hover:text-white'
                              }
                          `}
                      >
                          {link.name}
                      </Link>
                  </div>
              );
          })}
      </div>

        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 hover:opacity-90 p-2 rounded-lg cursor-pointer transition-colors duration-200"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Image
              src="/images/avatar.png" 
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="hidden md:block text-[var(--color-blue-darkest)]">
              <p className="font-semibold text-sm text-white">{userName}</p>
              <p className="text-xs opacity-70 text-white">{userRole}</p>
            </div>
          </div>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};