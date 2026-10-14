// Corrientes de la psicología — contenido de la sección educativa

export type Corriente = {
  slug: string;
  nombre: string;
  epoca: string;
  anio: number; // para la línea de tiempo
  referentes: string;
  idea: string;
  sesion: string;
  ayuda: string;
  pregunta: string; // la pregunta que se hace esta corriente
  color: string; // clase tailwind de fondo
};

export const corrientes: Corriente[] = [
  {
    slug: 'psicoanalisis',
    nombre: 'Psicoanálisis y psicodinámica',
    epoca: 'Finales del siglo XIX',
    anio: 1895,
    referentes: 'Sigmund Freud, Carl Jung, Melanie Klein, Jacques Lacan',
    idea: 'Mucho de lo que sentimos y hacemos nace de deseos, miedos y recuerdos que no son del todo conscientes. Nuestra historia temprana deja huellas que se repiten.',
    sesion: 'Hablas con libertad de lo que venga a tu mente. El terapeuta escucha lo que se repite y te ayuda a ponerle palabras.',
    ayuda: 'Patrones que se repiten en relaciones, angustia difusa, preguntas profundas sobre uno mismo.',
    pregunta: '¿De dónde viene esto que me pasa?',
    color: 'bg-agua',
  },
  {
    slug: 'conductual',
    nombre: 'Conductismo',
    epoca: 'Inicios del siglo XX',
    anio: 1913,
    referentes: 'Iván Pávlov, John B. Watson, B. F. Skinner',
    idea: 'Las conductas se aprenden y, por lo tanto, se pueden desaprender. Lo importante es lo que se puede observar y cambiar.',
    sesion: 'Se definen objetivos concretos y se practican nuevas conductas paso a paso, muchas veces con tareas entre sesiones.',
    ayuda: 'Fobias, hábitos, conductas que se quieren cambiar.',
    pregunta: '¿Qué mantiene esta conducta?',
    color: 'bg-celeste',
  },
  {
    slug: 'humanista',
    nombre: 'Psicología humanista',
    epoca: 'Años 50 y 60',
    anio: 1951,
    referentes: 'Carl Rogers, Abraham Maslow, Viktor Frankl',
    idea: 'Cada persona tiene una tendencia natural a crecer. Con un espacio de aceptación, empatía y autenticidad, encuentra sus propias respuestas.',
    sesion: 'Una conversación cálida, sin juicio, centrada en tu experiencia y en lo que tú necesitas.',
    ayuda: 'Autoestima, duelo, crisis de sentido, momentos de cambio.',
    pregunta: '¿Quién soy y quién quiero ser?',
    color: 'bg-turquesa-100',
  },
  {
    slug: 'gestalt',
    nombre: 'Terapia Gestalt',
    epoca: 'Años 50',
    anio: 1951,
    referentes: 'Fritz y Laura Perls, Paul Goodman',
    idea: 'Importa el aquí y ahora: darse cuenta de lo que sientes en el cuerpo y en el presente para cerrar lo que quedó pendiente.',
    sesion: 'Además de hablar, se trabaja con la experiencia: la silla vacía, la voz, el cuerpo, el darse cuenta.',
    ayuda: 'Emociones bloqueadas, asuntos inconclusos, conexión con uno mismo.',
    pregunta: '¿Qué estoy sintiendo ahora mismo?',
    color: 'bg-agua-100',
  },
  {
    slug: 'sistemica',
    nombre: 'Terapia sistémica',
    epoca: 'Años 50 a 70',
    anio: 1956,
    referentes: 'Gregory Bateson, Virginia Satir, Salvador Minuchin',
    idea: 'Las personas somos parte de sistemas —familia, pareja, trabajo— y lo que nos pasa tiene sentido dentro de esas relaciones.',
    sesion: 'Se mira el mapa de tus vínculos. A veces se invita a la pareja o a la familia a algunas sesiones.',
    ayuda: 'Conflictos de pareja y familia, crianza, comunicación.',
    pregunta: '¿Qué papel juego en mis relaciones?',
    color: 'bg-celeste-100',
  },
  {
    slug: 'cognitivo-conductual',
    nombre: 'Terapia cognitivo-conductual',
    epoca: 'Años 60',
    anio: 1963,
    referentes: 'Aaron T. Beck, Albert Ellis',
    idea: 'No es solo lo que pasa, sino cómo lo interpretamos. Si cambian los pensamientos, cambian las emociones y lo que hacemos.',
    sesion: 'Sesiones estructuradas: identificas pensamientos automáticos, los pones a prueba y practicas nuevas respuestas.',
    ayuda: 'Ansiedad, depresión, estrés, pánico, insomnio. Es una de las corrientes con más investigación.',
    pregunta: '¿Qué me estoy diciendo sobre esto?',
    color: 'bg-marino-50',
  },
  {
    slug: 'comunitaria',
    nombre: 'Psicología comunitaria y de la liberación',
    epoca: 'Años 70 y 80 · Latinoamérica',
    anio: 1975,
    referentes: 'Ignacio Martín-Baró, Maritza Montero, Paulo Freire (influencia)',
    idea: 'El malestar no es solo individual: la pobreza, la violencia o la desigualdad también enferman. La psicología debe mirar el contexto y ayudar a transformarlo.',
    sesion: 'Trabajo en grupos y comunidades, talleres participativos, proyectos que fortalecen redes de apoyo.',
    ayuda: 'Comunidades, colectivos, organizaciones y personas afectadas por injusticias sociales.',
    pregunta: '¿Qué de mi contexto me está pesando?',
    color: 'bg-turquesa-100',
  },
  {
    slug: 'contextuales',
    nombre: 'Terapias contextuales (tercera ola)',
    epoca: 'Años 90 en adelante',
    anio: 1990,
    referentes: 'Steven Hayes (ACT), Marsha Linehan (DBT), Jon Kabat-Zinn (mindfulness)',
    idea: 'No se trata de eliminar lo que duele, sino de cambiar tu relación con eso y moverte hacia lo que valoras.',
    sesion: 'Atención plena, aceptación, aclarar tus valores y comprometerte con pequeñas acciones.',
    ayuda: 'Emociones muy intensas, ansiedad, dolor crónico, rumiación.',
    pregunta: '¿Qué es lo que de verdad me importa?',
    color: 'bg-agua',
  },
];

