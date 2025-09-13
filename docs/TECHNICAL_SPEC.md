# MLM CRM - Technical Specifications

## 🎯 System Overview

The MLM CRM is a comprehensive web application designed to manage direct-selling organizations with advanced MLM capabilities. The system handles distributor management, customer relationships, order processing, commission calculations, and compliance tracking.

## 🏗️ System Architecture

### Overview
The MLM CRM follows a modern three-tier architecture:
- **Presentation Layer**: Next.js React application
- **Application Layer**: Node.js API with business logic
- **Data Layer**: PostgreSQL with Redis caching

### Architecture Pattern
- **Pattern**: Microservices-oriented monolith
- **Frontend**: Single Page Application (SPA)
- **Backend**: API-first architecture
- **Database**: Relational with JSONB for flexibility
- **Caching**: Multi-layer caching strategy
- **Queue System**: Background job processing

### Non-Functional Requirements

#### Performance Requirements
- **Page Load Time**: < 2 seconds for 95th percentile
- **API Response Time**: < 500ms for 95th percentile
- **Database Query Time**: < 100ms for 95th percentile
- **Commission Processing**: < 5 minutes for 10,000 distributors
- **Concurrent Users**: Support 1,000 simultaneous users

#### Scalability Requirements
- **Horizontal Scaling**: Stateless application servers
- **Database Scaling**: Read replicas and connection pooling
- **File Storage**: CDN for global distribution
- **Auto-scaling**: Cloud-native scaling based on load

#### Availability Requirements
- **Uptime**: 99.9% availability (8.77 hours downtime/year)
- **Recovery Time**: < 4 hours for major incidents
- **Backup Frequency**: Daily automated backups
- **Geographic Distribution**: Multi-region deployment ready

#### Security Requirements
- **Authentication**: Multi-factor authentication (MFA)
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: AES-256 for data at rest, TLS 1.3 for transit
- **Compliance**: GDPR, SOX, PCI DSS Level 1 ready
- **Audit Trail**: Immutable audit logs for all sensitive operations

### Technology Stack

#### Frontend
```typescript
// Core Framework
Next.js 14+ (App Router)
React 18+
TypeScript 5+

// Styling & UI
Tailwind CSS 3+
Headless UI
Radix UI (components)
Framer Motion (animations)

// State Management
Zustand (client state)
TanStack Query (server state)
React Hook Form (forms)

// Utilities
date-fns (date handling)
Zod (validation)
clsx (className utilities)
```

#### Backend
```typescript
// Runtime & Framework
Node.js 18+
Express.js or tRPC
TypeScript 5+

// Database & ORM
PostgreSQL 15+
Prisma ORM
Redis (caching & sessions)

// Authentication & Security
NextAuth.js or Clerk
bcrypt (password hashing)
JWT tokens
Rate limiting (express-rate-limit)

// File Handling
Multer (file uploads)
Sharp (image processing)
AWS S3 SDK
```

#### Infrastructure
```yaml
# Hosting & Deployment
Frontend: Vercel
Backend: Railway/Render
Database: Neon/Supabase
Storage: AWS S3/Cloudinary
CDN: Vercel Edge Network

# Monitoring & Analytics
Error Tracking: Sentry
Performance: Vercel Analytics
Logs: Structured JSON logging
Uptime: UptimeRobot
```

## 🗄️ Database Design

### Core Entities

#### Users & Authentication
```sql
-- Users table (core authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  phone VARCHAR(50),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role user_role NOT NULL,
  status user_status DEFAULT 'active',
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  locale VARCHAR(10) DEFAULT 'en-US',
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- User roles enum
CREATE TYPE user_role AS ENUM (
  'admin', 'manager', 'distributor', 'support', 'auditor'
);

-- User status enum
CREATE TYPE user_status AS ENUM (
  'active', 'inactive', 'suspended', 'pending'
);
```

