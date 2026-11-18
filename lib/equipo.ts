// ─────────────────────────────────────────────────────────────
//  EQUIPO Y HORARIOS — edita aquí los psicólogos de RAÍZ
//  • horario: día de la semana (1 = lunes … 6 = sábado) → horas de inicio
//  • modalidadesPorDia (opcional): limita la modalidad en ciertos días
//    (ej.: en línea entre semana y presencial los sábados)
//  • foto: archivo en /public/img/equipo/ (cuadrada, ~800×800)
//  ⚠ No pongas aquí correos, teléfonos ni notas internas: todo esto es público.
// ─────────────────────────────────────────────────────────────

export type Modalidad = 'presencial-quito' | 'presencial-ambato' | 'online';

export const modalidades: Record<Modalidad, string> = {
  'presencial-quito': 'Presencial · Quito',
  'presencial-ambato': 'Presencial · Ambato',
  online: 'En línea',
};

export type Psicologo = {
  id: string;
  nombre: string;
  titulo: string;
  corriente: string; // slug de lib/corrientes.ts
  complementarias?: string[]; // slugs de otras corrientes que integra
  frase: string;
  bio: string;
  temas: string[];
  poblaciones: string[];
  formacion: string[];
  experiencia?: number; // años
  senescyt?: string; // solo si la persona autorizó mostrarlo
  destacado?: string; // etiqueta corta (ej. "Amplia disponibilidad")
  modalidades: Modalidad[];
  modalidadesPorDia?: Partial<Record<number, Modalidad[]>>;
  horario: Record<number, string[]>;
  color: 'marino' | 'turquesa' | 'celeste' | 'agua';
  foto?: string;
};

const h = (...hs: number[]) => hs.map((x) => `${String(x).padStart(2, '0')}:00`);

