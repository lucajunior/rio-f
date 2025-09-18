export interface User {
  id: string;
  matricula: string;
  nome: string;
  aniversario: string;
  foto?: string;
  role: 'admin' | 'user';
}

export interface Auditorium {
  id: string;
  nome: string;
  capacidade: number;
}

export interface TimeSlot {
  id: string;
  nome: string;
  inicio: string;
  fim: string;
}

export interface Allocation {
  id: string;
  auditorio: string;
  data: string;
  turno: string;
  usuario: string;
  matricula: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  matricula: string;
  nome: string;
  role: 'admin' | 'user';
}