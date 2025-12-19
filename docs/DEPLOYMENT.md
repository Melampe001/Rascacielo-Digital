# Deployment Guide

Esta guía detalla cómo desplegar **Rascacielo Digital** en diferentes entornos.

## 📋 Tabla de Contenidos

- [Local Development](#local-development)
- [Vercel Deployment](#vercel-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Rollback Procedures](#rollback-procedures)

---

## 🖥️ Local Development

### Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Melampe001/Rascacielo-Digital.git
cd Rascacielo-Digital

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 4. Verificar instalación
npm run config:check
npm run health-check
```

### Ejecución Local

```bash
# Desarrollo con hot-reload
npm run dev

# Producción local
npm start

# Ejecutar tests
npm test

# Ejecutar linter
npm run lint

# Formatear código
npm run format
```

### Build Local

```bash
# Construir para producción
npm run build

# Limpiar artefactos
npm run clean

# Ejecutar pipeline completo
npm run orchestrate:full
```

---

## ☁️ Vercel Deployment

### Deployment Automático (Recomendado)

Rascacielo Digital se despliega automáticamente en Vercel cuando se hace push a las ramas principales.

#### 1. Conectar con Vercel

1. Visita [vercel.com](https://vercel.com)
2. Click en "Add New Project"
3. Import tu repositorio GitHub
4. Vercel detectará automáticamente la configuración desde `vercel.json`

#### 2. Configurar Environment Variables

En el dashboard de Vercel, agregar las siguientes variables:

```env
NODE_ENV=production
TREESIT_API_KEY=your_api_key
TREESIT_API_SECRET=your_secret
JWT_SECRET=your_jwt_secret
```

#### 3. Deploy

```bash
# Vercel desplegará automáticamente en cada push a main
git push origin main
```

### Deployment Manual

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy a preview
vercel

# Deploy a producción
vercel --prod
```

### Configuración de Vercel

El archivo `vercel.json` está optimizado para:

- **Static Build**: Sirve `public/index.html` como landing page
- **Serverless Functions**: API endpoints en `/api/*`
- **Security Headers**: Headers enterprise-grade configurados
- **Caching**: Estrategia optimizada para assets y API
- **Regions**: Desplegado en `iad1` (US East) por defecto

```json
{
  "version": 2,
  "name": "rascacielo-digital",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "public" }
    }
  ]
}
```

### API Endpoints Disponibles

Una vez desplegado, estos endpoints estarán disponibles:

```
https://your-project.vercel.app/
https://your-project.vercel.app/api/health
https://your-project.vercel.app/api/build
https://your-project.vercel.app/api/security
```

---

## 🔐 Environment Variables

### Variables Requeridas

```env
# Application
NODE_ENV=production
PORT=3000

# Authentication
JWT_SECRET=your_jwt_secret_min_32_chars
PASSWORD_HASH_ITERATIONS=10000

# Treesit Cloud
TREESIT_API_KEY=your_api_key
TREESIT_API_SECRET=your_api_secret
TREESIT_REGION=us-east-1
```

### Variables Opcionales

```env
# Build Configuration
BUILD_OPTIMIZE=true
BUILD_OUTPUT_DIR=./dist

# Security Configuration
SECURITY_LEVEL=moderate
SECURITY_FAIL_ON_HIGH=true

# Logging
LOG_LEVEL=info

# CI/CD
CI=false
GITHUB_ACTIONS=false
```

### Configuración por Entorno

#### Development

```env
NODE_ENV=development
LOG_LEVEL=debug
SECURITY_LEVEL=relaxed
```

#### Staging

```env
NODE_ENV=staging
LOG_LEVEL=info
SECURITY_LEVEL=moderate
```

#### Production

```env
NODE_ENV=production
LOG_LEVEL=warn
SECURITY_LEVEL=strict
SECURITY_FAIL_ON_HIGH=true
```

---

## 🔧 Troubleshooting

### Problema: Deployment Falla en Vercel

**Síntomas:**
- Build falla con error "Module not found"
- Timeout durante build

**Soluciones:**

1. Verificar `package.json` tiene todas las dependencias
2. Verificar `vercel.json` está configurado correctamente
3. Limpiar cache de Vercel: `vercel --force`
4. Verificar logs: Dashboard → Deployments → View Logs

### Problema: API Endpoints Retornan 404

**Síntomas:**
- `/api/health` retorna 404
- Functions no se ejecutan

**Soluciones:**

1. Verificar archivos en `/api/*.js` existen
2. Verificar `vercel.json` tiene configuración de functions
3. Verificar exports son correctos: `module.exports = async (req, res) => {}`

### Problema: Environment Variables No Funcionan

**Síntomas:**
- Variables retornan `undefined`
- Features no funcionan correctamente

**Soluciones:**

1. Verificar variables en Vercel Dashboard
2. Redeploy después de cambiar variables
3. Verificar nombres exactos (case-sensitive)
4. Usar `process.env.VARIABLE_NAME`

### Problema: Performance Lento

**Síntomas:**
- Respuestas lentas
- Timeouts frecuentes

**Soluciones:**

1. Optimizar functions para cold starts
2. Aumentar memory en `vercel.json`:
```json
"functions": {
  "api/**/*.js": {
    "memory": 3008,
    "maxDuration": 30
  }
}
```
3. Implementar caching
4. Usar CDN para assets estáticos

### Problema: Security Headers No Aparecen

**Síntomas:**
- Headers de seguridad missing
- Security score bajo

**Soluciones:**

1. Verificar `vercel.json` headers configuration
2. Verificar no hay overrides en código
3. Test headers: `curl -I https://your-project.vercel.app`

---

## 🔄 Rollback Procedures

### Rollback Automático en Vercel

Vercel mantiene historial de todos los deployments:

1. Ir a Dashboard → Deployments
2. Encontrar deployment anterior estable
3. Click en "..." → "Promote to Production"

### Rollback Usando CLI

```bash
# Listar deployments
vercel ls

# Rollback a deployment específico
vercel alias set <deployment-url> <your-domain>
```

### Rollback Manual

```bash
# 1. Revertir commit problemático
git revert <commit-hash>
git push origin main

# 2. Vercel desplegará automáticamente el estado revertido
```

### Rollback de Base de Datos (si aplica)

```bash
# 1. Restaurar desde backup
# 2. Verificar integridad
# 3. Redeploy application
```

### Proceso de Rollback Completo

1. **Identificar el problema**
   ```bash
   # Verificar logs
   vercel logs <deployment-url>
   ```

2. **Rollback rápido**
   ```bash
   # Promote deployment anterior
   vercel alias set <previous-deployment> production
   ```

3. **Verificar rollback**
   ```bash
   # Test health check
   curl https://your-domain/api/health
   ```

4. **Investigar causa**
   ```bash
   # Revisar logs y metrics
   # Identificar root cause
   ```

5. **Fix y redeploy**
   ```bash
   # Corregir issue
   git commit -m "fix: issue description"
   git push origin main
   ```

---

## 📊 Monitoring & Health Checks

### Health Check Endpoint

```bash
# Verificar estado del sistema
curl https://your-domain/api/health

# Respuesta esperada:
{
  "status": "healthy",
  "timestamp": "2024-12-19T04:00:00.000Z",
  "version": "1.1.0",
  "agents": {
    "build": "operational",
    "security": "operational",
    "deploy": "operational"
  }
}
```

### Monitoreo Continuo

```bash
# Script de monitoreo (agregar a cron)
#!/bin/bash
HEALTH_URL="https://your-domain/api/health"
RESPONSE=$(curl -s $HEALTH_URL)
STATUS=$(echo $RESPONSE | jq -r '.status')

if [ "$STATUS" != "healthy" ]; then
    echo "⚠️ System unhealthy!"
    # Enviar alerta
fi
```

---

## 🚀 Best Practices

### Pre-Deployment Checklist

- [ ] Todos los tests pasan (`npm test`)
- [ ] No hay errores de linting (`npm run lint`)
- [ ] Código formateado (`npm run format`)
- [ ] 0 vulnerabilidades (`npm audit`)
- [ ] Environment variables configuradas
- [ ] Health checks funcionando
- [ ] Documentación actualizada

### Post-Deployment Checklist

- [ ] Health check retorna "healthy"
- [ ] API endpoints responden correctamente
- [ ] Landing page carga correctamente
- [ ] Security headers presentes
- [ ] Logs no muestran errores críticos
- [ ] Performance dentro de límites aceptables

### Deployment Schedule Recomendado

- **Development**: Deploy continuo en cada push
- **Staging**: Deploy diario automático
- **Production**: Deploy manual después de QA completo

---

## 📞 Support & Resources

- **GitHub Issues**: [Reportar problemas](https://github.com/Melampe001/Rascacielo-Digital/issues)
- **Documentation**: [Docs completa](../README.md)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

---

**Rascacielo Digital v1.1.0** | Deployment Guide
