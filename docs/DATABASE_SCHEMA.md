# MLM CRM - Database Schema

## 📊 Entity Relationship Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Users       │    │  Distributors   │    │     Ranks       │
│                 │    │                 │    │                 │
│ id (PK)         │◄───┤ user_id (FK)    │    │ id (PK)         │
│ email           │    │ sponsor_id (FK) │───►│ name            │
│ role            │    │ rank_id (FK)    │────┘ min_pv          │
│ status          │    │ join_date       │     │ min_gv          │
│ created_at      │    │ personal_pv     │     │ requirements    │
└─────────────────┘    │ group_pv        │     └─────────────────┘
                       └─────────────────┘              
                                │                       
                                │                       
                       ┌─────────────────┐              
                       │    Contacts     │              
                       │                 │              
                       │ id (PK)         │              
                       │ owner_id (FK)   │──────────────┘
                       │ name            │
                       │ email           │
                       │ status          │
                       │ source          │
                       └─────────────────┘
                                │
                                │
                       ┌─────────────────┐
                       │   Customers     │
                       │                 │
                       │ id (PK)         │
                       │ distributor_id  │
                       │ email           │
                       │ phone           │
                       │ addresses       │
                       └─────────────────┘
                                │
                                │
                       ┌─────────────────┐    ┌─────────────────┐
                       │     Orders      │    │   Order Items   │
                       │                 │    │                 │
                       │ id (PK)         │◄───┤ order_id (FK)   │
                       │ customer_id(FK) │    │ product_id (FK) │
                       │ total           │    │ quantity        │
                       │ status          │    │ unit_price      │
                       │ created_at      │    │ pv              │
                       └─────────────────┘    └─────────────────┘
```

## 🗄️ Table Definitions

### Core User Management

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'distributor',
    status user_status NOT NULL DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(32),
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE TYPE user_role AS ENUM (
    'admin', 
    'manager', 
    'distributor', 
    'support', 
    'finance', 
    'auditor'
);

CREATE TYPE user_status AS ENUM (
    'active', 
    'inactive', 
    'suspended', 
    'pending'
);
```

