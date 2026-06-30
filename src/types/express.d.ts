import type { IUser } from "../interfaces/UserInterface";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        uid: string;
        email?: string;
      };
      currentUser?: IUser;
    }
  }
}

export {};
