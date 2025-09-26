'use client'; 

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Dashboard', href: '/pages/dashboard/overview' },
  { name: 'Storage', href: '/pages/storage' },
  { name: 'Review', href: '/pages/review' },
  { name: 'Settings', href: '/pages/settings' },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="relative bg-[var(--color-blue-darkest)] text-white shadow-md overflow-hidden">
      <div className="w-full px-10 py-3 flex justify-between items-center">
        
        <Link href="/dashboard" className="flex items-center gap-3">
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
                  className={`px-3 py-2 text-sm font-semibold transition-colors duration-200
                    ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white'
                    }
                  `}
                >
                  {link.name}
                </Link>
                {isActive && (
                  <div className="absolute -bottom-9.5 left-1/2 -translate-x-1/2 w-22 h-5 bg-[var(--color-accent-lightest)] rounded-lg"></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 bg-[var(--color-blue-lightest)] hover:opacity-90 p-2 rounded-lg cursor-pointer transition-colors duration-200">
          <Image
            src="/images/avatar.png" 
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="hidden md:block text-[var(--color-blue-darkest)]">
            <p className="font-semibold text-sm">Muhammad Neo Cicero Codes</p>
            <p className="text-xs opacity-70">Staff</p>
          </div>
        </div>

      </div>
    </nav>
  );
};