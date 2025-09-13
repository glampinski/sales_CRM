# MLM CRM - API Documentation

## 🔑 Authentication

All API endpoints require authentication unless otherwise specified.

### Authentication Flow
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "role": "distributor",
    "profile": {
      "firstName": "John",
      "lastName": "Doe"
    }
  },
  "requiresTwoFactor": false,
  "accessToken": "jwt_token_here"
}
```

### 2FA Verification
```http
POST /api/auth/2fa/verify
Authorization: Bearer {partial_token}

{
  "code": "123456"
}
```

## 👥 User Management

### Get Current User
```http
GET /api/users/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "123",
  "email": "user@example.com",
  "role": "distributor",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "timezone": "America/New_York"
  },
  "distributor": {
    "sponsorId": "456",
    "joinDate": "2024-01-15",
    "rank": {
      "id": "bronze",
      "name": "Bronze",
      "level": 1
    },
    "stats": {
      "personalPV": 150,
      "groupPV": 500,
      "monthlyRank": "bronze"
    }
  }
}
```

### Update User Profile
```http
PATCH /api/users/me
Authorization: Bearer {token}

{
  "profile": {
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890"
  }
}
```

## 📞 Contact Management

### List Contacts
```http
GET /api/contacts?page=1&limit=20&status=active&search=john
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `status` (string): Filter by status (new, contacted, qualified, enrolled, lost)
- `search` (string): Search by name, email, or phone
- `source` (string): Filter by lead source
- `tags` (array): Filter by tags

**Response:**
```json
{
  "data": [
    {
      "id": "contact_123",
      "name": "John Smith",
      "email": "john@example.com",
      "phone": "+1234567890",
      "status": "new",
      "source": "website",
      "tags": ["hot-lead", "referral"],
      "lastActivity": "2024-03-15T10:30:00Z",
      "createdAt": "2024-03-10T14:20:00Z",
      "assignedTo": {
        "id": "user_123",
        "name": "Jane Doe"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Create Contact
```http
POST /api/contacts
Authorization: Bearer {token}

{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1234567890",
  "source": "website",
  "tags": ["hot-lead"],
  "notes": "Interested in health products"
}
```

### Update Contact
```http
PATCH /api/contacts/{contactId}
Authorization: Bearer {token}

{
  "status": "contacted",
  "notes": "Called and scheduled follow-up"
}
```

### Import Contacts
```http
POST /api/contacts/import
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: contacts.csv
source: "trade-show"
tags: ["trade-show-2024"]
```

## 📋 Pipeline Management

### Get Pipeline
```http
GET /api/pipeline?view=kanban
Authorization: Bearer {token}
```

**Response:**
```json
{
  "stages": [
    {
      "id": "new",
      "name": "New Leads",
      "count": 25,
      "contacts": [
        {
          "id": "contact_123",
          "name": "John Smith",
          "email": "john@example.com",
          "value": 500,
          "daysInStage": 2
        }
      ]
    },
    {
      "id": "contacted",
      "name": "Contacted",
      "count": 15,
      "contacts": []
    }
  ]
}
```

### Move Contact in Pipeline
```http
POST /api/pipeline/move
Authorization: Bearer {token}

{
  "contactId": "contact_123",
  "fromStage": "new",
  "toStage": "contacted",
  "notes": "First contact made"
}
```

## ✅ Task Management

### List Tasks
```http
GET /api/tasks?status=pending&due=today
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": [
    {
      "id": "task_123",
      "title": "Follow up with John Smith",
      "description": "Second follow-up call",
      "type": "call",
      "status": "pending",
      "priority": "high",
      "dueAt": "2024-03-15T15:00:00Z",
      "contact": {
        "id": "contact_123",
        "name": "John Smith"
      },
      "assignee": {
        "id": "user_123",
        "name": "Jane Doe"
      }
    }
  ]
}
```

### Create Task
```http
POST /api/tasks
Authorization: Bearer {token}

{
  "title": "Follow up call",
  "description": "Second follow-up with prospect",
  "type": "call",
  "priority": "high",
  "dueAt": "2024-03-20T10:00:00Z",
  "contactId": "contact_123",
  "assigneeId": "user_123"
}
```

## 🛒 Order Management

### List Orders
```http
GET /api/orders?status=completed&customerId=customer_123
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": [
    {
      "id": "order_123",
      "orderNumber": "ORD-2024-001",
      "status": "completed",
      "total": 299.99,
      "currency": "USD",
      "tax": 24.00,
      "shipping": 9.99,
      "createdAt": "2024-03-15T10:30:00Z",
      "customer": {
        "id": "customer_123",
        "name": "John Smith",
        "email": "john@example.com"
      },
      "distributor": {
        "id": "dist_123",
        "name": "Jane Doe"
      },
      "items": [
        {
          "id": "item_123",
          "product": {
            "id": "prod_123",
            "name": "Protein Powder",
            "sku": "PP-001"
          },
          "quantity": 2,
          "unitPrice": 149.99,
          "pv": 50
        }
      ]
    }
  ]
}
```

### Create Order
```http
POST /api/orders
Authorization: Bearer {token}

