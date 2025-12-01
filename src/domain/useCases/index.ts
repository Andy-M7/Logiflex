import { EmployeeRepositoryImpl } from '../../data/repositories/EmployeeRepositoryImpl';
import { Employee } from '../entities/employee';

const repo = new EmployeeRepositoryImpl();

export const GetEmployeesUseCase = () => repo.getAll();

export const CreateEmployeeUseCase = (employee: Omit<Employee, 'id'>) => {
  return repo.create(employee);
};

export const UpdateEmployeeUseCase = (id: string, employee: Partial<Employee>) => {
  return repo.update(id, employee);
};

export const DeleteEmployeeUseCase = (id: string) => {
  return repo.delete(id);
};