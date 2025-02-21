'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track views on the home page
    if (pathname === '/') {
      fetch('/api/analytics/page-view', { method: 'POST' });
    }
  }, [pathname]);

  return null; // This component doesn't render anything
} 