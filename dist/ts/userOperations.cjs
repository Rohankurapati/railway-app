"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserHash = exports.usersStatus = exports.checkData = exports.checkLogin = exports.addIp = exports.registerUser = void 0;
const roomOperations_cjs_1 = require("./roomOperations.cjs");
const user_model_cjs_1 = __importDefault(require("../models/user.model.cjs"));
const saveModel_cjs_1 = __importDefault(require("./saveModel.cjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const sha1 = require("sha1");
const bufferData = (username, password) => sha1(`${username}${password}`);
const registerUser = (username, hashedPassword, ip) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_cjs_1.default.find({ username });
    if (users.length === 0) {
        const user = new user_model_cjs_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            username,
            password: hashedPassword,
            hashId: bufferData(username, hashedPassword),
            ip,
            status: "user",
        });
        (0, saveModel_cjs_1.default)(user);
        return { success: true };
    }
    else {
        return { success: false, data: "username exist" };
    }
});
exports.registerUser = registerUser;
const addIp = (username, ip) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_cjs_1.default.findOneAndUpdate({ username }, { ip })
        .exec()
        .then(_ => console.log(`ip ${ip} added...`))
        .catch(err => console.error(err));
});
exports.addIp = addIp;
const checkData = (hashId) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield user_model_cjs_1.default.find({ hashId }).exec();
    if (doc.length !== 0) {
        const rooms = yield (0, roomOperations_cjs_1.loadRooms)();
        return {
            success: true,
            username: doc[0].username,
            authentication: doc[0].hashId,
            rooms
        };
    }
    else
        return {
            success: false
        };
});
exports.checkData = checkData;
const checkLogin = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_cjs_1.default.findOne({ username }).exec();
    if (user == undefined) {
        return { success: false };
    }
    else {
        let pswrd = String(user.password);
        if (password === pswrd) {
            const hashId = user.hashId;
            const { _roomId } = yield (0, roomOperations_cjs_1.findLowestPositionRoom)();
            return {
                success: true,
                roomId: _roomId,
                hashId
            };
        }
        else {
            return { success: false };
        }
    }
});
exports.checkLogin = checkLogin;
const usersStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    let users = {};
    yield user_model_cjs_1.default.find()
        .exec()
        .then((doc) => {
        doc.forEach((el) => {
            users[el.username] = {
                status: "offline",
                tabsOpen: 0,
                socketIds: []
            };
        });
    });
    return users;
});
exports.usersStatus = usersStatus;
const getUserHash = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        user_model_cjs_1.default.findOne({ username })
            .then(user => {
            resolve({ userHash: user.hashId, userStatus: user.status });
        });
        // reject({ userHash: null });
    });
});
exports.getUserHash = getUserHash;
//# sourceMappingURL=userOperations.cjs.map