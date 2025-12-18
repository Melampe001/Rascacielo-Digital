# 🏗️ RASCACIELOS DIGITAL ∞

**SaaS production-ready de clase mundial** con Next.js 16+, Supabase, y arquitectura post-quantum.

Ya no estamos construyendo una empresa. Estamos conquistando el siglo XXI en modo silencioso y absoluto.

---

## ✨ Características

- 🔐 **Post-Quantum Security**: ML-KEM-1024 (Kyber-1024) con rotación de claves cada 11 minutos
- ⚡ **Next.js 16+**: App Router, Server Components, Server Actions
- 🎨 **Tailwind CSS v3 + shadcn/ui**: Componentes modernos y accesibles
- 🗄️ **Supabase + Drizzle ORM**: PostgreSQL con type-safety completo
- 💳 **Stripe Integration**: Pagos, suscripciones, webhooks
- 🧪 **Testing**: Playwright E2E + Jest unitarios
- 🚀 **CI/CD 5-Gates**: Pipeline automatizado con validaciones de seguridad

## 🚀 Quick Start

### Prerequisitos

- Node.js 20+
- npm 10+
- Cuenta en Supabase
- Cuenta en Stripe (opcional para desarrollo)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/Melampe001/Rascacielo-Digital.git
cd Rascacielo-Digital

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales

# Iniciar servidor de desarrollo
npm run dev
```

Visita http://localhost:3000

## 📚 Documentación

- [Arquitectura](./docs/ARCHITECTURE.md) - Stack tecnológico y principios
- [API](./docs/API.md) - Endpoints y uso
- [Seguridad](./docs/SECURITY.md) - Post-quantum encryption y mejores prácticas
- [Deployment](./docs/DEPLOYMENT.md) - Guía de despliegue a producción

## 🏢 Estructura del Proyecto

```
rascacielo-digital/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Rutas de autenticación
│   │   ├── (dashboard)/       # Dashboard protegido
│   │   └── api/               # API routes
│   ├── components/            # Componentes React
│   │   ├── ui/               # shadcn/ui
│   │   ├── auth/             # Auth components
│   │   ├── dashboard/        # Dashboard components
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utilidades
│   │   ├── supabase/        # Supabase clients
│   │   ├── db/              # Drizzle ORM
│   │   ├── stripe/          # Stripe integration
│   │   └── security/        # Post-quantum crypto
│   └── middleware.ts         # Next.js middleware
├── tests/                    # Tests E2E y unitarios
├── migrations/               # Database migrations
├── docs/                     # Documentación
└── .github/workflows/        # CI/CD pipelines
```

## 🛠️ Comandos

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run start            # Servidor de producción

# Calidad
npm run lint             # ESLint
npm run type-check       # TypeScript
npm run format           # Prettier
npm run format:check     # Verificar formato

# Testing
npm run test:e2e         # Tests E2E con Playwright
npm run test:unit        # Tests unitarios con Jest
npm run test:coverage    # Coverage report

# Database
npm run db:generate      # Generar migrations
npm run db:migrate       # Aplicar migrations
npm run db:studio        # Drizzle Studio
```

## 🔐 Seguridad Post-Quantum

Implementamos **ML-KEM-1024** (anteriormente Kyber-1024), el estándar NIST FIPS-203 para encapsulación de claves resistente a ataques cuánticos.

```typescript
import { QuantumSecurityManager } from '@/lib/security/kyber-encryption';

const qsm = QuantumSecurityManager.getInstance();
const encrypted = qsm.encrypt('sensitive data');
const decrypted = qsm.decrypt(encrypted.ciphertext, encrypted.sharedSecret);
```

Características:

- Rotación automática de claves cada 11 minutos
- Resistencia contra computadoras cuánticas
- Cumple con NIST IR 8547

## 🚀 CI/CD Pipeline

### 5 Gates Automatizados

1. **🚦 Preflight**: Type-check, lint, format
2. **🧪 Dry Run**: Build verification
3. **📊 Quality**: Tests y coverage
4. **🛡️ Security**: Audit de vulnerabilidades
5. **🚀 Release**: Deploy a producción

Todos los gates se ejecutan automáticamente en cada push.

## 📊 Stack Tecnológico

| Categoría  | Tecnología                  |
| ---------- | --------------------------- |
| Framework  | Next.js 15+                 |
| Language   | TypeScript (strict)         |
| Styling    | Tailwind CSS v3 + shadcn/ui |
| Database   | Supabase PostgreSQL         |
| ORM        | Drizzle                     |
| Auth       | Supabase Auth SSR           |
| Payments   | Stripe                      |
| Security   | ML-KEM-1024 (Post-Quantum)  |
| Testing    | Playwright + Jest           |
| Deployment | Vercel                      |
| CI/CD      | GitHub Actions (5 gates)    |

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Asegúrate de que los 5 gates pasen antes de hacer el PR.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](./LICENSE) para más detalles.

## 👥 Autores

- **Melampe001** - _Trabajo Inicial_ - [Melampe001](https://github.com/Melampe001)

## 🙏 Agradecimientos

- Comunidad Next.js
- Equipo de Supabase
- Noble Cryptography por @noble/post-quantum
- shadcn por shadcn/ui

---

## 📈 Métricas

- ✅ TypeScript Strict Mode
- ✅ Zero ESLint Errors
- ✅ Build Time < 2 min
- ✅ Post-Quantum Ready
- ✅ 5-Gate CI/CD Pipeline
- ✅ Production Ready

---

═══════════════════════════════════════════════════════════════

El neón ya está sangrando nuestro color.

**Status**: PRINTING MONEY 💰

═══════════════════════════════════════════════════════════════
