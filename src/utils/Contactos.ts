export interface ContactosValues {
  nombre: string;
  correo: string;
  mensaje: string;
}

export type ContactErrors = Partial<Record<keyof ContactosValues, string>>;

export const EMPTY_CONTACT: ContactosValues = { nombre: '', correo: '', mensaje: '' };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valida el formulario de contacto. El correo es opcional, pero si viene debe ser válido. */
export function validateContact(v: ContactosValues): ContactErrors {
  const errors: ContactErrors = {};
  const nombre = v.nombre.trim();
  const mensaje = v.mensaje.trim();
  if (!nombre) errors.nombre = 'El nombre es obligatorio.';
  else if (nombre.length > 100) errors.nombre = 'El nombre no puede superar los 100 caracteres.';
  if (v.correo.trim() && !EMAIL_REGEX.test(v.correo.trim())) errors.correo = 'Ingresa un correo válido.';
  if (!mensaje) errors.mensaje = 'El mensaje es obligatorio.';
  else if (mensaje.length > 500) errors.mensaje = 'El mensaje no puede superar los 500 caracteres.';
  return errors;
}