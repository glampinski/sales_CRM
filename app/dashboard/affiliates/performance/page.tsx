"use client"

import { PerformanceTracking } from "@/components/performance-tracking"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function DistributorPerformancePage() {
  return (
    <ProtectedRoute 
      
      fallback={
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to view performance tracking.</p>
          </div>
        </div>
      }
    >
      <PerformanceTracking />
    </ProtectedRoute>
  )
}
