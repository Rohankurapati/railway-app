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
exports.findLowestPositionRoom = exports.getVoiceRooms = exports.loadRooms = void 0;
const rooms_model_cjs_1 = __importDefault(require("../models/rooms.model.cjs"));
const loadRooms = () => __awaiter(void 0, void 0, void 0, function* () { return rooms_model_cjs_1.default.find().sort({ position: 1 }).exec(); });
exports.loadRooms = loadRooms;
const getVoiceRooms = () => __awaiter(void 0, void 0, void 0, function* () {
    let voices = {};
    yield rooms_model_cjs_1.default.find({ voice: true })
        .exec()
        .then((doc) => {
        doc.map((el) => {
            voices[el._id] = []; // roomName: [socket.id, ice-candidate]
        });
    });
    return voices;
});
exports.getVoiceRooms = getVoiceRooms;
const findLowestPositionRoom = () => new Promise((resolve, reject) => {
    rooms_model_cjs_1.default.find({})
        .sort({ position: 1 })
        .limit(1)
        .exec()
        .then((res) => {
        if (res.length !== 0) {
            resolve({ _roomId: res[0]._id, _name: res[0].name });
        }
    });
});
exports.findLowestPositionRoom = findLowestPositionRoom;
//# sourceMappingURL=roomOperations.cjs.map