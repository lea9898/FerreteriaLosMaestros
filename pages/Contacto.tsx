import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert } from '../components/atoms/Alert';
import { Button } from '../components/atoms/Button';
import { FormField } from '../components/molecules/FormField';
import { Info } from '../data/Info';
import { EMPTY_CONTACT, validateContact } from '../utils/Contactos';
import type { ContactosValues } from '../utils/Contactos';

export function Contacto() {
  const [values, setValues] = useState<ContactosValues>(EMPTY_CONTACT);
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  const errors = validateContact(values);
  const show = (field: keyof ContactosValues) => (submitted ? errors[field] : undefined);
  const set = (field: keyof ContactosValues) => (value: string) => {
    setSent(false);
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    // Simulado: aquí se llamaría a la API REST (Spring Boot) cuando exista.
    setSent(true);
    setValues(EMPTY_CONTACT);
    setSubmitted(false);
  };

  return (
    <>
      <section className="lm-hero mb-4">
        <span className="lm-eyebrow">Contacto</span>
        <h1>Contáctanos</h1>
        <p>¿Tienes dudas sobre algún producto o tu proyecto? Escríbenos o llámanos.</p>
      </section>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="lm-panel p-4 h-100">
            <h2 className="h5 mb-3">Datos de contacto</h2>
            <dl className="mb-0">
              <dt>Teléfono</dt>
              <dd><a href={`tel:${Info.telefono.replace(/\s/g, '')}`}>{Info.telefono}</a></dd>
              <dt>WhatsApp</dt>
              <dd>{Info.whatsapp}</dd>
              <dt>Correo</dt>
              <dd><a href={`mailto:${Info.correo}`}>{Info.correo}</a></dd>
              <dt>Dirección</dt>
              <dd>{Info.direccion}</dd>
              <dt>Horario</dt>
              <dd className="mb-0">{Info.horarios[0].dia}: {Info.horarios[0].horas}</dd>
            </dl>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <form onSubmit={handleSubmit} noValidate aria-label="Formulario de contacto" className="lm-panel p-4">
            {sent && <Alert variant="success">¡Gracias! Recibimos tu mensaje y te responderemos pronto.</Alert>}
            <FormField id="nombre-contacto" label="Nombre completo" value={values.nombre} error={show('nombre')} onChange={set('nombre')} />
            <FormField id="correo-contacto" label="Correo (opcional)" value={values.correo} error={show('correo')} onChange={set('correo')} placeholder="tucorreo@ejemplo.cl" />
            <div className="mb-3">
              <label htmlFor="mensaje-contacto" className="form-label fw-semibold">Mensaje</label>
              <textarea
                id="mensaje-contacto"
                rows={5}
                maxLength={500}
                className={`form-control${show('mensaje') ? ' is-invalid' : ''}`}
                aria-invalid={Boolean(show('mensaje'))}
                value={values.mensaje}
                onChange={(e) => set('mensaje')(e.target.value)}
              />
              {show('mensaje') && <div className="invalid-feedback d-block">{show('mensaje')}</div>}
            </div>
            <Button type="submit" variant="primary">Enviar mensaje</Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Contacto;