'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavigationMenu() {
  const pathname = usePathname();
  
  const menuItems = [
    { href: '/', label: '🐙 Dashboard', description: 'Fuzzy-Octo Principal' },
    { href: '/analytics', label: '📊 Analytics', description: 'Métriques & Insights' },
    { href: '/productivity', label: '🤖 Productivité', description: 'Assistant IA' },
    { href: '/automation', label: '⚡ Automation', description: 'Workflows' }
  ];

  return (
    <nav className="bg-gray-800/90 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-6 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === item.href
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <div>{item.label}</div>
              <div className="text-xs opacity-75">{item.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
