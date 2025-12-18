# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The Rascacielos Digital team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### Where to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:

- **Email**: security@rascacielosdigital.com (or create a security advisory in GitHub)

If you prefer, you can also report vulnerabilities using GitHub's security advisory feature:

1. Go to the [Security](https://github.com/Melampe001/Rascacielo-Digital/security) tab
2. Click "Report a vulnerability"
3. Fill out the form with details

### What to Include

When reporting a vulnerability, please include:

1. **Type of vulnerability** (e.g., SQL injection, XSS, authentication bypass)
2. **Full paths of source file(s)** related to the vulnerability
3. **Location of the affected source code** (tag/branch/commit or direct URL)
4. **Step-by-step instructions** to reproduce the issue
5. **Proof-of-concept or exploit code** (if possible)
6. **Impact of the vulnerability** and how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies based on severity
  - Critical: 24-48 hours
  - High: 7 days
  - Medium: 30 days
  - Low: 90 days

### What to Expect

After submitting a vulnerability report, you can expect:

1. **Acknowledgment**: We'll acknowledge receipt within 48 hours
2. **Communication**: We'll keep you informed about our progress
3. **Validation**: We'll work to validate and reproduce the issue
4. **Fix Development**: We'll develop and test a fix
5. **Disclosure**: We'll coordinate disclosure timing with you
6. **Credit**: We'll publicly acknowledge your responsible disclosure (unless you prefer to remain anonymous)

## Security Update Process

1. Security vulnerabilities are addressed with the highest priority
2. Patches are released as soon as they are available and tested
3. Security advisories are published on GitHub
4. Users are notified through:
   - GitHub Security Advisories
   - Release notes
   - Email notifications (for critical issues)

## Security Best Practices

When using Rascacielos Digital:

### Environment Variables

- Never commit `.env` files to version control
- Use strong, unique secrets for `JWT_SECRET` and API keys
- Rotate credentials regularly

### API Keys

- Store Treesit Cloud API keys securely
- Use environment variables, not hardcoded values
- Limit API key permissions to minimum required

### Dependencies

- Keep dependencies up to date
- Review Dependabot alerts regularly
- Run `npm audit` before production deployments

### Authentication

- Use strong passwords (minimum 12 characters)
- Enable 2FA for all accounts
- Use RBAC to limit permissions

### Deployment

- Use HTTPS/TLS for all communications
- Enable auto-scaling with minimum/maximum limits
- Implement rate limiting on APIs
- Regular security audits and penetration testing

## Security Features

Rascacielos Digital includes several built-in security features:

### Code Scanning

- **Security Agent**: Automated vulnerability scanning
- **ESLint**: Static code analysis
- **npm audit**: Dependency vulnerability checking

### Authentication

- **JWT**: Secure token-based authentication
- **Password Hashing**: PBKDF2 with configurable iterations
- **RBAC**: Role-based access control

### Build Security

- **Checksums**: SHA256 verification of build artifacts
- **Manifest**: Detailed build manifest for verification
- **Validation**: Pre-deployment security checks

### CI/CD Security

- **Security Gate**: Automated security scanning in pipeline
- **Dependency Scanning**: Trivy for filesystem scanning
- **Audit Gate**: npm audit in CI/CD

## Vulnerability Disclosure Policy

- We follow responsible disclosure practices
- We request 90 days from initial report before public disclosure
- We credit security researchers (unless they prefer anonymity)
- We maintain a security hall of fame for contributors

## Security Hall of Fame

We thank the following researchers for responsibly disclosing vulnerabilities:

- None yet - be the first!

## Contact

For security-related questions or concerns:

- **Security Email**: security@rascacielosdigital.com
- **General Contact**: https://github.com/Melampe001

## PGP Key

For encrypted communications, use our PGP key:

- **Key ID**: (To be added)
- **Fingerprint**: (To be added)

---

**Note**: This security policy is subject to change. Please check back regularly for updates.

Last updated: 2024-12-18
