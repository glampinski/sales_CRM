"use client"

import { DistributorManagement } from "@/components/distributor-management"
// Temporarily removing auth for testing
// import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function DistributorsPage() {
  return (
    <div className="p-6">
      <DistributorManagement />
    </div>
  )
}

// Commented out for testing - re-enable when auth is working
/*
export default function DistributorsPage() {
  return (
    <ProtectedRoute 
      requiredRole={['super_admin', 'admin', 'manager', 'salesperson']}
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