{
  "customerId": "customer_123",
  "items": [
    {
      "productId": "prod_123",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "US"
  },
  "paymentMethod": "card_token_123"
}
```

## 🌳 Genealogy

### Get Genealogy Tree
```http
GET /api/genealogy/{distributorId}?depth=3&type=downline
Authorization: Bearer {token}
```

**Response:**
```json
{
  "distributor": {
    "id": "dist_123",
    "name": "Jane Doe",
    "rank": "Silver",
    "joinDate": "2024-01-15",
    "stats": {
      "personalPV": 200,
      "groupPV": 1500,
      "teamSize": 25
    }
  },
  "children": [
    {
      "id": "dist_456",
      "name": "John Smith",
      "rank": "Bronze",
      "leg": "left",
      "stats": {
        "personalPV": 150,
        "groupPV": 500,
        "teamSize": 8
      },
      "children": []
    }
  ]
}
```

### Get Upline
```http
GET /api/genealogy/{distributorId}/upline
Authorization: Bearer {token}
```

## 💰 Commission System

### Get Commission Statement
```http
GET /api/commissions/periods/{periodId}/statement
Authorization: Bearer {token}
```

**Response:**
```json
{
  "period": {
    "id": "period_202403",
    "name": "March 2024",
    "startDate": "2024-03-01",
    "endDate": "2024-03-31",
    "status": "closed"
  },
  "distributor": {
    "id": "dist_123",
    "name": "Jane Doe"
  },
  "summary": {
    "personalPV": 200,
    "groupPV": 1500,
    "rankAchieved": "Silver",
    "totalCommissions": 450.00,
    "totalPayouts": 450.00
  },
  "commissions": [
    {
      "type": "retail",
      "description": "Retail commissions",
      "amount": 150.00,
      "pv": 200
    },
    {
      "type": "unilevel",
      "description": "Team commissions",
      "amount": 300.00,
      "levels": [
        {
          "level": 1,
          "pv": 800,
          "rate": 0.05,
          "amount": 40.00
        }
      ]
    }
  ]
}
```

### Request Payout
```http
POST /api/payouts/request
Authorization: Bearer {token}

{
  "amount": 450.00,
  "method": "bank_transfer",
  "bankAccount": {
    "accountNumber": "****1234",
    "routingNumber": "****5678"
  }
}
```

## 📊 Reports and Analytics

### Dashboard Data
```http
GET /api/dashboard?period=current_month
Authorization: Bearer {token}
```

**Response:**
```json
{
  "stats": {
    "newLeads": 25,
    "conversions": 8,
    "revenue": 2400.00,
    "teamGrowth": 3
  },
  "charts": {
    "dailyActivity": [
      {
        "date": "2024-03-01",
        "leads": 3,
        "contacts": 8,
        "orders": 2
      }
    ],
    "pipelineHealth": {
      "new": 25,
      "contacted": 15,
      "qualified": 8,
      "enrolled": 3
    }
  },
  "recentActivity": [
    {
      "type": "order_created",
      "description": "New order from John Smith",
      "timestamp": "2024-03-15T10:30:00Z"
    }
  ]
}
```

## 🔒 Compliance

### List Compliance Cases
```http
GET /api/compliance/cases?status=open&severity=high
Authorization: Bearer {token}
```

### Create Compliance Case
```http
POST /api/compliance/cases
Authorization: Bearer {token}

{
  "subjectType": "distributor",
  "subjectId": "dist_123",
  "severity": "medium",
  "description": "Potential income claim violation",
  "evidence": ["screenshot.jpg"]
}
```

## 🔍 Search

### Global Search
```http
GET /api/search?q=john&type=contacts,customers&limit=10
Authorization: Bearer {token}
```

**Response:**
```json
{
  "results": [
    {
      "type": "contact",
      "id": "contact_123",
      "title": "John Smith",
      "subtitle": "john@example.com",
      "url": "/contacts/contact_123"
    },
    {
      "type": "customer",
      "id": "customer_456",
      "title": "John Doe",
      "subtitle": "Customer since Jan 2024",
      "url": "/customers/customer_456"
    }
  ]
}
```

## 🔔 Webhooks

### Configure Webhook
```http
POST /api/webhooks
Authorization: Bearer {token}

{
  "url": "https://your-app.com/webhooks/mlm-crm",
  "events": ["order.created", "rank.changed", "payout.approved"],
  "secret": "webhook_secret_key"
}
```

### Webhook Payload Example
```json
{
  "id": "webhook_123",
  "event": "order.created",
  "timestamp": "2024-03-15T10:30:00Z",
  "data": {
    "order": {
      "id": "order_123",
      "total": 299.99,
      "customerId": "customer_123",
      "distributorId": "dist_123"
    }
  },
  "signature": "sha256=hash_here"
}
```

## 📱 Mobile API Considerations

### Pagination
- Use cursor-based pagination for real-time data
- Implement infinite scrolling support
- Optimize payload sizes

### Offline Support
- Implement sync endpoints for conflict resolution
- Support offline queue for critical actions
- Background sync capabilities

### Push Notifications
```http
POST /api/notifications/push
Authorization: Bearer {token}

{
  "userId": "user_123",
  "title": "New Lead Assigned",
  "body": "You have a new hot lead from the website",
  "data": {
    "type": "lead_assigned",
    "contactId": "contact_123"
  }
}
```

## 🚨 Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address",
    "details": {
      "field": "email",
      "value": "invalid-email"
    },
    "timestamp": "2024-03-15T10:30:00Z",
    "requestId": "req_123"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

## 🔄 Rate Limiting

Rate limits are applied per user and endpoint:

- **Authentication**: 5 requests per minute
- **API Calls**: 1000 requests per hour
- **File Uploads**: 10 requests per minute
- **Webhooks**: 100 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1710504600
```
