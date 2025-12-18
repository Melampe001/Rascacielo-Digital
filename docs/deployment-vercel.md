# 🚀 Guía de Deployment en Vercel

## Pre-requisitos

- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Vercel CLI instalado (`npm i -g vercel`)
- ✅ Código pasando todos los tests (`npm run validate`)

## Checklist Pre-Deployment

```bash
# 1. Lint
npm run lint

# 2. Format
npm run format:check

# 3. Tests
npm test

# 4. Build
npm run build

# 5. Validación completa
npm run validate
```

## Variables de Entorno

Configura estas variables en el dashboard de Vercel:

### Obligatorias

- `NODE_ENV=production`

### Opcionales (para ELARA cuando esté integrado)

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_API_KEY`
- (otras según `.env.example`)

## Proceso de Deployment

### Opción 1: Vercel CLI

```bash
# Preview
vercel

# Production
vercel --prod
```

### Opción 2: GitHub Integration (Recomendado)

1. Conecta repo a Vercel
2. Push a `main` → auto-deploy a producción
3. Push a otras branches → preview deployments

## Post-Deployment

### Verificación

```bash
# Health check
curl https://tu-proyecto.vercel.app/api/health

# Debe retornar:
{
  "status": "ok",
  "timestamp": "2025-12-18T...",
  "version": "1.0.0",
  "agents": { ... }
}
```

### Monitoreo

- Dashboard Vercel: logs en tiempo real
- Analytics: métricas de tráfico
- Errors: tracking de errores

## Troubleshooting

### Build Failures

Si el build falla en Vercel:

1. Verifica que `vercel-build` script existe
2. Revisa logs en Vercel dashboard
3. Prueba build local: `npm run build`

### Function Timeout

Si functions exceden tiempo límite:

1. Optimiza código de agentes
2. Ajusta `maxDuration` en `vercel.json`
3. Considera upgrade a Pro plan (60s timeout)

### Environment Variables

Si agentes fallan por variables:

1. Verifica que estén configuradas en Vercel
2. Usa nombres exactos de `.env.example`
3. Redeploy después de cambiar variables
