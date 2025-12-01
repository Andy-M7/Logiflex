import { AuthRepository } from "../../domain/repositories/AuthRepository";

export class LoginUseCase {
  constructor(private authRepo: AuthRepository) {}

  async execute(email: string, password: string) {
    return this.authRepo.login(email, password);
  }
}
