// src/types/index.ts
export interface Convocatoria {
  id: string;
  nombre: string;
  ano: number;
  descripcion: string;
  activa: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Etapa {
  id: string;
  nombre: string;
  descripcion: string;
  orden: number;
  activa: boolean;
  convocatoriaId: string;
}

export interface Seccion {
  id: string;
  nombre: string;
  icono: string;
  orden: number;
  activa: boolean;
  fechaActualizacion: Date;
  etapaId: string;
  convocatoriaId: string;
}

export interface ContenidoRequisito {
  id: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  icono: string;
  orden: number;
  obligatorio: boolean;
  seccionId: string;
  etapaId: string;
  convocatoriaId: string;
}