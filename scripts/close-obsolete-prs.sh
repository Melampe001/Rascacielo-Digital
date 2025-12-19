#!/bin/bash

# This script is designed specifically for the current PR cleanup task.
# It closes PRs #28, #29, and #31 as part of the consolidation effort.
# PR numbers are hardcoded as per the cleanup specification.

echo "🧹 Cerrando PRs obsoletos..."

# PR #28 - Obsoleto, reemplazado por #29
gh pr comment 28 --body "❌ **Cerrando PR**

Este PR ha sido superado por mejoras posteriores. Las funcionalidades han sido:
- Implementadas en PR #29 (mejor configuración)
- Mejoradas en PR #36 (Backend API REST)

**Acción**: Cerrar sin merge.

**Alternativa**: Usar PR #29 que tiene configuración más completa."

gh pr close 28

# PR #29 - Duplicado, consolidar en #36
gh pr comment 29 --body "🔄 **Consolidando PR**

Este PR tiene funcionalidades valiosas pero se está consolidando en:
- PR #36: Backend API REST (incluye serverless functions)
- PR #37: Complete application (incluye deployment config)

**Acción**: Cerrar para evitar duplicación.

**Nota**: Las mejores prácticas de este PR ya fueron incorporadas."

gh pr close 29

# PR #31 - Cambio muy grande, conflictivo
gh pr comment 31 --body "⚠️ **Cambio Demasiado Disruptivo**

Este PR intenta convertir todo el proyecto a Next.js 16+, lo cual:
- ❌ Conflicta con la arquitectura actual (Node.js + agentes)
- ❌ Requiere reescribir todo el código existente
- ❌ No es compatible con PR #36 y #37

**Recomendación**: Si deseas usar Next.js, crear un nuevo repositorio separado.

**Acción**: Cerrar sin merge.

**Alternativa**: Mantener arquitectura híbrida actual (Node.js backend + Flutter frontend)."

gh pr close 31

echo "✅ PRs obsoletos cerrados"
