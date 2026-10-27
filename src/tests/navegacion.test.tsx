import { render, screen } from '@testing-library/react';
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

describe('Navegación, vistas informativas y diseño responsivo', () => {
  beforeEach(() => productRepository.reset());

  it('el menú enlaza todas las vistas del sitio', () => {
    renderAt('/');
    const rutas: Record<string, string> = {
      Catálogo: '/',
      Nosotros: '/nosotros',
      Contacto: '/contacto',
      Ubicación: '/ubicacion',
      Administración: '/admin',
    };
    Object.entries(rutas).forEach(([nombre, href]) =>
      expect(screen.getByRole('link', { name: nombre })).toHaveAttribute('href', href),
    );
  });

  it('el enlace activo del menú se marca con la clase active', () => {
    renderAt('/contacto');
    expect(screen.getByRole('link', { name: 'Contacto' })).toHaveClass('active');
    expect(screen.getByRole('link', { name: 'Catálogo' })).not.toHaveClass('active');
  });

  it('al elegir una opción del menú se navega y el menú móvil se cierra', async () => {
    renderAt('/');
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    expect(screen.getByTestId('menu')).toHaveClass('show');
    await userEvent.click(screen.getByRole('link', { name: 'Nosotros' }));
    expect(screen.getByRole('heading', { name: 'Sobre nosotros' })).toBeInTheDocument();
    expect(screen.getByTestId('menu')).not.toHaveClass('show');
  });

  it('Sobre nosotros muestra las cifras y el equipo (listas renderizadas)', () => {
    renderAt('/nosotros');
    expect(screen.getByText('años de experiencia')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Equipo de ventas' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });

  it('Ubicación muestra dirección, los 3 horarios y el mapa', () => {
    renderAt('/ubicacion');
    expect(screen.getByRole('heading', { name: 'Dónde estamos' })).toBeInTheDocument();
    expect(screen.getByText('Av. Francisco de Aguirre 123, La Serena')).toBeInTheDocument();
    ['Lunes a viernes', 'Sábado', 'Domingo y festivos'].forEach((dia) =>
      expect(screen.getByText(dia)).toBeInTheDocument(),
    );
    expect(screen.getByText('Cerrado')).toBeInTheDocument();
    expect(screen.getByTitle('Mapa de ubicación de Ferretería Los Maestros')).toHaveAttribute(
      'src',
      expect.stringContaining('google.com/maps'),
    );
  });

  it('desde la 404 el botón vuelve al catálogo', async () => {
    renderAt('/no-existe');
    await userEvent.click(screen.getByRole('link', { name: 'Ir al catálogo' }));
    expect(screen.getByRole('heading', { name: 'Catálogo de productos' })).toBeInTheDocument();
  });

  it('RESPONSIVO: la grilla y el menú usan clases responsivas de Bootstrap', () => {
    renderAt('/');
    expect(document.querySelector('.row.row-cols-1.row-cols-sm-2.row-cols-lg-4')).not.toBeNull();
    expect(document.querySelector('nav')).toHaveClass('navbar-expand-md');
    expect(screen.getByLabelText('Buscar').closest('div')).toHaveClass('col-12', 'col-md-5');
  });

  it('RESPONSIVO: la tabla de administración tiene scroll horizontal y oculta columnas en móvil', () => {
    renderAt('/admin');
    expect(document.querySelector('.table-responsive')).not.toBeNull();
    expect(screen.getByRole('columnheader', { name: 'Categoría' })).toHaveClass('d-none', 'd-md-table-cell');
  });
});
