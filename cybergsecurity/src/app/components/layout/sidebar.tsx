'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type SubLink = { name: string; href: string };
type SidebarLink = { name: string; href: string; subLinks?: SubLink[] };

const sidebarLinks: SidebarLink[] = [
  { name: 'Overview', href: '/pages/dashboard/overview' },
  { name: 'Standards & Policies', href: '/pages/dashboard/standard-policies' },
  {
    name: 'Workflow',
    href: '/pages/dashboard/workflow',
    subLinks: [
      { name: 'New', href: '/pages/dashboard/workflow/new' },
      { name: 'On Verification', href: '/pages/dashboard/workflow/verification' },
      { name: 'On Review', href: '/pages/dashboard/workflow/review' },
      { name: 'Conflict', href: '/pages/dashboard/workflow/conflict' },
      { name: 'Accepted', href: '/pages/dashboard/workflow/accepted' },
    ],
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isWorkflowOpen, setWorkflowOpen] = useState(false);

  const getParentLinkClass = (link: SidebarLink, isActive: boolean) => {
    return `w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200
      ${
        isActive
          ? 'bg-slate-100 text-slate-900'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }
    `;
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-50 border-r border-slate-200 p-4">
      <nav className="flex flex-col space-y-1">
        {sidebarLinks.map((link) => {
          const isParentActive = pathname.startsWith(link.href);

          if (link.subLinks) {
            return (
              <div key={link.name}>
                <button
                  onClick={() => setWorkflowOpen(!isWorkflowOpen)}
                  className={getParentLinkClass(link, isParentActive)}
                >
                  <span>{link.name}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isWorkflowOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isWorkflowOpen ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="mt-2 ml-3 pl-4 border-l border-slate-200 flex flex-col space-y-1">
                    {link.subLinks.map((subLink) => {
                      const isSubActive = pathname === subLink.href;
                      return (
                        <Link
                          key={subLink.name}
                          href={subLink.href}
                          className={`relative block rounded-md px-3 py-2 text-sm transition-colors
                            ${
                              isSubActive
                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                : 'text-slate-500 hover:bg-slate-100'
                            }
                          `}
                        >
                          {isSubActive && (
                            <span className="absolute left-[-9px] top-1/2 -translate-y-1/2 h-[6px] w-[6px] bg-blue-600 rounded-full"></span>
                          )}
                          {subLink.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={link.name}
              href={link.href}
              className={getParentLinkClass(link, isParentActive)}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};