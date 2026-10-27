import type { Product } from '../types/product';

/** Foto del producto: la indicada, o por convención /productos/<codigo>.jpg (carpeta public/productos). */
export const getProductImage = (p: Pick<Product, 'codigo' | 'imagen'>): string =>
  p.imagen?.trim() || `/productos/${p.codigo}.jpg`;
