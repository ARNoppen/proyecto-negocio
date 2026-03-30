# Tareas - Proyecto Negocio (Fase 11: Transformación Almacen Montt)

## Backend - Infraestructura y Datos
- [x] Base de Datos: Añadir columna `custom_label` a la tabla `products`.
- [x] Servicio: Crear `SettingsService` para gestionar Configuraciones Generales.
- [x] API: Implementar endpoints `GET/PUT /api/settings` (Admin).
- [x] API: Implementar endpoint `GET /api/public/settings` (Público).
- [x] Servicio: Actualizar `ProductsService` para soportar `custom_label`.

## Frontend - Rediseño y Administración
- [x] Estilos: Actualizar `tailwind.config.js` con paleta Indigo/Violeta.
- [x] Layout: Actualizar `AdminLayout` con Branding "Almacen Montt" e iconos.
- [x] Módulo: Crear `SettingsView.vue` para gestión de identidad y pagos.
- [x] Módulo: Actualizar `ProductFormView.vue` con el campo de etiqueta personalizada.

## Frontend - Experiencia del Cliente (Público)
- [x] Layout: `PublicLayout` con nombre dinámico y cabecera renovada.
- [x] Home: Implementar Navegación por Chips (Categorías).
- [x] Home: Crear sección de Productos Destacados en la parte superior.
- [x] Home: Mostrar múltiples etiquetas simultáneamente (Oferta, Destacado, Custom).
- [x] Home: Lógica de ordenamiento (Agotados al final) y botón "Consultar" vía WhatsApp.
- [x] Carrito: `CartOverlay` con selección de Pago (Transferencia/Efectivo) y Observaciones.
- [x] Carrito: Generación de mensaje de WhatsApp detallado y limpieza automática.
- [x] Detalle: `ProductDetailView` con diseño premium y soporte de stock.

## Verificación final
- [x] Validar persistencia de configuraciones.
- [x] Probar flujo de pedido completo con forma de pago obligatoria.
- [x] Verificar ordenamiento del catálogo.
