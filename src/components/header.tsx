'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Nihongo Flash
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === '/' ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              Flashcards
            </Link>
            <Link
              href="/admin"
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname?.startsWith('/admin')
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
