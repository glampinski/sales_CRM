# MLM CRM - Sales Management System

A modern web-based CRM designed specifically for direct-selling and MLM companies to manage distributors, customers, and compensation plans.

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd # MLM CRM - Sales Management System

## 🎯 Project Overview

A comprehensive web CRM designed specifically for direct-selling (MLM) companies to manage **distributors**, **customers**, **orders**, and **commission calculations**. Built with modern technology stack optimized for fast data entry, mobile-first experience, and regulatory compliance.

## 🚀 Key Features

### Core CRM Functionality
- **Lead Management**: Import, track, and convert leads through customizable pipelines
- **Contact Management**: Comprehensive contact profiles with activity tracking
- **Task Management**: Automated follow-ups and reminder systems
- **Customer Portal**: Complete customer lifecycle management

### MLM-Specific Features
- **Genealogy Tree**: Visual downline/upline management with depth controls
- **Commission Engine**: Automated calculation of ranks, bonuses, and payouts
- **Rank Advancement**: Real-time tracking and qualification monitoring
- **Compliance Tools**: Built-in compliance monitoring and case management

### Advanced Capabilities
- **Mobile-First Design**: Responsive PWA with offline capabilities
- **Real-time Dashboards**: Business intelligence and performance metrics
- **Automated Workflows**: Smart notifications and business rule automation
- **Audit Trail**: Complete activity logging for compliance and security

## 📚 Documentation

### 📖 Complete Documentation Suite
- **[📋 Documentation Index](./docs/README.md)** - Complete guide to all documentation
- **[🗺️ Project Roadmap](./docs/PROJECT_ROADMAP.md)** - Development timeline and milestones
- **[🏗️ Technical Architecture](./docs/TECHNICAL_ARCHITECTURE.md)** - System design and infrastructure
- **[📊 Database Schema](./docs/DATABASE_SCHEMA.md)** - Complete data model and relationships
- **[🔧 Development Guide](./docs/DEVELOPMENT_GUIDE.md)** - Setup and development workflows
- **[📡 API Documentation](./docs/API_DOCUMENTATION.md)** - Complete API reference
- **[📋 Technical Specifications](./docs/TECHNICAL_SPEC.md)** - Detailed technical requirements

## 🛠️ Technology Stack

### Frontend
- **Next.js 14+** with App Router for SSR/SSG
- **TypeScript** for type safety
- **Tailwind CSS** for responsive design
- **TanStack Query** for server state management
- **Zustand** for client state management

### Backend
- **Node.js 18+** with Express/tRPC
- **PostgreSQL 15+** with Prisma ORM
- **Redis** for caching and sessions
- **Bull MQ** for background job processing

### Infrastructure
- **Vercel** for frontend hosting
- **Railway/Render** for backend deployment
- **AWS S3** for file storage
- **Stripe** for payment processing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Installation
```bash
# Clone the repository
git clone https://github.com/glampinski/sales_CRM.git
cd sales_CRM

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up database
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📅 Development Timeline

### Phase 1: MVP Foundation (Months 1-3)
- ✅ Core CRM functionality
- ✅ Basic MLM features
- ✅ User management and authentication
- ✅ Simple commission calculations

### Phase 2: MLM Core Features (Months 4-6)
- 🔄 Advanced commission engine
- 🔄 Genealogy management
- 🔄 Compliance tools
- 🔄 Automated workflows

### Phase 3: Growth Features (Months 7-9)
- 📋 Replicated sites
- 📋 Team management tools
- 📋 Advanced analytics
- 📋 Third-party integrations

### Phase 4: Enterprise Features (Months 10-12)
- 📋 White-label customization
- 📋 Advanced compliance automation
- 📋 Global multi-currency support
- 📋 Enterprise SSO

## 🎯 Success Metrics

- **Performance**: Sub-2-second page loads, <500ms API responses
- **Scale**: Support 10,000+ distributors with real-time updates
- **Compliance**: Full audit trail and regulatory compliance
- **User Experience**: Mobile-first design with 99.9% uptime

## 🤝 Contributing

1. Read the [Development Guide](./docs/DEVELOPMENT_GUIDE.md)
2. Check the [Project Roadmap](./docs/PROJECT_ROADMAP.md) for current priorities
3. Follow the coding standards and testing requirements
4. Submit PRs with detailed descriptions

## 📄 License

This project is proprietary software developed for MLM/direct-selling organizations.

## 📞 Support

For technical documentation, see the [docs](./docs/) directory.
For issues and feature requests, please use the GitHub issue tracker.

---

**Built with ❤️ for direct-selling success**
npm install
npm run dev
```

## 📋 Project Overview

This CRM optimizes for:
- **Fast data entry** and mobile-first design
- **Genealogy management** (upline/downline trees)
- **Commission calculations** and payout systems
- **Compliance tracking** and audit trails
- **Multi-role access** (Admin, Manager, Distributor, Support, Auditor)

## 🏗️ Architecture

- **Frontend**: Next.js 14+ with TypeScript
- **Backend**: Node.js + Express/tRPC
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **UI**: Tailwind CSS + Headless UI

## 📚 Documentation

| Document | Description | Status |
|----------|-------------|--------|
| [Project Roadmap](./docs/PROJECT_ROADMAP.md) | Complete development roadmap | ✅ |
| [Technical Specification](./docs/TECHNICAL_SPEC.md) | Architecture and tech stack | ⏳ |
| [Database Schema](./docs/DATABASE_SCHEMA.md) | Data models and relationships | ⏳ |
| [API Documentation](./docs/API_DOCS.md) | REST/tRPC endpoints | ⏳ |
| [User Roles & Permissions](./docs/PERMISSIONS.md) | RBAC matrix | ⏳ |
| [Feature Specifications](./docs/FEATURES.md) | Detailed feature requirements | ⏳ |
| [Setup Guide](./docs/SETUP.md) | Development environment setup | ⏳ |
| [Deployment Guide](./docs/DEPLOYMENT.md) | Production deployment | ⏳ |

## 🎯 Current Phase: MVP Development

See [Project Roadmap](./docs/PROJECT_ROADMAP.md) for detailed phases and milestones.

## 🤝 Contributing

1. Read the [Technical Specification](./docs/TECHNICAL_SPEC.md)
2. Follow the [Setup Guide](./docs/SETUP.md)
3. Review [Feature Specifications](./docs/FEATURES.md) before implementing

## 📄 License

[License Type] - See LICENSE file for details
