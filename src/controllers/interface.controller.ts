import { Request, Response, NextFunction } from "express";

// ──────────────────────────────────────────────
// Controller Interface Contract
// ──────────────────────────────────────────────
// These typed interfaces define a standard contract for all resource controllers.
// Implement the composite InterfaceController for full CRUD,
// or pick individual interfaces for partial CRUD.

export interface Indexable {
  index(req: Request, res: Response, next: NextFunction): Promise<void | Response> | void | Response;
}

export interface Storable {
  store(req: Request, res: Response, next: NextFunction): Promise<void | Response> | void | Response;
}

export interface Showable {
  show(req: Request, res: Response, next: NextFunction): Promise<void | Response> | void | Response;
}

export interface Editable {
  edit(req: Request, res: Response, next: NextFunction): Promise<void | Response> | void | Response;
}

export interface Updatable {
  update(req: Request, res: Response, next: NextFunction): Promise<void | Response> | void | Response;
}

export interface Destroyable {
  destroy(req: Request, res: Response, next: NextFunction): Promise<void | Response> | void | Response;
}

/**
 * Composite master interface — implements all six CRUD operations.
 * Use this when building a full-resource controller.
 */
export interface InterfaceController extends Indexable, Storable, Showable, Editable, Updatable, Destroyable {}
