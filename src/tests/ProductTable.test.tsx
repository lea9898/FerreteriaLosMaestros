import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ProductGrid } from '../components/organisms/ProductGrid';
import { ProductTable } from '../components/organisms/ProductTable';
import { seedProducts } from '../data/seedProducts';

const some = seedProducts.slice(0, 3);

describe('Listas de productos', () => {
  it('ProductTable muestra una fila por cada producto recibido', () => {
    render(<MemoryRouter><ProductTable products={some} onDelete={() => {}} /></MemoryRouter>);
    expect(screen.getAllByRole('row')).toHaveLength(some.length + 1); // + encabezado
    some.forEach((p) => expect(screen.getByText(p.nombre)).toBeInTheDocument());
  });

  it('ProductTable llama a onDelete con el código al presionar Eliminar', async () => {
    const onDelete = vi.fn();
    render(<MemoryRouter><ProductTable products={some} onDelete={onDelete} /></MemoryRouter>);
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar MC002' }));
    expect(onDelete).toHaveBeenCalledWith('MC002');
  });

  it('ProductTable muestra mensaje cuando no hay productos', () => {
    render(<MemoryRouter><ProductTable products={[]} onDelete={() => {}} /></MemoryRouter>);
    expect(screen.getByRole('alert')).toHaveTextContent('No se encontraron productos');
  });

  it('ProductGrid muestra todas las tarjetas con enlace al detalle', () => {
    render(<MemoryRouter><ProductGrid products={some} /></MemoryRouter>);
    const links = screen.getAllByRole('link', { name: 'Ver detalle' });
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', '/producto/MC001');
  });
});
