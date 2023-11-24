"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuth = void 0;
const user_model_cjs_1 = __importDefault(require("../../models/user.model.cjs"));
const isAuth = (req, res, next) => auth(req, res, next, ["user", "Admin"]);
exports.isAuth = isAuth;
const isAdmin = (req, res, next) => auth(req, res, next, ["Admin"]);
exports.isAdmin = isAdmin;
const auth = (req, res, next, status) => {
    const { authentication, username } = req.body;
    user_model_cjs_1.default.findOne({ username })
        .then(doc => {
        if (doc === null || doc.hashId !== authentication) {
            res.send({ success: false, status: "401 Unauthorized" });
        }
        else if (!status.includes(doc.status)) {
            res.send({ success: false, status: "403 Forbidden" });
        }
        else {
            next();
        }
    });
};
//# sourceMappingURL=authentication.cjs.map