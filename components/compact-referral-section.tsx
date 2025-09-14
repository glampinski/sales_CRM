"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  ExternalLink, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Share2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReferralService } from "@/lib/referral-service";
import { ReferralStats, ReferralLink } from "@/types/referral";

interface CompactReferralSectionProps {
  userId: string;
  userEmail: string;
}

export function CompactReferralSection({ userId, userEmail }: CompactReferralSectionProps) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const referralService = ReferralService.getInstance();
  const userReferralCode = userId; // Use userId directly instead of generated code

  useEffect(() => {
    loadReferralData();
  }, [userId]);

  const loadReferralData = async () => {
    try {
      setLoading(true);
      const statsData = await referralService.getUserReferralStats(userId);
      setStats(statsData);
      setReferralLinks(referralService.generateReferralLinks(userId));
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Referral System
            </CardTitle>
            <CardDescription>
              Share your referral links and earn commissions
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats?.total_referrals}</div>
            <p className="text-xs text-muted-foreground">Total Referrals</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${stats?.total_earnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total Earnings</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats?.conversion_rate}%</div>
            <p className="text-xs text-muted-foreground">Conversion Rate</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{userReferralCode}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyToClipboard(userReferralCode, 'Referral code')}
              className="p-0 h-auto text-xs"
            >
              Copy Code
            </Button>
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">Quick Signup Link</p>
              <p className="text-xs text-muted-foreground">Direct customers to signup</p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(referralLinks.find(l => l.link_type === 'signup')?.base_url || '', 'Signup link')}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(referralLinks.find(l => l.link_type === 'signup')?.base_url || '', '_blank')}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            <div>
              <h4 className="font-medium mb-3">All Referral Links</h4>
              <div className="space-y-3">
                {referralLinks.map((link) => (
                  <div key={link.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium capitalize text-sm">{link.link_type} Page</h5>
                      <Badge variant="outline" className="text-xs">
                        {link.clicks} clicks
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Input 
                        value={link.base_url} 
                        readOnly 
                        className="font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(link.base_url, `${link.link_type} link`)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(link.base_url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Performance Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Pending referrals:</span>
                    <span className="font-medium">{stats?.pending_referrals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed referrals:</span>
                    <span className="font-medium text-green-600">{stats?.completed_referrals}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Pending commissions:</span>
                    <span className="font-medium">${stats?.pending_commissions.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total clicks:</span>
                    <span className="font-medium">{stats?.click_count}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
