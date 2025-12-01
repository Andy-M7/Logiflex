export interface AttendanceRecord {
  id?: string; // Opcional porque al enviar no lo tenemos
  employeeId: string;
  date: string;
  isPresent: boolean;
}