# Open/Closed Principle (O) — Repository Abstraction Layer

**Branch:** `open-close-principle`
**Date:** 2026-07-01

---

## [PROBLEM]

The service layer (`UserService`, `AuthService`) depended **concretely** on Mongoose model methods:

```ts
// BEFORE — violated OCP and DIP:
class UserService {
  async getAllUsers(options) {
    const users = await User.find()...        // concrete Mongoose
    const total = await User.countDocuments(); // concrete Mongoose
    return { users, total };
  }
}
```

This meant:
- **OCP violation:** Adding PostgreSQL, a cache layer, or a mock for testing required *modifying* `UserService`
- **DIP violation:** High-level business logic depended on low-level persistence details

---

## [SOLUTION]

Introduced a repository abstraction layer with four changes:

### 1. New: `src/repositories/interfaces/IUserRepository.ts`
The closed contract defining all user data operations:

| Method | Purpose |
|---|---|
| `findAll(options)` | Paginated list with total count |
| `findById(id)` | Single user lookup |
| `findOneByEmail(email)` | Auth lookup |
| `create(data)` | Insert |
| `update(id, data)` | Patch |
| `delete(id)` | Remove |

### 2. New: `src/repositories/mongo/UserRepository.ts`
The first (and current) implementation — Mongoose-backed, implements `IUserRepository`.

### 3. Modified: `src/services/user.service.ts` + `src/services/auth.service.ts`
Services now accept `IUserRepository` via constructor:

```ts
// AFTER — OCP + DIP compliant:
class UserService {
  constructor(private readonly userRepo: IUserRepository) {}

  async getAllUsers(options) {
    return this.userRepo.findAll(options);  // no concrete dependency
  }
}
```

### 4. New: `src/composition-root.ts`
Single file wiring the dependency graph:

```
MongoUserRepository → UserService + AuthService → UserController + AuthController
```

Change one line in `composition-root.ts` to swap the data source.

---

## [FILES CHANGED]

| File | Action | Severity |
|---|---|---|
| `src/repositories/interfaces/IUserRepository.ts` | **Created** | New |
| `src/repositories/mongo/UserRepository.ts` | **Created** | New |
| `src/repositories/index.ts` | **Created** | New |
| `src/composition-root.ts` | **Created** | New |
| `src/services/user.service.ts` | **Modified** | Refactor |
| `src/services/auth.service.ts` | **Modified** | Refactor |
| `src/controllers/auth.controller.ts` | **Modified** | Refactor |
| `src/controllers/examples/user.controller.ts` | **Modified** | Refactor |
| `src/routes/index.ts` | **Modified** | Wiring |
| `src/routes/auth.routes.ts` | **Modified** | Wiring |

---

## [VERIFICATION]

```bash
npx tsc --noEmit
# → Zero errors
```

---

## [NEXT / FUTURE]

To swap data source (e.g., PostgreSQL), create:

```ts
class PostgresUserRepository implements IUserRepository { ... }
```

Then change one line in `composition-root.ts`:

```ts
// Before:
const userRepo = new MongoUserRepository();

// After:
const userRepo = new PostgresUserRepository(db);
```

Zero changes to services or controllers.
