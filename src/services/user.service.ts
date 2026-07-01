import { UserDocument } from "../models/user.model";
import { ICreateUserDTO, IUpdateUserDTO, IPaginationOptions } from "../types";
import { IUserRepository } from "../repositories";

/**
 * UserService
 * Business logic layer — stateless class that encapsulates
 * all user data operations via an injected repository.
 *
 * OCP: The service depends on IUserRepository (abstraction),
 * not on Mongoose (concrete). Swap the implementation without
 * modifying this file.
 *
 * DIP: High-level policy (service) and low-level detail (Mongo)
 * both depend on the same interface.
 */
export class UserService {
  constructor(private readonly userRepo: IUserRepository) {}

  async getAllUsers(options: IPaginationOptions): Promise<{ users: UserDocument[]; total: number }> {
    return this.userRepo.findAll(options);
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return this.userRepo.findById(id);
  }

  async createUser(data: ICreateUserDTO): Promise<UserDocument> {
    return this.userRepo.create(data);
  }

  async updateUser(id: string, data: IUpdateUserDTO): Promise<UserDocument | null> {
    return this.userRepo.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }
}
