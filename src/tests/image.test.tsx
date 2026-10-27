import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ProductImage } from '../components/atoms/ProductImage';
import { ProductCard } from '../components/molecules/ProductCard';
import { seedProducts } from '../data/seedProducts';
import { getProductImage } from '../utils/image';
import { EMPTY_FORM, toProduct, validateProduct } from '../utils/validation';

const valid = {
  ...EMPTY_FORM, codigo: 'MC011', categoria: 'Pinturas', subcategoria: 'Látex', nombre: 'Pintura de prueba',
  marca: 'Sipa', unidad: 'Galón', precioCompra: '1000', precioVenta: '2000', stock: '10', stockMinimo: '2',
};

describe('Fotos de productos', () => {
  it('getProductImage usa la imagen indicada o /productos/<codigo>.jpg por defecto', () => {
    expect(getProductImage({ codigo: 'MC001' })).toBe('/productos/MC001.jpg');
    expect(getProductImage({ codigo: 'MC001', imagen: 'https://x.cl/a.jpg' })).toBe('https://x.cl/a.jpg');
  });

  it('ProductImage muestra la imagen de relleno cuando falla la carga', () => {
    render(<ProductImage src="/productos/no-existe.jpg" alt="Producto" />);
    const img = screen.getByAltText('Producto');
    expect(img).toHaveAttribute('src', '/productos/no-existe.jpg');
    fireEvent.error(img);
    expect(img.getAttribute('src')).toContain('data:image/svg+xml');
  });

  it('ProductCard muestra la foto con el nombre del producto como texto alternativo', () => {
    render(<MemoryRouter><ProductCard product={seedProducts[0]} /></MemoryRouter>);
    expect(screen.getByAltText('Cemento Polpaico gris 25 kg')).toHaveAttribute('src', '/productos/MC001.jpg');
  });

  it('la validación acepta imagen vacía, URL http(s) y ruta con /', () => {
    expect(validateProduct(valid).imagen).toBeUndefined();
    expect(validateProduct({ ...valid, imagen: 'https://sitio.cl/foto.jpg' }).imagen).toBeUndefined();
    expect(validateProduct({ ...valid, imagen: '/productos/MC011.jpg' }).imagen).toBeUndefined();
  });

  it('la validación rechaza una imagen con formato inválido', () => {
    expect(validateProduct({ ...valid, imagen: 'foto.jpg' }).imagen).toMatch(/URL válida/);
  });

  it('toProduct omite la imagen si está vacía y la recorta si viene con espacios', () => {
    expect(toProduct(valid)).not.toHaveProperty('imagen');
    expect(toProduct({ ...valid, imagen: '  /productos/a.jpg ' }).imagen).toBe('/productos/a.jpg');
  });
});