#### user_profiles
```sql
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'UTC',
    locale VARCHAR(10) DEFAULT 'en-US',
    address JSONB,
    emergency_contact JSONB,
    tax_id VARCHAR(50),
    kyc_status VARCHAR(20) DEFAULT 'pending',
    kyc_documents JSONB[],
    marketing_consent BOOLEAN DEFAULT FALSE,
    data_processing_consent BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### MLM Structure

#### distributors
```sql
CREATE TABLE distributors (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    distributor_number VARCHAR(20) UNIQUE NOT NULL,
    sponsor_id UUID REFERENCES distributors(user_id),
    placement_id UUID REFERENCES distributors(user_id),
    enroller_id UUID REFERENCES distributors(user_id),
    rank_id VARCHAR(50) REFERENCES ranks(id),
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status distributor_status DEFAULT 'active',
    territory_id UUID REFERENCES territories(id),
    personal_pv DECIMAL(10,2) DEFAULT 0,
    group_pv DECIMAL(10,2) DEFAULT 0,
    current_month_pv DECIMAL(10,2) DEFAULT 0,
    current_month_gv DECIMAL(10,2) DEFAULT 0,
    lifetime_pv DECIMAL(12,2) DEFAULT 0,
    auto_ship_active BOOLEAN DEFAULT FALSE,
    qualification_date DATE,
    next_rank_target VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE distributor_status AS ENUM (
    'active', 
    'inactive', 
    'terminated', 
    'on_hold'
);
```

#### ranks
```sql
CREATE TABLE ranks (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level INTEGER NOT NULL,
    min_personal_pv DECIMAL(10,2) DEFAULT 0,
    min_group_pv DECIMAL(10,2) DEFAULT 0,
    min_legs INTEGER DEFAULT 0,
    min_leg_volume DECIMAL(10,2) DEFAULT 0,
    requirements JSONB,
    benefits JSONB,
    commission_rate DECIMAL(5,4),
    bonus_percentage DECIMAL(5,4),
    car_bonus DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### genealogy_paths
```sql
CREATE TABLE genealogy_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ancestor_id UUID NOT NULL REFERENCES distributors(user_id),
    descendant_id UUID NOT NULL REFERENCES distributors(user_id),
    depth INTEGER NOT NULL,
    path_type genealogy_type NOT NULL,
    leg_position INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(ancestor_id, descendant_id, path_type)
);

CREATE TYPE genealogy_type AS ENUM ('sponsor', 'placement');

-- Indexes for genealogy queries
CREATE INDEX idx_genealogy_ancestor_depth ON genealogy_paths(ancestor_id, depth);
CREATE INDEX idx_genealogy_descendant ON genealogy_paths(descendant_id);
```

### CRM Core

#### contacts
```sql
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    company VARCHAR(200),
    title VARCHAR(100),
    source contact_source,
    status contact_status DEFAULT 'new',
    tags TEXT[],
    notes TEXT,
    lead_score INTEGER DEFAULT 0,
    last_activity_at TIMESTAMP,
    next_follow_up TIMESTAMP,
    converted_at TIMESTAMP,
    converted_to_customer_id UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE contact_source AS ENUM (
    'website', 'referral', 'trade_show', 'social_media', 
    'advertisement', 'cold_call', 'email_campaign', 'other'
);

CREATE TYPE contact_status AS ENUM (
    'new', 'contacted', 'qualified', 'proposal', 
    'negotiation', 'enrolled', 'won', 'lost'
);
```

#### tasks
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type task_type NOT NULL,
    priority task_priority DEFAULT 'medium',
    status task_status DEFAULT 'pending',
    assignee_id UUID NOT NULL REFERENCES users(id),
    created_by_id UUID NOT NULL REFERENCES users(id),
    contact_id UUID REFERENCES contacts(id),
    customer_id UUID REFERENCES customers(id),
    due_at TIMESTAMP,
    completed_at TIMESTAMP,
    reminder_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE task_type AS ENUM (
    'call', 'email', 'meeting', 'follow_up', 
    'demo', 'presentation', 'other'
);

CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
```

### Customer & Order Management

#### customers
```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_number VARCHAR(20) UNIQUE NOT NULL,
    distributor_id UUID NOT NULL REFERENCES distributors(user_id),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    preferred_language VARCHAR(10) DEFAULT 'en',
    billing_address JSONB,
    shipping_addresses JSONB[],
    payment_methods JSONB[],
    marketing_opt_in BOOLEAN DEFAULT FALSE,
    auto_ship_enabled BOOLEAN DEFAULT FALSE,
    loyalty_points INTEGER DEFAULT 0,
    lifetime_value DECIMAL(12,2) DEFAULT 0,
    first_order_date DATE,
    last_order_date DATE,
    status customer_status DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE customer_status AS ENUM ('active', 'inactive', 'suspended');
```

#### products
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    short_description TEXT,
    category_id UUID REFERENCES product_categories(id),
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    pv DECIMAL(8,2) NOT NULL DEFAULT 0,
    weight DECIMAL(8,2),
    dimensions JSONB,
    images TEXT[],
    is_subscription BOOLEAN DEFAULT FALSE,
    subscription_frequency INTEGER, -- days
    tax_code VARCHAR(20),
    shipping_class VARCHAR(50),
    inventory_tracked BOOLEAN DEFAULT TRUE,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    status product_status DEFAULT 'active',
    launch_date DATE,
    discontinued_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE product_status AS ENUM ('active', 'inactive', 'discontinued');
```

#### orders
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(30) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    distributor_id UUID NOT NULL REFERENCES distributors(user_id),
    status order_status DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_status payment_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    shipping_method VARCHAR(50),
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE order_status AS ENUM (
    'pending', 'confirmed', 'processing', 'shipped', 
    'delivered', 'cancelled', 'refunded'
);

CREATE TYPE payment_status AS ENUM (
    'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
);
```

#### order_items
```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    pv DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Commission System

#### commission_periods
```sql
CREATE TABLE commission_periods (
    id VARCHAR(20) PRIMARY KEY, -- e.g., '2024-03'
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status period_status DEFAULT 'open',
    close_date TIMESTAMP,
    calculation_started_at TIMESTAMP,
    calculation_completed_at TIMESTAMP,
    total_pv DECIMAL(15,2) DEFAULT 0,
    total_commissions DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE period_status AS ENUM ('open', 'closed', 'calculating', 'finalized');
```

#### commission_ledger
```sql
CREATE TABLE commission_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id VARCHAR(20) NOT NULL REFERENCES commission_periods(id),
    distributor_id UUID NOT NULL REFERENCES distributors(user_id),
    type commission_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    pv DECIMAL(8,2) DEFAULT 0,
    gv DECIMAL(8,2) DEFAULT 0,
    source_order_id UUID REFERENCES orders(id),
    source_distributor_id UUID REFERENCES distributors(user_id),
    level INTEGER,
    rate DECIMAL(5,4),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE commission_type AS ENUM (
    'retail', 'unilevel', 'matching', 'leadership', 
    'fast_start', 'rank_bonus', 'car_bonus', 'adjustment'
);
```

#### payouts
```sql
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    distributor_id UUID NOT NULL REFERENCES distributors(user_id),
    period_id VARCHAR(20) REFERENCES commission_periods(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    method payout_method NOT NULL,
    status payout_status DEFAULT 'requested',
    bank_details JSONB,
    reference_number VARCHAR(100),
    fee_amount DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2),
    kyc_status VARCHAR(20) DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT NOW(),
    approved_at TIMESTAMP,
    processed_at TIMESTAMP,
    failed_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE payout_method AS ENUM (
    'bank_transfer', 'paypal', 'check', 'cryptocurrency', 'e_wallet'
);

CREATE TYPE payout_status AS ENUM (
    'requested', 'approved', 'processing', 'completed', 
    'failed', 'cancelled'
);
```

### Compliance & Audit

#### compliance_cases
```sql
CREATE TABLE compliance_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number VARCHAR(30) UNIQUE NOT NULL,
    subject_type VARCHAR(50) NOT NULL,
    subject_id UUID NOT NULL,
    reporter_id UUID REFERENCES users(id),
    assignee_id UUID REFERENCES users(id),
    severity case_severity NOT NULL,
    status case_status DEFAULT 'open',
    category VARCHAR(50),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    evidence JSONB[],
    resolution TEXT,
    resolved_at TIMESTAMP,
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE case_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE case_status AS ENUM ('open', 'investigating', 'resolved', 'closed');
```

#### audit_logs
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    before_data JSONB,
    after_data JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    request_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Partition by month for performance
CREATE TABLE audit_logs_y2024m03 PARTITION OF audit_logs
FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');
```

## 📈 Indexes for Performance

```sql
-- User and authentication indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_status ON users(role, status);

-- Distributor indexes
CREATE INDEX idx_distributors_sponsor ON distributors(sponsor_id);
CREATE INDEX idx_distributors_rank ON distributors(rank_id);
CREATE INDEX idx_distributors_status ON distributors(status);

-- Contact and CRM indexes
CREATE INDEX idx_contacts_owner_status ON contacts(owner_id, status);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_last_activity ON contacts(last_activity_at);
CREATE INDEX idx_tasks_assignee_status ON tasks(assignee_id, status);
CREATE INDEX idx_tasks_due_date ON tasks(due_at);

-- Order indexes
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_distributor ON orders(distributor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_date ON orders(created_at);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Commission indexes
CREATE INDEX idx_commission_ledger_period_dist ON commission_ledger(period_id, distributor_id);
CREATE INDEX idx_commission_ledger_type ON commission_ledger(type);
CREATE INDEX idx_payouts_distributor_status ON payouts(distributor_id, status);

-- Audit indexes
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

## 🔧 Database Functions and Triggers

### Update Genealogy Paths
```sql
CREATE OR REPLACE FUNCTION update_genealogy_paths()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert direct relationship
    INSERT INTO genealogy_paths (ancestor_id, descendant_id, depth, path_type)
    VALUES (NEW.sponsor_id, NEW.user_id, 1, 'sponsor');
    
    -- Insert all ancestor relationships
    INSERT INTO genealogy_paths (ancestor_id, descendant_id, depth, path_type)
    SELECT gp.ancestor_id, NEW.user_id, gp.depth + 1, 'sponsor'
    FROM genealogy_paths gp
    WHERE gp.descendant_id = NEW.sponsor_id
    AND gp.path_type = 'sponsor';
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_genealogy_paths
    AFTER INSERT ON distributors
    FOR EACH ROW
    EXECUTE FUNCTION update_genealogy_paths();
```

### Calculate PV/GV
```sql
CREATE OR REPLACE FUNCTION calculate_distributor_volumes(
    dist_id UUID,
    period_start DATE,
    period_end DATE
) RETURNS TABLE(personal_pv DECIMAL, group_pv DECIMAL) AS $$
BEGIN
    RETURN QUERY
    WITH personal_volume AS (
        SELECT COALESCE(SUM(oi.pv), 0) as pv
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        WHERE o.distributor_id = dist_id
        AND o.created_at >= period_start
        AND o.created_at < period_end + INTERVAL '1 day'
        AND o.status = 'completed'
    ),
    group_volume AS (
        SELECT COALESCE(SUM(oi.pv), 0) as gv
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        JOIN genealogy_paths gp ON gp.descendant_id = o.distributor_id
        WHERE gp.ancestor_id = dist_id
        AND gp.path_type = 'sponsor'
        AND o.created_at >= period_start
        AND o.created_at < period_end + INTERVAL '1 day'
        AND o.status = 'completed'
    )
    SELECT pv.pv, COALESCE(gv.gv, 0) + COALESCE(pv.pv, 0)
    FROM personal_volume pv, group_volume gv;
END;
$$ LANGUAGE plpgsql;
```

## 🚀 Database Optimization

### Partitioning Strategy
```sql
-- Partition audit logs by month
CREATE TABLE audit_logs (
    -- columns as defined above
) PARTITION BY RANGE (created_at);

-- Commission ledger partitioned by period
CREATE TABLE commission_ledger (
    -- columns as defined above
) PARTITION BY LIST (period_id);
```

### Connection Pooling
```javascript
// Example with Prisma
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

// Connection pool configuration
export const dbConfig = {
  max: 20, // Maximum connections
  min: 5,  // Minimum connections
  acquire: 30000, // Maximum time to acquire connection
  idle: 10000,    // Maximum idle time
}
```

## 📊 Data Seeding

### Initial Ranks
```sql
INSERT INTO ranks (id, name, level, min_personal_pv, min_group_pv, commission_rate) VALUES
('bronze', 'Bronze', 1, 100, 0, 0.05),
('silver', 'Silver', 2, 200, 1000, 0.07),
('gold', 'Gold', 3, 300, 2500, 0.10),
('platinum', 'Platinum', 4, 500, 5000, 0.12),
('diamond', 'Diamond', 5, 1000, 10000, 0.15);
```

### Demo Users
```sql
-- Create admin user
INSERT INTO users (id, email, role, status, email_verified) VALUES
('admin-123', 'admin@mlmcrm.com', 'admin', 'active', true);

-- Create demo distributors
INSERT INTO users (id, email, role, status, email_verified) VALUES
('dist-001', 'john@example.com', 'distributor', 'active', true),
('dist-002', 'jane@example.com', 'distributor', 'active', true);
```
