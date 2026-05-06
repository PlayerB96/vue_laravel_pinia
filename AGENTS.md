# AGENTS

Guía rápida para agentes que colaboran en este proyecto.

## Contexto del proyecto
- Stack principal: Laravel (backend) + Vue 3 con Vite (frontend).
- Base de datos esperada: PostgreSQL.
- Objetivo funcional: sistema de caja rápida para tiendas.
- Funcionalidad clave: consulta de precio de productos y emisión de boletas.

## Reglas de trabajo
- Mantener cambios enfocados y pequeños por tarea.
- No modificar archivos no relacionados con la solicitud.
- No eliminar funcionalidades existentes sin confirmación explícita.
- Si hay ambigüedad en requisitos, pedir aclaración antes de cambiar lógica crítica.

## Backend (Laravel)
- Usar migraciones para cambios de esquema; evitar SQL manual en código de app.
- Validar entradas en controladores o Form Requests.
- Mantener controladores ligeros; mover lógica de negocio a servicios cuando crezca.
- Revisar y respetar convenciones de nombres de modelos, tablas y rutas.

## Frontend (Vue)
- Mantener componentes simples y con responsabilidades claras.
- Evitar duplicación de lógica; extraer utilidades cuando aplique.
- Conservar consistencia visual y de estructura con páginas existentes.
- Usar unicamente Tailwind para estilos de interfaz.
- Evitar CSS personalizado en archivos `.css`, `<style>` o estilos inline, salvo autorización explícita.
- Iconografía con Lucide (`lucide-vue-next`); no usar etiquetas `<svg>` manualmente ni emojis como iconos.

## Reglas funcionales de caja rapida
- Priorizar flujos de venta rapidos: buscar producto, consultar precio y cerrar venta con pocos pasos.
- Incluir soporte para exportar o imprimir boletas en formato compatible con impresora termica.
- Diseñar salidas de boleta con formato claro (items, cantidades, subtotales, total, fecha y medio de pago).

## Calidad y verificación
- Ejecutar pruebas o validaciones mínimas después de cambios relevantes.
- Confirmar que no se introducen errores de lint o build.
- Documentar brevemente decisiones importantes en PR o commit.

## Seguridad y datos
- No exponer secretos, tokens ni credenciales.
- Evitar hardcodear datos sensibles.
- Validar y sanear datos de entrada en backend.
