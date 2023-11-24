"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomsSchema = new mongoose_1.default.Schema({
    _id: String,
    name: {
        type: String,
        trim: true,
        unique: false,
        required: [true, "Please add a name"],
    },
    position: {
        type: Number,
        unique: false,
        required: false,
    },
    voice: {
        type: Boolean,
        required: false,
    },
}, {
    timestamps: false,
});
const rooms = mongoose_1.default.model("Rooms", roomsSchema);
// module.exports = rooms;
exports.default = rooms;
//# sourceMappingURL=rooms.model.cjs.map