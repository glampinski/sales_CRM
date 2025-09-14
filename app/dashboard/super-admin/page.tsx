"use client"

import Link from 'next/link'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown, ArrowRight, Eye } from 'lucide-react'

export default function SuperAdminRedirectPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Crown className="h-8 w-8 text-yellow-500" />
              <CardTitle className="text-2xl">Super Admin Controls Moved</CardTitle>
            </div>
            <CardDescription className="text-base">
              The super admin management interface has been integrated into the main dashboard for better accessibility and control.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              Super admins can now access all management features directly from the main dashboard, 
              including permission control, user role management, and system oversight.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/dashboard" className="flex items-center">
                  <Crown className="h-4 w-4 mr-2" />
                  Go to Super Admin Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link href="/demo/super-admin" className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  View Demo Features</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