export const getCorriente = (slug: string) => corrientes.find((c) => c.slug === slug);

// Niveles del modelo ecológico (Bronfenbrenner) para la sección "Psicología y sociedad"
export const capas = [
  {
    id: 'persona',
    nombre: 'Tú',
    texto: 'Tu cuerpo, tu historia, tu temperamento, tus emociones. Es el punto de partida, pero nunca está aislado.',
    ejemplo: 'Dormir mal una semana cambia cómo te sientes.',
  },
  {
    id: 'micro',
    nombre: 'Tus vínculos',
    texto: 'Familia, pareja, amistades, compañeros de clase o de trabajo: las relaciones del día a día.',
    ejemplo: 'Un hogar con conflictos constantes se siente en el cuerpo.',
  },
  {
    id: 'meso',
    nombre: 'Tu comunidad',
    texto: 'El barrio, la escuela, el trabajo, los espacios donde participas y cómo se conectan entre sí.',
    ejemplo: 'Tener o no tener espacios seguros para reunirte.',
  },
  {
    id: 'exo',
    nombre: 'Las instituciones',
    texto: 'Salud, educación, empleo, transporte, seguridad: lo que no eliges directamente, pero te afecta.',
    ejemplo: 'Pasar tres horas al día en transporte agota.',
  },
  {
    id: 'macro',
    nombre: 'La sociedad y la cultura',
    texto: 'La economía, la desigualdad, los roles de género, el racismo, las creencias sobre la salud mental.',
    ejemplo: '"Los hombres no lloran" también es un mensaje de la cultura.',
  },
];

export const mitos = [
  { mito: 'Ir al psicólogo es para "locos".', realidad: 'Es para cualquier persona que quiera entenderse y estar mejor. Cuidar la mente es como cuidar el cuerpo.' },
  { mito: 'Hablar con amigos es lo mismo.', realidad: 'Los amigos son clave, pero un psicólogo tiene formación, no juzga y no forma parte de tu historia.' },
  { mito: 'El psicólogo te dice qué hacer.', realidad: 'Te acompaña a encontrar tus propias respuestas. Acompañar no es dirigir, es estar.' },
  { mito: 'Pedir ayuda es de débiles.', realidad: 'Pedir ayuda requiere valentía. Es una forma de cuidarte.' },
  { mito: 'La terapia dura años, siempre.', realidad: 'Depende de ti y del enfoque. Hay procesos de pocas semanas y otros más largos.' },
  { mito: 'Si estás triste, solo tienes que echarle ganas.', realidad: 'El malestar tiene causas personales y sociales. No es falta de voluntad.' },
];
