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
  Clock,
  Share2,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReferralService } from "@/lib/referral-service";
import { ReferralStats, Referral, ReferralLink } from "@/types/referral";

interface ReferralDashboardProps {
  userId: string;
  userEmail: string;
}

export function ReferralDashboard({ userId, userEmail }: ReferralDashboardProps) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const referralService = ReferralService.getInstance();
  const userReferralCode = referralService.generateReferralCode(userId);

  useEffect(() => {
    loadReferralData();
  }, [userId]);

  const loadReferralData = async () => {
    try {
      setLoading(true);
      const [statsData, referralsData] = await Promise.all([
        referralService.getUserReferralStats(userId),
        referralService.getUserReferrals(userId)
      ]);
      
      setStats(statsData);
      setReferrals(referralsData);
      setReferralLinks(referralService.generateReferralLinks(userReferralCode));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_referrals}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pending_referrals} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.total_earnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              ${stats?.pending_commissions.toFixed(2)} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.conversion_rate}%</div>
            <p className="text-xs text-muted-foreground">
              From {stats?.click_count} clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral Code</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{userReferralCode}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyToClipboard(userReferralCode, 'Referral code')}
              className="p-0 h-auto text-xs"
            >
              Copy code
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Referral Links and Management */}
      <Tabs defaultValue="links" className="space-y-4">
        <TabsList>
          <TabsTrigger value="links">Referral Links</TabsTrigger>
          <TabsTrigger value="history">Referral History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Links</CardTitle>
              <CardDescription>
                Share these links to track referrals and earn commissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {referralLinks.map((link) => (
                <div key={link.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium capitalize">{link.link_type} Page</h4>
                    <Badge variant="outline">
                      {link.clicks} clicks • {link.conversions} conversions
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={link.base_url} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(link.base_url, `${link.link_type} link`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openLink(link.base_url)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {link.link_type === 'landing' && 'Use this link on your website or marketing materials'}
                    {link.link_type === 'onboarding' && 'Direct customers to the onboarding process'}
                    {link.link_type === 'signup' && 'Direct link to customer signup page'}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
              <CardDescription>
                Track the status of your referrals and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Referral #{referral.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Code: {referral.referral_code}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(referral.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <Badge 
                        variant={
                          referral.status === 'completed' ? 'default' :
                          referral.status === 'pending' ? 'secondary' : 'outline'
                        }
                      >
                        {referral.status}
                      </Badge>
                      {referral.reward_amount > 0 && (
                        <p className="text-sm font-medium text-green-600">
                          +${referral.reward_amount.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral Analytics</CardTitle>
              <CardDescription>
                Detailed performance metrics for your referral program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Performance Summary</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Click-through rate:</span>
                      <span>{stats?.conversion_rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average commission:</span>
                      <span>${(stats?.total_earnings! / Math.max(stats?.completed_referrals!, 1)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success rate:</span>
                      <span>{((stats?.completed_referrals! / Math.max(stats?.total_referrals!, 1)) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Recent Activity</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>• 3 clicks this week</p>
                    <p>• 1 conversion this month</p>
                    <p>• Last referral: 5 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
