# Deployment Guide - Rascacielos Digital

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Vercel Deployment](#vercel-deployment)
- [Environment Variables](#environment-variables)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

Before deploying to production, ensure you have:

- ✅ Node.js >= 18.0.0
- ✅ npm >= 9.0.0
- ✅ Git installed and configured
- ✅ Vercel account ([sign up here](https://vercel.com/signup))
- ✅ All tests passing (62/62)
- ✅ Zero security vulnerabilities
- ✅ `package-lock.json` committed

---

## Environment Setup

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

Follow the authentication prompts to link your account.

### 3. Link Project (First Time Only)

```bash
vercel link
```

This will:
- Ask you to select your Vercel account/team
- Create or link to an existing project
- Generate a `.vercel` directory (ignored by git)

---

## Vercel Deployment

### Preview Deployment

Preview deployments are automatic for every push to any branch:

```bash
# Manual preview deployment
vercel
```

This creates a unique preview URL for testing before production.

### Production Deployment

Deploy to production only after preview testing:

```bash
vercel --prod
```

**Important**: Production deployments should only be done from the `main` branch after:
- All tests pass
- Code review is complete
- Preview deployment is verified

---

## Environment Variables

### Required Variables

Configure these in the Vercel Dashboard (`Settings > Environment Variables`):

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment type | `production` | Yes |
| `PORT` | Application port | `3000` | No (auto-assigned) |

### Optional Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `TREESIT_API_KEY` | TreeSit Cloud API key | `sk_live_...` | No |
| `LOG_LEVEL` | Logging verbosity | `info` | No |

### Setting Variables via CLI

```bash
# Set production variable
vercel env add NODE_ENV production

# Set preview variable
vercel env add NODE_ENV preview

# Set development variable
vercel env add NODE_ENV development
```

### Setting Variables via Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to `Settings > Environment Variables`
4. Add variables for each environment

---

## Monitoring

### Health Check

Monitor system health:

```bash
# Check production health
curl https://your-project.vercel.app/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "uptime": 123.456,
  "memory": {
    "rss": 12345678,
    "heapTotal": 8388608,
    "heapUsed": 5242880,
    "external": 1048576
  }
}
```

### Vercel Analytics

Monitor performance metrics:
- Response times
- Error rates
- Geographic distribution
- Edge cache hits

Access at: `https://vercel.com/[your-username]/[project-name]/analytics`

### Logs

View real-time logs:

```bash
# Via CLI
vercel logs [deployment-url]

# Follow logs
vercel logs [deployment-url] --follow
```

Or access via Dashboard: `https://vercel.com/[your-username]/[project-name]/deployments`

---

## Troubleshooting

### Build Failures

**Issue**: Build fails on Vercel

**Solutions**:
1. Check build logs in Vercel Dashboard
2. Verify `package-lock.json` is committed
3. Ensure all dependencies are in `package.json`
4. Test build locally: `npm run build`

### Function Timeout

**Issue**: Serverless function exceeds timeout (10s default)

**Solutions**:
1. Optimize function execution time
2. Use Pro plan for 60s timeout
3. Move long-running tasks to external services

### Module Not Found

**Issue**: `Cannot find module` error

**Solutions**:
1. Verify module is in `dependencies` (not `devDependencies`)
2. Run `npm install` and commit `package-lock.json`
3. Check case sensitivity in `require()` statements

### CORS Issues

**Issue**: CORS errors in browser

**Solutions**:
1. Add CORS headers to serverless functions (already configured)
2. Verify `Access-Control-Allow-Origin` header
3. Check OPTIONS method handling

---

## Rollback Procedures

### Instant Rollback

Vercel keeps all previous deployments. To rollback:

1. **Via Dashboard**:
   - Go to `Deployments` tab
   - Find the stable deployment
   - Click `...` menu > `Promote to Production`

2. **Via CLI**:
```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote [deployment-url]
```

### Redeploy Previous Version

```bash
# Checkout previous commit
git checkout [commit-hash]

# Deploy to production
vercel --prod

# Return to main
git checkout main
```

---

## CI/CD Integration

### Automatic Deployments

Vercel automatically deploys:
- **Preview**: Every push to any branch
- **Production**: Every push to `main` branch (if configured)

### Disable Auto-Deploy (Optional)

If you prefer manual deployments:

1. Go to Project Settings
2. Navigate to `Git > Production Branch`
3. Uncheck "Automatic deployments"

### Custom Build Command

Already configured in `package.json`:
```json
{
  "scripts": {
    "build": "node build.js"
  }
}
```

---

## Performance Optimization

### Edge Caching

Static assets are automatically cached:
- HTML, CSS, JS: Edge cached
- API responses: Configurable via headers
- Static files in `/public`: Immutable cache

### Cold Start Optimization

Minimize cold starts:
- Keep dependencies minimal
- Use lazy loading for heavy modules
- Consider Vercel Pro for always-warm functions

---

## Security Checklist

Before production deployment:

- [x] Security headers configured (`vercel.json`)
- [x] HTTPS enabled (automatic on Vercel)
- [x] Environment variables secured
- [x] Dependencies audited (`npm audit`)
- [x] CORS properly configured
- [x] Rate limiting implemented (if needed)
- [x] Input validation on all endpoints

---

## Support

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Serverless Functions](https://vercel.com/docs/functions)
- [Project README](../README.md)

### Community
- [GitHub Issues](https://github.com/Melampe001/Rascacielo-Digital/issues)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

## Quick Reference Commands

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# View logs
vercel logs [url]

# List deployments
vercel ls

# Environment variables
vercel env ls
vercel env add [name] [environment]
vercel env rm [name] [environment]

# Project info
vercel inspect [url]

# Remove deployment
vercel rm [url]
```

---

**Last Updated**: 2024-01-15  
**Version**: 1.0.0  
**Author**: Melampe001
