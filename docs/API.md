# 📡 API Documentation

## API Routes

### Health Check

**Endpoint**: `GET /api/health`

Verifica el estado del servicio.

**Response**:

```json
{
  "status": "ok",
  "timestamp": "2024-12-18T22:00:00.000Z",
  "service": "rascacielo-digital"
}
```

### Webhooks

#### Stripe Webhook

**Endpoint**: `POST /api/webhooks/stripe`

Procesa eventos de Stripe.

**Headers**:

```
Content-Type: application/json
Stripe-Signature: <signature>
```

**Events Handled**:

1. **customer.subscription.created**
   - Crea nueva suscripción en la base de datos
2. **customer.subscription.updated**
   - Actualiza estado de suscripción existente
3. **customer.subscription.deleted**
   - Marca suscripción como cancelada
4. **invoice.paid**
   - Registra pago exitoso de invoice
5. **invoice.payment_failed**
   - Registra fallo de pago

**Implementation Note**:

- Requiere `STRIPE_WEBHOOK_SECRET` configurado
- Verifica firma de Stripe automáticamente
- Usa Drizzle ORM para persistencia

**Example Payload** (customer.subscription.created):

```json
{
  "id": "evt_xxx",
  "type": "customer.subscription.created",
  "data": {
    "object": {
      "id": "sub_xxx",
      "customer": "cus_xxx",
      "status": "active",
      "items": {
        "data": [
          {
            "price": {
              "id": "price_xxx"
            }
          }
        ]
      }
    }
  }
}
```

## Server Actions

Server Actions permiten mutaciones server-side sin crear API routes explícitos.

### Authentication Actions

(Implementados en componentes client-side usando Supabase)

**Login**:

```typescript
const { error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

**Signup**:

```typescript
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { full_name: fullName }
  }
});
```

**Logout**:

```typescript
await supabase.auth.signOut();
```

## Database Queries (Drizzle)

### Users

**Get User by ID**:

```typescript
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const user = await db.query.users.findFirst({
  where: eq(users.id, userId)
});
```

**Create User**:

```typescript
await db.insert(users).values({
  email: 'user@example.com',
  fullName: 'John Doe'
});
```

### Subscriptions

**Get User Subscriptions**:

```typescript
import { subscriptions } from '@/lib/db/schema';

const userSubs = await db.query.subscriptions.findMany({
  where: eq(subscriptions.userId, userId)
});
```

**Update Subscription**:

```typescript
await db
  .update(subscriptions)
  .set({ status: 'canceled' })
  .where(eq(subscriptions.id, subscriptionId));
```

### Invoices

**Get User Invoices**:

```typescript
import { invoices } from '@/lib/db/schema';

const userInvoices = await db.query.invoices.findMany({
  where: eq(invoices.userId, userId),
  orderBy: (invoices, { desc }) => [desc(invoices.createdAt)]
});
```

## External APIs

### Supabase

**Client Creation**:

Server-side:

```typescript
import { createClient } from '@/lib/supabase/server';
const supabase = await createClient();
```

Client-side:

```typescript
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
```

**Auth Methods**:

- `auth.signInWithPassword()`
- `auth.signUp()`
- `auth.signOut()`
- `auth.getUser()`
- `auth.getSession()`

### Stripe

**Client Creation**:

```typescript
import { stripe } from '@/lib/stripe/client';
```

**Common Operations**:

Create Checkout Session:

```typescript
const session = await stripe.checkout.sessions.create({
  customer: customerId,
  line_items: [
    {
      price: priceId,
      quantity: 1
    }
  ],
  mode: 'subscription',
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`
});
```

## Error Handling

### API Error Responses

**Format**:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common HTTP Status Codes**:

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Error Handling Best Practices

1. Always catch and log errors
2. Return user-friendly messages
3. Don't expose sensitive information
4. Use appropriate HTTP status codes
5. Log stack traces server-side only

## Rate Limiting

(To be implemented)

Recommended limits:

- Authentication: 5 requests per minute per IP
- API routes: 100 requests per minute per user
- Webhooks: Unlimited (verified by signature)

## Authentication

### Protected Routes

Routes requiring authentication:

- `/dashboard/*`
- `/billing`
- `/settings`

Protected by middleware in `src/middleware.ts`.

### Session Management

- Sessions stored in cookies
- Automatic refresh by Supabase
- Middleware verifies on each request

## Versioning

Current API version: **v1**

Future versions will use URL prefixes:

- `v1`: `/api/v1/*`
- `v2`: `/api/v2/*`

## Testing

### Example E2E Test (Playwright)

```typescript
test('health check returns ok', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(data.status).toBe('ok');
});
```

### Example Unit Test (Jest)

```typescript
describe('Stripe Webhook Handler', () => {
  it('verifies signature', async () => {
    // Test implementation
  });
});
```

## Documentation Updates

When adding new endpoints:

1. Document in this file
2. Add TypeScript types
3. Write tests
4. Update Postman collection (if using)

---

**Last Updated**: 2024-12-18
