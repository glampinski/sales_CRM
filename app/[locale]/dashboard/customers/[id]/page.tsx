"use client"

import { useParams } from "next/navigation"
import { CustomerProfile } from "@/components/customer-profile"

export default function CustomerDetailPage() {
  const params = useParams()
  const customerId = params.id as string

  return (
    <div className="p-6">
      <CustomerProfile customerId={customerId} />
    </div>
  )
}
