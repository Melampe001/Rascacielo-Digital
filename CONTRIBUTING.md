# Contribuir a Rascacielos Digital

¡Gracias por tu interés en contribuir a Rascacielos Digital! Este documento proporciona guías para contribuir al proyecto.

## 📋 Código de Conducta

Este proyecto y todos los participantes están regidos por nuestro Código de Conducta. Al participar, se espera que respetes este código.

## 🚀 Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor abre un issue con:

1. Descripción clara del problema
2. Pasos para reproducir
3. Comportamiento esperado vs actual
4. Versión del sistema
5. Capturas de pantalla (si aplica)

### Sugerir Mejoras

Las sugerencias de mejoras son bienvenidas:

1. Abre un issue con la etiqueta "enhancement"
2. Describe la mejora propuesta
3. Explica por qué sería útil
4. Proporciona ejemplos de uso

### Pull Requests

#### Proceso

1. **Fork** el repositorio
2. **Crea** una rama desde `develop`:
   ```bash
   git checkout -b feature/mi-nueva-caracteristica
   ```
3. **Implementa** tus cambios
4. **Agrega** tests para tus cambios
5. **Asegúrate** que todos los tests pasen:
   ```bash
   npm test
   npm run lint
   ```
6. **Commit** con mensajes descriptivos
7. **Push** a tu fork
8. **Abre** un Pull Request

#### Guía de Estilo

**Commits:**
- Usa mensajes claros y descriptivos
- Formato: `tipo(scope): descripción`
- Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Ejemplos:
```
feat(agents): agregar Monitor Agent
fix(security): corregir validación de vulnerabilidades
docs(readme): actualizar guía de instalación
```

**Código:**
- Sigue las convenciones de JavaScript/Node.js
- Usa nombres descriptivos para variables y funciones
- Comenta código complejo
- Mantén funciones pequeñas y enfocadas

**Tests:**
- Escribe tests para nuevas funcionalidades
- Mantén cobertura mínima del 80%
- Tests deben ser claros y descriptivos

#### Checklist del PR

- [ ] El código sigue el estilo del proyecto
- [ ] He realizado una auto-revisión del código
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Los cambios no generan nuevos warnings
- [ ] He agregado tests que prueban mi fix/feature
- [ ] Tests nuevos y existentes pasan localmente
- [ ] Cambios dependientes han sido mergeados

## 🏗️ Estructura del Proyecto

```
.
├── agents/           # Agentes especializados
├── modules/          # Módulos del sistema
├── docs/             # Documentación
├── config/           # Configuraciones
├── .github/          # Workflows de CI/CD
└── tests/            # Tests
```

## 🧪 Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests específicos
npm test -- path/to/test

# Con coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## 📝 Documentación

Si agregas una nueva funcionalidad, por favor:

1. Actualiza el README principal
2. Agrega documentación en `/docs`
3. Incluye ejemplos de uso
4. Actualiza el API reference si aplica

## 🔍 Code Review

Todos los PRs requieren revisión antes de merge:

1. Al menos una aprobación requerida
2. Todos los checks de CI deben pasar
3. No puede haber conversaciones sin resolver
4. Branch debe estar actualizado con `develop`

## 🎯 Prioridades

Áreas donde más necesitamos contribuciones:

- [ ] Tests adicionales
- [ ] Documentación
- [ ] Ejemplos de uso
- [ ] Nuevos agentes especializados
- [ ] Optimizaciones de performance
- [ ] Traducciones

## 💬 Comunidad

- **Discussions**: Para preguntas y discusiones generales
- **Issues**: Para bugs y features
- **Pull Requests**: Para contribuciones de código

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la Licencia MIT del proyecto.

## 🙏 Agradecimientos

Gracias por contribuir a Rascacielos Digital y hacer este proyecto mejor para todos.
