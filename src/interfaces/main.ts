
export interface ISessioner {
  appendSession: () => string;
  get: (sessionId: string,) => string;
  set: (sessionId: string, data: any) => boolean;
  append: (sessionId: string, dataToAppend: any, key: string) => boolean;
};

export interface ISession {
  sessionId: string;
  data: string;
};

export interface ICollectionSession {
  [key: string]: ISession
};

export type TCookieOptions = {
  cookieName: string;
  sameSite: string;
  secure: boolean;
};

export interface IOptions {
  cookie: {
    cookieName?: string;
    sameSite?: string;
    secure?: boolean;
    conditional?: (req: any, res: any) => TCookieOptions 
  };
};