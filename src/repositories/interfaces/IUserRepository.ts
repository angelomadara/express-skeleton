import { UserDocument } from "../../models/user.model";
import { ICreateUserDTO, IUpdateUserDTO, IPaginationOptions } from "../../types";

/**
 * Repository interface for User data access.
 *
 * High-level modules (services) depend on THIS abstraction,
 * not on Mongoose directly — satisfying both Open/Closed (O)
 * and Dependency Inversion (D).
 *
 * CLOSED — the contract never changes.
 * OPEN   — add new implementations (Postgres, cache, mock) as new classes.
 */
export interface IUserRepository {
  findAll(options: IPaginationOptions): Promise<{ users: UserDocument[]; total: number }>;
  findById(id: string): Promise<UserDocument | null>;
  findOneByEmail(email: string): Promise<UserDocument | null>;
  create(data: ICreateUserDTO): Promise<UserDocument>;
  update(id: string, data: IUpdateUserDTO): Promise<UserDocument | null>;
  delete(id: string): Promise<void>;
}
