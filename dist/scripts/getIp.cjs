"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getIp = (req) => { var _a; return (_a = (req.headers["x-forwarded-for"] || req.connection.remoteAddress)) === null || _a === void 0 ? void 0 : _a.toString(); };
exports.default = getIp;
//# sourceMappingURL=getIp.cjs.map