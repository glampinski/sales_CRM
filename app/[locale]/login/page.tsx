"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield } from 'lucide-react'

const TEST_USERS = [
  { id: '1', name: 'Super Admin', email: 'superadmin@glampinski.com', role: 'super_admin', password: 'admin123' },
  { id: '2', name: 'Department Head', email: 'admin@glampinski.com', role: 'admin', password: 'admin123' },
  { id: '3', name: 'Department Employee', email: 'manager@glampinski.com', role: 'manager', password: 'manager123' },
  { id: '4', name: 'John Customer', email: 'customer@example.com', role: 'customer', password: 'customer123' },
  { id: '5', name: 'Jane Affiliate', email: 'affiliate@glampinski.com', role: 'affiliate', password: 'affiliate123' }
]

export default function DirectLoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleDirectLogin = (testUser: typeof TEST_USERS[0]) => {
    setIsLoading(true)
    
    // Clear any existing data
    localStorage.clear()
    
    // Set the user directly
    const userWithTimestamps = {
      ...testUser,
      createdAt: '2024-01-01',
      lastLogin: new Date().toISOString()
    }
    
    localStorage.setItem('auth_user', JSON.stringify(userWithTimestamps))
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Direct Login (Debug)</CardTitle>
          <CardDescription>
            Click any button to login directly as that user
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {TEST_USERS.map((user) => (
            <Button
              key={user.id}
              onClick={() => handleDirectLogin(user)}
              disabled={isLoading}
              className="w-full"
              variant={user.role === 'super_admin' ? 'default' : 'outline'}
            >
              Login as {user.name} ({user.role.replace('_', ' ')})
            </Button>
          ))}
          
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Logging in...</p>
            </div>
          )}
          
          <div className="text-center pt-4">
            <Button
              variant="link"
              onClick={() => window.location.href = '/'}
              className="text-sm"
            >
              Back to Normal Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
