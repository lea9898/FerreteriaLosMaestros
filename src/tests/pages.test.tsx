import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { productRepository } from '../services/productRepository';

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe('Páginas y navegación (integración)', () => {
  beforeEach(() => productRepository.reset());

  it('el catálogo muestra todos los productos al inicio', () => {
    renderAt('/');
    expect(screen.getByText('Mostrando 85 de 85 productos')).toBeInTheDocument();
  });

  it('el filtro de texto reduce la lista y muestra el contador actualizado', async () => {
    renderAt('/');
    await userEvent.type(screen.getByLabelText('Buscar'), 'cemento');
    expect(screen.getByText('Mostrando 2 de 85 productos')).toBeInTheDocument();
    expect(screen.getByText('Cemento Polpaico gris 25 kg')).toBeInTheDocument();
  });

  it('el filtro por categoría y "Limpiar filtros" funcionan', async () => {
    renderAt('/');
    await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'Pinturas');
    expect(screen.getByText('Mostrando 9 de 85 productos')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(screen.getByText('Mostrando 85 de 85 productos')).toBeInTheDocument();
  });

  it('un texto sin coincidencias muestra el mensaje de lista vacía', async () => {
    renderAt('/');
    await userEvent.type(screen.getByLabelText('Buscar'), 'zzzzzz');
    expect(screen.getByRole('alert')).toHaveTextContent('No se encontraron productos');
  });

  it('la ruta con parámetro muestra el detalle del producto', () => {
    renderAt('/producto/MC001');
    expect(screen.getByRole('heading', { name: 'Cemento Polpaico gris 25 kg' })).toBeInTheDocument();
  });

  it('un código inexistente en el detalle muestra "Producto no encontrado"', () => {
    renderAt('/producto/NOEXISTE');
    expect(screen.getByRole('alert')).toHaveTextContent('Producto no encontrado.');
  });

  it('una ruta desconocida muestra la página 404', () => {
    renderAt('/ruta-inventada');
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('el menú hamburguesa abre y cierra la navegación', async () => {
    renderAt('/');
    const menu = screen.getByTestId('menu');
    expect(menu).not.toHaveClass('show');
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    expect(menu).toHaveClass('show');
  });

  it('CREATE: crear un producto desde el formulario lo muestra en la tabla de administración', async () => {
    renderAt('/admin/nuevo');
    await userEvent.type(screen.getByLabelText('Código'), 'ZZ100');
    await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'Pinturas');
    await userEvent.type(screen.getByLabelText('Subcategoría'), 'Látex');
    await userEvent.type(screen.getByLabelText('Nombre del producto'), 'Pintura Test Integración');
    await userEvent.type(screen.getByLabelText('Marca'), 'Sipa');
    await userEvent.type(screen.getByLabelText('Unidad'), 'Galón');
    await userEvent.type(screen.getByLabelText('Precio de compra (CLP)'), '1000');
    await userEvent.type(screen.getByLabelText('Precio de venta (CLP)'), '2000');
    await userEvent.type(screen.getByLabelText('Stock'), '10');
    await userEvent.type(screen.getByLabelText('Stock mínimo'), '2');
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }));
    expect(await screen.findByText('Producto ZZ100 creado correctamente.')).toBeInTheDocument();
    expect(screen.getByText('Pintura Test Integración')).toBeInTheDocument();
    expect(productRepository.getById('ZZ100')).toBeDefined();
  });

  it('UPDATE: editar el stock de un producto actualiza la tabla', async () => {
    renderAt('/admin/editar/MC001');
    const stock = screen.getByLabelText('Stock');
    await userEvent.clear(stock);
    await userEvent.type(stock, '7');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('Producto MC001 actualizado correctamente.')).toBeInTheDocument();
    const fila = screen.getByText('MC001').closest('tr') as HTMLElement;
    expect(within(fila).getByText('7')).toBeInTheDocument();
    expect(productRepository.getById('MC001')?.stock).toBe(7);
  });

  it('DELETE: eliminar pide confirmación y quita el producto de la tabla', async () => {
    renderAt('/admin');
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar MC001' }));
    expect(screen.getByText('¿Seguro que quieres eliminar el producto MC001?')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar eliminación' }));
    expect(screen.getByText('Producto MC001 eliminado correctamente.')).toBeInTheDocument();
    expect(screen.queryByText('Cemento Polpaico gris 25 kg')).not.toBeInTheDocument();
  });

  it('DELETE: cancelar la confirmación no elimina el producto', async () => {
    renderAt('/admin');
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar MC001' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByText('Cemento Polpaico gris 25 kg')).toBeInTheDocument();
    expect(productRepository.getById('MC001')).toBeDefined();
  });
});
