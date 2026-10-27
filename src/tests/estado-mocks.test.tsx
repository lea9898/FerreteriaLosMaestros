import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import { Badge } from '../components/atoms/Badge';
import { ConfirmBox } from '../components/molecules/ConfirmBox';
import { FormField } from '../components/molecules/FormField';
import { SearchFilters } from '../components/molecules/SearchFilters';
import { ProductForm } from '../components/organisms/ProductForm';
import { productRepository } from '../services/productRepository';
import { EMPTY_FILTERS } from '../utils/filters';
import { formatCLP } from '../utils/format';

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe('Estado, props y eventos de componentes', () => {
  it('ESTADO: el campo del ProductForm refleja lo que escribe el usuario', async () => {
    render(<ProductForm categories={['Pinturas']} existingCodes={[]} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    const nombre = screen.getByLabelText('Nombre del producto');
    expect(nombre).toHaveValue('');
    await userEvent.type(nombre, 'Martillo');
    expect(nombre).toHaveValue('Martillo');
  });

  it('PROPS: en modo edición el código está bloqueado y el botón dice "Guardar cambios"', () => {
    const initial = {
      codigo: 'MC001', categoria: 'Pinturas', subcategoria: 'Látex', nombre: 'Pintura', marca: 'Sipa',
      unidad: 'Galón', precioCompra: '1', precioVenta: '2', stock: '1', stockMinimo: '1', imagen: '',
    };
    render(<ProductForm initialValues={initial} isEditing categories={['Pinturas']} existingCodes={['MC001']}
      onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText('Código')).toBeDisabled();
    expect(screen.getByLabelText('Código')).toHaveValue('MC001');
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument();
  });

  it('EVENTO: SearchFilters avisa cada cambio con el filtro completo', async () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    render(<SearchFilters filters={EMPTY_FILTERS} categories={['Pinturas']} onChange={onChange} onClear={onClear} />);
    await userEvent.click(screen.getByLabelText('Solo stock bajo'));
    expect(onChange).toHaveBeenLastCalledWith({ ...EMPTY_FILTERS, soloStockBajo: true });
    await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'Pinturas');
    expect(onChange).toHaveBeenLastCalledWith({ ...EMPTY_FILTERS, categoria: 'Pinturas' });
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('EVENTO: ConfirmBox ejecuta onConfirm u onCancel según el botón', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<ConfirmBox message="¿Eliminar?" onConfirm={onConfirm} onCancel={onCancel} />);
    expect(screen.getByRole('alertdialog')).toHaveTextContent('¿Eliminar?');
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar eliminación' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('PROPS: Badge aplica la variante recibida', () => {
    const { rerender } = render(<Badge variant="success">OK</Badge>);
    expect(screen.getByText('OK')).toHaveClass('badge', 'text-bg-success');
    rerender(<Badge variant="warning">Ojo</Badge>);
    expect(screen.getByText('Ojo')).toHaveClass('text-bg-warning', 'text-dark');
  });

  it('PROPS: FormField con opciones dibuja un select con placeholder por defecto', () => {
    render(<FormField id="cat" label="Categoría" value="" onChange={() => {}} options={['A', 'B']} />);
    expect(screen.getByRole('combobox', { name: 'Categoría' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Selecciona una opción' })).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('formatCLP formatea precios en pesos chilenos', () => {
    expect(formatCLP(5990)).toMatch(/\$\s?5\.990/);
  });
});

describe('Uso de mocks (vi.spyOn) sobre el repositorio', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    productRepository.reset();
  });

  it('MOCK: el catálogo muestra lo que entrega el repositorio simulado', () => {
    const spy = vi.spyOn(productRepository, 'getAll').mockReturnValue([
      { codigo: 'XX001', categoria: 'Pinturas', subcategoria: 'Látex', nombre: 'Producto simulado', marca: 'Mock',
        unidad: 'Unidad', precioCompra: 1, precioVenta: 2, stock: 5, stockMinimo: 1 },
    ]);
    renderAt('/');
    expect(spy).toHaveBeenCalled();
    expect(screen.getByText('Mostrando 1 de 1 productos')).toBeInTheDocument();
    expect(screen.getByText('Producto simulado')).toBeInTheDocument();
  });

  it('MOCK: si el repositorio falla al crear, la página muestra el error y no navega', async () => {
    vi.spyOn(productRepository, 'create').mockImplementation(() => {
      throw new Error('Error simulado de base de datos');
    });
    renderAt('/admin/nuevo');
    await userEvent.type(screen.getByLabelText('Código'), 'ZZ100');
    await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'Pinturas');
    await userEvent.type(screen.getByLabelText('Subcategoría'), 'Látex');
    await userEvent.type(screen.getByLabelText('Nombre del producto'), 'Pintura X');
    await userEvent.type(screen.getByLabelText('Marca'), 'Sipa');
    await userEvent.type(screen.getByLabelText('Unidad'), 'Galón');
    await userEvent.type(screen.getByLabelText('Precio de compra (CLP)'), '1000');
    await userEvent.type(screen.getByLabelText('Precio de venta (CLP)'), '2000');
    await userEvent.type(screen.getByLabelText('Stock'), '10');
    await userEvent.type(screen.getByLabelText('Stock mínimo'), '2');
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Error simulado de base de datos');
    expect(screen.getByRole('heading', { name: 'Nuevo producto' })).toBeInTheDocument();
  });

  it('editar un código inexistente muestra "Producto no encontrado"', () => {
    renderAt('/admin/editar/NOEXISTE');
    expect(screen.getByRole('alert')).toHaveTextContent('Producto no encontrado.');
  });

  it('Cancelar en el formulario vuelve a la administración', async () => {
    renderAt('/admin/nuevo');
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByRole('heading', { name: 'Administración de productos' })).toBeInTheDocument();
  });

  it('en Administración, "Limpiar filtros" restaura la tabla completa', async () => {
    renderAt('/admin');
    await userEvent.type(screen.getByLabelText('Buscar'), 'cemento');
    expect(screen.getAllByRole('row')).toHaveLength(3);
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(screen.getAllByRole('row')).toHaveLength(86);
  });
});
