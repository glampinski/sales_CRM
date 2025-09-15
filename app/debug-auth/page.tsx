"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'

export default function DebugAuthPage() {
  const { user, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4">Auth Debug Page</h1>
        <div>Loading client-side data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Page</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
        </div>
        
        <div>
          <strong>User:</strong> 
          <pre className="bg-gray-100 p-2 rounded mt-2">
            {user ? JSON.stringify(user, null, 2) : 'null'}
          </pre>
        </div>
        
        <div>
          <strong>LocalStorage auth_user:</strong> 
          <pre className="bg-gray-100 p-2 rounded mt-2">
            {localStorage.getItem('auth_user') || 'null'}
          </pre>
        </div>
        
        <div>
          <strong>LocalStorage impersonation_data:</strong> 
          <pre className="bg-gray-100 p-2 rounded mt-2">
            {localStorage.getItem('impersonation_data') || 'null'}
          </pre>
        </div>
        
        <button 
          onClick={() => {
            localStorage.clear()
            window.location.reload()
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear Session & Reload
        </button>
        
        <button 
          onClick={() => {
            window.location.href = '/'
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4"
        >
          Go to Home Page
        </button>
      </div>
    </div>
  )
}
