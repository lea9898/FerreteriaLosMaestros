import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="lm-panel text-center py-5">
      <h1 className="display-5">404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="btn btn-primary">Ir al catálogo</Link>
    </div>
  );
}
