import { Outlet } from 'react-router-dom';
import { AppNavbar } from '../organisms/AppNavbar';

/** Plantilla: estructura común de todas las páginas. */
export function MainLayout() {
  return (
    <>
      <AppNavbar />
      <main className="container py-4 flex-grow-1">
        <Outlet />
      </main>
      <footer className="lm-footer">
        <div className="container py-4 d-flex flex-wrap justify-content-between gap-3">
          <div>
            <strong>Ferretería Los Maestros</strong>
            <p className="small mb-0 mt-1">22 años abasteciendo a contratistas y particulares en La Serena.</p>
          </div>
          <small className="align-self-end">&copy; 2026 Ferretería Los Maestros. Todos los derechos reservados.</small>
        </div>
      </footer>
    </>
  );
}
