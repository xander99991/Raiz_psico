// ─────────────────────────────────────────────────────────────
//  CALCULADORA DE TARIFA — edita aquí precios, preguntas y reglas
//
//  Cómo se decide (se calcula igual en el navegador y en el servidor):
//   1. Tramo base según el INGRESO POR PERSONA del hogar (P2 ÷ P3).
//   2. Ajuste de vulnerabilidad: 2 o más señales de dificultad → baja un tramo.
//   3. Ajuste de respaldo: más de un vehículo o universidad privada pagada → sube un tramo.
//      Con seguro que reembolsa la terapia → tarifa estándar directa.
//   4. Frecuencia semanal en el tramo intermedio-alto → baja un tramo.
//   5. Contraste con lo que la persona dice poder pagar (P14):
//      • Si dice que puede pagar MÁS que la tarifa estándar → estándar (gana su autoevaluación).
//      • Si dice que puede pagar MENOS, se le cree solo si su situación lo respalda:
//        tramo intermedio (3) y al menos una señal de dificultad. En el tramo más alto (4)
//        el ingreso por persona manda, para que la tarifa social llegue a quien la necesita.
//   Tramos 1–2 → tarifa social · Tramos 3–4 → tarifa estándar
// ─────────────────────────────────────────────────────────────

export const tarifas = {
  social: { id: 'social', nombre: 'Tarifa social', precio: 15 },
  estandar: { id: 'estandar', nombre: 'Tarifa estándar', precio: 30 },
} as const;

export type TierId = keyof typeof tarifas;

/** Límites de ingreso mensual POR PERSONA para los tramos 1→2, 2→3 y 3→4 (USD) */
export const limitesTramo = [150, 400, 800];

export type Opcion = { id: string; texto: string; emoji?: string };
export type Pregunta = {
  id: string;
  bloque: string;
  texto: string;
  ayuda?: string;
  opciones: Opcion[];
  compacta?: boolean; // opciones cortas en fila (ej. número de personas)
  soloSi?: (r: Respuestas) => boolean;
};
export type Respuestas = Record<string, string>;

const B1 = 'Tu hogar';
const B2 = 'Tu día a día';
const B3 = 'Un poco más';
const B4 = 'Para cerrar';

export const preguntas: Pregunta[] = [
  {
    id: 'ocupacion', bloque: B1, texto: '¿Cuál es tu ocupación principal?',
    opciones: [
      { id: 'estudiante', texto: 'Estudio', emoji: '📚' },
      { id: 'dependiente', texto: 'Trabajo con relación de dependencia', emoji: '💼' },
      { id: 'independiente', texto: 'Trabajo por cuenta propia', emoji: '🧰' },
      { id: 'informal', texto: 'Trabajo informal u ocasional', emoji: '🛒' },
      { id: 'sin-empleo', texto: 'Ahora no tengo trabajo', emoji: '🔎' },
      { id: 'cuidado', texto: 'Me dedico al cuidado del hogar o de otras personas', emoji: '🏡' },
      { id: 'jubilado', texto: 'Estoy jubilado/a', emoji: '🌿' },
    ],
  },
  {
    id: 'ingresoHogar', bloque: B1, texto: '¿Cuánto suman al mes los ingresos de todas las personas de tu hogar?',
    ayuda: 'Sueldos, ventas, bonos, pensiones, ayudas de familiares… todo junto.',
    opciones: [
      { id: 'menos-500', texto: 'Menos de $500' },
      { id: '500-800', texto: '$500 – $800' },
      { id: '800-1200', texto: '$800 – $1.200' },
      { id: '1200-1800', texto: '$1.200 – $1.800' },
      { id: '1800-3000', texto: '$1.800 – $3.000' },
      { id: 'mas-3000', texto: 'Más de $3.000' },
    ],
  },
  {
    id: 'personas', bloque: B1, texto: '¿Cuántas personas viven en tu hogar, contándote a ti?', compacta: true,
    opciones: [{ id: '1', texto: '1' }, { id: '2', texto: '2' }, { id: '3', texto: '3' }, { id: '4', texto: '4' }, { id: '5', texto: '5 o más' }],
  },
  {
    id: 'estabilidad', bloque: B1, texto: '¿Qué tan estable es tu ingreso?',
    opciones: [
      { id: 'fijo', texto: 'Fijo todos los meses', emoji: '📅' },
      { id: 'varia', texto: 'Varía un poco', emoji: '〰️' },
      { id: 'irregular', texto: 'Es irregular o incierto', emoji: '🌫️' },
    ],
  },
  {
    id: 'finDeMes', bloque: B2, texto: 'Con los ingresos de tu hogar, ¿cómo llegan a fin de mes?',
    opciones: [
      { id: 'mucha', texto: 'Con mucha dificultad' },
      { id: 'algo', texto: 'Con algo de dificultad' },
      { id: 'cierta', texto: 'Con cierta facilidad' },
      { id: 'facil', texto: 'Con facilidad' },
    ],
  },
  {
    id: 'imprevisto', bloque: B2, texto: 'Si mañana tuvieras un gasto imprevisto de $300, ¿podrías cubrirlo?',
    opciones: [
      { id: 'ahorros', texto: 'Sí, con mis ahorros' },
      { id: 'prestado', texto: 'Sí, pero tendría que pedir prestado o pedir ayuda' },
      { id: 'no', texto: 'No podría cubrirlo' },
    ],
  },
  {
    id: 'vivienda', bloque: B2, texto: '¿Tu vivienda es…?',
    opciones: [
      { id: 'propia', texto: 'Propia y totalmente pagada' },
      { id: 'hipoteca', texto: 'Propia, pagando hipoteca' },
      { id: 'arriendo', texto: 'Arrendada' },
      { id: 'prestada', texto: 'Prestada o vivo con familiares' },
    ],
  },
  {
    id: 'deudas', bloque: B2, texto: '¿Tienes deudas (tarjetas, préstamos) que te cuesta pagar?',
    opciones: [
      { id: 'no', texto: 'No tengo deudas' },
      { id: 'al-dia', texto: 'Sí, pero estoy al día' },
      { id: 'atrasado', texto: 'Sí, y estoy atrasado/a' },
    ],
  },
  {
    id: 'gastosSalud', bloque: B2, texto: '¿Tienes gastos fijos en salud o en cuidado de otras personas?',
    ayuda: 'Medicinas, tratamientos, el cuidado de un familiar…',
    opciones: [
      { id: 'no', texto: 'No' },
      { id: 'moderados', texto: 'Sí, moderados' },
      { id: 'altos', texto: 'Sí, altos' },
    ],
  },
  {
    id: 'seguro', bloque: B3, texto: '¿Tienes un seguro o una empresa que te reembolse la terapia?',
    opciones: [{ id: 'si', texto: 'Sí', emoji: '🛡️' }, { id: 'no', texto: 'No', emoji: '✋' }],
  },
  {
    id: 'vehiculo', bloque: B3, texto: '¿Tú o tu hogar tienen vehículo propio?',
    opciones: [{ id: 'no', texto: 'No' }, { id: 'uno', texto: 'Sí, uno' }, { id: 'varios', texto: 'Sí, más de uno' }],
  },
  {
    id: 'institucion', bloque: B3, texto: '¿Dónde estudias?', soloSi: (r) => r.ocupacion === 'estudiante',
    opciones: [
      { id: 'publica', texto: 'Institución pública' },
      { id: 'beca', texto: 'Institución privada con beca' },
      { id: 'privada', texto: 'Institución privada, pagada por mi familia o por mí' },
    ],
  },
  {
    id: 'frecuencia', bloque: B4, texto: '¿Con qué frecuencia piensas asistir?',
    ayuda: 'Lo que pesa es el gasto del mes, no el de cada sesión.',
    opciones: [{ id: 'semanal', texto: 'Cada semana' }, { id: 'quincenal', texto: 'Cada dos semanas' }, { id: 'mensual', texto: 'Una vez al mes' }],
  },
  {
    id: 'puedoPagar', bloque: B4, texto: '¿Cuánto crees que podrías pagar por sesión sin afectar tus gastos básicos?',
    opciones: [
      { id: 'menos-10', texto: 'Menos de $10' },
      { id: '10-20', texto: '$10 – $20' },
      { id: '20-30', texto: '$20 – $30' },
      { id: '30-40', texto: '$30 – $40' },
      { id: 'mas-40', texto: 'Más de $40' },
    ],
  },
];

