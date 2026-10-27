import { Link } from 'react-router-dom';
import { mapEmbedUrl, Info } from '../data/Info';

export function DondeEstamos() {
  return (
    <>
      <section className="lm-hero mb-4">
        <span className="lm-eyebrow">Visítanos</span>
        <h1>Dónde estamos</h1>
        <p>Pasa por nuestro local en {Info.ciudad}. Te asesoramos y cargamos tu pedido.</p>
      </section>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="lm-panel p-4 mb-3">
            <h2 className="h5">Dirección</h2>
            <p className="mb-0">{Info.direccion}</p>
            <small className="text-muted">{Info.ciudad}</small>
          </div>
          <div className="lm-panel p-4 mb-3">
            <h2 className="h5">Horarios de atención</h2>
            <ul className="list-unstyled mb-0">
              {Info.horarios.map((h) => (
                <li key={h.dia} className="d-flex justify-content-between border-bottom py-2">
                  <span>{h.dia}</span>
                  <strong>{h.horas}</strong>
                </li>
              ))}
            </ul>
          </div>
          <Link to="/contacto" className="btn btn-primary">¿Dudas? Escríbenos</Link>
        </div>
        <div className="col-12 col-lg-7">
          <div className="lm-panel p-2 h-100">
            <iframe
              title="Mapa de ubicación de Ferretería Los Maestros"
              src={mapEmbedUrl}
              loading="lazy"
              className="w-100 border-0 rounded"
              style={{ minHeight: 420, height: '100%' }}
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </>
  );
}