/**
 * PATRÓN DE DISEÑO: Repository.
 * Es la única fuente de datos simulada (en memoria) y expone el CRUD.
 * La interfaz nunca toca el arreglo directamente; si mañana los datos vienen
 * de la API REST (Spring Boot), solo se reemplaza este módulo.
 */
import { seedProducts } from '../data/seedProducts';
import type { Product } from '../types/product';

const clone = (p: Product): Product => ({ ...p });

let products: Product[] = seedProducts.map(clone);

export const productRepository = {
  /** READ: todos los productos. */
  getAll(): Product[] {
    return products.map(clone);
  },

  /** READ: un producto por código. */
  getById(codigo: string): Product | undefined {
    const found = products.find((p) => p.codigo === codigo);
    return found ? clone(found) : undefined;
  },

  /** CREATE: agrega un producto. Falla si el código ya existe. */
  create(product: Product): Product {
    if (products.some((p) => p.codigo === product.codigo)) {
      throw new Error(`Ya existe un producto con el código ${product.codigo}`);
    }
    products = [...products, clone(product)];
    return clone(product);
  },

  /** UPDATE: modifica un producto existente (el código no cambia). */
  update(codigo: string, changes: Partial<Omit<Product, 'codigo'>>): Product {
    const index = products.findIndex((p) => p.codigo === codigo);
    if (index === -1) {
      throw new Error(`No existe un producto con el código ${codigo}`);
    }
    const updated: Product = { ...products[index], ...changes, codigo };
    products = products.map((p, i) => (i === index ? updated : p));
    return clone(updated);
  },

  /** DELETE: elimina por código. Devuelve true si eliminó algo. */
  remove(codigo: string): boolean {
    const before = products.length;
    products = products.filter((p) => p.codigo !== codigo);
    return products.length < before;
  },

  /** Categorías distintas presentes en el catálogo. */
  getCategories(): string[] {
    return [...new Set(products.map((p) => p.categoria))].sort((a, b) => a.localeCompare(b, 'es'));
  },

  /** Restaura los datos originales (útil para las pruebas). */
  reset(): void {
    products = seedProducts.map(clone);
  },
};
