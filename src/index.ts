import uuid from 'uuid';
import { ICollectionSession, IOptions, ISession, ISessioner, TCookieOptions } from './interfaces/main';


class Sessioner implements ISessioner {
  static sessions: ICollectionSession = {};
  static options: IOptions = {
    cookie: {
      sameSite: '',
      secure: false,
      cookieName: 'web.sid'
    }
  };

  constructor(options: IOptions) {
    Sessioner.options = options;
  };

  middler(req: any, res: any, next: Function,) {
    let cookie: TCookieOptions;
    if (Sessioner.options.cookie.conditional) {
      cookie = Sessioner.options.cookie.conditional(req, res);
    } else {
      cookie = {
        cookieName: Sessioner.options.cookie.cookieName || 'web.sid',
        sameSite: Sessioner.options.cookie.sameSite || 'Lax',
        secure: Sessioner.options.cookie.secure || false
      };
    };
    if (req.cookies[cookie.cookieName]) {
      next();
      return;
    };
    res.cookie(cookie.cookieName, { sameSite: cookie.sameSite, secure: cookie.secure });
    next();
  };

  appendSession() {
    const generatedId = uuid.v4();
    const session: ISession = {
      sessionId: generatedId,
      data: ''
    }
    Sessioner.sessions[generatedId] = session;
    return generatedId;
  };

  get(sessionId: string) {
    return Sessioner.sessions[sessionId].data;
  };

  set(sessionId: string, data: any) {
    try {
      Sessioner.sessions[sessionId].data = JSON.stringify(data);
    } catch {
      return false;
    };
    return true;
  };

  append(sessionId: string, dataToAppend: any, key: string) {
    try {
      const data = Sessioner.sessions[sessionId].data;
      const parsedData = JSON.parse(data);
      parsedData[key] = dataToAppend;
      return this.set(sessionId, parsedData);
    } catch {
      return false;
    };
  };
};

export default Sessioner;