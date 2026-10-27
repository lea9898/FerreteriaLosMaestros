import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from '../components/atoms/Alert';
import { Button } from '../components/atoms/Button';
import { StockBadge } from '../components/molecules/StockBadge';
import { FormField } from '../components/molecules/FormField';

describe('Átomos y moléculas simples', () => {
  it('Button renderiza su texto y ejecuta onClick con un clic', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Guardar</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Button deshabilitado no ejecuta onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>Guardar</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('Alert muestra el mensaje con role="alert"', () => {
    render(<Alert variant="danger">Algo salió mal</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Algo salió mal');
  });

  it('StockBadge muestra el estado según stock y stock mínimo', () => {
    const { rerender } = render(<StockBadge product={{ stock: 0, stockMinimo: 5 }} />);
    expect(screen.getByText('Sin stock')).toBeInTheDocument();
    rerender(<StockBadge product={{ stock: 3, stockMinimo: 5 }} />);
    expect(screen.getByText('Stock bajo')).toBeInTheDocument();
    rerender(<StockBadge product={{ stock: 50, stockMinimo: 5 }} />);
    expect(screen.getByText('Disponible')).toBeInTheDocument();
  });

  it('FormField muestra el error solo cuando se entrega la propiedad error', () => {
    const { rerender } = render(<FormField id="nombre" label="Nombre" value="" onChange={() => {}} />);
    expect(screen.queryByText('Campo requerido')).not.toBeInTheDocument();
    rerender(<FormField id="nombre" label="Nombre" value="" onChange={() => {}} error="Campo requerido" />);
    expect(screen.getByText('Campo requerido')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre')).toHaveAttribute('aria-invalid', 'true');
  });
});
