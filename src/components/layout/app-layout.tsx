'use client';

import type {ReactNode} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {LayoutGrid, Trophy, Sparkles, User, Wallet, PiggyBank} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';

const menuItems = [
  {href: '/', label: 'Explorer', icon: LayoutGrid},
  {href: '/leaderboard', label: 'Leaderboard', icon: Trophy},
  {href: '/invest', label: 'Invest', icon: PiggyBank},
  {href: '/ai-namer', label: 'AI Namer', icon: Sparkles},
];

export function AppLayout({children}: {children: ReactNode}) {
  const pathname = usePathname();

  const currentPage =
    menuItems.find(item => pathname.startsWith(item.href) && item.href !== '/') ||
    menuItems.find(item => item.href === pathname) ||
    (pathname.startsWith('/profile') ? { label: 'Profile' } : { label: 'Explorer' });


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-primary"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <h1 className="text-xl font-headline font-semibold">Treazly</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map(item => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/profile'}
                tooltip="Profile"
              >
                <Link href="/profile">
                  <User />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <h2 className="text-2xl font-headline font-bold text-primary">
            {currentPage.label}
          </h2>
          <div className="flex items-center gap-4">
            <Button>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
            <Link href="/profile">
              <Avatar>
                <AvatarImage
                  src="https://placehold.co/100x100.png"
                  alt="User Avatar"
                  data-ai-hint="avatar abstract"
                />
                <AvatarFallback>TZ</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
