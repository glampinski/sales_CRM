"use client"

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ReferralService } from '@/lib/referral-service';

interface ReferralTrackerProps {
  children: React.ReactNode;
  userId?: string; // Allow passing userId directly for dynamic routes
}

export function ReferralTracker({ children, userId }: ReferralTrackerProps) {
  const searchParams = useSearchParams();
  const referralService = ReferralService.getInstance();

  useEffect(() => {
    // Check for referral parameter in URL first, then use passed userId
    const refCode = searchParams.get('ref') || userId;
    
    if (refCode) {
      // Track the referral click
      referralService.trackReferralClick(refCode);
      
      // Optional: Show a toast notification
      console.log(`Referral tracked: ${refCode}`);
    }
  }, [searchParams, userId, referralService]);

  return <>{children}</>;
}
