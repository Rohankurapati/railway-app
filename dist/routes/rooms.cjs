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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const rooms_model_cjs_1 = __importDefault(require("../models/rooms.model.cjs"));
const saveModel_cjs_1 = __importDefault(require("../ts/saveModel.cjs"));
const roomOperations_cjs_1 = require("../ts/roomOperations.cjs");
const authentication_cjs_1 = require("./middleware/authentication.cjs");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.status(200).json({
        message: "Handling GET requests to /users...",
    });
});
router.get("/api/firstRoomId/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _roomId } = yield (0, roomOperations_cjs_1.findLowestPositionRoom)();
    yield res.send({ newRoomId: _roomId });
}));
router.get("/api/roomId/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { _roomId } = yield (0, roomOperations_cjs_1.findLowestPositionRoom)();
    const room = yield rooms_model_cjs_1.default.findOne({ _id: id }).exec();
    if (!room) {
        yield res.send({ sucess: false, newRoomId: _roomId });
        return;
    }
    yield res.send({
        sucess: true,
        name: room.name,
        voice: room.voice,
    });
    console.log("sent nameById:", room.name);
}));
router.post("/api/editRoom", authentication_cjs_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, newName } = req.body;
    rooms_model_cjs_1.default.findOneAndUpdate({ _id }, { name: newName }).exec();
    res.send({ success: true });
}));
router.post("/api/addRoom", authentication_cjs_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, voice } = req.body;
    rooms_model_cjs_1.default.count({}, (err, count) => __awaiter(void 0, void 0, void 0, function* () {
        let newRoomModel = new rooms_model_cjs_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            name,
            position: count,
            voice,
        });
        yield (0, saveModel_cjs_1.default)(newRoomModel);
        yield res.send({
            success: true,
            _id: newRoomModel._id,
            position: newRoomModel.position,
        });
    }));
}));
router.post("/api/changeRoomPosition", authentication_cjs_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, draggingRoomIndex, finalIndex } = req.body;
    if (finalIndex === draggingRoomIndex) {
        res.send({ success: false });
        return;
    }
    console.log(`draggingRoomIndex: ${draggingRoomIndex}; finalIndex: ${finalIndex};`);
    const messages = yield rooms_model_cjs_1.default.find().sort({ position: 1 });
    if (finalIndex > draggingRoomIndex) {
        messages.forEach((room, n) => {
            if (n > draggingRoomIndex && n <= finalIndex) {
                // console.log("rise", room.name);
                rooms_model_cjs_1.default.findOneAndUpdate({ _id: room._id }, { position: n - 1 }).exec();
            }
        });
    }
    else {
        messages.forEach((room, n) => {
            if (n < draggingRoomIndex && n >= finalIndex) {
                // console.log("rise", room.name);
                rooms_model_cjs_1.default.findOneAndUpdate({ _id: room._id }, { position: n + 1 }).exec();
            }
        });
    }
    rooms_model_cjs_1.default.findOneAndUpdate({ _id: roomId }, { position: finalIndex }).exec();
    res.send({ success: true });
}));
router.post("/api/deleteRoom", authentication_cjs_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body;
    const doc = yield rooms_model_cjs_1.default.findOne({ _id });
    if (doc === null) {
        return;
    }
    yield doc.remove();
    res.send({ success: true });
    // renumber rooms (positions)
    const position = doc.position;
    rooms_model_cjs_1.default.find().sort({ position: 1 }).exec()
        .then(rooms => {
        rooms.forEach((room, n) => {
            if (room.position > position) {
                rooms_model_cjs_1.default.findOneAndUpdate({ _id: room._id }, { position: room.position - 1 }).exec();
            }
        });
    });
}));
module.exports = router;
// export default router;
//# sourceMappingURL=rooms.cjs.map