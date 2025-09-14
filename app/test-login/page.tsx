"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TestLoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Set up a test affiliate user directly in localStorage
    const testUser = {
      id: '5',
      name: 'Jane Affiliate',
      email: 'affiliate@glampinski.com',
      role: 'affiliate',
      createdAt: '2024-02-15',
      lastLogin: '2024-09-14'
    }
    
    localStorage.setItem('auth_user', JSON.stringify(testUser))
    
    // Redirect to dashboard
    router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Setting up test login...</h1>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
