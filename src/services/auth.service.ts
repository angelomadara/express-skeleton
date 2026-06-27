import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/user.model";
import config from "../config";
import { AppError } from "../utils/appError";

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
 */
class AuthService {
  /**
   * Register a new user.
   */
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError("Email already in use", 409);
    }

    const user = await User.create({ name, email, password });
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

export default new AuthService();
