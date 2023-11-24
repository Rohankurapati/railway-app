"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const { kStringMaxLength } = require("buffer");
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    username: {
        type: String,
        required: [true, "Please add a username"],
        unique: true,
        trim: true,
        minwidth: 3,
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        unique: false,
        trim: true,
    },
    imageDir: {
        type: String,
        required: false,
        default: null,
        trim: true,
    },
    status: {
        type: String,
        default: "user",
        unique: false,
        trim: false,
    },
    ip: {
        type: String,
        required: false,
        unique: false,
        trim: true,
    },
    hashId: {
        type: String,
        required: false,
        unique: true,
    },
}, {
    timestamps: false,
});
const User = mongoose_1.default.model("User", userSchema);
// module.exports = User;
exports.default = User;
//# sourceMappingURL=user.model.cjs.map