# Finance Agent - Agente Especializado en Finanzas Internacionales

## 🎯 Misión

El Finance Agent es un agente especializado del sistema Rascacielos Digital diseñado para proporcionar análisis, recomendaciones y gestión en:

- **Negocios Internacionales**: Análisis de mercados globales y estrategias de expansión
- **Bolsa y Mercados**: Seguimiento y análisis de mercados bursátiles
- **Finanzas Corporativas**: Gestión financiera empresarial y estructuración de capital
- **Inversiones**: Análisis de oportunidades y gestión de portafolios
- **Manejo de Divisas**: Estrategias de cobertura y optimización cambiaria

## ✨ Características Principales

- **Análisis de Perfiles de Riesgo**: Clasificación de inversores (conservador, moderado, agresivo)
- **Recomendaciones de Portafolio**: Sugerencias personalizadas basadas en perfil de riesgo
- **Análisis Multi-divisa**: Soporte para principales monedas internacionales (USD, EUR, GBP, JPY, CHF)
- **Arquitectura Extensible**: Preparado para integración con APIs financieras reales
- **Configuración Flexible**: Parámetros ajustables vía archivo de configuración
- **Modularidad**: Diseño interno limpio siguiendo convenciones idiomáticas de Go

## 📁 Estructura del Proyecto

```
finance-agent/
├── README.md                    # Este archivo
├── go.mod                       # Definición del módulo Go
├── go.sum                       # Checksums de dependencias
├── cmd/
│   └── agent/
│       └── main.go              # Punto de entrada de la aplicación
├── internal/
│   └── analytics/
│       └── advice.go            # Lógica de análisis y recomendaciones
└── config/
    └── config.yml               # Configuración por defecto
```

### Convenciones de Estructura

- **`cmd/`**: Comandos ejecutables de la aplicación
- **`internal/`**: Código interno no exportable fuera del módulo
- **`config/`**: Archivos de configuración

## 🚀 Instalación

### Requisitos Previos

- Go >= 1.21
- Git

### Pasos de Instalación

```bash
# Navegar al directorio del agente
cd agents/finance-agent

# Descargar dependencias
go mod download

# Compilar el agente
go build -o bin/finance-agent cmd/agent/main.go
```

## 💻 Uso

### Ejecución Directa

```bash
# Ejecutar sin compilar
go run cmd/agent/main.go

# O ejecutar el binario compilado
./bin/finance-agent
```

### Ejecución con Parámetros Personalizados

```bash
# Especificar archivo de configuración personalizado
go run cmd/agent/main.go --config=custom-config.yml
```

## 📊 Ejemplo de Salida

```
=== Finance Agent - Recomendación de Portafolio ===

Perfil del Inversor: moderado
Horizonte de Inversión: 5 años
Capital Inicial: $100,000.00

Recomendación de Asignación:
  - Acciones: 40.00% ($40,000.00)
  - Bonos: 35.00% ($35,000.00)
  - Efectivo: 15.00% ($15,000.00)
  - Alternativos: 10.00% ($10,000.00)

Diversificación por Región:
  - América del Norte: 35%
  - Europa: 30%
  - Asia-Pacífico: 25%
  - Mercados Emergentes: 10%

Exposición a Divisas:
  - USD: 45%
  - EUR: 25%
  - GBP: 15%
  - JPY: 10%
  - CHF: 5%

Retorno Esperado: 6.5% anual
Nivel de Riesgo: Medio
```

## 🔧 Configuración

El archivo `config/config.yml` permite personalizar:

- Perfiles de riesgo y sus asignaciones de activos
- Divisas soportadas y sus ponderaciones
- Regiones geográficas para diversificación
- Parámetros de análisis y umbrales

Ejemplo de configuración:

```yaml
risk_profiles:
  conservative:
    stocks: 20
    bonds: 60
    cash: 15
    alternatives: 5
  moderate:
    stocks: 40
    bonds: 35
    cash: 15
    alternatives: 10
  aggressive:
    stocks: 70
    bonds: 15
    cash: 5
    alternatives: 10
```

## 🔮 Próximos Pasos

### Fase 1 - Integración de Datos Reales
- [ ] Conectar con APIs de mercados financieros (Alpha Vantage, Yahoo Finance, IEX Cloud)
- [ ] Integración con APIs de divisas (Fixer, Open Exchange Rates)
- [ ] Sistema de caché para optimizar llamadas a APIs

### Fase 2 - Análisis Avanzado
- [ ] Motor de análisis técnico (medias móviles, RSI, MACD)
- [ ] Análisis fundamental de empresas
- [ ] Predicción de tendencias con ML/AI
- [ ] Backtesting de estrategias

### Fase 3 - Dashboard y Visualización
- [ ] Panel web interactivo con gráficos en tiempo real
- [ ] Exportación de reportes en PDF
- [ ] Alertas y notificaciones automatizadas
- [ ] API REST para integración con otros sistemas

### Fase 4 - Gestión Avanzada
- [ ] Sistema de órdenes de compra/venta simuladas
- [ ] Rebalanceo automático de portafolios
- [ ] Gestión de múltiples portafolios
- [ ] Análisis de performance histórico

### Fase 5 - Expansión Internacional
- [ ] Soporte para más de 50 divisas
- [ ] Análisis de mercados emergentes
- [ ] Integración con exchanges de criptomonedas
- [ ] Estrategias de cobertura de riesgo cambiario

## 🧪 Testing

```bash
# Ejecutar tests
go test ./...

# Tests con cobertura
go test -cover ./...

# Tests con reporte detallado
go test -v ./...
```

## 📚 Documentación de Código

Para generar documentación del código:

```bash
# Generar documentación local
godoc -http=:6060
# Visitar http://localhost:6060/pkg/
```

## 🤝 Contribuir

Este agente sigue las convenciones del proyecto Rascacielos Digital. Para contribuir:

1. Seguir las guías de estilo de Go (gofmt, golint)
2. Mantener cobertura de tests >= 80%
3. Documentar funciones públicas
4. Actualizar este README con nuevas funcionalidades

Ver [CONTRIBUTING.md](../../CONTRIBUTING.md) para más detalles.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](../../LICENSE) para más detalles.

## 👥 Autores

- **Equipo Rascacielos Digital** - [Melampe001](https://github.com/Melampe001)

## 🔗 Enlaces Relacionados

- [Documentación Principal](../../docs/README.md)
- [Otros Agentes](../README.md)
- [Guía de Contribución](../../CONTRIBUTING.md)
