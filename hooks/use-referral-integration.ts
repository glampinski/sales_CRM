"use client"

import { useEffect, useState } from 'react';
import { ReferralService } from '@/lib/referral-service';
import { Referral } from '@/types/referral';

export function useReferralIntegration() {
  const [referralAttribution, setReferralAttribution] = useState<string | null>(null);
  const referralService = ReferralService.getInstance();

  useEffect(() => {
    // Check for referral attribution on component mount
    const attribution = referralService.getReferralAttribution();
    setReferralAttribution(attribution);
  }, [referralService]);

  const processSignupReferral = (userData: any): Referral | null => {
    return referralService.processReferralSignup(userData);
  };

  const hasReferralAttribution = () => {
    return referralAttribution !== null;
  };

  const getReferralCode = () => {
    return referralAttribution;
  };

  return {
    hasReferralAttribution,
    getReferralCode,
    processSignupReferral,
    referralAttribution
  };
}
