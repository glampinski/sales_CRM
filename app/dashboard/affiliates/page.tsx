"use client"

import { AffiliateManagement } from "@/components/affiliate-management"
import PermissionGate from "@/components/permission-gate"

export default function AffiliatesPage() {
  return (
    <div className="p-6">
      {/* NEW APPROACH: Use PermissionGate for granular control */}
      <PermissionGate 
        permission="affiliates.canView"
        fallback={
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to view affiliate management.</p>
          </div>
        }
      >
        <AffiliateManagement />
      </PermissionGate>
    </div>
  )
}

/* MIGRATION GUIDE:
 * 
 * OLD APPROACH (deprecated):
 * <ProtectedRoute requiredRole={['super_admin', 'admin']}>
 *   <AffiliateManagement />
 * </ProtectedRoute>
 * 
 * NEW APPROACH (recommended):
 * <PermissionGate permission="affiliates.canView">
 *   <AffiliateManagement />
 * </PermissionGate>
 * 
 * Benefits:
 * 1. More granular permission control
 * 2. Easier to maintain and understand
 * 3. Super Admin automatically sees everything
 * 4. Permission-based instead of role-based
 * 5. No hardcoded role checks
 */
