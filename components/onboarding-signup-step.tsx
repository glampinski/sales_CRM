"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Users, User } from 'lucide-react';
import type { OnboardingData } from './onboarding-flow';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface OnboardingSignupStepProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  canProceed: boolean;
  referralUserId?: string;
}

export function OnboardingSignupStep({ 
  data, 
  updateData, 
  onNext, 
  canProceed, 
  referralUserId 
}: OnboardingSignupStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (formData: SignupFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create user data
      const userData = {
        id: `user_${Date.now()}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        createdAt: new Date().toISOString(),
        referralUserId: referralUserId
      };

      // Update onboarding data with user info
      updateData({
        ...data,
        userInfo: userData
      });

      toast({
        title: "Account Created!",
        description: referralUserId 
          ? `Welcome! You were referred by ${referralUserId}` 
          : "Welcome to Glampinski!",
      });

      // Continue to next step
      onNext();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get selected share info for display
  const getShareInfo = () => {
    switch(data.shareLevel) {
      case 'full': return { name: 'Full Share', price: '€150,000', fraction: '1/1' };
      case 'half': return { name: '1/2 Share', price: '€80,000', fraction: '1/2' };
      case 'quarter': return { name: '1/4 Share', price: '€42,500', fraction: '1/4' };
      case 'eighth': return { name: '1/8 Share', price: '€25,000', fraction: '1/8' };
      default: return null;
    }
  };

  const shareInfo = getShareInfo();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <User className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Create Your Account</h2>
        <p className="text-muted-foreground mt-2">
          Complete your registration to secure your timeshare investment
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Referral Info */}
        {referralUserId && (
          <Alert className="border-blue-200 bg-blue-50">
            <Users className="h-4 w-4" />
            <AlertDescription className="flex items-center gap-2">
              You&apos;re joining through a referral from: 
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {referralUserId}
              </Badge>
            </AlertDescription>
          </Alert>
        )}

        {/* Selected Share Summary */}
        {shareInfo && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-900">{shareInfo.name}</h3>
                  <p className="text-sm text-green-700">Selected timeshare option</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-900">{shareInfo.price}</div>
                  <div className="text-sm text-green-700">{shareInfo.fraction} ownership</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    placeholder="John"
                    disabled={isLoading}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    placeholder="Doe"
                    disabled={isLoading}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="john@example.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+1 (555) 123-4567"
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  size="lg" 
                  className="px-8"
                >
                  {isLoading ? "Creating Account..." : "Create Account & Continue"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
