import { describe, expect, it } from 'vitest';
import { EMPTY_FORM, validateProduct } from '../utils/validation';

const valid = {
  codigo: 'MC011', categoria: 'Pinturas', subcategoria: 'Látex', nombre: 'Pintura de prueba',
  marca: 'Sipa', unidad: 'Galón', precioCompra: '1000', precioVenta: '2000', stock: '10', stockMinimo: '2', imagen: '',
};

describe('validateProduct', () => {
  it('un formulario válido no produce errores', () => {
    expect(validateProduct(valid)).toEqual({});
  });

  it('un formulario vacío marca todos los campos obligatorios', () => {
    const errors = validateProduct(EMPTY_FORM);
    expect(Object.keys(errors)).toHaveLength(10);
    expect(errors.codigo).toBe('El código es obligatorio.');
  });

  it('rechaza un código con formato inválido', () => {
    expect(validateProduct({ ...valid, codigo: 'abc' }).codigo).toMatch(/Formato inválido/);
  });

  it('rechaza un código duplicado al crear, pero no al editar', () => {
    expect(validateProduct(valid, ['MC011']).codigo).toBe('Ya existe un producto con este código.');
    expect(validateProduct(valid, ['MC011'], true).codigo).toBeUndefined();
  });

  it('rechaza precio de venta menor al de compra', () => {
    const errors = validateProduct({ ...valid, precioCompra: '5000', precioVenta: '3000' });
    expect(errors.precioVenta).toBe('El precio de venta no puede ser menor al precio de compra.');
  });

  it('rechaza stock negativo o decimal', () => {
    expect(validateProduct({ ...valid, stock: '-1' }).stock).toMatch(/entero/);
    expect(validateProduct({ ...valid, stockMinimo: '1.5' }).stockMinimo).toMatch(/entero/);
  });

  it('rechaza precios en 0, negativos o que no son números', () => {
    expect(validateProduct({ ...valid, precioCompra: '0' }).precioCompra).toBe('Debe ser un número mayor a 0.');
    expect(validateProduct({ ...valid, precioVenta: '-5' }).precioVenta).toBe('Debe ser un número mayor a 0.');
    expect(validateProduct({ ...valid, precioCompra: 'abc' }).precioCompra).toBe('Debe ser un número mayor a 0.');
  });
});
