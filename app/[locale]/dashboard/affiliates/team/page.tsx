"use client"

import { TeamHierarchy } from "@/components/team-hierarchy"
import PermissionGate from "@/components/permission-gate"

export default function DistributorTeamPage() {
  return (
    <PermissionGate 
      permission="affiliates.canView"
      fallback={
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to view team hierarchy.</p>
          </div>
        </div>
      }
    >
      <TeamHierarchy />
    </PermissionGate>
  )
}
