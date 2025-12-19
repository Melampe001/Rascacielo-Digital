# Security System Usage Examples

## Quick Start

### 1. Initialize the Vault

```bash
npm run vault:init
```

### 2. Protect Sensitive Files

```bash
npm run vault:access
# Select option 4 to protect all sensitive files
# Or option 3 to protect a specific file
```

## Example: Protecting a Configuration File

```javascript
const fileVault = require('./modules/security/file-vault');

// Premium user
const premiumUser = {
  username: 'Melampe001',
  email: 'elara@rascacielo-digital.dev'
};

// Protect a file
await fileVault.protectFile('config/api-keys.js', premiumUser);
```

## Example: Accessing Protected Files

```javascript
const fileVault = require('./modules/security/file-vault');

const premiumUser = {
  username: 'Melampe001',
  email: 'elara@rascacielo-digital.dev'
};

// Access protected file content
const content = await fileVault.accessFile('config/api-keys.js', premiumUser);
console.log(content);
```

## Example: Using Access Middleware in Express

```javascript
const express = require('express');
const AccessMiddleware = require('./modules/security/access-middleware');
const securityConfig = require('./config/security-config');

const app = express();

// Protect entire route with premium access
app.get('/api/admin', AccessMiddleware.premiumOnly, (req, res) => {
  res.json({ message: 'Admin access granted', level: req.accessLevel });
});

// Require specific access level
app.get(
  '/api/owner',
  AccessMiddleware.requireLevel(securityConfig.accessLevels.OWNER),
  (req, res) => {
    res.json({ message: 'Owner access granted' });
  }
);

// Apply rate limiting
app.use('/api', AccessMiddleware.rateLimit(100, 60000)); // 100 req/min
```

## Example: Encryption and Decryption

```javascript
const securityConfig = require('./config/security-config');

// Encrypt sensitive data
const sensitiveData = {
  apiKey: 'sk-1234567890',
  dbPassword: 'supersecret123'
};

const encrypted = securityConfig.encrypt(sensitiveData);
console.log('Encrypted:', encrypted);
// { encrypted: '...', iv: '...', authTag: '...' }

// Decrypt (premium user only)
const premiumUser = {
  username: 'Melampe001',
  email: 'elara@rascacielo-digital.dev'
};

const decrypted = securityConfig.decrypt(
  encrypted.encrypted,
  encrypted.iv,
  encrypted.authTag,
  premiumUser
);
console.log('Decrypted:', decrypted);
// { apiKey: 'sk-1234567890', dbPassword: 'supersecret123' }
```

## Testing Premium vs Non-Premium Access

```javascript
const securityConfig = require('./config/security-config');

// Check if user is premium
const isPremium = securityConfig.isPremiumUser('Melampe001');
console.log('Is premium:', isPremium); // true

// Get access level
const user = { username: 'Melampe001' };
const level = securityConfig.getAccessLevel(user);
console.log('Access level:', level); // 4 (OWNER)
```

## CLI Usage

### Interactive Mode

```bash
node scripts/vault-access.js
```

Then select from menu:

1. List protected files
2. Access a file
3. Protect a new file
4. Protect all sensitive files

### Programmatic Usage

```bash
# Initialize vault
npm run vault:init

# Protect all sensitive files
npm run vault:protect

# Run security audit
npm run security:audit
```

## Environment Variables

Set `MASTER_ENCRYPTION_KEY` in your environment or `.env` file:

```bash
MASTER_ENCRYPTION_KEY=your-64-character-hex-key-here
```

If not set, a random key will be generated (not recommended for production).

## Security Best Practices

1. **Never commit** the `MASTER_ENCRYPTION_KEY` to version control
2. **Always use** environment variables for sensitive data
3. **Rotate keys** periodically
4. **Monitor access** through logs
5. **Limit premium access** to trusted team members only
6. **Review** the `.gitignore` to ensure sensitive files are excluded

## Troubleshooting

### Access Denied Errors

If you get access denied:

- Verify username/email match premium team list
- Check `config/security-config.js` for authorized users
- Contact Elara (Melampe001) for access

### Decryption Errors

If decryption fails:

- Ensure `MASTER_ENCRYPTION_KEY` hasn't changed
- Verify file hasn't been corrupted
- Check user has premium access

### Vault Not Found

If vault directory is missing:

```bash
npm run vault:init
```
