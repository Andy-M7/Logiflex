import { Employee } from '../entities/employee';

export interface EmployeeRepository {
  getAll(): Promise<Employee[]>;
  create(employee: Omit<Employee, 'id'>): Promise<Employee>;
  update(id: string, employee: Partial<Employee>): Promise<Employee>;
  delete(id: string): Promise<void>;
}