export const DECLARACION =
  'Declaro que la información es verdadera. Entiendo que la tarifa social existe para que más personas accedan a terapia.';

// Valor representativo de cada rango de ingreso del hogar (USD/mes)
const INGRESO: Record<string, number> = { 'menos-500': 300, '500-800': 650, '800-1200': 1000, '1200-1800': 1500, '1800-3000': 2400, 'mas-3000': 3500 };
// Máximo que la persona dice poder pagar por sesión
const PUEDE_MAX: Record<string, number> = { 'menos-10': 10, '10-20': 20, '20-30': 30, '30-40': 40, 'mas-40': 999 };

export const preguntasVisibles = (r: Respuestas) => preguntas.filter((p) => !p.soloSi || p.soloSi(r));

export function calcularTarifa(r: Respuestas) {
  // Todas las preguntas visibles deben estar respondidas con opciones válidas
  for (const p of preguntasVisibles(r)) if (!p.opciones.some((o) => o.id === r[p.id])) return null;
  if (r.declaracion !== 'si') return null;

  const percapita = Math.round(INGRESO[r.ingresoHogar] / Number(r.personas));
  let tramo = 1 + limitesTramo.filter((l) => percapita >= l).length; // 1..4

  const senales = [
    r.finDeMes === 'mucha' || r.finDeMes === 'algo',
    r.imprevisto === 'no',
    r.deudas === 'atrasado',
    r.gastosSalud === 'altos',
    r.estabilidad === 'irregular',
  ].filter(Boolean).length;
  if (senales >= 2) tramo -= 1;
  if (r.vehiculo === 'varios' || r.institucion === 'privada') tramo += 1;
  if (r.frecuencia === 'semanal' && tramo === 3) tramo -= 1;
  tramo = Math.min(4, Math.max(1, tramo));

  let tier: TierId = tramo <= 2 ? 'social' : 'estandar';
  let motivo = 'calculo';
  if (r.seguro === 'si') {
    tier = 'estandar';
    motivo = 'seguro';
  } else {
    const puede = PUEDE_MAX[r.puedoPagar];
    if (tier === 'social' && puede > tarifas.estandar.precio) { tier = 'estandar'; motivo = 'autoevaluacion'; }
    else if (tier === 'estandar' && puede < tarifas.estandar.precio && tramo === 3 && senales >= 1) { tier = 'social'; motivo = 'tope'; }
  }
  return { tier, tramo, percapita, senales, motivo, ...tarifas[tier] };
}

export const STORAGE_KEY = 'raiz-tarifa-v3';
