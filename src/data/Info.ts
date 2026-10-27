export const Info = {
  nombre: 'Ferretería Los Maestros',
  ciudad: 'La Serena, Región de Coquimbo',
  direccion: 'Av. Francisco de Aguirre 123, La Serena', // EJEMPLO: reemplazar
  telefono: '+56 51 255 0000', // EJEMPLO: reemplazar
  whatsapp: '+56 9 1234 5678', // EJEMPLO: reemplazar
  correo: 'contacto@losmaestros.cl', // EJEMPLO: reemplazar
  horarios: [
    { dia: 'Lunes a viernes', horas: '08:30 – 19:00' },
    { dia: 'Sábado', horas: '09:00 – 14:00' },
    { dia: 'Domingo y festivos', horas: 'Cerrado' },
  ],
};

/** URL del mapa incrustado, armada con la dirección. */
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  `${Info.direccion}, Chile`,
)}&output=embed`;