#### MLM Structure
```sql
-- Distributors (extends users for MLM-specific data)
CREATE TABLE distributors (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  distributor_id VARCHAR(50) UNIQUE NOT NULL,
  sponsor_id UUID REFERENCES distributors(user_id),
  placement_id UUID REFERENCES distributors(user_id),
  join_date DATE NOT NULL,
  rank_id UUID REFERENCES ranks(id),
  current_pv DECIMAL(10,2) DEFAULT 0,
  current_gv DECIMAL(10,2) DEFAULT 0,
  lifetime_pv DECIMAL(12,2) DEFAULT 0,
  lifetime_gv DECIMAL(12,2) DEFAULT 0,
  next_rank_id UUID REFERENCES ranks(id),
  rank_qualified_at TIMESTAMP,
  territory_id UUID REFERENCES territories(id),
  business_center VARCHAR(100),
  tax_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ranks and advancement rules
CREATE TABLE ranks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(100),
  sort_order INTEGER,
  min_personal_pv DECIMAL(10,2) DEFAULT 0,
  min_group_pv DECIMAL(10,2) DEFAULT 0,
  min_legs INTEGER DEFAULT 0,
  leg_requirements JSONB, -- Complex leg rules
  bonus_percentage DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Contacts & Pipeline
```sql
-- Contacts/Leads
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(200),
  title VARCHAR(100),
  source contact_source,
  status contact_status DEFAULT 'new',
  stage pipeline_stage DEFAULT 'new',
  tags TEXT[],
  notes TEXT,
  score INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP,
  converted_at TIMESTAMP,
  customer_id UUID REFERENCES customers(id),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contact enums
CREATE TYPE contact_source AS ENUM (
  'website', 'referral', 'social_media', 'email_campaign', 
  'cold_call', 'event', 'import', 'other'
);

CREATE TYPE contact_status AS ENUM (
  'new', 'contacted', 'qualified', 'converted', 'lost', 'inactive'
);

CREATE TYPE pipeline_stage AS ENUM (
  'new', 'contacted', 'follow_up', 'proposal', 'negotiation', 
  'closed_won', 'closed_lost'
);
```

#### Products & Orders
```sql
-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  cost DECIMAL(10,2),
  pv DECIMAL(8,2) DEFAULT 0, -- Personal Volume
  category_id UUID REFERENCES product_categories(id),
  is_subscription BOOLEAN DEFAULT false,
  subscription_interval subscription_interval,
  tax_code VARCHAR(50),
  weight DECIMAL(8,2),
  dimensions JSONB,
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  distributor_id UUID REFERENCES distributors(user_id),
  status order_status DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax_total DECIMAL(10,2) DEFAULT 0,
  shipping_total DECIMAL(10,2) DEFAULT 0,
  discount_total DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  total_pv DECIMAL(8,2) DEFAULT 0,
  payment_method VARCHAR(50),
  payment_status payment_status DEFAULT 'pending',
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  metadata JSONB,
  ordered_at TIMESTAMP DEFAULT NOW(),
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes & Performance
```sql
-- Critical indexes for performance
CREATE INDEX idx_distributors_sponsor ON distributors(sponsor_id);
CREATE INDEX idx_distributors_placement ON distributors(placement_id);
CREATE INDEX idx_contacts_owner_status ON contacts(owner_id, status);
CREATE INDEX idx_orders_distributor_date ON orders(distributor_id, ordered_at);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_commission_ledger_period ON commission_ledger(period_id, distributor_id);

-- Full-text search indexes
CREATE INDEX idx_contacts_search ON contacts USING GIN(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(company, '')));
```

## 🔒 Security Architecture

### Authentication Flow
```typescript
// JWT-based authentication with refresh tokens
interface AuthTokens {
  accessToken: string;  // 15 minutes expiry
  refreshToken: string; // 7 days expiry
  user: {
    id: string;
    email: string;
    role: UserRole;
    permissions: string[];
  };
}

// 2FA implementation
interface TwoFactorAuth {
  enabled: boolean;
  secret: string;        // TOTP secret
  backupCodes: string[]; // Single-use backup codes
  lastUsed: Date;
}
```

### Authorization (RBAC)
```typescript
// Role-based permissions
const PERMISSIONS = {
  // Contacts
  'contacts:read': ['admin', 'manager', 'distributor'],
  'contacts:write': ['admin', 'manager', 'distributor'],
  'contacts:delete': ['admin', 'manager'],
  
  // Orders
  'orders:read': ['admin', 'manager', 'distributor', 'support'],
  'orders:write': ['admin', 'manager', 'distributor'],
  'orders:refund': ['admin', 'support'],
  
  // Genealogy
  'genealogy:read': ['admin', 'manager', 'distributor'],
  'genealogy:modify': ['admin'],
  
  // Commissions
  'commissions:read': ['admin', 'manager', 'distributor'],
  'commissions:configure': ['admin'],
  'commissions:manual': ['admin'],
  
  // Admin functions
  'users:manage': ['admin'],
  'system:configure': ['admin'],
  'audit:access': ['admin', 'auditor']
} as const;
```

