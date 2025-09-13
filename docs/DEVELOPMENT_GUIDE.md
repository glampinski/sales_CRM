# MLM CRM - Development Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 15+
- Redis 7+
- Git

### Environment Setup

1. **Clone the repository**
```bash
git clone https://github.com/glampinski/sales_CRM.git
cd sales_CRM
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mlm_crm"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# External Services
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
SENDGRID_API_KEY="SG...."
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."

# File Upload
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="mlm-crm-uploads"
```

4. **Database setup**
```bash
# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🏗️ Project Structure

```
sales_CRM/
├── .github/workflows/     # CI/CD pipelines
├── docs/                  # Documentation
├── prisma/               # Database schema and migrations
│   ├── migrations/       # Migration files
│   ├── seed.ts          # Database seeding
│   └── schema.prisma    # Prisma schema
├── public/              # Static files
├── src/
│   ├── app/             # Next.js app directory
│   │   ├── api/         # API routes
│   │   ├── auth/        # Authentication pages
│   │   ├── dashboard/   # Dashboard pages
│   │   └── globals.css  # Global styles
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # Base UI components
│   │   ├── forms/       # Form components
│   │   └── charts/      # Chart components
│   ├── lib/             # Utility functions
│   │   ├── auth.ts      # Authentication config
│   │   ├── db.ts        # Database connection
│   │   ├── email.ts     # Email utilities
│   │   └── utils.ts     # General utilities
│   ├── server/          # Server-side logic
│   │   ├── api/         # tRPC routers
│   │   ├── db/          # Database queries
│   │   └── services/    # Business logic
│   ├── types/           # TypeScript type definitions
│   └── hooks/           # React hooks
├── tests/               # Test files
│   ├── e2e/            # End-to-end tests
│   ├── integration/    # Integration tests
│   └── unit/           # Unit tests
├── .env.example        # Environment variables template
├── tailwind.config.js  # Tailwind CSS configuration
├── next.config.js      # Next.js configuration
└── package.json        # Dependencies and scripts
```

## 🔧 Development Workflows

### Creating New Features

1. **Create feature branch**
```bash
git checkout -b feature/add-commission-calculator
```

2. **Database changes**
If your feature requires database changes:
```bash
# Create migration
npx prisma migrate dev --name add_commission_calculator

# Update Prisma client
npx prisma generate
```

3. **API development**
Create tRPC router in `src/server/api/routers/`:
```typescript
// src/server/api/routers/commission.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const commissionRouter = createTRPCRouter({
  calculate: protectedProcedure
    .input(z.object({
      distributorId: z.string(),
      periodId: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      // Implementation here
    }),
});
```

4. **UI development**
Create components in `src/components/`:
```typescript
// src/components/commission/CommissionCalculator.tsx
export function CommissionCalculator({ distributorId }: Props) {
  const { data, isLoading } = api.commission.calculate.useQuery({
    distributorId,
    periodId: "2024-03"
  });

  // Component implementation
}
```

5. **Testing**
```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run specific test
npm run test -- CommissionCalculator
```

### Code Quality

#### Linting and Formatting
```bash
# Check code quality
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

#### Type Checking
```bash
# Check TypeScript types
npm run type-check
```

#### Pre-commit Hooks
We use Husky for pre-commit hooks:
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run type-check"
    }
  }
}
```

## 🧪 Testing Strategy

### Unit Tests (Vitest)
```typescript
// tests/unit/commission.test.ts
import { describe, it, expect } from 'vitest';
import { calculateCommission } from '@/lib/commission';

describe('Commission Calculator', () => {
  it('calculates retail commission correctly', () => {
    const result = calculateCommission({
      type: 'retail',
      amount: 100,
      rate: 0.25
    });
    
    expect(result).toBe(25);
  });
});
```

### Integration Tests
```typescript
// tests/integration/api/commission.test.ts
import { describe, it, expect } from 'vitest';
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/commission/calculate';

describe('/api/commission/calculate', () => {
  it('returns commission calculation', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        distributorId: 'test-123',
        periodId: '2024-03'
      }
    });

    await handler(req, res);
    
    expect(res._getStatusCode()).toBe(200);
  });
});
```

### E2E Tests (Playwright)
```typescript
// tests/e2e/commission.spec.ts
import { test, expect } from '@playwright/test';

test('commission calculation flow', async ({ page }) => {
  await page.goto('/dashboard/commission');
  
  // Fill form
  await page.fill('[data-testid="period-select"]', '2024-03');
  await page.click('[data-testid="calculate-button"]');
  
  // Verify results
  await expect(page.locator('[data-testid="commission-total"]')).toBeVisible();
});
```

## 📦 Component Development

### UI Component Guidelines

1. **Use Tailwind for styling**
```typescript
// Good
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Click me
</button>

// Better - use component variants
<Button variant="primary" size="medium">
  Click me
