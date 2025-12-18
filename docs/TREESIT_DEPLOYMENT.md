# Despliegue en Treesit Cloud

## Configuración Inicial

### 1. Configurar Credenciales

Crear archivo `.env` con las credenciales de Treesit:

```bash
TREESIT_API_KEY=your_api_key
TREESIT_SECRET_KEY=your_secret_key
TREESIT_PROJECT_ID=your_project_id
TREESIT_REGION=us-east-1
```

### 2. Configurar GitHub Secrets

En GitHub: Settings > Secrets and variables > Actions

Agregar:
- `TREESIT_API_KEY`
- `TREESIT_SECRET_KEY`
- `TREESIT_PROJECT_ID`
- `TREESIT_REGION`

## Despliegue Manual

```bash
# Desplegar a producción
npm run deploy

# Verificar estado
npm run deploy:status

# Ver logs
npm run deploy:logs

# Rollback si es necesario
npm run deploy:rollback
```

## Despliegue Automático

Cada push a `Main` despliega automáticamente a Treesit Cloud.

## Monitoreo

```bash
# Check health
npm run deploy:health

# View metrics
node -e "
  const TreesitClient = require('./modules/treesit-client');
  new TreesitClient().getMetrics('24h').then(console.log);
"
```

## Arquitectura de Deployment

### Componentes

1. **TreesitCloudConfig** (`config/treesit-cloud.js`)
   - Gestiona la configuración de Treesit Cloud
   - Valida credenciales requeridas
   - Proporciona acceso seguro a configuraciones

2. **TreesitClient** (`modules/treesit-client.js`)
   - Cliente HTTP para la API de Treesit Cloud
   - Maneja autenticación y requests
   - Proporciona métodos para deployment, storage y monitoring

3. **DeployAgent** (`agents/deploy-agent.js`)
   - Orquesta el proceso completo de deployment
   - Implementa pre y post deployment checks
   - Maneja rollback automático en caso de fallo

### Flujo de Deployment

1. **Pre-deployment Checks**
   - Verifica conectividad con Treesit Cloud
   - Valida configuración y credenciales

2. **Artifact Preparation**
   - Prepara el paquete de deployment
   - Incluye archivos y metadatos necesarios

3. **Deployment**
   - Envía artifacts a Treesit Cloud
   - Inicia el proceso de deployment

4. **Monitoring**
   - Espera a que el deployment complete
   - Verifica estado cada 10 segundos

5. **Post-deployment Validation**
   - Valida que la aplicación esté saludable
   - Confirma que el deployment fue exitoso

6. **Rollback (si es necesario)**
   - Se ejecuta automáticamente en caso de fallo
   - Restaura la versión anterior

## Troubleshooting

### Error: Missing required credentials

Verifica que las variables de entorno estén configuradas:
```bash
echo $TREESIT_API_KEY
echo $TREESIT_PROJECT_ID
```

### Error: Treesit Cloud no está disponible

Verifica la conectividad:
```bash
npm run deploy:health
```

### Deployment timeout

Aumenta el timeout en la configuración del DeployAgent:
```javascript
const agent = new DeployAgent({ 
  healthCheckTimeout: 600000 // 10 minutos 
});
```

## Configuración Avanzada

### Multi-ambiente

```bash
# Deploy a staging
NODE_ENV=staging npm run deploy

# Deploy a development
NODE_ENV=development npm run deploy
```

### Custom Domain

Configura el dominio personalizado en `.env`:
```bash
CUSTOM_DOMAIN=tuapp.ejemplo.com
```

### Auto-scaling

La configuración de auto-scaling se encuentra en `config/treesit-cloud.js`:
```javascript
autoScale: true,
minInstances: 1,
maxInstances: 5
```

## Seguridad

- Nunca commits credenciales en el código
- Usa GitHub Secrets para CI/CD
- Usa variables de entorno en local
- El método `getAll()` de la configuración excluye secretos automáticamente

## Soporte

Para problemas con Treesit Cloud, contacta a su equipo de soporte o consulta la documentación oficial.
