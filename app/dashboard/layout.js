'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import {
  LayoutDashboard,
  Package,
  Tags,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/button';

const sidebarItems = [
  {
    title: 'לוח בקרה',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'מוצרים',
    href: '/dashboard/products',
    icon: Package,
  },
  {
    title: 'מותגים',
    href: '/dashboard/brands',
    icon: Tags,
  },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/sign-in';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className={`lg:hidden fixed top-16 ${sidebarOpen ? 'left-0' : 'right-0'} z-40 w-full`}>
        <Button
          className='bg-white w-full'
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X /> : <div className='flex items-center gap-2'><Menu /> <span>תפריט אדמן</span></div>}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-30 w-64 bg-white transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-full flex flex-col mt-24">
          <div className="flex-1 py-6 overflow-y-auto">
            <nav className="px-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100',
                      pathname === item.href && 'bg-gray-100 text-primary'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span>התנתק</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={cn(
          'transition-all duration-200 ease-in-out',
          'lg:mr-64 min-h-screen bg-gray-50'
        )}
      >
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
} 