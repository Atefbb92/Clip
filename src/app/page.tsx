'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/firebase';

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Only redirect if we're on the root path
      if (pathname === '/') {
        if (user) {
          // User is signed in, redirect to profile
          router.push('/patients');
        } else {
          // User is signed out, redirect to signin
          router.push('/signin');
        }
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Diamond</h1>
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
}