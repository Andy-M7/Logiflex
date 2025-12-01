export interface Employee {
  id: string;
  dni: string;
  fullName: string; // En el backend se llama fullName
  role: 'Líder' | 'Auxiliar' | 'Supervisor'; // Ajustado al backend
  isActive: boolean;
}