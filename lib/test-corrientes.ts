// ─────────────────────────────────────────────────────────────
//  TEST "¿QUÉ CORRIENTE VA CONTIGO?"
//  Basado en las 4 dimensiones de preferencia del Inventario
//  Cooper-Norcross (C-NIP, 2016) —directividad, intensidad emocional,
//  orientación pasado/presente, apoyo cálido vs. confrontación— más
//  preguntas sobre los mecanismos propios de cada enfoque.
//  Cada opción suma puntos a una o más corrientes (slugs de lib/corrientes.ts).
//  El resultado SOLO muestra corrientes con al menos un psicólogo en lib/equipo.ts.
// ─────────────────────────────────────────────────────────────

export type OpcionTest = { t: string; p: Record<string, number> };
export type PreguntaTest = { dim: string; q: string; o: OpcionTest[] };

const N = 'narrativa', C = 'cognitivo-conductual', X = 'contextuales', P = 'psicoanalisis', H = 'humanista', S = 'sistemica';

export const test: PreguntaTest[] = [
  { dim: 'Cómo quieres que sea la terapia', q: 'En terapia prefieres que el/la psicólogo/a…', o: [
    { t: 'Proponga ejercicios y una estructura clara', p: { [C]: 3, [X]: 1 } },
    { t: 'Te enseñe habilidades, pero respetando tu ritmo', p: { [X]: 3, [C]: 1 } },
    { t: 'Te escuche sin dirigir, para que llegues a tus propias conclusiones', p: { [P]: 3, [H]: 2 } },
    { t: 'Converse contigo de igual a igual y construyan juntos', p: { [N]: 3, [H]: 1, [S]: 1 } },
  ] },
  { dim: 'Cómo quieres que sea la terapia', q: 'Al salir de cada sesión te gustaría llevarte…', o: [
    { t: 'Tareas concretas para practicar', p: { [C]: 3 } },
    { t: 'Una pregunta que te quede dando vueltas', p: { [P]: 3 } },
    { t: 'Una nueva forma de contar lo que te pasa', p: { [N]: 3 } },
    { t: 'Un pequeño paso hacia lo que te importa', p: { [X]: 3 } },
  ] },
  { dim: 'Pasado o presente', q: 'Para entender lo que te pasa, crees que hay que mirar…', o: [
    { t: 'Tu infancia y tu historia', p: { [P]: 3, [N]: 1 } },
    { t: 'Lo que piensas y haces hoy', p: { [C]: 3, [X]: 1 } },
    { t: 'Cómo te relacionas con lo que sientes ahora', p: { [X]: 3, [H]: 1 } },
    { t: 'Las historias que otros y la sociedad han contado sobre ti', p: { [N]: 3, [S]: 1 } },
  ] },
  { dim: 'Pasado o presente', q: '¿Qué frase te describe mejor hoy?', o: [
    { t: '«Quiero entender por qué repito lo mismo»', p: { [P]: 3 } },
    { t: '«Quiero dejar de sentirme así lo antes posible»', p: { [C]: 3 } },
    { t: '«Quiero dejar de pelear contra lo que siento»', p: { [X]: 3 } },
    { t: '«Siento que el problema me define y no quiero que sea así»', p: { [N]: 3 } },
  ] },
  { dim: 'Intensidad emocional', q: 'Cuando hablas de algo difícil, prefieres…', o: [
    { t: 'Ir con calma y ordenar las ideas', p: { [C]: 3, [N]: 1 } },
    { t: 'Sentir la emoción, aunque cueste, con alguien que te sostenga', p: { [X]: 2, [H]: 2, [P]: 1 } },
    { t: 'Hablar libremente, sin un orden', p: { [P]: 3 } },
    { t: 'Ponerle nombre al problema y mirarlo desde afuera', p: { [N]: 3 } },
  ] },
  { dim: 'Apoyo o confrontación', q: 'De tu psicólogo/a valorarías más que…', o: [
    { t: 'Te señale tus contradicciones', p: { [P]: 3 } },
    { t: 'Te enseñe técnicas que funcionan', p: { [C]: 3 } },
    { t: 'Te ayude a aceptarte sin juzgarte', p: { [X]: 2, [H]: 2 } },
    { t: 'Valore lo que ya sabes y tu contexto', p: { [N]: 3 } },
  ] },
  { dim: 'Cómo cambian las cosas', q: 'Cuando aparece un pensamiento negativo…', o: [
    { t: 'Te sirve revisarlo y cuestionarlo', p: { [C]: 3 } },
    { t: 'Prefieres observarlo y dejarlo pasar', p: { [X]: 3 } },
    { t: 'Te preguntas qué dice de ti y de dónde viene', p: { [P]: 3 } },
    { t: 'Te preguntas quién o qué te enseñó a pensar así', p: { [N]: 3 } },
  ] },
  { dim: 'Cómo cambian las cosas', q: '¿Qué te llama más la atención?', o: [
    { t: 'Registros, metas y medir avances', p: { [C]: 3 } },
    { t: 'Mindfulness y atención plena', p: { [X]: 3 } },
    { t: 'Sueños, recuerdos y lo que se dice sin querer', p: { [P]: 3 } },
    { t: 'Cartas y documentos para reescribir tu historia', p: { [N]: 3 } },
  ] },
  { dim: 'Lo que te trae', q: 'Lo que más te preocupa ahora es…', o: [
    { t: 'Ansiedad, estrés o ataques de pánico', p: { [C]: 3, [X]: 1 } },
    { t: 'Emociones o impulsos que te desbordan', p: { [X]: 3, [C]: 1 } },
    { t: 'Relaciones que se repiten o un malestar que no sabes explicar', p: { [P]: 3, [S]: 1 } },
    { t: 'Violencia, discriminación o presiones sociales que te afectan', p: { [N]: 3 } },
  ] },
  { dim: 'Lo que te trae', q: '¿Cuánto tiempo imaginas tu proceso?', o: [
    { t: 'Pocas sesiones, enfocadas en algo concreto', p: { [C]: 3, [X]: 1 } },
    { t: 'Unos meses, a mi ritmo', p: { [X]: 2, [N]: 2 } },
    { t: 'Sin apuro, el tiempo que haga falta', p: { [P]: 3, [H]: 1 } },
    { t: 'No lo sé: prefiero decidirlo en el camino', p: { [N]: 2, [H]: 1 } },
  ] },
  { dim: 'Lo que buscas', q: 'Sobre lo que valoras en la vida…', o: [
    { t: 'Quieres tener claro qué te importa y actuar en coherencia', p: { [X]: 3 } },
    { t: 'Quieres recuperar algo valioso que el problema te quitó', p: { [N]: 3 } },
    { t: 'Quieres entender qué deseas realmente', p: { [P]: 3 } },
    { t: 'Prefieres enfocarte en resolver el problema concreto', p: { [C]: 3 } },
  ] },
  { dim: 'Lo que buscas', q: 'Lo social y lo político en terapia…', o: [
    { t: 'Es central: tu malestar también viene de ahí', p: { [N]: 3, [S]: 1 } },
    { t: 'Importa, pero necesitas herramientas para el día a día', p: { [X]: 2, [C]: 2 } },
    { t: 'Te interesa más lo que pasa dentro de ti', p: { [P]: 3 } },
    { t: 'Prefieres enfocarte en tus hábitos y conductas', p: { [C]: 3 } },
  ] },
  { dim: 'Una imagen', q: 'Si tu proceso fuera una imagen, sería…', o: [
    { t: 'Una caja de herramientas', p: { [C]: 3 } },
    { t: 'Una brújula', p: { [X]: 3 } },
    { t: 'Un espejo', p: { [P]: 3 } },
    { t: 'Un libro que se reescribe', p: { [N]: 3 } },
  ] },
  { dim: 'Una imagen', q: 'Cuando algo te sale bien, quieres…', o: [
    { t: 'Entender qué hiciste para repetirlo', p: { [C]: 3 } },
    { t: 'Notarlo y disfrutarlo en el presente', p: { [X]: 3 } },
    { t: 'Entender qué cambió en ti', p: { [P]: 2, [H]: 1 } },
    { t: 'Contarlo y que otras personas sean testigos', p: { [N]: 3 } },
  ] },
];

/** Puntaje por corriente, solo entre las disponibles; devuelve ordenado de mayor a menor con % de afinidad */
export function resultadoTest(respuestas: number[], disponibles: string[]) {
  const puntos: Record<string, number> = Object.fromEntries(disponibles.map((d) => [d, 0]));
  respuestas.forEach((r, i) => {
    const op = test[i]?.o[r];
    if (op) for (const [slug, v] of Object.entries(op.p)) if (slug in puntos) puntos[slug] += v;
  });
  const total = Object.values(puntos).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(puntos)
    .map(([slug, v]) => ({ slug, puntos: v, pct: Math.round((v / total) * 100) }))
    .sort((a, b) => b.puntos - a.puntos);
}
