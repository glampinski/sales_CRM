import { InternalPurchaseFlow } from "@/components/internal-purchase-flow"
import { Suspense } from "react"

export default function InternalPurchasePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InternalPurchaseFlow />
    </Suspense>
  )
}
