
'use client';

import type {ReactNode} from 'react';
import './globals.css';
import {AppLayout} from '@/components/layout/app-layout';
import {Toaster} from '@/components/ui/toaster';
import Script from 'next/script';
import {SplashScreen} from '@/components/splash-screen';
import {useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isLoading, setIsLoading] = useState(isHome);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);


  // This is a temporary workaround for a Next.js bug where metadata is not
  // being set on the server.
  useEffect(() => {
    document.title = 'Treazly Explorer';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'A colorful, gamified NFT marketplace platform.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'A colorful, gamified NFT marketplace platform.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
        {isLoading && isHome ? (
          <SplashScreen onFinished={() => setIsLoading(false)} />
        ) : (
          <AppLayout>{children}</AppLayout>
        )}
        <Toaster />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}
