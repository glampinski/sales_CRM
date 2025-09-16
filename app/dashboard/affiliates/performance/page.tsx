"use client"

import { PerformanceTracking } from "@/components/performance-tracking"
import PermissionGate from "@/components/permission-gate"

export default function DistributorPerformancePage() {
  return (
    <PermissionGate 
      permission="affiliates.canView"
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
    </PermissionGate>
  )
}