### Data Protection
```typescript
// Field-level encryption for PII
interface EncryptedField {
  value: string;      // Encrypted data
  algorithm: string;  // Encryption method
  keyId: string;     // Key reference
}

// Audit trail for sensitive operations
interface AuditLog {
  id: string;
  actorId: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'view';
  before: Record<string, any>;
  after: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  sessionId: string;
}
```

## 🔌 API Design

### RESTful Endpoints
```typescript
// Authentication
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/2fa/enable
POST /api/auth/2fa/verify

// Users & Distributors
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/distributors/:id/genealogy

// Contacts & Pipeline
GET    /api/contacts
POST   /api/contacts
GET    /api/contacts/:id
PUT    /api/contacts/:id
DELETE /api/contacts/:id
POST   /api/contacts/import
GET    /api/contacts/:id/activities
POST   /api/contacts/:id/activities

// Orders & Products
GET    /api/products
GET    /api/orders
POST   /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id/status
POST   /api/orders/:id/refund

// Commissions
GET    /api/commissions/periods
POST   /api/commissions/periods/:id/close
GET    /api/commissions/statements/:distributorId
GET    /api/payouts
POST   /api/payouts/request
```

### Response Format
```typescript
// Standard API response format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: Record<string, any>;
}

// Error handling
class ApiError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
    public details?: Record<string, any>
  ) {
    super(message);
  }
}
```

## ⚡ Performance & Scaling

### Caching Strategy
```typescript
// Redis caching layers
interface CacheConfig {
  // User sessions (15 minutes)
  'session:*': { ttl: 900 };
  
  // Genealogy trees (1 hour, frequently accessed)
  'genealogy:*': { ttl: 3600 };
  
  // Commission calculations (24 hours, expensive to compute)
  'commissions:*': { ttl: 86400 };
  
  // Product catalog (6 hours)
  'products:*': { ttl: 21600 };
  
  // Dashboard data (5 minutes)
  'dashboard:*': { ttl: 300 };
}
```

### Database Optimization
```sql
-- Partitioning for large tables
CREATE TABLE commission_ledger (
  id UUID PRIMARY KEY,
  distributor_id UUID NOT NULL,
  period_id UUID NOT NULL,
  -- ... other columns
) PARTITION BY RANGE (created_at);

-- Monthly partitions for commission data
CREATE TABLE commission_ledger_2024_01 PARTITION OF commission_ledger
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### Queue System
```typescript
// Background job processing
interface JobQueue {
  // Commission calculations
  'calculate-commissions': {
    periodId: string;
    distributorIds?: string[];
  };
  
  // Email notifications
  'send-email': {
    to: string[];
    template: string;
    data: Record<string, any>;
  };
  
  // Data imports
  'import-contacts': {
    userId: string;
    fileUrl: string;
    mapping: Record<string, string>;
  };
}
```

## 📊 Monitoring & Observability

### Logging Structure
```typescript
// Structured logging format
interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  service: string;
  traceId: string;
  userId?: string;
  action: string;
  duration?: number;
  metadata: Record<string, any>;
  error?: {
    message: string;
    stack: string;
    code: string;
  };
}
```

### Metrics & Alerts
```typescript
// Key performance indicators
interface Metrics {
  // Performance
  'api.response_time': number;
  'db.query_time': number;
  'cache.hit_rate': number;
  
  // Business
  'orders.created': number;
  'commissions.calculated': number;
  'users.active_daily': number;
  
  // Errors
  'errors.rate': number;
  'failed_payments': number;
}
```

## 🚀 Deployment Architecture

### Environment Configuration
```yaml
# Production environment
apiVersion: v1
kind: ConfigMap
metadata:
  name: crm-config
data:
  NODE_ENV: production
  DATABASE_URL: ${DATABASE_URL}
  REDIS_URL: ${REDIS_URL}
  JWT_SECRET: ${JWT_SECRET}
  ENCRYPTION_KEY: ${ENCRYPTION_KEY}
  
  # External services
  STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
  SENDGRID_API_KEY: ${SENDGRID_API_KEY}
  AWS_ACCESS_KEY: ${AWS_ACCESS_KEY}
```

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          npm ci
          npm run test
          npm run test:e2e
          
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          npm run build
          vercel --prod
```

This technical specification provides the foundation for building a robust, scalable MLM CRM system. The architecture emphasizes security, performance, and maintainability while supporting the complex business requirements of MLM operations.
