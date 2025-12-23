# Arquitectura Híbrida Imperial

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUTTER WEB FRONTEND                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │  Analytics   │  │   Agents     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                           │                                  │
│                  ┌────────▼────────┐                        │
│                  │   API Client    │                        │
│                  │  + WebSocket    │                        │
│                  └────────┬────────┘                        │
└───────────────────────────┼──────────────────────────────────┘
                            │ HTTPS/WSS
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                  NODE.JS BACKEND (Vercel)                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              API Layer (REST + WebSocket)              │  │
│  └─────────────────────────┬──────────────────────────────┘  │
│                            │                                  │
│  ┌────────────┬────────────┼────────────┬──────────────┐    │
│  │            │            │            │              │    │
│  ▼            ▼            ▼            ▼              ▼    │
│ Build      Security   Orchestrator  Deploy         Queue    │
│ Agent       Agent        Agent       Agent         Agent    │
│  │            │            │            │              │    │
│  └────────────┴────────────┴────────────┴──────────────┘    │
│                            │                                  │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │           Shared Services & Utilities                  │  │
│  │  (Logger, Config, Validators, Cache)                   │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

## Flujo de Datos

1. **User Action** (Flutter) → 2. **API Request** (HTTP) → 3. **Agent Execution** (Node.js) → 4. **Response** (JSON) → 5. **UI Update** (Flutter)

## Beneficios

- ✅ **Separation of Concerns**: Frontend y backend independientes
- ✅ **Scalability**: Escalar cada parte por separado
- ✅ **Performance**: WASM en frontend + Node.js optimizado
- ✅ **Deployment**: CI/CD automático para ambos
- ✅ **Development**: Equipos pueden trabajar en paralelo

## Endpoints API

### REST API

#### POST /api/v1/agents
Ejecuta una acción de agente específico.

**Request Body:**
```json
{
  "agent": "build|security|orchestrator",
  "action": "string",
  "params": {}
}
```

**Response:**
```json
{
  "success": true,
  "agent": "build",
  "result": {},
  "timestamp": "2024-12-19T00:00:00.000Z"
}
```

#### GET /api/v1/docs
Devuelve la documentación OpenAPI/Swagger de la API.

### WebSocket API

#### /api/websocket
Conexión WebSocket para actualizaciones en tiempo real.

**Message Format:**
```json
{
  "type": "agent-update",
  "data": {},
  "timestamp": 1234567890
}
```

## Configuración de Entorno

### Backend (Node.js)

Variables requeridas en `.env`:

```bash
# Backend API
NODE_ENV=production
ALLOWED_ORIGINS=https://your-flutter-app.vercel.app

# Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

### Frontend (Flutter)

Variables en el build:

```bash
# Backend API URL
BACKEND_API_URL=https://your-backend.vercel.app
WEBSOCKET_URL=wss://your-backend.vercel.app/api/websocket
```

## Deployment

### Backend

```bash
# Deploy manual
vercel --prod

# Deploy automático via GitHub Actions
# Push a branch 'main' con cambios en api/, agents/, modules/
```

### Frontend

```bash
# Build Flutter Web
cd flutter_web
flutter build web --release --web-renderer canvaskit --wasm

# Deploy manual
vercel --prod ./build/web

# Deploy automático via GitHub Actions
# Push a branch 'main' con cambios en flutter_web/
```

## Seguridad

- CORS configurado para dominios específicos
- Headers de seguridad en todas las respuestas
- Rate limiting en API endpoints (configurar en Vercel)
- Autenticación JWT (implementar según necesidad)
- Validación de input en todos los endpoints

## Performance

- API responses < 200ms
- WebSocket latency < 100ms
- Flutter Web con WASM compilation
- Vercel Edge Network para baja latencia global
- Cache strategies para assets estáticos

## Monitoreo

- Vercel Analytics para backend
- Vercel Web Analytics para frontend
- Custom logging en agentes
- Error tracking (integrar Sentry/similar)
- Performance metrics collection

## Desarrollo Local

### Backend
```bash
npm install
npm run dev
# API disponible en http://localhost:3000
```

### Frontend
```bash
cd flutter_web
flutter pub get
flutter run -d chrome
# App disponible en http://localhost:5000
```

## Testing

### Backend
```bash
npm test              # Unit tests
npm run test:coverage # Coverage report
```

### Frontend
```bash
cd flutter_web
flutter test
```

## Troubleshooting

### CORS Issues
- Verificar `ALLOWED_ORIGINS` en `.env`
- Verificar headers en `vercel.json`

### WebSocket Connection Failed
- Verificar que el endpoint esté desplegado como Edge Function
- Verificar URL de WebSocket en frontend

### Build Failures
- Verificar Node.js version >= 18
- Verificar Flutter version >= 3.0
- Limpiar cache: `npm clean-install` / `flutter clean`

## Próximos Pasos

1. Implementar autenticación JWT
2. Agregar rate limiting
3. Implementar cache layer (Redis)
4. Agregar monitoring avanzado
5. Implementar feature flags
6. Setup staging environment
