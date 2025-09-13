# MLM CRM - Technical Architecture

## 🏗️ System Architecture

### Overview
Modern web application built with microservices architecture, optimized for scalability and maintainability.

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Web App   │  │  Admin UI   │  │ Mobile PWA  │         │
│  │  (Next.js)  │  │  (React)    │  │   (React)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway                               │
│              (Next.js API Routes / tRPC)                   │
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Auth      │  │   CRM       │  │ Commission  │         │
│  │  Service    │  │  Service    │  │   Engine    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Notification│  │  Compliance │  │   Reports   │         │
│  │  Service    │  │   Service   │  │  Service    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ PostgreSQL  │  │    Redis    │  │   S3/CDN    │         │
│  │ (Primary)   │  │  (Cache)    │  │ (Files)     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: Tailwind CSS + Headless UI
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Icons**: Heroicons

### Backend
- **Runtime**: Node.js 18+
- **API**: tRPC for type safety
- **Database ORM**: Prisma
- **Authentication**: NextAuth.js or Clerk
- **Validation**: Zod
- **Queue System**: Bull MQ (Redis)

### Database
- **Primary**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Search**: PostgreSQL Full-Text Search
- **Analytics**: PostHog or Mixpanel

### Infrastructure
- **Hosting**: Vercel (Frontend) + Railway/Render (Backend)
- **Database**: Neon or Supabase
- **File Storage**: AWS S3 or Cloudinary
- **CDN**: Cloudflare
- **Monitoring**: Sentry + Vercel Analytics

### External Services
- **Email**: Resend or SendGrid
- **SMS**: Twilio
- **Payments**: Stripe
- **KYC**: Persona or SumSub
- **Analytics**: PostHog

## 📊 Database Design

### Core Entities

```sql
-- Users and Authentication
users (id, email, phone, role, status, created_at, updated_at)
user_profiles (user_id, first_name, last_name, avatar_url, timezone, locale)
user_sessions (id, user_id, token, expires_at, ip_address, user_agent)

-- MLM Structure
distributors (user_id PK, sponsor_id, placement_id, join_date, rank_id, status)
ranks (id, name, min_pv, min_gv, requirements JSON, benefits JSON)
genealogy_paths (ancestor_id, descendant_id, depth, path_type)

-- CRM Core
contacts (id, owner_id, name, email, phone, source, status, tags, created_at)
customers (id, distributor_id, email, phone, billing_address JSON, shipping_addresses JSON)
tasks (id, assignee_id, contact_id, due_at, type, status, description, completed_at)

-- Products and Orders
products (id, sku, name, description, price, pv, currency, status, category_id)
orders (id, customer_id, distributor_id, total, currency, status, tax_total)
order_items (id, order_id, product_id, quantity, unit_price, pv)

-- Commission System
commission_periods (id, start_date, end_date, status, closed_at)
commission_ledger (id, distributor_id, period_id, type, amount, pv, gv, source_order_id)
payouts (id, distributor_id, amount, method, status, requested_at, processed_at)

-- Compliance and Audit
compliance_cases (id, subject_type, subject_id, severity, status, description)
audit_logs (id, actor_id, entity_type, entity_id, action, before JSON, after JSON)
```

### Indexes and Performance
```sql
-- Critical indexes for performance
CREATE INDEX idx_genealogy_paths_ancestor ON genealogy_paths(ancestor_id, depth);
CREATE INDEX idx_orders_distributor_date ON orders(distributor_id, created_at);
CREATE INDEX idx_commission_ledger_period ON commission_ledger(period_id, distributor_id);
CREATE INDEX idx_contacts_owner_status ON contacts(owner_id, status);
```

## 🔐 Security Architecture

### Authentication Flow
1. Email/Password or SSO login
2. 2FA verification (TOTP)
3. JWT token generation
4. Session management
5. Role-based permissions

### Authorization Levels
- **Row-Level Security**: PostgreSQL RLS policies
- **API-Level**: tRPC middleware checks
- **UI-Level**: Component-level guards
- **Field-Level**: Sensitive data encryption

### Data Protection
```typescript
// Example encryption for PII
const encryptedFields = {
  ssn: encrypt(user.ssn),
  bankAccount: encrypt(user.bankAccount),
  notes: encrypt(user.notes)
}
```

## 🚀 Deployment Architecture

### Environment Strategy
```yaml
# Development
DATABASE_URL: "postgresql://dev..."
REDIS_URL: "redis://dev..."
ENVIRONMENT: "development"

# Staging
DATABASE_URL: "postgresql://staging..."
REDIS_URL: "redis://staging..."
ENVIRONMENT: "staging"

# Production
DATABASE_URL: "postgresql://prod..."
REDIS_URL: "redis://prod..."
ENVIRONMENT: "production"
```

### CI/CD Pipeline
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run E2E tests
        run: npm run test:e2e

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
```

## 📈 Scalability Considerations

### Database Scaling
- **Read Replicas**: For reporting and analytics
- **Partitioning**: Commission ledger by period
- **Caching**: Redis for frequent queries
- **Connection Pooling**: PgBouncer

### Application Scaling
- **Horizontal Scaling**: Stateless API servers
- **CDN**: Static assets and images
- **Queue System**: Background job processing
- **Microservices**: Split by domain boundaries

### Performance Targets
- **Page Load**: < 2 seconds
- **API Response**: < 500ms
- **Database Queries**: < 100ms
- **Commission Processing**: < 5 minutes for 10K users

## 🔍 Monitoring and Observability

### Metrics to Track
```typescript
// Application Metrics
- User registration rate
- Order conversion rate
- Commission calculation time
- API response times
- Error rates

// Business Metrics
- Active distributors
- Monthly revenue
- Rank advancement rate
- Payout processing time
- Compliance case resolution time
```

### Alerting Setup
```yaml
alerts:
  - name: "High Error Rate"
    condition: "error_rate > 5%"
    duration: "5m"
    
  - name: "Slow Commission Processing"
    condition: "commission_processing_time > 10m"
    duration: "1m"
    
  - name: "Database Connection Issues"
    condition: "db_connection_failures > 10"
    duration: "2m"
```

## 🧪 Testing Strategy

### Test Pyramid
```
┌─────────────────────────┐
│      E2E Tests          │ ← Few, critical user flows
│    (Playwright)         │
├─────────────────────────┤
│   Integration Tests     │ ← API endpoints, DB operations
│     (Jest + MSW)        │
├─────────────────────────┤
│    Unit Tests           │ ← Business logic, utilities
│      (Vitest)           │
└─────────────────────────┘
```

### Critical Test Scenarios
- Complete order flow with commission calculation
- Genealogy tree operations
- Rank advancement logic
- Payout processing
- Security and authorization

## 🔄 Data Migration Strategy

### Version Control for Schema
```sql
-- migrations/001_initial_schema.sql
-- migrations/002_add_genealogy_indexes.sql
-- migrations/003_add_commission_triggers.sql
```

### Backup and Recovery
- Daily automated backups
- Point-in-time recovery capability
- Cross-region backup replication
- Disaster recovery procedures

## 📱 Mobile Strategy

### Progressive Web App (PWA)
- Service worker for offline capability
- Push notifications
- App-like experience
- Background sync

### Future Native Apps
- React Native for iOS/Android
- Shared business logic
- Platform-specific optimizations
