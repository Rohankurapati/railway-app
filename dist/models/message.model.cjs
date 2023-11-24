"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    date: {
        type: String,
        unique: false,
        trim: true,
        required: [true, "Please add date"],
    },
    message: {
        type: String,
        unique: false,
        trim: true,
        required: false,
    },
    user: {
        type: String,
        unique: false,
        trim: true,
        required: [true, "Please add a username"],
    },
    room: {
        type: String,
        unique: false,
        trim: true,
        required: [true, "Please add a room name"],
    },
    roomId: {
        type: String,
        trim: true,
        unique: false,
        required: [true, "Please add a room id"],
    },
    isFile: {
        type: Boolean,
        unique: false,
        required: true,
    },
    path: {
        type: String,
        unique: false,
        required: false,
    },
    originalName: {
        type: String,
        trim: true,
        unique: false,
        required: false,
    },
    downloadCount: {
        type: Number,
        unique: false,
        required: false,
    },
    size: {
        type: Number,
        unique: false,
        required: false,
    },
    edited: {
        type: Boolean,
        unique: false,
        required: true,
        default: false,
    },
    emojis: [{
            emoji: String,
            num: Number,
            users: [String],
        }],
    number: {
        type: Number,
        required: true,
    },
}, {
    timestamps: false,
});
const Message = mongoose_1.default.model("Message", messageSchema);
// module.exports = Message;
exports.default = Message;
//# sourceMappingURL=message.model.cjs.map