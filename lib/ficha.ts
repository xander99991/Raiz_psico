// Campos de la ficha del equipo (formulario /unete)
export const DIAS_FICHA = [
  { n: 1, corto: 'Lun' }, { n: 2, corto: 'Mar' }, { n: 3, corto: 'Mié' },
  { n: 4, corto: 'Jue' }, { n: 5, corto: 'Vie' }, { n: 6, corto: 'Sáb' },
];
export const HORAS_FICHA = Array.from({ length: 14 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`); // 07:00–20:00

export const TEMAS_FICHA = [
  'Ansiedad', 'Depresión', 'Estrés', 'Autoestima', 'Duelo', 'Pareja', 'Familia', 'Crianza',
  'Trauma', 'Violencia', 'Adicciones', 'Sexualidad', 'Identidad', 'Orientación vocacional',
  'Problemas de aprendizaje', 'Evaluaciones', 'Crisis vitales', 'Migración',
];
export const POBLACIONES_FICHA = ['Niños', 'Adolescentes', 'Adultos', 'Adultos mayores', 'Parejas', 'Familias', 'Grupos'];

export type Ficha = {
  nombre: string;
  nombreWeb: string;
  titulo: string;
  senescyt: string;
  mostrarSenescyt: boolean;
  formacion: string;
  experiencia: string;
  corriente: string;
  corrienteOtra: string;
  complementarias: string[];
  frase: string;
  bio: string;
  temas: string[];
  temasOtros: string;
  poblaciones: string[];
  idiomas: string;
  modalidades: string[];
  horario: Record<string, string[]>;
  email: string;
  whatsapp: string;
  redes: string;
  comentarios: string;
  consentimiento: boolean;
};
