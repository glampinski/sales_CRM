"use client"

import { CommissionDashboard } from "@/components/commission-dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function CommissionPage() {
  return (
    <ProtectedRoute 
      
      fallback={
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to view commission data.</p>
          </div>
        </div>
      }
    >
      <div className="p-6">
        <CommissionDashboard />
      </div>
    </ProtectedRoute>
  )
}
