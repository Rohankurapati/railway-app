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
const message_model_cjs_1 = __importDefault(require("../models/message.model.cjs"));
const msgOperations_cjs_1 = require("../ts/msgOperations.cjs");
const body_parser_1 = __importDefault(require("body-parser"));
const multer = require("multer"); // for file uploading
const upload = multer({ dest: "uploads" });
const router = express_1.default.Router();
router.use(body_parser_1.default.json());
router.use(body_parser_1.default.urlencoded({ extended: true }));
router.get("/", (req, res) => {
    message_model_cjs_1.default.find()
        .then((message) => res.json(message))
        .catch((err) => res.status(400).json(`Error: ${err}`));
});
router.delete("/:messageId", (req, res) => {
    const { messageId } = req.params;
    message_model_cjs_1.default.remove({
        _id: messageId,
    })
        .exec()
        .then((result) => res.status(200).json(result))
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
});
router.post("/upload", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { room, roomId, user, fileName, datetime, size } = req.body;
    // @ts-ignore
    const path = req.file.path;
    const realFileData = {
        isFile: true,
        username: user,
        originalName: fileName,
        path,
        room,
        roomId,
        datetime,
        size,
    };
    const _id = yield (0, msgOperations_cjs_1.addToMongoose)(realFileData);
    yield res.send({ status: "done", _id: _id });
    console.log("uploaded");
}));
const handleD = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield message_model_cjs_1.default.findById(req.params.id);
    yield res.download(file.path, file.originalName);
    // file.downloadCount++;
    // await file.save();
});
router.route("/file/:id").get(handleD).post(handleD);
router.route("/emojis/:messageId/:emoji").get((req, res) => {
    const { messageId, emoji } = req.params;
    // console.log(`received req; id: ${messageId}; emoji: ${emoji}`);
    message_model_cjs_1.default.findById(messageId)
        .then(message => {
        let emojis = message === null || message === void 0 ? void 0 : message.emojis;
        emojis === null || emojis === void 0 ? void 0 : emojis.forEach(el => {
            if (el.emoji == emoji) {
                res.send({ users: el.users });
                // console.log("response sent", el.users);
            }
        });
    });
});
router.route("/moreMessages/:room/:oldMessagesReceived/:newMessagesReceived").get((req, res) => {
    const { room, oldMessagesReceived, newMessagesReceived } = req.params;
    const skipN = 15 + 5 * parseInt(oldMessagesReceived) + parseInt(newMessagesReceived);
    message_model_cjs_1.default.find({ room })
        .sort({ number: -1 })
        .limit(5)
        .skip(skipN)
        .exec()
        .then((doc) => {
        res.send({ messages: doc });
    });
});
module.exports = router;
//# sourceMappingURL=messages.cjs.map