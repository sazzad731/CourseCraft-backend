import { TUser } from "./auth";

declare global {
  namespace Express {
    interface Request {
      user?: TUser;
    }
  }
}

export { TUser };