export const equipo: Psicologo[] = [
  {
    id: 'micaela-nunez',
    nombre: 'Micaela Núñez Toro',
    titulo: 'Psicóloga clínica',
    corriente: 'contextuales',
    complementarias: ['comunitaria', 'sistemica', 'cognitivo-conductual', 'psicoanalisis'],
    frase: 'No todo lo que te pasa depende solo de ti.',
    bio: 'Te ofrezco un espacio seguro, de confianza y sin juicios para hablar de lo que estás viviendo. Juntos/as vamos a comprender tus emociones, reconocer qué te causa malestar —en ti y en tu entorno— y encontrar nuevas formas de afrontarlo. Integro herramientas de las terapias contextuales con una mirada comunitaria: cada historia importa, y no necesitas tener todas las respuestas para empezar.',
    temas: ['Ansiedad', 'Depresión', 'Duelo', 'Autoestima', 'Identidad', 'Migración', 'Crisis vitales', 'Adicciones', 'Sexualidad'],
    poblaciones: ['Adolescentes', 'Adultos'],
    formacion: [
      'Psicología Clínica · Universidad Central del Ecuador',
      'Diplomado en Salud Mental en situaciones de violencia política y catástrofes · Universidad Complutense de Madrid y Grupo de Acción Comunitaria',
      'Maestrante en Políticas Públicas · FLACSO Ecuador',
    ],
    experiencia: 2,
    modalidades: ['presencial-quito', 'online'],
    horario: { 1: h(18, 19), 2: h(18, 19), 3: h(20), 4: h(18, 19), 6: h(7, 8) },
    color: 'marino',
  },
  {
    id: 'laura-ruiz',
    nombre: 'Laura Mariela Ruiz',
    titulo: 'Psicóloga · Terapeuta narrativa',
    corriente: 'narrativa',
    frase: 'Tu historia es más grande que el problema que hoy estás viviendo.',
    bio: 'Trabajo desde las prácticas narrativas y con un compromiso claro con la justicia social. Lo que vives no puede separarse de tus relaciones, de tu historia ni de las condiciones en las que vives. En terapia exploramos las historias que se han construido sobre ti, cómo el problema llegó a ocupar tanto espacio y qué otras experiencias y vínculos merecen ser escuchados, para abrir formas de vivir más cercanas a lo que valoras.',
    temas: ['Ansiedad', 'Depresión', 'Autoestima', 'Violencia', 'Identidad', 'Migración', 'Salud menstrual', 'Estrés', 'Sexualidad'],
    poblaciones: ['Adultos', 'Grupos'],
    formacion: [
      'Licenciatura en Psicología · BUAP (México)',
      'Maestría en Psicología · UNAM (México)',
      'Maestría en Prácticas Narrativas',
    ],
    experiencia: 12,
    destacado: '12 años de experiencia',
    modalidades: ['online'],
    horario: { 1: h(9, 10, 11, 20), 2: h(20), 3: h(9, 10), 5: h(9, 10, 11), 6: h(9, 10) },
    color: 'turquesa',
  },
  {
    id: 'jorge-paz',
    nombre: 'Jorge Paz',
    titulo: 'Psicólogo · Psicoterapeuta',
    corriente: 'contextuales',
    complementarias: ['cognitivo-conductual', 'conductual', 'humanista'],
    frase: 'Comprender tu historia y lo que vives hoy puede abrir nuevas formas de relacionarte contigo y con los demás.',
    bio: 'Te ofrezco un espacio para hablar de lo que te duele y sentirte escuchado/a, con respeto y sin juicios. Trabajamos para comprender tus emociones, atravesar momentos difíciles y relacionarte de otra manera con los pensamientos que te hacen sufrir. A tu ritmo, practicamos habilidades para cuidar tus vínculos y avanzar hacia lo que de verdad te importa, distinguiendo lo que necesitas aceptar de lo que deseas cambiar.',
    temas: ['Ansiedad', 'Depresión', 'Regulación emocional', 'Adicciones', 'Duelo', 'Autoestima', 'Estrés', 'Identidad', 'Crisis vitales', 'Sexualidad'],
    poblaciones: ['Adolescentes', 'Adultos', 'Grupos'],
    formacion: [
      'Psicología · Universidad Internacional del Ecuador',
      'Máster en Terapias de Tercera Generación · Universidad de Valencia',
      'Maestría en Psicoterapia · Universidad de las Américas',
      'Diplomados en ACT, Terapia Dialéctico Conductual, Terapia Metacognitiva, Mindfulness y tratamiento de consumo de sustancias',
    ],
    experiencia: 7,
    senescyt: '1041-2017-1823543',
    modalidades: ['online', 'presencial-quito'],
    // En línea entre semana · presencial los sábados
    modalidadesPorDia: { 1: ['online'], 2: ['online'], 3: ['online'], 4: ['online'], 5: ['online'], 6: ['presencial-quito'] },
    horario: { 1: h(18, 19), 2: h(18, 19), 3: h(18, 19), 4: h(18, 19), 5: h(18, 19), 6: h(11, 12) },
    color: 'agua',
  },
  {
    id: 'jorge-mora',
    nombre: 'Jorge Mora',
    titulo: 'Psicólogo clínico · Psicoanalista',
    corriente: 'psicoanalisis',
    frase: 'Escuchar lo singular de tu historia para abrir nuevas posibilidades.',
    bio: 'Mi práctica se orienta por el psicoanálisis lacaniano. Te ofrezco un espacio de escucha para hablar de lo que te preocupa, a tu ritmo y sin juicios. A través de la palabra trabajamos sobre tu malestar, tu historia y aquello que se repite en tus vínculos y decisiones, para que puedas entenderlo y abrir caminos distintos.',
    temas: ['Ansiedad', 'Depresión', 'Duelo', 'Trauma', 'Riesgo suicida', 'Adicciones', 'Estrés', 'Crisis vitales', 'Migración'],
    poblaciones: ['Adolescentes', 'Adultos', 'Adultos mayores', 'Grupos'],
    formacion: [
      'Psicología Clínica · Universidad Central del Ecuador',
      'Magíster en Psicoanálisis y Educación · Universidad Católica de Santiago de Guayaquil',
    ],
    experiencia: 10,
    destacado: '10 años de experiencia',
    modalidades: ['online'],
    horario: { 1: h(19, 20), 3: h(19, 20), 6: h(9, 10, 11) },
    color: 'celeste',
  },
  {
    id: 'liz-ramirez',
    nombre: 'Liz Ramírez Iza',
    titulo: 'Psicóloga clínica',
    corriente: 'cognitivo-conductual',
    complementarias: ['comunitaria'],
    frase: 'El mundo ya es lo suficientemente complejo: aquí tienes un espacio seguro para ti.',
    bio: 'Mi trabajo parte de un enfoque de derechos y de la perspectiva de género. Te ofrezco un espacio seguro y respetuoso, donde lo que vives y sientes se recibe sin juicios. Desde la empatía y una relación horizontal, te acompaño a validar y atravesar tus emociones mientras construimos herramientas prácticas, pensadas para tu realidad y fáciles de integrar en tu día a día.',
    temas: ['Autoestima', 'Pareja', 'Familia', 'Crianza', 'Violencia', 'Identidad', 'Estrés', 'Sexualidad', 'Crisis vitales'],
    poblaciones: ['Adultos', 'Familias', 'Grupos'],
    formacion: [
      'Psicología Clínica',
      'Maestría en Derechos Humanos, Interculturalidad y Género',
    ],
    experiencia: 6,
    senescyt: '1005-2020-2160718',
    modalidades: ['online'],
    horario: { 1: h(17, 18), 3: h(17), 5: h(20) },
    color: 'turquesa',
  },
  {
    id: 'morelia-navarrete',
    nombre: 'Morelia Navarrete',
    titulo: 'Egresada de Psicología Clínica',
    corriente: 'cognitivo-conductual',
    frase: 'Las teorías nos enseñan a comprender la mente; el encuentro entre dos personas es lo que nos permite acompañar el dolor.',
    bio: 'Quiero que te sientas en confianza, escuchado/a y comprendido/a, sin miedo a ser juzgado/a. Te ofrezco un espacio para hablar de lo que sientes, entender lo que estás viviendo y encontrar nuevas formas de afrontarlo. Cada historia es distinta, por eso adapto las herramientas de la terapia cognitivo-conductual a tus necesidades y a tu ritmo. No necesitas saber por dónde empezar: lo descubrimos juntos/as.',
    temas: ['Ansiedad', 'Depresión', 'Estrés', 'Autoestima', 'Duelo', 'Crisis vitales'],
    poblaciones: ['Niños', 'Adolescentes', 'Adultos', 'Adultos mayores'],
    formacion: ['Egresada de Psicología Clínica · Universidad Central del Ecuador'],
    destacado: 'Amplia disponibilidad',
    modalidades: ['online'],
    horario: {
      1: h(8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20),
      2: h(8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20),
      3: h(8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20),
      4: h(8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20),
      5: h(8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20),
    },
    color: 'celeste',
  },
];

export const getPsicologo = (id: string) => equipo.find((p) => p.id === id);
