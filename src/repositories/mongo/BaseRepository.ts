import { Model, Document } from "mongoose";
import { IPaginationOptions } from "../../types";
import { IBaseRepository } from "../interfaces/IBaseRepository";

/**
 * Generic Mongoose-backed base repository.
 *
 * Implements the 5 standard CRUD operations for any Mongoose model.
 * Domain repositories extend this and only override or add
 * entity-specific methods (e.g. findOneByEmail).
 *
 * @template T        Document type (e.g. UserDocument extends Document)
 * @template CreateDTO  DTO for creating
 * @template UpdateDTO  DTO for updating
 */
export abstract class MongoBaseRepository<
  T extends Document,
  CreateDTO = Partial<T>,
  UpdateDTO = Partial<T>,
> implements IBaseRepository<T, CreateDTO, UpdateDTO>
{
  constructor(protected readonly model: Model<T>) {}

  async findAll(options: IPaginationOptions): Promise<{ items: T[]; total: number }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model.find().skip(skip).limit(limit),
      this.model.countDocuments(),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async create(data: CreateDTO): Promise<T> {
    const doc = new this.model(data);
    return doc.save();
  }

  async update(id: string, data: UpdateDTO): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data as any, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}
