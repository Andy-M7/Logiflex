import { EmployeeRepositoryImpl } from '../../../data/repositories/EmployeeRepositoryImpl';

const repo = new EmployeeRepositoryImpl();

export const GetEmployeesUseCase = async () => {
  return await repo.getAll();
};