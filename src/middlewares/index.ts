import { TUser } from "./auth.js";

declare global {
  namespace Express {
    interface Request {
      user?: TUser;
    }
  }
}

export { TUser };
