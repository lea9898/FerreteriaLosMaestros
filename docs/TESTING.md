# Documento de testing – EP2 DSY1104

## Configuración del entorno
- **Ejecutor:** Vitest 5 (`vite.config.ts` → bloque `test`), entorno **jsdom** (navegador simulado), `globals: true`.
- **Librerías:** React Testing Library + `@testing-library/user-event` (simula al usuario) + `@testing-library/jest-dom` (cargado en `src/test/setup.ts`).
- **Cobertura:** `@vitest/coverage-v8`.
- **Requisito:** Node.js 22.22 o superior (jsdom 30 lo exige).
- Vitest usa la misma sintaxis que Jasmine (`describe`, `it`, `expect`, `beforeEach`, `afterEach`) y cumple el rol de Karma como ejecutor de pruebas.

## Cómo reproducir
```bash
npm install
npm run test      # ejecuta las pruebas (modo observación; q para salir)
npm run coverage  # pruebas + cobertura (coverage/index.html)
npm run report    # pruebas + cobertura + reports/test-results.json
```

## Resultados (última ejecución)
- **12 archivos de prueba, 95 pruebas, 95 aprobadas, 0 fallidas.**
- Cobertura: sentencias 99,64 %, ramas 98,85 %, funciones 100 %, líneas 100 %.

## Las 15 pruebas documentadas (`src/tests/rubrica.test.tsx`)
Escritas con el estilo visto en clases (`test`, `expect`, `render`, `screen`, `fireEvent`, `vi`).

| # | Categoría | Prueba |
|---|---|---|
| 1 | Props | El botón muestra la etiqueta que recibe por props |
| 2 | Props + eventos | El botón ejecuta la función onClick al hacer clic (`vi.fn`) |
| 3 | Renderizado de listas | La tabla muestra una fila por cada producto |
| 4 | Renderizado de listas | Cada tarjeta tiene un enlace al detalle |
| 5 | Renderizado condicional | La insignia de stock cambia según la cantidad |
| 6 | Renderizado condicional | El mensaje de error solo aparece cuando hay error |
| 7 | Condicional + eventos | El formulario vacío muestra errores y no se envía |
| 8 | Estado | El estado del formulario cambia cuando el usuario escribe |
| 9 | Eventos | El contacto avisa que el nombre es obligatorio |
| 10 | Responsivo | Contacto usa columnas `col-12` / `col-lg-5` / `col-lg-7` |
| 11 | Responsivo | La grilla usa `row-cols-1` / `row-cols-sm-2` / `row-cols-lg-4` |
| 12 | Lógica | El filtro por categoría devuelve solo esa categoría |
| 13 | Lógica (CRUD) | El repositorio crea un producto y luego se puede leer |
| 14 | Lógica (validación) | Se rechaza precio de venta menor al de compra |
| 15 | Mock | El catálogo muestra los datos del repositorio simulado (`vi.spyOn`) |

## Pruebas por archivo (complementarias, para cobertura)
| Archivo | N° | Qué verifica |
|---|---|---|
| `productRepository.test.ts` | 7 | CRUD completo: leer todos, leer por código, crear, crear duplicado (error), actualizar, actualizar inexistente (error), eliminar |
| `filters.test.ts` | 5 | Sin filtros, texto (sin distinguir mayúsculas/tildes), categoría, stock bajo, combinación sin resultados |
| `validation.test.ts` | 7 | Formulario válido, obligatorios, formato de código, duplicado, precio venta < compra, precio 0/negativo/no numérico, stock negativo/decimal |
| `atoms.test.tsx` | 5 | `Button` (texto, onClick, deshabilitado), `Alert`, `StockBadge` (3 estados), `FormField` (error condicional) |
| `ProductForm.test.tsx` | 6 | Sin errores al cargar, errores al enviar vacío, error al salir del campo, duplicado, envío válido, cancelar |
| `ProductTable.test.tsx` | 4 | Una fila por producto, `onDelete` con el código, lista vacía, tarjetas con enlace |
| `image.test.tsx` | 6 | Foto por convención, imagen de relleno al fallar, texto alternativo, validación del campo imagen |
| `pages.test.tsx` | 12 | Catálogo, filtros, detalle por parámetro, 404, menú hamburguesa, CREATE/UPDATE/DELETE en la interfaz |
| `contacto.test.tsx` | 8 | Formulario de contacto: errores condicionales, correo inválido, envío exitoso y limpieza, validación de largos |
| `navegacion.test.tsx` | 8 | Enlaces del menú, enlace activo, cierre del menú al navegar, Nosotros, Ubicación, 404, **clases responsivas de Bootstrap** |
| `estado-mocks.test.tsx` | 12 | Estado del formulario al escribir, props en modo edición, eventos de `SearchFilters` y `ConfirmBox`, `Badge`, `formatCLP`, **mocks con `vi.spyOn`** del repositorio (datos simulados y error simulado) |

## Clasificación según la propuesta del docente
| Categoría | Ejemplos |
|---|---|
| Renderizado correcto (listas) | ProductTable filas, ProductGrid tarjetas, catálogo con 85 productos, equipo en Nosotros |
| Renderizado condicional | FormField error, StockBadge, "Producto no encontrado", errores del contacto, lista vacía |
| Propiedades (props) | Button etiqueta + onClick, Button disabled, Badge variante, ProductForm en modo edición |
| Estado (state) | Campo refleja lo escrito, filtros actualizan el contador, menú abre/cierra, contacto se limpia al enviar |
| Eventos | onDelete, onSubmit, onCancel, SearchFilters onChange/onClear, ConfirmBox, navegación por el menú |

## Mocks y espías
- `vi.fn()`: funciones simuladas para verificar callbacks (`onSubmit`, `onCancel`, `onDelete`, `onClick`, `onChange`, `onConfirm`) y sus argumentos.
- `vi.spyOn(productRepository, ...)`: reemplaza el repositorio para (1) entregar datos simulados al catálogo y (2) simular un error al crear y comprobar que la página lo muestra. Se restaura con `vi.restoreAllMocks()` en `afterEach`.
- `MemoryRouter`: simula la navegación sin navegador real. `productRepository.reset()` deja los datos iniciales antes de cada prueba.

## Análisis de resultados
- Las pruebas detectaron un error real: el regex del correo había perdido la barra (`.` en vez de `\.`) y aceptaba `juan@correo`. Dos pruebas de `contacto.test.tsx` fallaron hasta corregirlo.
- También detectaron que el menú no enlazaba Nosotros, Contacto y Ubicación (prueba "el menú enlaza todas las vistas del sitio").

## Archivos incluidos / excluidos de la cobertura
- **Excluidos:** `src/main.tsx` (solo monta la app), `src/vite-env.d.ts`, `src/types/**` (solo tipos), `src/data/seedProducts.ts` (datos), `src/test/**` y `src/tests/**` (las propias pruebas).
- **Incluidos:** todo el resto de `src/`.

## Límites
- Ramas no cubiertas (2): la guarda `if (!pendingDelete) return` de `AdminPage` (no se puede alcanzar desde la interfaz) y el mensaje genérico de `ProductFormPage` cuando lo lanzado no es un objeto `Error`. Son protecciones defensivas.
- Los datos viven en memoria: se reinician al recargar la página. No hay pruebas contra una API real (aún no existe).
- Una cobertura alta no garantiza calidad: cada prueba comprueba un resultado explícito (`expect`), no solo ejecuta el código.
