"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClearSessionPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear all authentication data
    localStorage.removeItem('auth_user')
    localStorage.removeItem('impersonation_data')
    
    // Clear all localStorage
    localStorage.clear()
    
    // Clear sessionStorage too
    sessionStorage.clear()
    
    console.log('All session data cleared')
    
    // Redirect to home after clearing
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Clearing Session...</h1>
        <p className="text-muted-foreground">Removing all cached data and redirecting to login...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
