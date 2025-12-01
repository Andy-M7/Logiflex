import { EmployeeRepositoryImpl } from '../../../data/repositories/EmployeeRepositoryImpl';
import { Employee } from '../../entities/employee';

const repo = new EmployeeRepositoryImpl();

// CORRECCIÓN: Quitamos 'isActive' del Omit.
// Ahora la función acepta: { dni, fullName, role, isActive }
export const CreateEmployeeUseCase = async (data: Omit<Employee, 'id'>) => {
  return await repo.create(data);
};