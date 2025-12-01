import { UserRepositoryImpl } from '../../data/repositories/UserRepositoryImpl';
import {User} from '../entities/user';

const {login} = new UserRepositoryImpl();
export const LoginUseCase = async (email: string, password: string): Promise<User[]> => {
    return await login(email,password)
}