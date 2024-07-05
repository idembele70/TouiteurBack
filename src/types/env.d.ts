import { BinaryToTextEncoding } from "crypto";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_USERNAME: string;
      MONGO_PASSWORD: string;
      MONGO_CLUSTER: string;
      MONGO_OPTIONS: string;
      MONGO_APP_NAME: string;
      PORT: number;
      PASSWORD_SECRET_KEY: string;
      JWT_SECRET_KEY: string;
      NODE_ENV: string;
    }
  }
}