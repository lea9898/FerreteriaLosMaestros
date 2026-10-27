import type { Product, ProductFilters } from '../types/product';

export const EMPTY_FILTERS: ProductFilters = { texto: '', categoria: '', soloStockBajo: false };

const normalize = (text: string): string =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export const isLowStock = (p: Pick<Product, 'stock' | 'stockMinimo'>): boolean => p.stock <= p.stockMinimo;

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const texto = normalize(filters.texto);
  return products.filter((p) => {
    const matchesText =
      texto === '' ||
      [p.codigo, p.nombre, p.marca, p.subcategoria].some((field) => normalize(field).includes(texto));
    const matchesCategory = filters.categoria === '' || p.categoria === filters.categoria;
    const matchesStock = !filters.soloStockBajo || isLowStock(p);
    return matchesText && matchesCategory && matchesStock;
  });
}
