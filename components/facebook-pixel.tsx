"use client"

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initFacebookPixel, trackPageView } from '@/lib/facebook-pixel';

export default function FacebookPixel() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Facebook Pixel on client side
    initFacebookPixel();
  }, []);

  useEffect(() => {
    // Track page views on route changes
    trackPageView();
  }, [pathname]);

  return null;
}