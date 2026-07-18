import { JWTPayload } from "jose-cjs";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export {};