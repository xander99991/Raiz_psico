// ─────────────────────────────────────────────────────────────
//  EQUIPO Y HORARIOS — edita aquí los psicólogos de RAÍZ
//  • "ejemplo: true" muestra la etiqueta "Perfil de ejemplo".
//    Cámbialo a false cuando el perfil tenga datos reales.
//  • horario: día de la semana (1 = lunes … 6 = sábado) → horas de inicio
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
  frase: string;
  bio: string;
  temas: string[];
  modalidades: Modalidad[];
  horario: Record<number, string[]>;
  color: 'marino' | 'turquesa' | 'celeste' | 'agua';
  foto?: string; // ruta en /public/img (opcional)
  ejemplo?: boolean;
};

export const equipo: Psicologo[] = [
  {
    id: 'micaela-nunez',
    nombre: 'Micaela Núñez T.',
    titulo: 'Psicóloga clínica',
    corriente: 'cognitivo-conductual',
    frase: 'Entender lo que piensas cambia cómo lo vives.',
    bio: 'Acompaña procesos de ansiedad, estrés y autoestima con herramientas prácticas y mucha escucha. Realiza evaluaciones psicológicas y talleres psicoeducativos.',
    temas: ['Ansiedad', 'Autoestima', 'Estrés', 'Evaluaciones'],
    modalidades: ['presencial-quito', 'presencial-ambato', 'online'],
    horario: {
      1: ['09:00', '10:00', '11:00', '15:00', '16:00', '17:00'],
      2: ['14:00', '15:00', '16:00', '17:00', '18:00'],
      3: ['09:00', '10:00', '11:00', '15:00', '16:00'],
      4: ['14:00', '15:00', '16:00', '17:00', '18:00'],
      5: ['09:00', '10:00', '11:00'],
    },
    color: 'marino',
    ejemplo: true,
  },
  {
    id: 'daniel-andrade',
    nombre: 'Daniel Andrade',
    titulo: 'Psicólogo clínico',
    corriente: 'humanista',
    frase: 'Nadie sabe más de tu vida que tú.',
    bio: 'Trabaja desde la escucha sin juicio y la confianza en los recursos de cada persona. Acompaña duelos, crisis vitales y búsqueda de sentido.',
    temas: ['Duelo', 'Crisis vitales', 'Sentido de vida', 'Jóvenes'],
    modalidades: ['presencial-quito', 'online'],
    horario: {
      1: ['16:00', '17:00', '18:00', '19:00'],
      3: ['16:00', '17:00', '18:00', '19:00'],
      5: ['15:00', '16:00', '17:00'],
      6: ['09:00', '10:00', '11:00', '12:00'],
    },
    color: 'turquesa',
    ejemplo: true,
  },
  {
    id: 'sofia-cevallos',
    nombre: 'Sofía Cevallos',
    titulo: 'Psicóloga clínica · Terapia familiar',
    corriente: 'sistemica',
    frase: 'Lo que te pasa también vive en tus vínculos.',
    bio: 'Acompaña a personas, parejas y familias mirando los patrones de relación. Le interesan las dinámicas familiares, la crianza y la comunicación.',
    temas: ['Pareja', 'Familia', 'Crianza', 'Comunicación'],
    modalidades: ['presencial-ambato', 'online'],
    horario: {
      2: ['09:00', '10:00', '11:00', '12:00'],
      4: ['09:00', '10:00', '11:00', '12:00'],
      6: ['09:00', '10:00', '11:00'],
    },
    color: 'celeste',
    ejemplo: true,
  },
  {
    id: 'andres-paredes',
    nombre: 'Andrés Paredes',
    titulo: 'Psicólogo clínico',
    corriente: 'psicoanalisis',
    frase: 'Poner en palabras lo que se repite.',
    bio: 'Escucha con calma lo que se repite en tu historia para darle un sentido nuevo. Procesos de mediano y largo plazo.',
    temas: ['Relaciones', 'Patrones que se repiten', 'Angustia', 'Adultos'],
    modalidades: ['presencial-quito', 'online'],
    horario: {
      1: ['18:00', '19:00'],
      2: ['18:00', '19:00'],
      3: ['18:00', '19:00'],
      4: ['18:00', '19:00'],
    },
    color: 'agua',
    ejemplo: true,
  },
];

export const getPsicologo = (id: string) => equipo.find((p) => p.id === id);
