"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
const uri = process.env.MONGO_ADDRESS;
mongoose_1.default.set('strictQuery', true);
mongoose_1.default.connect(uri);
//# sourceMappingURL=db.cjs.map