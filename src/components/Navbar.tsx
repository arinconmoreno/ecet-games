'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { href: '/home', label: 'Inicio' },
  { href: '/games', label: 'Juegos' },
  { href: '/leaderboard', label: 'Posiciones' },
  { href: '/prizes', label: 'Premios' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.isAdmin;
  const userName = session?.user?.name || '';
  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <nav className="sticky top-0 z-50 bg-bg-nav border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-sofka-orange rounded-lg flex items-center justify-center">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                <path d="M13 8L1 15V1L13 8Z" fill="white" />
              </svg>
            </div>
            <span className="font-clash font-bold text-sm tracking-wide hidden sm:block">
              E-CET GAMES
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
                  pathname === item.href
                    ? 'bg-sofka-orange text-white'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
                  pathname === '/admin'
                    ? 'bg-sofka-teal text-white'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isAdmin && (
              <span className="hidden sm:inline-block text-xs font-semibold text-sofka-teal border border-sofka-teal/30 px-2 py-0.5 rounded">
                ADMIN
              </span>
            )}
            <div className="w-8 h-8 rounded-full bg-sofka-orange flex items-center justify-center text-xs font-bold text-white">
              {initials}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
