"use client"

import React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ImpersonationBanner } from "@/components/impersonation-banner"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { PermissionProvider } from "@/contexts/PermissionContext-simple"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <PermissionProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <ImpersonationBanner />
              <DashboardHeader />
              <main 
                className="flex-1 overflow-auto bg-muted/10 relative"
                onClick={() => {
                  // Close any open dropdowns when clicking in main content
                  const event = new CustomEvent('closeDropdowns');
                  document.dispatchEvent(event);
                }}
              >
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </PermissionProvider>
    </ProtectedRoute>
  )
}
