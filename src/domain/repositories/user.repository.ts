import { User } from '../entities/user';

export interface UserRepository{
    login(email: string, password:string): Promise<User[]>;
    create(email: string, password:string): Promise<User[]>;
}