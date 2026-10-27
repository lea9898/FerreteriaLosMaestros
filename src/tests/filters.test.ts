import { describe, expect, it } from 'vitest';
import { seedProducts } from '../data/seedProducts';
import { EMPTY_FILTERS, filterProducts, isLowStock } from '../utils/filters';

describe('filterProducts (filtros de búsqueda)', () => {
  it('sin filtros devuelve todos los productos', () => {
    expect(filterProducts(seedProducts, EMPTY_FILTERS)).toHaveLength(seedProducts.length);
  });

  it('filtra por texto ignorando mayúsculas y tildes', () => {
    const result = filterProducts(seedProducts, { ...EMPTY_FILTERS, texto: 'MELON' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.marca === 'Melón' || p.nombre.includes('Melón'))).toBe(true);
  });

  it('filtra por categoría', () => {
    const result = filterProducts(seedProducts, { ...EMPTY_FILTERS, categoria: 'Pinturas' });
    expect(result).toHaveLength(9);
    expect(result.every((p) => p.categoria === 'Pinturas')).toBe(true);
  });

  it('filtra solo stock bajo', () => {
    const result = filterProducts(seedProducts, { ...EMPTY_FILTERS, soloStockBajo: true });
    expect(result.every(isLowStock)).toBe(true);
  });

  it('combina texto y categoría; devuelve vacío si nada coincide', () => {
    expect(filterProducts(seedProducts, { ...EMPTY_FILTERS, texto: 'cemento', categoria: 'Pinturas' })).toEqual([]);
  });
});
