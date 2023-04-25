import { BinaryToTextEncoding } from "crypto";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URL: string;
      PORT: number;
      RANDOM_BYTES: number;
      CRYPTO_BASE: BufferEncoding | undefined;
      HMAC: string;
      PASSWORD_SECRET_KEY: string;
      DIGEST: BinaryToTextEncoding;
      COOKIE_SECRET_KEY: string;
      COOKIE_DOMAIN: string
    }
  }
}
export { }