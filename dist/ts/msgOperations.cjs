"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFileData = exports.addToMongoose = void 0;
const message_model_cjs_1 = __importDefault(require("../models/message.model.cjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const saveModel_cjs_1 = __importDefault(require("./saveModel.cjs"));
let num = 0;
// find the maximum number value (the newest message)
message_model_cjs_1.default.find({})
    .sort({ number: -1 })
    .limit(1)
    .exec()
    .then((res) => {
    // console.log("res:", res);
    if (res.length !== 0) {
        num = res[0].number + 1;
    }
});
const addToMongoose = (data) => {
    let newMessageModel;
    if (data.isFile) {
        newMessageModel = new message_model_cjs_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            user: data.username,
            isFile: true,
            originalName: data.originalName,
            path: data.path,
            date: data.datetime,
            room: data.room,
            roomId: data.roomId,
            downloadCount: 0,
            size: data.size,
            emojis: [],
            number: num,
        });
    }
    else {
        newMessageModel = new message_model_cjs_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            isFile: false,
            user: data.username,
            message: data.message,
            date: data.datetime,
            room: data.room,
            roomId: data.roomId,
            emojis: [],
            number: num,
        });
    }
    num++;
    (0, saveModel_cjs_1.default)(newMessageModel);
    return newMessageModel._id;
};
exports.addToMongoose = addToMongoose;
const sendFileData = (_id, room, socket) => {
    message_model_cjs_1.default.findById(_id).then((doc) => {
        console.log("doc", doc);
        if (doc !== null) {
            console.log("file sent:", doc._id, doc.originalName);
            socket.emit("message", doc);
            socket.in(room).emit("message", doc);
        }
        else {
            setTimeout(() => {
                sendFileData(_id, room, socket);
            }, 100);
        }
    });
};
exports.sendFileData = sendFileData;
//# sourceMappingURL=msgOperations.cjs.map