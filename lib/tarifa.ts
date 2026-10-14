// ─────────────────────────────────────────────────────────────
//  CALCULADORA DE TARIFA — edita precios, preguntas y puntajes
//  Cada respuesta suma puntos. Si el total llega al "umbralSocial",
//  la persona accede a la tarifa social.
// ─────────────────────────────────────────────────────────────

export const tarifas = {
  social: { id: 'social', nombre: 'Tarifa social', precio: 20 },
  estandar: { id: 'estandar', nombre: 'Tarifa estándar', precio: 40 },
} as const;

export type TierId = keyof typeof tarifas;

export const umbralSocial = 4;

export type Pregunta = {
  id: string;
  texto: string;
  ayuda?: string;
  opciones: { id: string; texto: string; puntos: number; emoji: string }[];
};

export const preguntas: Pregunta[] = [
  {
    id: 'ocupacion',
    texto: '¿Cuál es tu ocupación principal?',
    opciones: [
      { id: 'estudiante', texto: 'Estudio', puntos: 3, emoji: '📚' },
      { id: 'dependiente', texto: 'Trabajo con relación de dependencia', puntos: 0, emoji: '💼' },
      { id: 'independiente', texto: 'Trabajo por cuenta propia', puntos: 1, emoji: '🧰' },
      { id: 'sin-empleo', texto: 'Ahora no tengo trabajo', puntos: 3, emoji: '🔎' },
      { id: 'cuidado', texto: 'Me dedico al cuidado del hogar o de otras personas', puntos: 2, emoji: '🏡' },
      { id: 'jubilado', texto: 'Estoy jubilado/a', puntos: 2, emoji: '🌿' },
    ],
  },
  {
    id: 'ingreso',
    texto: '¿Cuánto recibes al mes, aproximadamente?',
    ayuda: 'Tu ingreso personal (sueldo, mesada, apoyo familiar, etc.).',
    opciones: [
      { id: 'menos-500', texto: 'Menos de $500', puntos: 3, emoji: '🌱' },
      { id: '500-1000', texto: 'Entre $500 y $1.000', puntos: 2, emoji: '🌿' },
      { id: '1000-1800', texto: 'Entre $1.000 y $1.800', puntos: 0, emoji: '🌳' },
      { id: 'mas-1800', texto: 'Más de $1.800', puntos: -2, emoji: '🌲' },
    ],
  },
  {
    id: 'dependientes',
    texto: '¿Cuántas personas dependen de ese ingreso, además de ti?',
    opciones: [
      { id: '0', texto: 'Ninguna', puntos: 0, emoji: '🙂' },
      { id: '1-2', texto: '1 o 2 personas', puntos: 1, emoji: '👥' },
      { id: '3+', texto: '3 o más', puntos: 2, emoji: '👨‍👩‍👧‍👦' },
    ],
  },
  {
    id: 'seguro',
    texto: '¿Tienes un seguro o empresa que te reembolse la terapia?',
    opciones: [
      { id: 'si', texto: 'Sí', puntos: -2, emoji: '🛡️' },
      { id: 'no', texto: 'No', puntos: 0, emoji: '✋' },
    ],
  },
];

export type Respuestas = Record<string, string>;

export function calcularTarifa(respuestas: Respuestas) {
  let puntos = 0;
  for (const p of preguntas) {
    const op = p.opciones.find((o) => o.id === respuestas[p.id]);
    if (!op) return null; // falta alguna respuesta
    puntos += op.puntos;
  }
  const tier: TierId = puntos >= umbralSocial ? 'social' : 'estandar';
  return { tier, puntos, ...tarifas[tier] };
}

export const STORAGE_KEY = 'raiz-tarifa';
