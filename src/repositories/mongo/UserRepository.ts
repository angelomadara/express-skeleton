import User, { UserDocument } from "../../models/user.model";
import { ICreateUserDTO, IUpdateUserDTO } from "../../types";
import { MongoBaseRepository } from "./BaseRepository";
import { IUserRepository } from "../interfaces/IUserRepository";

/**
 * Mongoose-backed implementation of IUserRepository.
 *
 * Extends MongoBaseRepository to inherit all 5 CRUD operations.
 * Only entity-specific queries (findOneByEmail) are defined here.
 *
 * To add a new data source (Postgres, Redis, mock):
 *   class PostgresUserRepository implements IUserRepository { ... }
 * — zero changes to this file.
 */
export class MongoUserRepository
  extends MongoBaseRepository<UserDocument, ICreateUserDTO, IUpdateUserDTO>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({ email });
  }
}
