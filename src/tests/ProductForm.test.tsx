import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProductForm } from '../components/organisms/ProductForm';

const categories = ['Pinturas', 'Herramientas'];

function setup(existingCodes: string[] = ['MC001']) {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  render(<ProductForm categories={categories} existingCodes={existingCodes} onSubmit={onSubmit} onCancel={onCancel} />);
  return { onSubmit, onCancel };
}

async function fillValid() {
  await userEvent.type(screen.getByLabelText('Código'), 'PT100');
  await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'Pinturas');
  await userEvent.type(screen.getByLabelText('Subcategoría'), 'Látex');
  await userEvent.type(screen.getByLabelText('Nombre del producto'), 'Pintura nueva');
  await userEvent.type(screen.getByLabelText('Marca'), 'Sipa');
  await userEvent.type(screen.getByLabelText('Unidad'), 'Galón');
  await userEvent.type(screen.getByLabelText('Precio de compra (CLP)'), '1000');
  await userEvent.type(screen.getByLabelText('Precio de venta (CLP)'), '2000');
  await userEvent.type(screen.getByLabelText('Stock'), '10');
  await userEvent.type(screen.getByLabelText('Stock mínimo'), '2');
}

describe('ProductForm (formulario controlado)', () => {
  it('al cargar no muestra mensajes de error', () => {
    setup();
    expect(screen.queryByText(/obligatorio/i)).not.toBeInTheDocument();
  });

  it('al enviar vacío muestra errores específicos y no llama a onSubmit', async () => {
    const { onSubmit } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }));
    expect(screen.getByText('El código es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('Selecciona una categoría.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('muestra error de formato al salir del campo código con un valor inválido', async () => {
    setup();
    await userEvent.type(screen.getByLabelText('Código'), 'xx');
    await userEvent.tab();
    expect(screen.getByText(/Formato inválido/)).toBeInTheDocument();
  });

  it('muestra error de código duplicado', async () => {
    setup(['MC001']);
    await userEvent.type(screen.getByLabelText('Código'), 'MC001');
    await userEvent.tab();
    expect(screen.getByText('Ya existe un producto con este código.')).toBeInTheDocument();
  });

  it('con datos válidos llama a onSubmit con el producto convertido a números', async () => {
    const { onSubmit } = setup();
    await fillValid();
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      codigo: 'PT100', categoria: 'Pinturas', subcategoria: 'Látex', nombre: 'Pintura nueva',
      marca: 'Sipa', unidad: 'Galón', precioCompra: 1000, precioVenta: 2000, stock: 10, stockMinimo: 2,
    });
  });

  it('el botón Cancelar llama a onCancel', async () => {
    const { onCancel } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
