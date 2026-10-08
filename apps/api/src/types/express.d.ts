import { UserRole } from "../modules/users/user.model";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        role: UserRole;
      };
    }
  }
}

export {};
