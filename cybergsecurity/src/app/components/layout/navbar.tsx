'use client'; 

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { useOnClickOutside } from '@/app/hooks/useOnclickOutside';
import { LogOut } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', href: '/pages/dashboard' },
  { name: 'Storage', href: '/pages/storage' },
  { name: 'Review', href: '/pages/review' },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useOnClickOutside(profileRef, () => setProfileOpen(false));

  return (
    <nav className="relative bg-[var(--color-blue-darkest)] text-white shadow-md z-50">
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
                <Link
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200 z-10
                    ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white'
                    }
                  `}
                >
                  {link.name}
                  
                  {isActive && (
                    <div className="absolute inset-0 -z-10 flex items-center justify-center">
                      <div className="w-full h-8 bg-[var(--color-blue-lightest)] rounded-full opacity-30"></div>
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-lg cursor-pointer transition-colors duration-200"
          >
            <Image
              src="/images/avatar.png" 
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="hidden md:block">
              <p className="font-semibold text-sm text-white">Muhammad Neo Cicero Codes</p>
              <p className="text-xs opacity-70 text-white">Staff</p>
            </div>
          </div>

          {isProfileOpen && (
            <div 
              className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200
                         origin-top-right animate-scale-in-ver-top"
            >
              <div className="p-2">
                <div className="my-1 h-px bg-slate-100" />
                <a href="/auth/login" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors font-medium">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};