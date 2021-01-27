"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = __importDefault(require("uuid"));
var Sessioner = /** @class */ (function () {
    function Sessioner(options) {
        Sessioner.options = options;
    }
    ;
    Sessioner.prototype.middler = function (req, res, next) {
        var cookie;
        if (Sessioner.options.cookie.conditional) {
            cookie = Sessioner.options.cookie.conditional(req, res);
        }
        else {
            cookie = {
                cookieName: Sessioner.options.cookie.cookieName || 'web.sid',
                sameSite: Sessioner.options.cookie.sameSite || 'Lax',
                secure: Sessioner.options.cookie.secure || false
            };
        }
        ;
        if (req.cookies[cookie.cookieName]) {
            next();
            return;
        }
        ;
        res.cookie(cookie.cookieName, { sameSite: cookie.sameSite, secure: cookie.secure });
        next();
    };
    ;
    Sessioner.prototype.appendSession = function () {
        var generatedId = uuid_1.default.v4();
        var session = {
            sessionId: generatedId,
            data: ''
        };
        Sessioner.sessions[generatedId] = session;
        return generatedId;
    };
    ;
    Sessioner.prototype.get = function (sessionId) {
        return Sessioner.sessions[sessionId].data;
    };
    ;
    Sessioner.prototype.set = function (sessionId, data) {
        try {
            Sessioner.sessions[sessionId].data = JSON.stringify(data);
        }
        catch (_a) {
            return false;
        }
        ;
        return true;
    };
    ;
    Sessioner.prototype.append = function (sessionId, dataToAppend, key) {
        try {
            var data = Sessioner.sessions[sessionId].data;
            var parsedData = JSON.parse(data);
            parsedData[key] = dataToAppend;
            return this.set(sessionId, parsedData);
        }
        catch (_a) {
            return false;
        }
        ;
    };
    ;
    Sessioner.sessions = {};
    Sessioner.options = {
        cookie: {
            sameSite: '',
            secure: false,
            cookieName: 'web.sid'
        }
    };
    return Sessioner;
}());
;
exports.default = Sessioner;
