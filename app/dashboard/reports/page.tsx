"use client"

import { ReportsDashboard } from "@/components/reports-dashboard"
import PermissionGate from "@/components/permission-gate"

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-6">
      <PermissionGate 
        permission="reports.canView"
        fallback={
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to view reports.</p>
          </div>
        }
      >
        <ReportsDashboard />
      </PermissionGate>
    </div>
  )
}