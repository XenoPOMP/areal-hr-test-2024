import 'express';
import 'express-session';

declare module 'express' {
  interface Request {
    cookies?: Record<string, string>;
    sessionID?: string;
  }
}

declare module 'express-session' {
  interface Session {
    user?: { id: number; login: string };
  }
}

declare global {
  namespace Express {
    interface User {
      id: number;
      login: string;
    }

    interface Request {
      user?: User; // req.user будет соответствовать структуре User
    }
  }
}
