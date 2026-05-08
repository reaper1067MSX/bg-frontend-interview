# Banco Guayaquil - Inventory UI

Interfaz de usuario moderna y responsiva para la gestión del catálogo de activos y existencias del Banco Guayaquil.

## 🚀 Tecnologías y Stack

- **Framework:** Next.js 15+ (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** TailwindCSS (v4)
- **Gestión de Estado:** Zustand (Stateless UI Pattern)
- **Iconos:** Lucide React
- **HTTP Client:** Axios con interceptores para JWT

## 🛠️ Requisitos Previos

- [Node.js 20+](https://nodejs.org/)
- Backend API en ejecución (ver README del backend)

## 🏁 Inicialización Local

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz (puedes basarte en `.env` si existe):
```env
NEXT_PUBLIC_API_URL=http://localhost:5091/api
```

### 3. Ejecutar el Proyecto en Desarrollo
```bash
npm run dev
```
La aplicación se abrirá en: `http://localhost:3000`

## ✨ Características Implementadas

- **Dashboard de Inventario:** Tabla pivote con visualización de existencias totales y desglose por proveedor.
- **Maestro de Proveedores:** Gestión centralizada (Alta/Baja) de proveedores con validaciones de integridad.
- **Gestión de Activos:** Formulario dinámico para asignar múltiples proveedores, precios y stocks a un mismo producto.
- **Seguridad:** Autenticación basada en Roles (Admin/User).
- **UX de Calidad:** Notificaciones de errores de negocio, skeletons de carga y diseño responsivo adaptado a dispositivos móviles.

## 📁 Estructura del Código

- `/src/app`: Rutas y páginas de la aplicación.
- `/src/components`: Componentes atómicos y de características (Features).
- `/src/store`: Estado global con Zustand.
- `/src/repositories`: Capa de abstracción para llamadas a la API.
- `/src/types`: Definiciones de tipos TypeScript para el dominio.

---
© 2026 Banco Guayaquil Inventory Challenge
