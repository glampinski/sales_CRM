import { Referral, Affiliate, ReferralLink, ReferralStats } from '@/types/referral';

export class ReferralService {
  private static instance: ReferralService;
  
  static getInstance(): ReferralService {
    if (!ReferralService.instance) {
      ReferralService.instance = new ReferralService();
    }
    return ReferralService.instance;
  }

  // Generate unique referral code
  generateReferralCode(userId: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `REF_${userId.substring(0, 4).toUpperCase()}_${timestamp}_${random}`.toUpperCase();
  }

  // Generate tracking links for different purposes
  generateReferralLinks(userId: string): ReferralLink[] {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://glampinski.com';
    
    return [
      {
        id: `landing_${userId}`,
        affiliate_id: userId,
        link_type: 'landing',
        base_url: `${baseUrl}/${userId}`,
        tracking_code: userId,
        created_at: new Date().toISOString(),
        clicks: 0,
        conversions: 0
      },
      {
        id: `onboarding_${userId}`,
        affiliate_id: userId,
        link_type: 'onboarding',
        base_url: `${baseUrl}/${userId}/onboarding`,
        tracking_code: userId,
        created_at: new Date().toISOString(),
        clicks: 0,
        conversions: 0
      },
      {
        id: `signup_${userId}`,
        affiliate_id: userId,
        link_type: 'signup',
        base_url: `${baseUrl}/${userId}/signup`,
        tracking_code: userId,
        created_at: new Date().toISOString(),
        clicks: 0,
        conversions: 0
      }
    ];
  }

  // Track referral click from URL path
  trackReferralClick(userId: string): void {
    // Store in localStorage for now, later integrate with Supabase
    const clickData = {
      userId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };
    
    // Store for attribution
    localStorage.setItem('referral_source', userId);
    localStorage.setItem('referral_click_data', JSON.stringify(clickData));
    
    // Set cookie for longer attribution
    this.setCookie('ref_code', userId, 30); // 30 days
  }

  // Get referral attribution from storage
  getReferralAttribution(): string | null {
    return localStorage.getItem('referral_source') || this.getCookie('ref_code');
  }

  // Process signup with referral attribution
  processReferralSignup(userData: any): Referral | null {
    const referralUserId = this.getReferralAttribution();
    
    if (!referralUserId) return null;

    const referral: Referral = {
      id: `ref_${Date.now()}`,
      referrer_id: referralUserId,
      referred_id: userData.id,
      referral_code: referralUserId,
      status: 'pending',
      reward_amount: 0,
      created_at: new Date().toISOString()
    };

    // Clear attribution data
    localStorage.removeItem('referral_source');
    localStorage.removeItem('referral_click_data');
    this.deleteCookie('ref_code');

    return referral;
  }

  // Calculate commission based on conversion
  calculateCommission(conversionValue: number, commissionRate: number): number {
    return (conversionValue * commissionRate) / 100;
  }

  // Cookie utilities
  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // Mock data for development - replace with Supabase calls later
  async getUserReferralStats(userId: string): Promise<ReferralStats> {
    // This would be a Supabase query in production
    return {
      total_referrals: 15,
      pending_referrals: 3,
      completed_referrals: 12,
      total_earnings: 1250.00,
      pending_commissions: 375.00,
      conversion_rate: 12.5,
      click_count: 120
    };
  }

  async getUserReferrals(userId: string): Promise<Referral[]> {
    // Mock data - replace with Supabase query
    return [
      {
        id: 'ref_1',
        referrer_id: userId,
        referred_id: 'user_123',
        referral_code: `REF_${userId}_ABC123`,
        status: 'completed',
        reward_amount: 100.00,
        created_at: '2024-01-15T10:00:00Z',
        completed_at: '2024-01-16T15:30:00Z',
        conversion_value: 500.00
      },
      {
        id: 'ref_2',
        referrer_id: userId,
        referred_id: 'user_456',
        referral_code: `REF_${userId}_DEF456`,
        status: 'pending',
        reward_amount: 0,
        created_at: '2024-01-20T14:00:00Z'
      }
    ];
  }
}
