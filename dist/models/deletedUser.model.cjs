"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const deletedUserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
    },
    ip: {
        type: String,
    },
}, {
    timestamps: false,
});
const DeletedUser = mongoose_1.default.model("DeletedUser", deletedUserSchema);
exports.default = DeletedUser;
//# sourceMappingURL=deletedUser.model.cjs.map