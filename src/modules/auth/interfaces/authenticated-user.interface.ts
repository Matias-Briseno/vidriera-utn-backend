export interface AuthenticatedUser {
  id: number;
  nombre: string;
  apellido: string;
  foto_url: string | null;
  nro_legajo: string;
  email: string;
  tecnicatura_id: number | null;
  condicion_academica: "alumno" | "egresado" | null;
  rol: "estudiante" | "docente" | "bedelia" | "directivo";
  created_at: Date;
}