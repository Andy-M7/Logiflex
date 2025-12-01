import { backendApi } from "../source/remote/api/backendApi";
import { AttendanceRecord } from "../../domain/entities/attendance";

export class AttendanceRepositoryImpl {
  
  // Obtener registros de una fecha
  async getByDate(date: string): Promise<AttendanceRecord[]> {
    try {
      const { data } = await backendApi.get<any[]>(`/attendance?date=${date}`);
      // Mapeamos la respuesta del backend al formato frontend simple
      return data.map(item => ({
        id: item.id,
        employeeId: item.employee.id,
        date: item.date,
        isPresent: item.isPresent
      }));
    } catch (error) {
      console.log('Error get attendance', error);
      return [];
    }
  }

  // Guardar un registro (individual)
  async save(record: AttendanceRecord): Promise<void> {
    await backendApi.post('/attendance', record);
  }
}