import User, { UserDocument } from "../../models/user.model";
import { ICreateUserDTO, IUpdateUserDTO, IPaginationOptions } from "../../types";
import { IUserRepository } from "../interfaces/IUserRepository";

/**
 * Mongoose-backed implementation of IUserRepository.
 *
 * OPEN for extension: adding PostgresUserRepository, RedisUserRepository,
 * MockUserRepository (for tests) requires zero changes here.
 *
 * CLOSED for modification: the IUserRepository contract stays stable.
 */
export class MongoUserRepository implements IUserRepository {
  async findAll(options: IPaginationOptions): Promise<{ users: UserDocument[]; total: number }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    return { users, total };
  }

  async findById(id: string): Promise<UserDocument | null> {
    return User.findById(id);
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return User.findOne({ email });
  }

  async create(data: ICreateUserDTO): Promise<UserDocument> {
    const user = new User(data);
    return user.save();
  }

  async update(id: string, data: IUpdateUserDTO): Promise<UserDocument | null> {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  }
}
