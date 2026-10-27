import { Link } from 'react-router-dom';
import { Info } from '../data/Info';
const equipo = [
  { titulo: 'Equipo de bodega', texto: 'Mantiene el stock actualizado y prepara los despachos.' },
  { titulo: 'Equipo de ventas', texto: 'Te asesora para elegir los materiales correctos según tu proyecto.' },
  { titulo: 'Equipo de desarrollo web', texto: 'Estudiantes Duoc UC a cargo de este sitio' },
];

const cifras = [
  { valor: '22', texto: 'años de experiencia' },
  { valor: '800+', texto: 'productos para la construcción' },
  { valor: 'Coquimbo', texto: 'región que atendemos' },
];

export function SobreNosotros() {
  return (
    <>
      <section className="lm-hero mb-4">
        <span className="lm-eyebrow">Quiénes somos</span>
        <h1>Sobre nosotros</h1>
        <p>
          Somos un negocio familiar ubicado en {Info.ciudad}, con más de 800 productos para la construcción
          y 22 años de experiencia atendiendo a la región.
        </p>
      </section>

      <div className="row g-3 mb-4">
        {cifras.map((c) => (
          <div className="col-12 col-md-4" key={c.texto}>
            <div className="lm-panel text-center h-100">
              <div className="lm-price" style={{ color: 'var(--lm-orange)' }}>{c.valor}</div>
              <small className="text-muted">{c.texto}</small>
            </div>
          </div>
        ))}
      </div>

      <section className="lm-panel p-4 mb-4">
        <h2 className="h4">Nuestra historia</h2>
        <p className="mb-0">
          {Info.nombre} nació como un pequeño local de barrio y hoy es un referente para contratistas,
          maestros y particulares que buscan materiales de construcción con buena asesoría y precios justos.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="h4 mb-3">Nuestro equipo</h2>
        <div className="row g-3">
          {equipo.map((e) => (
            <div className="col-12 col-md-4" key={e.titulo}>
              <div className="lm-panel h-100" style={{ borderLeft: '4px solid var(--lm-orange)' }}>
                <h3 className="h6">{e.titulo}</h3>
                <p className="mb-0 text-muted">{e.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="d-flex flex-wrap gap-2">
        <Link to="/" className="btn btn-primary">Ver catálogo</Link>
        <Link to="/contacto" className="btn btn-outline-primary">Contáctanos</Link>
      </div>
    </>
  );
}

export default SobreNosotros;