import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export function AppNavbar() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link${isActive ? ' active' : ''}`;

  return (
    <nav className="navbar navbar-expand-md navbar-dark lm-navbar">
      <div className="container">
        <Link to="/" className="navbar-brand" onClick={close}>
          <img src="/logo.svg" alt="" className="brand-logo" />
          <span>
            Ferretería <strong>Los Maestros</strong>
          </span>
        </Link>

        <button
          type="button"
          className="navbar-toggler"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className={`collapse navbar-collapse${open ? ' show' : ''}`}
          data-testid="menu"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={linkClass}
                onClick={close}
              >
                Catálogo
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/nosotros"
                className={linkClass}
                onClick={close}
              >
                Nosotros
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/contacto"
                className={linkClass}
                onClick={close}
              >
                Contacto
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/ubicacion"
                className={linkClass}
                onClick={close}
              >
                Ubicación
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/admin"
                className={linkClass}
                onClick={close}
              >
                Administración
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}