</Button>
```

2. **Follow component patterns**
```typescript
// src/components/ui/Button.tsx
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'medium', ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          // Variants
          {
            'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
            'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          },
          // Sizes
          {
            'h-8 px-3 text-sm': size === 'small',
            'h-10 px-4': size === 'medium',
            'h-12 px-6 text-lg': size === 'large',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

export { Button };
```

3. **Form components with validation**
```typescript
// src/components/forms/ContactForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register("name")}
          placeholder="Full Name"
          className="w-full px-3 py-2 border rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Contact"}
      </Button>
    </form>
  );
}
```

## 🗄️ Database Development

### Schema Changes
```bash
# Create migration
npx prisma migrate dev --name add_new_field

# Reset database (development only)
npx prisma migrate reset

# Apply migrations (production)
npx prisma migrate deploy
```

### Query Patterns
```typescript
// src/server/db/queries/contacts.ts
import { db } from "@/lib/db";

export async function getContactsByOwner(ownerId: string) {
  return db.contact.findMany({
    where: { ownerId },
    include: {
      tasks: {
        where: { status: "pending" },
        orderBy: { dueAt: "asc" }
      }
    },
    orderBy: { lastActivityAt: "desc" }
  });
}

export async function createContact(data: CreateContactData) {
  return db.$transaction(async (tx) => {
    const contact = await tx.contact.create({ data });
    
    // Create initial follow-up task
    await tx.task.create({
      data: {
        title: `Follow up with ${contact.name}`,
        type: "follow_up",
        assigneeId: contact.ownerId,
        contactId: contact.id,
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });
    
    return contact;
  });
}
```

## 🔐 Authentication Development

### Protected Routes
```typescript
// src/app/dashboard/layout.tsx
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav>Dashboard Navigation</nav>
      <main>{children}</main>
    </div>
  );
}
```

### Role-based Access
```typescript
// src/lib/auth.ts
export function hasPermission(
  userRole: UserRole,
  permission: Permission
): boolean {
  const rolePermissions = {
    admin: ['read', 'write', 'delete', 'config'],
    manager: ['read', 'write'],
    distributor: ['read'],
    support: ['read', 'write']
  };
  
  return rolePermissions[userRole]?.includes(permission) ?? false;
}

// Usage in components
export function AdminOnlyButton() {
  const { data: session } = useSession();
  
  if (!hasPermission(session?.user.role, 'config')) {
    return null;
  }
  
  return <Button>Admin Action</Button>;
}
```

## 📊 State Management

### Server State (TanStack Query)
```typescript
// src/hooks/useContacts.ts
import { api } from "@/lib/api";

export function useContacts(filters: ContactFilters) {
  return api.contacts.list.useQuery(filters, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
  });
}

export function useCreateContact() {
  const utils = api.useContext();
  
  return api.contacts.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch contacts
      utils.contacts.list.invalidate();
    },
  });
}
```

### Client State (Zustand)
```typescript
// src/stores/ui.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  currentView: 'kanban' | 'table';
  filters: ContactFilters;
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: 'kanban' | 'table') => void;
  updateFilters: (filters: Partial<ContactFilters>) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  currentView: 'kanban',
  filters: {},
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentView: (view) => set({ currentView: view }),
  updateFilters: (newFilters) => 
    set((state) => ({ 
      filters: { ...state.filters, ...newFilters } 
    })),
}));
```

## 🚀 Deployment

### Environment Setup
```bash
# Staging deployment
npm run build
npm run start

# Production deployment
docker build -t mlm-crm .
docker run -p 3000:3000 mlm-crm
```

### Database Migrations
```bash
# Production migration
NODE_ENV=production npx prisma migrate deploy

# Backup before migration
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Environment Variables Checklist
```env
# Required for production
NODE_ENV=production
NEXTAUTH_SECRET=your-production-secret
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# External services
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG....
TWILIO_ACCOUNT_SID=AC...

# Optional
SENTRY_DSN=https://...
ANALYTICS_ID=GA_...
```

## 📚 Useful Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

### Database
```bash
npx prisma studio    # Open Prisma Studio
npx prisma format    # Format schema file
npx prisma validate  # Validate schema
npx prisma db push   # Push schema changes (dev only)
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

### Utilities
```bash
npm run clean        # Clean build artifacts
npm run reset        # Reset database (dev only)
npm run seed         # Seed database
npm run generate     # Generate Prisma client
```

## 🐛 Debugging

### Common Issues

1. **Database connection issues**
```bash
# Check connection
npx prisma db pull

# Reset database
npx prisma migrate reset
```

2. **Build errors**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules && npm install
```

3. **Type errors**
```bash
# Regenerate Prisma client
npx prisma generate

# Check types
npm run type-check
```

### Debug Configuration
```typescript
// next.config.js
module.exports = {
  experimental: {
    logging: {
      level: 'verbose',
    },
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'eval-source-map';
    }
    return config;
  },
};
```

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Playwright Documentation](https://playwright.dev/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.
