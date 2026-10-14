// ─────────────────────────────────────────────────────────────
//  DATOS GENERALES DE RAÍZ — edita aquí contacto, redes y textos
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'RAÍZ Psicología Clínica',
  shortName: 'RAÍZ',
  claim: 'Reconecta en ti',
  description:
    'Atención psicológica humana, consciente y contextual en Quito, Ambato y en línea. Agenda tu turno y conoce tu tarifa en un minuto.',
  email: 'raiz.psicologia@protonmail.com',
  phoneDisplay: '098 107 3506',
  whatsapp: '593981073506', // formato internacional sin "+"
  cities: 'Quito · Ambato · En línea',
  address: 'Dirección por confirmar — Quito y Ambato',
  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    tiktok: 'https://tiktok.com/',
  },
  sessionMinutes: 50,
  // Horas mínimas de anticipación para reservar un turno
  minHoursAhead: 12,
  // Cuántos días hacia adelante se puede reservar
  maxDaysAhead: 60,
};

export const nav = [
  { href: '/psicologia', label: 'Psicología y sociedad' },
  { href: '/equipo', label: 'Equipo' },
  { href: '/tarifa', label: 'Tu tarifa' },
  { href: '/rincon', label: 'Rincón Raíz' },
];

// Frases del tono de voz (Manual de Identidad)
export const frases = [
  'No tienes que tener todo claro para empezar.',
  'Tu proceso es válido, incluso cuando no es perfecto.',
  'Está bien detenerse, escuchar y volver a empezar.',
  'No estás solo en lo que sientes.',
  'Paso a paso también es avanzar.',
  'Lo que sientes también importa.',
  'Volver a ti es el inicio.',
];

export const servicios = [
  {
    titulo: 'Atención psicológica individual',
    texto: 'Un espacio semanal para ti: entender lo que sientes, ordenar lo que pesa y construir otras formas de estar.',
    icon: '/img/icon-sesion.webp',
  },
  {
    titulo: 'Evaluaciones psicológicas',
    texto: 'Evaluaciones con pruebas estandarizadas y un informe claro, explicado en un lenguaje que se entiende.',
    icon: '/img/icon-evaluacion.webp',
  },
  {
    titulo: 'Talleres psicoeducativos',
    texto: 'Talleres para colegios, empresas y comunidades sobre emociones, vínculos, estrés y autocuidado.',
    icon: '/img/icon-cerebro.webp',
  },
  {
    titulo: 'Proyectos sociales y consultorías',
    texto: 'Diseño y acompañamiento de proyectos de salud mental comunitaria con enfoque de justicia social.',
    icon: '/img/icon-manos.webp',
  },
];

export const pasos = [
  { n: '01', titulo: 'Descubre tu tarifa', texto: 'Responde 4 preguntas y sabrás si te corresponde la tarifa social o la estándar.' },
  { n: '02', titulo: 'Elige con quién', texto: 'Conoce al equipo y su corriente. Si no sabes, elige "quien tenga espacio".' },
  { n: '03', titulo: 'Escoge día y hora', texto: 'Solo verás horarios libres. Lo que ya está ocupado no se puede elegir.' },
  { n: '04', titulo: 'Primera sesión', texto: 'Te escribimos para confirmar. La primera sesión es para conocernos, sin presión.' },
];

export const faqs = [
  {
    q: '¿Cómo sé si necesito ir al psicólogo?',
    a: 'No hace falta estar en crisis. Si algo te pesa, se repite o te cuesta manejarlo solo, ya es motivo suficiente. La primera sesión sirve justamente para ver juntos qué necesitas.',
  },
  {
    q: '¿Cuánto dura una sesión y cada cuánto se va?',
    a: 'Cada sesión dura 50 minutos. Lo habitual es una vez por semana al inicio; luego se ajusta según tu proceso.',
  },
  {
    q: '¿Por qué hay dos tarifas?',
    a: 'Creemos en la justicia social: la salud mental no debería depender de cuánto ganas. Quien puede pagar la tarifa estándar permite sostener la tarifa social para quien la necesita.',
  },
  {
    q: '¿Me piden documentos para la tarifa social?',
    a: 'No. La tarifa se basa en tus respuestas y en tu palabra. Confiamos en ti.',
  },
  {
    q: '¿Lo que digo en sesión es confidencial?',
    a: 'Sí. Todo lo que compartes está protegido por el secreto profesional, salvo las excepciones que marca la ley cuando hay riesgo grave para ti o para otras personas. Te lo explicamos en la primera sesión.',
  },
  {
    q: '¿Las sesiones en línea funcionan igual?',
    a: 'Para la mayoría de personas, sí. Solo necesitas un lugar privado y buena conexión. Te enviamos el enlace por correo o WhatsApp.',
  },
  {
    q: '¿Puedo cambiar o cancelar mi turno?',
    a: 'Sí, escríbenos por WhatsApp con al menos 24 horas de anticipación y lo reprogramamos.',
  },
];
