# 🚀 Deployment Guide

## Prerequisites

### Required Accounts

1. **Vercel** - Hosting platform
2. **Supabase** - Database and authentication
3. **Stripe** - Payment processing
4. **GitHub** - Source control and CI/CD

### Required Tools

- Node.js 20+
- npm 10+
- Git
- Vercel CLI (optional): `npm install -g vercel`

## Environment Setup

### Local Development

1. **Clone the repository**:

```bash
git clone https://github.com/Melampe001/Rascacielo-Digital.git
cd Rascacielo-Digital
```

2. **Install dependencies**:

```bash
npm install
```

3. **Copy environment variables**:

```bash
cp .env.local.example .env.local
```

4. **Configure `.env.local`**:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Database
DATABASE_URL=postgresql://xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Run development server**:

```bash
npm run dev
```

Visit http://localhost:3000

### Database Setup (Supabase)

1. **Create Supabase project**:
   - Go to https://supabase.com
   - Create new project
   - Note your URL and anon key

2. **Run migrations**:

```bash
# Apply the initial schema
# In Supabase Dashboard > SQL Editor, run:
# migrations/00001_initial_schema.sql
```

3. **Verify tables**:
   - users
   - subscriptions
   - invoices

4. **Enable RLS**:
   - All tables should have RLS enabled
   - Policies should be configured per schema

### Stripe Setup

1. **Create Stripe account**:
   - Go to https://stripe.com
   - Complete registration

2. **Get API keys**:
   - Dashboard > Developers > API Keys
   - Copy Secret key and Publishable key

3. **Create webhook endpoint**:
   - Dashboard > Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events:
     - customer.subscription.created
     - customer.subscription.updated
     - customer.subscription.deleted
     - invoice.paid
     - invoice.payment_failed
   - Copy webhook secret

4. **Test with Stripe CLI** (optional):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Production Deployment

### Vercel Deployment

#### Option 1: GitHub Integration (Recommended)

1. **Connect to Vercel**:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Select "Rascacielo-Digital"

2. **Configure build settings**:
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`
   - Install command: `npm install`

3. **Set environment variables**:
   In Vercel Dashboard > Settings > Environment Variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   DATABASE_URL
   STRIPE_SECRET_KEY
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   STRIPE_WEBHOOK_SECRET
   NEXT_PUBLIC_APP_URL (set to your production URL)
   ```

4. **Deploy**:
   - Push to `main` branch
   - Vercel deploys automatically
   - Monitor deployment in dashboard

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Post-Deployment

1. **Update Stripe webhook URL**:
   - Go to Stripe Dashboard
   - Update webhook endpoint to production URL
   - Test webhook delivery

2. **Verify deployment**:
   - Check health endpoint: `https://your-domain.com/api/health`
   - Test authentication flow
   - Verify database connection

3. **Monitor**:
   - Vercel Analytics
   - Supabase Logs
   - Stripe Dashboard

## CI/CD Pipeline

### 5-Gate System

Our CI/CD pipeline consists of 5 automated gates:

#### Gate 1: Preflight 🚦

- Type checking
- Linting
- Code formatting
- **Trigger**: Push to any branch

#### Gate 2: Dry Run 🧪

- Build verification
- Artifact generation
- **Trigger**: After Gate 1 passes

#### Gate 3: Quality 📊

- Unit tests
- Integration tests
- E2E tests
- Coverage check
- **Trigger**: After Gate 2 passes

#### Gate 4: Security 🛡️

- npm audit
- Trivy vulnerability scan
- Secret detection
- **Trigger**: After Gate 3 passes

#### Gate 5: Release 🚀

- Production build
- Deployment to Vercel
- Smoke tests
- **Trigger**: After Gate 4 passes (main branch only)

### GitHub Secrets

Configure these secrets in GitHub:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
DATABASE_URL
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
VERCEL_TOKEN (for automated deployment)
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

### Manual Deployment

For manual deployments:

```bash
# Ensure you're on the correct branch
git checkout main

# Build locally
npm run build

# Deploy with Vercel CLI
vercel --prod
```

## Rollback Procedure

### Vercel Rollback

1. Go to Vercel Dashboard
2. Select deployment to rollback to
3. Click "Promote to Production"

### Database Rollback

1. Identify migration to rollback
2. Run rollback script (if available)
3. Or manually revert changes in Supabase SQL Editor

### Emergency Procedures

1. **Site Down**:
   - Check Vercel status
   - Check Supabase status
   - Review recent deployments
   - Rollback if necessary

2. **Database Issues**:
   - Check Supabase logs
   - Verify connection string
   - Check RLS policies

3. **Payment Issues**:
   - Check Stripe dashboard
   - Verify webhook delivery
   - Check webhook endpoint logs

## Monitoring

### Vercel Analytics

- Real User Monitoring (RUM)
- Performance metrics
- Error tracking

### Supabase Logs

- Database queries
- Authentication events
- RLS policy violations

### Stripe Dashboard

- Payment events
- Subscription status
- Webhook deliveries

## Performance Optimization

### Next.js Optimizations

- ✅ Server Components by default
- ✅ Dynamic imports
- ✅ Image optimization
- ✅ Font optimization
- ✅ Static generation where possible

### Database Optimizations

- Indexes on frequently queried columns
- Connection pooling
- Query optimization with Drizzle

### CDN Configuration

Vercel Edge Network:

- Automatic CDN
- Global distribution
- DDoS protection

## Backup Strategy

### Database Backups

Supabase provides:

- Automatic daily backups
- Point-in-time recovery
- Manual backups on demand

### Code Backups

- Git version control
- GitHub repository
- Regular commits

## Troubleshooting

### Build Failures

1. Check build logs in Vercel
2. Verify environment variables
3. Test build locally: `npm run build`
4. Check for TypeScript errors

### Runtime Errors

1. Check Vercel function logs
2. Check browser console
3. Verify API endpoints
4. Check database connectivity

### Database Connection Issues

1. Verify `DATABASE_URL`
2. Check Supabase project status
3. Test connection with Drizzle Studio
4. Verify network access

## Scaling

### Horizontal Scaling

Vercel automatically scales:

- Serverless functions
- Edge network
- Static assets

### Database Scaling

Supabase options:

- Free tier: Development
- Pro tier: Production
- Enterprise: Large scale

### Cost Optimization

1. Monitor usage in dashboards
2. Optimize database queries
3. Use caching strategically
4. Monitor Stripe transaction volume

---

**Last Updated**: 2024-12-18
**Next Review**: Q1 2025
