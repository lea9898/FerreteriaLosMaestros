// @vitest-environment jsdom

// 15 pruebas unitarias documentadas para la Evaluación Parcial 2.
// Están escritas con el mismo estilo visto en clases: test(), expect(), render(), screen, fireEvent y vi.

import { test, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { App } from "../App";
import { Button } from "../components/atoms/Button";
import { FormField } from "../components/molecules/FormField";
import { StockBadge } from "../components/molecules/StockBadge";
import { ProductForm } from "../components/organisms/ProductForm";
import { ProductGrid } from "../components/organisms/ProductGrid";
import { ProductTable } from "../components/organisms/ProductTable";
import { Contacto } from "../pages/Contacto";
import { seedProducts } from "../data/seedProducts";
import { productRepository } from "../services/productRepository";
import { filterProducts, EMPTY_FILTERS } from "../utils/filters";
import { validateProduct } from "../utils/validation";

// Después de cada prueba restauramos los mocks y los datos originales
afterEach(() => {
  vi.restoreAllMocks();
  productRepository.reset();
});

// Tres productos de ejemplo tomados del catálogo
const productos = seedProducts.slice(0, 3);

// ---------------------------------------------------------------
// PRUEBAS DE PROPIEDADES (props)
// ---------------------------------------------------------------

// 1
test("el botón muestra la etiqueta que recibe por props", () => {
  render(<Button>Guardar</Button>);

  const boton = screen.getByText("Guardar");

  expect(boton.textContent).toBe("Guardar");
});

// 2
test("el botón ejecuta la función onClick al hacer clic", () => {
  // Función simulada (mock) para saber si fue llamada
  const alHacerClic = vi.fn();

  render(<Button onClick={alHacerClic}>Guardar</Button>);

  fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

  expect(alHacerClic).toHaveBeenCalledTimes(1);
});

// ---------------------------------------------------------------
// PRUEBAS DE RENDERIZADO CORRECTO (listas)
// ---------------------------------------------------------------

// 3
test("la tabla de administración muestra una fila por cada producto", () => {
  render(
    <MemoryRouter>
      <ProductTable products={productos} onDelete={() => {}} />
    </MemoryRouter>
  );

  // 3 productos + 1 fila de encabezado
  expect(screen.getAllByRole("row").length).toBe(4);
  expect(screen.getByText("Cemento Polpaico gris 25 kg")).toBeTruthy();
});

// 4
test("cada tarjeta del catálogo tiene un enlace al detalle del producto", () => {
  render(
    <MemoryRouter>
      <ProductGrid products={productos} />
    </MemoryRouter>
  );

  const enlaces = screen.getAllByText("Ver detalle");

  expect(enlaces.length).toBe(3);
  expect(enlaces[0].getAttribute("href")).toBe("/producto/MC001");
});

// ---------------------------------------------------------------
// PRUEBAS DE RENDERIZADO CONDICIONAL
// ---------------------------------------------------------------

// 5
test("la insignia de stock cambia según la cantidad disponible", () => {
  const { rerender } = render(<StockBadge product={{ stock: 0, stockMinimo: 5 }} />);
  expect(screen.getByText("Sin stock")).toBeTruthy();

  rerender(<StockBadge product={{ stock: 3, stockMinimo: 5 }} />);
  expect(screen.getByText("Stock bajo")).toBeTruthy();

  rerender(<StockBadge product={{ stock: 50, stockMinimo: 5 }} />);
  expect(screen.getByText("Disponible")).toBeTruthy();
});

// 6
test("el mensaje de error solo aparece cuando hay un error", () => {
  const { rerender } = render(
    <FormField id="nombre" label="Nombre" value="" onChange={() => {}} />
  );
  expect(screen.queryByText("Campo requerido")).toBeNull();

  rerender(
    <FormField id="nombre" label="Nombre" value="" onChange={() => {}} error="Campo requerido" />
  );
  expect(screen.getByText("Campo requerido")).toBeTruthy();
});

// 7
test("el formulario de producto vacío muestra errores y no se envía", () => {
  const alEnviar = vi.fn();

  render(
    <ProductForm categories={["Pinturas"]} existingCodes={[]} onSubmit={alEnviar} onCancel={() => {}} />
  );

  fireEvent.click(screen.getByRole("button", { name: "Crear producto" }));

  expect(screen.getByText("El código es obligatorio.")).toBeTruthy();
  expect(alEnviar).not.toHaveBeenCalled();
});

// ---------------------------------------------------------------
// PRUEBAS DE ESTADO (state)
// ---------------------------------------------------------------

// 8
test("el estado del formulario cambia cuando el usuario escribe", () => {
  render(
    <ProductForm categories={["Pinturas"]} existingCodes={[]} onSubmit={() => {}} onCancel={() => {}} />
  );

  const campoNombre = screen.getByLabelText("Nombre del producto") as HTMLInputElement;
  expect(campoNombre.value).toBe("");

  // Simulamos que el usuario escribe
  fireEvent.change(campoNombre, { target: { value: "Martillo" } });

  expect(campoNombre.value).toBe("Martillo");
});

// ---------------------------------------------------------------
// PRUEBAS DE EVENTOS
// ---------------------------------------------------------------

// 9
test("el formulario de contacto avisa que el nombre es obligatorio", () => {
  render(
    <MemoryRouter>
      <Contacto />
    </MemoryRouter>
  );

  // Simulamos que el usuario presiona Enviar sin escribir nada
  fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

  expect(screen.getByText("El nombre es obligatorio.")).toBeTruthy();
});

// ---------------------------------------------------------------
// PRUEBAS DE DISEÑO RESPONSIVO (Bootstrap)
// ---------------------------------------------------------------

// 10
test("la página de contacto usa columnas responsivas col-12 y col-lg", () => {
  render(
    <MemoryRouter>
      <Contacto />
    </MemoryRouter>
  );

  const columnaDatos = document.querySelector(".col-12.col-lg-5");
  const columnaFormulario = document.querySelector(".col-12.col-lg-7");

  expect(columnaDatos).not.toBeNull();
  expect(columnaFormulario).not.toBeNull();
  expect(columnaFormulario?.className).toContain("col-12");
  expect(columnaFormulario?.className).toContain("col-lg-7");
});

// 11
test("la grilla del catálogo muestra 1, 2 o 4 tarjetas por fila según la pantalla", () => {
  render(
    <MemoryRouter>
      <ProductGrid products={productos} />
    </MemoryRouter>
  );

  const grilla = document.querySelector(".row");

  expect(grilla?.className).toContain("row-cols-1");  // celular
  expect(grilla?.className).toContain("row-cols-sm-2"); // tablet
  expect(grilla?.className).toContain("row-cols-lg-4"); // computador
});

// ---------------------------------------------------------------
// PRUEBAS DE LÓGICA (funciones y CRUD)
// ---------------------------------------------------------------

// 12
test("el filtro por categoría devuelve solo productos de esa categoría", () => {
  const resultado = filterProducts(seedProducts, { ...EMPTY_FILTERS, categoria: "Pinturas" });

  expect(resultado.length).toBe(9);
  expect(resultado.every((p) => p.categoria === "Pinturas")).toBe(true);
});

// 13
test("el repositorio crea un producto y luego se puede leer", () => {
  productRepository.create({
    codigo: "ZZ999", categoria: "Pinturas", subcategoria: "Látex", nombre: "Producto de prueba",
    marca: "Test", unidad: "Unidad", precioCompra: 100, precioVenta: 200, stock: 10, stockMinimo: 2,
  });

  expect(productRepository.getAll().length).toBe(86);
  expect(productRepository.getById("ZZ999")?.nombre).toBe("Producto de prueba");
});

// 14
test("la validación rechaza un precio de venta menor al de compra", () => {
  const errores = validateProduct({
    codigo: "MC011", categoria: "Pinturas", subcategoria: "Látex", nombre: "Pintura de prueba",
    marca: "Sipa", unidad: "Galón", precioCompra: "5000", precioVenta: "3000",
    stock: "10", stockMinimo: "2", imagen: "",
  });

  expect(errores.precioVenta).toBe("El precio de venta no puede ser menor al precio de compra.");
});

// ---------------------------------------------------------------
// PRUEBA CON MOCK (vi.spyOn)
// ---------------------------------------------------------------

// 15
test("el catálogo muestra los datos que entrega el repositorio simulado", () => {
  // Reemplazamos getAll por una versión simulada con un solo producto
  const espia = vi.spyOn(productRepository, "getAll").mockReturnValue([
    {
      codigo: "XX001", categoria: "Pinturas", subcategoria: "Látex", nombre: "Producto simulado",
      marca: "Mock", unidad: "Unidad", precioCompra: 1, precioVenta: 2, stock: 5, stockMinimo: 1,
    },
  ]);

  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  expect(espia).toHaveBeenCalled();
  expect(screen.getByText("Producto simulado")).toBeTruthy();
  expect(screen.getByText("Mostrando 1 de 1 productos")).toBeTruthy();
});
