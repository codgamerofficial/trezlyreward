
'use client';

import type {ReactNode} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {LayoutGrid, Trophy, Sparkles, User, PiggyBank, BarChart3, LogOut, LogIn, CandlestickChart} from 'lucide-react';

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
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';


const menuItems = [
  {href: '/', label: 'Explorer', icon: LayoutGrid},
  {href: '/leaderboard', label: 'Leaderboard', icon: Trophy},
  {href: '/invest', label: 'Invest', icon: PiggyBank},
  {href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  {href: '/trading', label: 'Trading', icon: CandlestickChart},
  {href: '/ai-namer', label: 'AI Namer', icon: Sparkles},
];

export function AppLayout({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const currentPage =
    menuItems.find(item => pathname.startsWith(item.href) && item.href !== '/') ||
    menuItems.find(item => item.href === pathname) ||
    (pathname.startsWith('/profile') ? { label: 'Profile' } : { label: 'Explorer' });
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }


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
           <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
             <h2 className="text-2xl font-headline font-bold text-primary hidden sm:block">
              {currentPage.label}
            </h2>
            <nav className="hidden lg:flex items-center gap-4 text-sm font-medium">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
           </div>
          <div className="flex items-center gap-4">
            {user ? (
               <Button variant="secondary" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
            <Link href="/profile">
              <Avatar>
                <AvatarImage
                  src="https://placehold.co/100x100.png"
                  alt="User Avatar"
                  data-ai-hint="avatar abstract"
                />
                <AvatarFallback>
                  {user ? user.email?.substring(0, 2).toUpperCase() : 'TZ'}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
