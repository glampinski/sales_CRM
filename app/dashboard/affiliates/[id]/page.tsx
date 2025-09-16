"use client"

import { useParams } from "next/navigation"
import { UserProfile } from "@/components/user-profile"
import PermissionGate from "@/components/permission-gate"

export default function DistributorDetailPage() {
  const params = useParams()
  const distributorId = params.id as string

  return (
    <PermissionGate 
      permission="affiliates.canView"
      fallback={
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to view distributor profiles.</p>
          </div>
        </div>
      }
    >
      <UserProfile userId={distributorId} />
    </PermissionGate>
  )
}
