import { UserJwtPayload } from './express.d';
import { JwtPayload } from "jsonwebtoken";

declare global {
  declare namespace Express {
    interface UserJwtPayload extends jwt.JwtPayload {
      id?: string,
      isAdmin?: boolean;
    }
    interface Request {
      user?: UserJwtPayload
    }
  }
}
export {
  UserJwtPayload
}