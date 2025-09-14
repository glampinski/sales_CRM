# Referral System Implementation

This implementation provides a comprehensive referral system for the sales CRM using Next.js + React Hook Form. The system tracks referrals through URL parameters and provides an easy-to-use dashboard for affiliates.

## Features

### 1. Referral Dashboard
- **Location**: `/dashboard` → "Referrals" tab
- **Features**:
  - Display referral statistics (total referrals, earnings, conversion rate)
  - Generate referral links for different purposes
  - View referral history
  - Copy referral links with one click
  - Analytics and performance tracking

### 2. Referral Link Types
The system generates three types of referral links using clean, short URLs:

1. **Landing Page Links**: `glampinski.com/USER_ID`
   - Use on marketing materials and external websites
   - Tracks initial interest and attribution

2. **Signup Links**: `glampinski.com/USER_ID/signup`
   - Direct link to customer registration
   - Highest conversion potential

3. **Onboarding Links**: `glampinski.com/USER_ID/onboarding`
   - Direct customers to the onboarding process
   - Perfect for existing leads

### 3. Tracking System
- **Clean URL Tracking**: Uses short URLs like `glampinski.com/USER_ID`
- **Dynamic Route Handling**: Automatic tracking through URL path parameters
- **Cookie Attribution**: 30-day attribution window
- **Local Storage Backup**: Ensures tracking across page loads
- **Conversion Tracking**: Tracks when referrals complete signup

## How It Works

### For Affiliates
1. Go to Dashboard → Referrals tab
2. Copy the appropriate referral link
3. Share the link through marketing channels
4. Track performance through the dashboard
5. Earn commissions when referrals convert

### For Referred Customers
1. Click on affiliate's referral link
2. Get tracked automatically (transparent to user)
3. Complete signup/onboarding process
4. Attribution is recorded and affiliate gets credit

## Technical Implementation

### Core Components

1. **ReferralService** (`/lib/referral-service.ts`)
   - Generates unique referral codes
   - Creates tracking links
   - Handles attribution logic
   - Manages cookie/localStorage

2. **ReferralDashboard** (`/components/referral-dashboard.tsx`)
   - Main dashboard interface
   - Statistics display
   - Link generation and management
   - Performance analytics

3. **ReferralTracker** (`/components/referral-tracker.tsx`)
   - Tracks URL parameters
   - Sets attribution cookies
   - Transparent to end users

4. **useReferralIntegration** (`/hooks/use-referral-integration.ts`)
   - React hook for signup integration
   - Processes referral attribution
   - Handles conversion tracking

### Data Flow

1. **Link Click**: User clicks referral link with `?ref=CODE`
2. **Attribution**: ReferralTracker stores attribution data
3. **Signup**: User completes signup form
4. **Processing**: useReferralIntegration processes the referral
5. **Conversion**: Referral marked as converted
6. **Commission**: Affiliate earns commission (calculated later)

## Integration Points

### Pages with Referral Tracking
- `/` - Main landing page
- `/signup` - Customer signup
- `/onboarding` - Customer onboarding

### Database Schema (Future Integration)
When integrating with Supabase or another database, create these tables:

```sql
-- Affiliates table
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  affiliate_code VARCHAR(50) UNIQUE NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  status VARCHAR(20) DEFAULT 'active',
  total_earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Referrals table
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES affiliates(id),
  referred_user_id UUID REFERENCES users(id),
  referral_code VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  conversion_value DECIMAL(10,2),
  commission_earned DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  converted_at TIMESTAMP
);

-- Referral clicks tracking
CREATE TABLE referral_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code VARCHAR(50),
  ip_address INET,
  user_agent TEXT,
  referrer_url TEXT,
  clicked_at TIMESTAMP DEFAULT NOW()
);
```

## Configuration

### Referral Code Format
- Format: `REF_{USER_ID}_{TIMESTAMP}_{RANDOM}`
- Example: `REF_USER_1A2B_3C4D_5E6F`
- Ensures uniqueness and traceability

### Attribution Window
- **Cookie Duration**: 30 days
- **Local Storage**: Session-based backup
- **URL Parameter**: Immediate tracking

### Commission Structure
- **Default Rate**: 10% (configurable per affiliate)
- **Calculation**: Based on conversion value
- **Payment**: Manual processing (can be automated)

## Usage Examples

### Getting Referral Links in Dashboard
```javascript
// User's referral code
const userCode = referralService.generateReferralCode(userId);

// Generated links
const links = referralService.generateReferralLinks(userCode);
// Returns array with landing, onboarding, and signup links
```

### Processing Signup Referrals
```javascript
// In signup form
const { processSignupReferral } = useReferralIntegration();

const handleSignup = (userData) => {
  const referral = processSignupReferral(userData);
  if (referral) {
    // Referral was processed
    console.log('Referred by:', referral.referral_code);
  }
};
```

### Tracking Referral Performance
```javascript
// Get user's referral statistics
const stats = await referralService.getUserReferralStats(userId);
// Returns: total_referrals, earnings, conversion_rate, etc.
```

## Next Steps

1. **Database Integration**: Replace mock data with Supabase queries
2. **Payment Processing**: Automate commission payments
3. **Advanced Analytics**: Add conversion funnels and A/B testing
4. **Email Notifications**: Notify affiliates of successful referrals
5. **Mobile App**: Extend tracking to mobile applications
6. **API Endpoints**: Create REST/GraphQL APIs for external integrations

## Testing

### Test Referral Flow
1. Go to `/dashboard` → Referrals tab
2. Copy a referral link
3. Open in incognito/private window
4. Complete signup process
5. Check dashboard for updated statistics

### Test URLs
- Landing: `http://localhost:3000/user123`
- Signup: `http://localhost:3000/user123/signup`
- Onboarding: `http://localhost:3000/user123/onboarding`

## Security Considerations

- Referral codes are not sensitive (publicly shareable)
- Attribution data stored client-side (no PII in cookies)
- Commission calculation server-side only
- Rate limiting on referral link generation
- Fraud detection for suspicious patterns
