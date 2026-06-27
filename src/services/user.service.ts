import User, { UserDocument } from "../models/user.model";
import { ICreateUserDTO, IUpdateUserDTO, IPaginationOptions } from "../types";

/**
 * UserService
 * Business logic layer — services are stateless classes that
 * encapsulate all data operations and business rules.
 */
class UserService {
  async getAllUsers(options: IPaginationOptions): Promise<{ users: UserDocument[]; total: number }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([User.find().skip(skip).limit(limit), User.countDocuments()]);

    return { users, total };
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return User.findById(id);
  }

  async createUser(data: ICreateUserDTO): Promise<UserDocument> {
    const user = new User(data);
    return user.save();
  }

  async updateUser(id: string, data: IUpdateUserDTO): Promise<UserDocument | null> {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteUser(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  }
}

export default new UserService();
