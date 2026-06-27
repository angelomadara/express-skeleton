import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/express";

/**
 * Simple auth middleware — extracts user from a hypothetical token.
 * Replace with your own JWT / session verification logic.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthenticatedRequest;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  // TODO: verify token, extract user payload
  // authReq.user = { id: "...", role: "..." };
  next();
}

/**
 * Role-based authorization middleware.
 */
export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user || !roles.includes(authReq.user.role)) {
      res.status(403).json({ success: false, message: "Insufficient permissions" });
      return;
    }
    next();
  };
}
