"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Copy, 
  ExternalLink, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Share2,
  Link2,
  BarChart3,
  Eye,
  Crown,
  Gift,
  Target,
  UserPlus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/contexts/PermissionContext-simple";
import { useTranslations } from 'next-intl';
import { ReferralService } from "@/lib/referral-service";
import { ReferralStats, ReferralLink } from "@/types/referral";

interface ReferralDashboardSectionProps {
  userId: string;
  userEmail: string;
  userRole?: string;
}

export function ReferralDashboardSection({ userId, userEmail, userRole }: ReferralDashboardSectionProps) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const permissions = usePermissions();
  const t = useTranslations('referrals');
  
  const referralService = ReferralService.getInstance();
  const userReferralCode = userId;

  // Check if user has permission to view referrals
  if (!permissions.hasModuleAccess('referrals')) {
    return null;
  }

  useEffect(() => {
    loadReferralData();
  }, [userId]);

  const loadReferralData = async () => {
    try {
      setLoading(true);
      const statsData = await referralService.getUserReferralStats(userId);
      const linksData = referralService.generateReferralLinks(userId, userRole);
      setStats(statsData);
      setReferralLinks(linksData);
    } catch (error) {
      console.error('Error loading referral data:', error);
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: t('messages.copied'),
        description: t('messages.copiedToClipboard', { type }),
      });
    } catch (error) {
      toast({
        title: t('messages.error'),
        description: t('messages.failedToCopy'),
        variant: "destructive",
      });
    }
  };

  // Simplified - no need for complex link creation

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-500" />
            <div>
              <CardTitle className="text-xl">{t('title')}</CardTitle>
              <CardDescription>
                {t('description')}
              </CardDescription>
            </div>
          </div>
          {permissions.permissions.referrals.canManage && (
            <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <Crown className="h-3 w-3 mr-1" />
              {t('premiumAccess')}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-card rounded-lg border">
            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{stats?.total_referrals || 0}</div>
            <div className="text-sm text-muted-foreground">{t('metrics.totalReferrals')}</div>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border">
            <DollarSign className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">${stats?.total_earnings?.toFixed(2) || '0.00'}</div>
            <div className="text-sm text-muted-foreground">{t('metrics.totalEarnings')}</div>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border">
            <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{stats?.conversion_rate?.toFixed(1) || '0.0'}%</div>
            <div className="text-sm text-muted-foreground">{t('metrics.conversionRate')}</div>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border">
            <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{stats?.pending_referrals || 0}</div>
            <div className="text-sm text-muted-foreground">{t('metrics.pending')}</div>
          </div>
        </div>

        {/* Simplified Referral Links */}
        <div className="grid gap-4">
          {/* Customer Onboarding Link */}
          <div className="p-4 bg-card rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">{t('links.customerOnboarding')}</h3>
              </div>
              <Badge variant="secondary">
                {t('links.customers')}
              </Badge>
            </div>
            <div className="bg-muted p-3 rounded border font-mono text-sm break-all mb-3 text-foreground">
              {referralLinks[0]?.base_url || 'https://example.com/customer-signup?ref=YOUR_CODE'}
            </div>
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => copyToClipboard(
                referralLinks[0]?.base_url || 'https://example.com/customer-signup?ref=YOUR_CODE',
                t('links.customers')
              )}
            >
              <Copy className="h-4 w-4 mr-2" />
              {t('actions.copyLink')}
            </Button>
          </div>

          {/* Affiliate Enrollment Link */}
          <div className="p-4 bg-card rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">{t('links.affiliateEnrollment')}</h3>
              </div>
              <Badge variant="secondary">
                {t('links.affiliates')}
              </Badge>
            </div>
            <div className="bg-muted p-3 rounded border font-mono text-sm break-all mb-3 text-foreground">
              {referralLinks[1]?.base_url || 'https://example.com/affiliate-signup?ref=YOUR_CODE'}
            </div>
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => copyToClipboard(
                referralLinks[1]?.base_url || 'https://example.com/affiliate-signup?ref=YOUR_CODE',
                t('links.affiliates')
              )}
            >
              <Copy className="h-4 w-4 mr-2" />
              {t('actions.copyLink')}
            </Button>
          </div>
        </div>

        {/* Quick Action */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
          <div>
            <div className="font-semibold">Start Earning Today!</div>
            <div className="text-sm opacity-90">Share your referral code: <code className="bg-white/20 px-2 py-1 rounded">{userReferralCode}</code></div>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => copyToClipboard(`https://glampinski.com/${userReferralCode}`, 'Referral link')}
          >
            Copy Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
