import { BinaryToTextEncoding } from "crypto";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URL: string;
      PORT: number;
      PASSWORD_SECRET_KEY: string;
      JWT_SECRET_KEY: string;
    }
  }
}