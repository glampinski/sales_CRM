# Purchasing Components

This directory contains all components related to the purchasing process for the MLM CRM system.

## Structure

```
purchasing/
├── cart/                 # Shopping cart components
├── checkout/            # Checkout flow components
├── products/            # Product catalog components
├── orders/              # Order management components
├── payments/            # Payment processing components
└── subscription/        # Subscription management components
```

## Integration Points

### MLM-Specific Features
- **PV Calculation**: Product Volume tracking for commission calculations
- **Distributor Assignment**: Orders automatically assigned to distributors
- **Commission Triggers**: Order completion triggers commission calculations
- **Genealogy Updates**: Customer assignments update downline structures

### Key Components
- `ProductCatalog` - Browse and select products
- `ShoppingCart` - Cart management with PV calculations
- `CheckoutFlow` - Multi-step checkout process
- `PaymentProcessor` - Handle payments via Stripe
- `OrderConfirmation` - Order success and tracking
- `SubscriptionManager` - Auto-ship and recurring orders

## Usage

```tsx
import { ProductCatalog } from '@/components/purchasing/products';
import { ShoppingCart } from '@/components/purchasing/cart';
import { CheckoutFlow } from '@/components/purchasing/checkout';

// Example implementation in a page
export default function ShopPage() {
  return (
    <div className="container mx-auto">
      <ProductCatalog distributorId={session.user.id} />
      <ShoppingCart />
      <CheckoutFlow />
    </div>
  );
}
```

## Data Flow

1. **Product Selection** → Cart with PV calculations
2. **Customer Info** → Assign to distributor genealogy
3. **Payment Processing** → Stripe integration
4. **Order Creation** → Database with audit trail
5. **Commission Trigger** → Background job for calculations
6. **Confirmation** → Email/SMS notifications
