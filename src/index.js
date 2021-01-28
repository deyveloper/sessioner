const uuid = require('uuid');

class Sessioner {
    static sessions = {};
    static options = {
        cookie: {
            sameSite: '',
            secure: false,
            cookieName: 'web.sid'
        }
    };

    constructor(options) {
        Sessioner.options = options;
    };

    static middler(req, res, next, ) {
        let cookie;
        if (Sessioner.options.cookie.conditional) {
            cookie = Sessioner.options.cookie.conditional(req, res);
        } else {
            cookie = {
                cookieName: Sessioner.options.cookie.cookieName || 'web.sid',
                sameSite: Sessioner.options.cookie.sameSite || 'Lax',
                secure: Sessioner.options.cookie.secure || false
            };
        };
        const webSid = req.cookies[cookie.cookieName];
        if (webSid && Object.keys(Sessioner.sessions).includes(webSid)) {
            next();
            return;
        };
        const sessionId = Sessioner.appendSession();
        res.cookie(cookie.cookieName, sessionId, { sameSite: cookie.sameSite, secure: cookie.secure });
        next();
    };

    static appendSession() {
        const generatedId = uuid.v4();
        const session = {
            sessionId: generatedId,
            data: ''
        }
        Sessioner.sessions[generatedId] = session;
        return generatedId;
    };

    static get(sessionId) {
        return Sessioner.sessions[sessionId].data;
    };

    static set(sessionId, data) {
        try {
            Sessioner.sessions[sessionId].data = JSON.stringify(data);
        } catch {
            return false;
        };
        return true;
    };

    static append(sessionId, dataToAppend, key) {
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

module.exports = Sessioner;