export interface Referral {
  id: string;
  referrer_id: string;
  referred_id?: string;
  referral_code: string;
  status: 'pending' | 'completed' | 'rewarded';
  reward_amount: number;
  created_at: string;
  completed_at?: string;
  conversion_value?: number;
}

export interface Affiliate {
  id: string;
  user_id: string;
  affiliate_code: string;
  company_name?: string;
  contact_email: string;
  contact_phone?: string;
  commission_rate: number;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  payment_method?: string;
  payment_details?: any;
  total_earnings: number;
  created_at: string;
  approved_at?: string;
}

export interface ReferralLink {
  id: string;
  affiliate_id: string;
  link_type: 'landing' | 'onboarding';
  base_url: string;
  tracking_code: string;
  created_at: string;
  clicks: number;
  conversions: number;
}

export interface ReferralStats {
  total_referrals: number;
  pending_referrals: number;
  completed_referrals: number;
  total_earnings: number;
  pending_commissions: number;
  conversion_rate: number;
  click_count: number;
}
