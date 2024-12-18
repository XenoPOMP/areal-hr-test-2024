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
