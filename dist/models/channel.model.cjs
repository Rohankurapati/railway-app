"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const channelSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    name: {
        type: String,
        unique: true,
    },
    users: [{ type: String }],
    admin: {
        type: String,
    },
});
const Channel = mongoose_1.default.model("Channel", channelSchema);
exports.default = Channel;
//# sourceMappingURL=channel.model.cjs.map