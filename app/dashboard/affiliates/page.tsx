"use client"

import { AffiliateManagement } from "@/components/affiliate-management"
// Temporarily removing auth for testing
// import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function AffiliatesPage() {
  return (
    <div className="p-6">
      <AffiliateManagement />
    </div>
  )
}

// Commented out for testing - re-enable when auth is working
/*
export default function DistributorsPage() {
  return (
    <ProtectedRoute 
      
      fallback={
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to manage distributors.</p>
          </div>
        </div>
      }
    >
      <DistributorManagement />
    </ProtectedRoute>
  )
}
*/
