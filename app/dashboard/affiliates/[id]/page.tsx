"use client"

import { useParams } from "next/navigation"
import { DistributorProfile } from "@/components/affiliate-profile"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function DistributorDetailPage() {
  const params = useParams()
  const distributorId = params.id as string

  return (
    <ProtectedRoute 
      requiredRole={['super_admin', 'admin', 'manager']}
      fallback={
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to view distributor profiles.</p>
          </div>
        </div>
      }
    >
      <DistributorProfile distributorId={distributorId} />
    </ProtectedRoute>
  )
}
