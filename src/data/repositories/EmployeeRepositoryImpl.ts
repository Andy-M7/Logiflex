import { Employee } from "../../domain/entities/employee";
import { EmployeeRepository } from "../../domain/repositories/employee.repository";
import { backendApi } from "../source/remote/api/backendApi";

export class EmployeeRepositoryImpl implements EmployeeRepository {
  
  async getAll(): Promise<Employee[]> {
    try {
      console.log('📡 Intentando obtener empleados...');
      const { data } = await backendApi.get<Employee[]>('/employees');
      
      console.log('✅ ÉXITO: Empleados recibidos:', JSON.stringify(data, null, 2));
      return data;

    } catch (error: any) {
      // ESTO ES LO IMPORTANTE: Ver el error real
      console.error('❌ ERROR AL OBTENER EMPLEADOS:');
      if (error.response) {
        // El servidor respondió con un error (400, 404, 500)
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta (Error de Red)
        console.error('No hubo respuesta del servidor (Posible error de IP o Puerto)');
        console.error('Request:', error.request);
      } else {
        console.error('Error:', error.message);
      }
      throw error;
    }
  }

  // ... Mantén el resto de métodos (create, update, delete) igual ...
  async create(employee: Omit<Employee, 'id'>): Promise<Employee> {
    const { data } = await backendApi.post<Employee>('/employees', employee);
    return data;
  }

  async update(id: string, employee: Partial<Employee>): Promise<Employee> {
    const { data } = await backendApi.patch<Employee>(`/employees/${id}`, employee);
    return data;
  }

  async delete(id: string): Promise<void> {
    await backendApi.delete(`/employees/${id}`);
  }
}