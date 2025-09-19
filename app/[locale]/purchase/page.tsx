import { Suspense } from "react"
import { EmbeddedPurchaseFlow } from "@/components/embedded-purchase-flow"

interface PurchasePageProps {
  searchParams: {
    customerId?: string
    shareLevel?: "full" | "half" | "quarter" | "eighth"
  }
}

// Mock function to get customer data - in real app this would fetch from API
function getCustomerData(customerId: string) {
  const mockCustomers = {
    "cust-001": {
      id: "cust-001",
      name: "Alessandro Rossi",
      email: "alessandro.rossi@email.com",
      phone: "+39 340 123 4567",
      avatar: "/placeholder-user.jpg",
      tier: "vip" as const,
      totalOrders: 2,
      totalSpent: 175000
    },
    "cust-002": {
      id: "cust-002", 
      name: "Emma Thompson",
      email: "emma.thompson@email.com",
      phone: "+44 7700 123456",
      avatar: "/placeholder-user.jpg",
      tier: "premium" as const,
      totalOrders: 1,
      totalSpent: 80000
    },
    "cust-003": {
      id: "cust-003",
      name: "Klaus Mueller", 
      email: "klaus.mueller@email.com",
      phone: "+49 170 123 4567",
      tier: "standard" as const,
      totalOrders: 1,
      totalSpent: 21250
    }
  }
  
  return mockCustomers[customerId as keyof typeof mockCustomers] || null
}

export default function PurchasePage({ searchParams }: PurchasePageProps) {
  const { customerId, shareLevel } = searchParams
  const customer = customerId ? getCustomerData(customerId) : null

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmbeddedPurchaseFlow 
        customer={customer || undefined}
        selectedShareLevel={shareLevel}
      />
    </Suspense>
  )
}
