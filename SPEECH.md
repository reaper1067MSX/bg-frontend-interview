# Speech: Frontend Architecture & UI Strategy

## 🎨 Composición y Estructura
El frontend fue desarrollado con **Next.js 15+** y **TypeScript**, enfocándose en una experiencia de usuario (UX) fluida y una arquitectura de estado predecible.

### Bloques Constructores:
1.  **Zustand (Stateless UI Pattern):** Utilizamos Zustand para centralizar el estado global. La UI es "tonta" (stateless); solo reacciona a los cambios del store y dispara acciones. Esto evita el *prop-drilling* y facilita el testing.
2.  **Repository Pattern:** Separamos las llamadas a la API en una capa de repositorios. Esto permite que, si el contrato de la API cambia, solo toquemos un archivo y no todos los componentes.
3.  **TailwindCSS v4:** Aprovechamos las últimas capacidades de Tailwind para un diseño *Mobile-First* y responsivo, asegurando que el inventario sea gestionable desde una tablet o desktop.

## 🧠 Decisiones Clave y Por Qué
-   **Consumo Agnostico de Errores:** Implementamos un sistema donde el store captura el campo `description` de los errores del backend. Esto permite que el frontend muestre mensajes de negocio reales (ej: "No se puede eliminar el proveedor porque tiene stock") sin tener que "adivinar" el error por códigos HTTP.
-   **Tabla Pivote (Pivot Table):** Para un sistema de inventario, una lista simple no es suficiente. Diseñamos una vista que consolida la información multiproveedor, permitiendo ver el stock total y el desglose granular en una sola mirada.
-   **Preservación de Identidad:** Decidimos manejar los IDs internos de las relaciones producto-proveedor en el estado local. Esto resolvió los conflictos de concurrencia al asegurar que el backend sepa exactamente qué fila de la base de datos se está modificando.

## 챌 Challenge & Desafíos
-   **Gestión Dinámica de Formularios:** Crear un formulario donde se pueden añadir/quitar proveedores dinámicamente, cada uno con su propio precio y stock, manteniendo la validación de tipos y la integridad de los datos fue el reto técnico más complejo de la interfaz.
-   **UX Bancaria:** El desafío estético fue crear una interfaz que se sienta "limpia y profesional" (estilo dashboard bancario) pero que sea altamente funcional, utilizando feedback visual inmediato (toasts, alertas animadas, indicadores de carga).

---
El frontend resultante es una aplicación moderna, rápida y diseñada para escalar, priorizando siempre la claridad de los datos para el usuario final.
