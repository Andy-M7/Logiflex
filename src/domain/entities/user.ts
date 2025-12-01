export interface User {
  id: string;
  email: string;
  fullName?: string;
  // Campos opcionales que vienen en el login o listado
  token?: string; 
  isActive?: boolean;
  role?: string; // Aunque no lo usemos en lógica, sirve para mostrarlo
}