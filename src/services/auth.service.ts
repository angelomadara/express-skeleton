import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/user.model";
import config from "../config";
import { AppError } from "../utils/appError";
import { IUserRepository } from "../repositories";

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  user: Pick<UserDocument, "_id" | "name" | "email" | "role">;
  tokens: AuthTokens;
}

/**
 * AuthService
 * Handles user registration, login, and token generation.
 *
 * OCP: Depends on IUserRepository (abstraction) for data access.
 * Swap the persistence layer without touching auth logic.
 *
 * DIP: Both service and repository implement the same interface contract.
 */
export class AuthService {
  constructor(private readonly userRepo: IUserRepository) {}

  /**
   * Register a new user.
   */
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const existing = await this.userRepo.findOneByEmail(email);
    if (existing) {
      throw new AppError("Email already in use", 409);
    }

    const user = await this.userRepo.create({ name, email, password });
    const accessToken = this.generateToken(user);

    return {
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      tokens: { accessToken },
    };
  }

  /**
   * Authenticate a user with email and password.
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    // Need the password field — the Mongoose model has select:false on it,
    // so we fetch from the raw model. This is a repository-specific concern.
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = this.generateToken(user);

    return {
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      tokens: { accessToken },
    };
  }

  /**
   * Generate a signed JWT access token.
   */
  private generateToken(user: UserDocument): string {
    return jwt.sign(
      { id: user._id, role: user.role },
      config.jwtAccessSecret,
      { expiresIn: config.jwtExpiresIn } as jwt.SignOptions,
    );
  }
}
