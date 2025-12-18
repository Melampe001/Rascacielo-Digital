# 🔐 Documentación de Seguridad

## Post-Quantum Cryptography

### ML-KEM-1024 (Kyber-1024)

Rascacielo Digital implementa criptografía post-cuántica usando **ML-KEM-1024**, el esquema de encapsulación de claves aprobado por NIST en FIPS-203.

#### Características

- **Resistencia cuántica**: Protección contra ataques de computadoras cuánticas
- **Key rotation**: Rotación automática cada 11 minutos
- **Key encapsulation**: Encapsulación segura de claves compartidas
- **Performance**: Optimizado para producción

#### Implementación

```typescript
import { ml_kem1024 } from '@noble/post-quantum/ml-kem';

// Key generation
const keys = ml_kem1024.keygen();

// Encapsulation (Bob)
const { cipherText, sharedSecret } = ml_kem1024.encapsulate(keys.publicKey);

// Decapsulation (Alice)
const recoveredSecret = ml_kem1024.decapsulate(cipherText, keys.secretKey);
```

#### Uso en la Aplicación

La clase `QuantumSecurityManager` en `src/lib/security/kyber-encryption.ts` proporciona:

1. **Singleton Pattern**: Una única instancia para toda la aplicación
2. **Auto-rotation**: Rotación automática de claves cada 11 minutos
3. **Encrypt/Decrypt**: Métodos simples para cifrado de datos
4. **Public Key Export**: Obtención de clave pública en base64

```typescript
const qsm = QuantumSecurityManager.getInstance();
const encrypted = qsm.encrypt('sensitive data');
const decrypted = qsm.decrypt(encrypted.ciphertext, encrypted.sharedSecret);
```

## Authentication Security

### Supabase Auth SSR

- **Server-Side Rendering**: Auth totalmente server-side
- **Cookie-based**: Sesiones seguras con cookies
- **Middleware Protection**: Rutas protegidas automáticamente
- **Row Level Security**: Políticas RLS en PostgreSQL

### Protected Routes

El middleware en `src/middleware.ts` protege:

- `/dashboard/*` - Requiere autenticación
- `/billing` - Requiere autenticación
- `/settings` - Requiere autenticación

Usuarios no autenticados son redirigidos a `/login`.

## Database Security

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado:

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can only update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);
```

### Prepared Statements

Drizzle ORM usa prepared statements automáticamente, previniendo SQL injection.

## API Security

### Stripe Webhooks

- **Signature Verification**: Validación de firma de Stripe
- **Event Processing**: Procesamiento seguro de eventos
- **Error Handling**: Manejo robusto de errores

### Rate Limiting

(Pendiente de implementación)

- API rate limiting con Vercel Edge Config
- Per-user rate limits
- IP-based throttling

## Environment Variables

### Secrets Management

Nunca commitear:

- `.env.local`
- Claves API
- Database URLs con credenciales

Usar:

- `.env.local.example` como plantilla
- GitHub Secrets para CI/CD
- Vercel Environment Variables para producción

### Required Secrets

```bash
NEXT_PUBLIC_SUPABASE_URL=          # Public
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Public (anon key)
DATABASE_URL=                       # Private
STRIPE_SECRET_KEY=                  # Private
STRIPE_WEBHOOK_SECRET=              # Private
```

## Security Scanning

### CI/CD Security Gates

1. **npm audit**: Vulnerabilidades de dependencias
2. **Trivy**: Escaneo de vulnerabilidades en filesystem
3. **TruffleHog**: Detección de secretos commiteados
4. **TypeScript**: Strict mode para type safety

### Manual Security Review

Antes de cada release:

1. Revisar cambios en authentication
2. Verificar RLS policies
3. Auditar nuevas dependencies
4. Revisar environment variables

## Best Practices

### Code Security

- ✅ TypeScript strict mode
- ✅ ESLint con reglas de seguridad
- ✅ No usar `any` type
- ✅ Validar inputs con Zod
- ✅ Sanitizar outputs

### Runtime Security

- ✅ HTTPS only en producción
- ✅ Secure cookies (HttpOnly, SameSite, Secure)
- ✅ CORS configurado correctamente
- ✅ CSP headers (Content Security Policy)
- ✅ No exponer stack traces

### Data Security

- ✅ Encrypt sensitive data
- ✅ Hash passwords (Supabase lo hace automáticamente)
- ✅ No loggear información sensible
- ✅ Rotate keys regularmente
- ✅ Backup encryption

## Incident Response

### En caso de vulnerabilidad:

1. **Evaluar**: Determinar severidad y alcance
2. **Mitigar**: Aplicar fix o workaround inmediato
3. **Notificar**: Informar a usuarios si es necesario
4. **Documentar**: Registrar incidente y resolución
5. **Prevenir**: Actualizar procesos para evitar recurrencia

## Compliance

### NIST Post-Quantum Standards

- FIPS-203: ML-KEM (Module-Lattice-Based Key-Encapsulation Mechanism)
- Future-proof contra amenazas cuánticas
- Cumple con recomendaciones de NIST IR 8547

### Data Protection

- Cumple con principios de GDPR
- Minimización de datos
- Right to be forgotten (implementar según necesidad)
- Data portability

## Security Contacts

Para reportar vulnerabilidades de seguridad:

- Email: security@rascacielo.digital
- GitHub Security Advisories
- Responsible disclosure policy

---

**Última actualización**: 2024-12-18
**Próxima revisión**: Q1 2025
