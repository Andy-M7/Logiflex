import { UserRepositoryImpl } from '../../../data/repositories/UserRepositoryImpl';
import { User } from '../../entities/user';

// Instanciamos el repositorio existente
const repo = new UserRepositoryImpl();

export const GetUsersUseCase = () => repo.getAll();

export const CreateUserUseCase = (user: { email: string; fullName: string; password?: string }) => {
  return repo.create(user);
};

export const DeleteUserUseCase = (id: string) => {
  return repo.remove(id);
};

export const UpdateUserUseCase = (id: string, user: Partial<User>) => {
  return repo.update(id, user);
};