// components/layout/Sidebar.tsx
// Navigation sidebar

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Building2,
  BarChart3,
  Settings,
} from 'lucide-react';

const navItems = [
  {
    title: 'לוח בקרה',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'הזמנות רכש',
    href: '/purchase-orders',
    icon: ShoppingCart,
  },
  {
    title: 'קטלוג פריטים',
    href: '/items',
    icon: Package,
  },
  {
    title: 'ספקים',
    href: '/suppliers',
    icon: Building2,
  },
  {
    title: 'דוחות',
    href: '/reports',
    icon: BarChart3,
  },
  {
    title: 'ניהול משתמשים',
    href: '/admin/users',
    icon: Users,
    adminOnly: true,
  },
  {
    title: 'הגדרות',
    href: '/admin/settings',
    icon: Settings,
    adminOnly: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-64 border-l bg-gray-50">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-gray-100 text-gray-700'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
