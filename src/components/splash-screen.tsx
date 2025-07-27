
'use client';

import {useEffect, useState} from 'react';
import {cn} from '@/lib/utils';

export function SplashScreen({ onFinished }: { onFinished: () => void }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2000); // Start fading out after 2 seconds

    const finishedTimer = setTimeout(() => {
        onFinished();
    }, 2500); // finish after fade out

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(finishedTimer);
    };
  }, [onFinished]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-in-out',
        isFadingOut ? 'opacity-0' : 'opacity-100',
      )}
    >
      <div className="flex items-center gap-4 text-primary animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-16 h-16"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        <h1 className="text-5xl font-headline font-semibold">Treazly</h1>
      </div>
      <p className="mt-4 text-muted-foreground">Initializing your experience...</p>
    </div>
  );
}
