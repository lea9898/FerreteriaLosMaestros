import { beforeEach, describe, expect, it } from 'vitest';
import { productRepository } from '../services/productRepository';
import type { Product } from '../types/product';

const nuevo: Product = {
  codigo: 'ZZ999', categoria: 'Varios', subcategoria: 'Prueba', nombre: 'Producto de prueba',
  marca: 'Test', unidad: 'Unidad', precioCompra: 100, precioVenta: 200, stock: 10, stockMinimo: 2,
};

describe('productRepository (CRUD)', () => {
  beforeEach(() => productRepository.reset());

  it('READ: getAll devuelve los 85 productos del catálogo', () => {
    expect(productRepository.getAll()).toHaveLength(85);
  });

  it('READ: getById devuelve el producto correcto y undefined si no existe', () => {
    expect(productRepository.getById('MC001')?.nombre).toBe('Cemento Polpaico gris 25 kg');
    expect(productRepository.getById('NOEXISTE')).toBeUndefined();
  });

  it('CREATE: agrega un producto y queda disponible', () => {
    productRepository.create(nuevo);
    expect(productRepository.getAll()).toHaveLength(86);
    expect(productRepository.getById('ZZ999')).toEqual(nuevo);
  });

  it('CREATE: lanza error si el código ya existe', () => {
    expect(() => productRepository.create({ ...nuevo, codigo: 'MC001' })).toThrow(/Ya existe/);
  });

  it('UPDATE: modifica solo los campos indicados', () => {
    const updated = productRepository.update('MC001', { stock: 5, precioVenta: 6500 });
    expect(updated.stock).toBe(5);
    expect(productRepository.getById('MC001')?.precioVenta).toBe(6500);
    expect(productRepository.getById('MC001')?.nombre).toBe('Cemento Polpaico gris 25 kg');
  });

  it('UPDATE: lanza error si el producto no existe', () => {
    expect(() => productRepository.update('NOEXISTE', { stock: 1 })).toThrow(/No existe/);
  });

  it('DELETE: elimina el producto y devuelve true; false si no existía', () => {
    expect(productRepository.remove('MC001')).toBe(true);
    expect(productRepository.getById('MC001')).toBeUndefined();
    expect(productRepository.remove('MC001')).toBe(false);
  });
});
