# Ferretería Los Maestros – Evaluación Parcial 2 (DSY1104)

Frontend con **React + Vite + TypeScript**, Bootstrap, React Router y pruebas con Vitest + React Testing Library.

## Cómo ejecutarlo en Visual Studio Code

Requisito: **Node.js 22.22 o superior (recomendado Node 24 LTS)**. Con versiones anteriores las pruebas fallan con `Cannot read properties of undefined (reading 'bind')` porque jsdom 30 lo exige (`node -v`).

```bash
npm install        # instala dependencias
npm run dev        # abre la app en http://localhost:5173
npm test           # ejecuta las pruebas
npm run report     # pruebas + cobertura + reporte JSON (carpetas coverage/ y reports/)
npm run build      # revisa tipos y genera la versión de producción
```

## Rutas

| Ruta | Vista |
|---|---|
| `/` | Catálogo con filtros (texto, categoría, solo stock bajo) |
| `/producto/:codigo` | Detalle del producto (parámetro de ruta) |
| `/nosotros` | Sobre nosotros |
| `/contacto` | Formulario de contacto con validación |
| `/ubicacion` | Dirección, horarios y mapa |
| `/admin` | Tabla de administración (leer, eliminar con confirmación) |
| `/admin/nuevo` | Crear producto |
| `/admin/editar/:codigo` | Editar producto |

## Arquitectura

```
src/
  components/
    atoms/       Button, Badge, Alert, TextInput, SelectInput
    molecules/   FormField, SearchFilters, ProductCard, StockBadge, ConfirmBox
    organisms/   AppNavbar, ProductGrid, ProductTable, ProductForm
    templates/   MainLayout
  pages/         CatalogPage, ProductDetailPage, AdminPage, ProductFormPage, NotFoundPage,
                 SobreNosotros, Contacto, DondeEstamos
  services/      productRepository.ts   ← fuente de datos simulada + CRUD (patrón Repository)
  hooks/         useProducts.ts         ← conecta useState con el repositorio
  utils/         validation, Contactos, filters, format, image
  data/          seedProducts.ts        ← 85 productos del Excel del caso
  tests/         pruebas unitarias y de integración
```

- **Atomic Design**: átomos → moléculas → organismos → plantilla → páginas. Ej.: `FormField` (molécula) compone `TextInput`/`SelectInput` (átomos) y `ProductForm` (organismo) compone varios `FormField`.
- **Patrón de diseño: Repository** (`productRepository.ts`). La interfaz no accede al arreglo de datos; solo llama a `getAll`, `getById`, `create`, `update`, `remove`. Para conectar el backend Spring Boot basta con reemplazar ese módulo por llamadas HTTP.
- **Estado**: `useState` (hook `useProducts`, filtros, formularios controlados).
- **Responsividad**: grilla y navbar de Bootstrap (menú hamburguesa bajo 768 px, tabla con scroll horizontal).

## Fotos de productos
Incluye las 6 fotos de la Evaluación 1 (MC001–MC006). Guarda las fotos en `public/productos/` con el código como nombre (`MC001.jpg`). Se muestran solas en el catálogo, el detalle y la tabla de administración. Si falta una, aparece una imagen "Sin foto". También se puede indicar una URL o ruta en el campo *Foto del producto* del formulario.

## Pruebas

Ver `docs/TESTING.md`.
