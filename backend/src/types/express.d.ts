import type { AuthenticatedUser } from '../auth/api_auth/auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
