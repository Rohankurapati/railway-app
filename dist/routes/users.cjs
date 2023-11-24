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
const sharp_1 = __importDefault(require("sharp"));
const multer = require("multer"); // for file uploading
const upload = multer({ dest: "profile_pictures" });
const router = express_1.default.Router();
const userOperations_cjs_1 = require("../ts/userOperations.cjs");
const user_model_cjs_1 = __importDefault(require("../models/user.model.cjs"));
const deletedUser_model_cjs_1 = __importDefault(require("../models/deletedUser.model.cjs"));
const getIp_cjs_1 = __importDefault(require("../scripts/getIp.cjs"));
const saveModel_cjs_1 = __importDefault(require("../ts/saveModel.cjs"));
const authentication_cjs_1 = require("./middleware/authentication.cjs");
router.get("/", (req, res) => {
    res.status(200).json({
        message: "Handling GET requests to /users...",
    });
});
router.post("/api/users/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, hashedPassword } = req.body;
    const ip = (0, getIp_cjs_1.default)(req);
    const { success, data } = yield (0, userOperations_cjs_1.registerUser)(username, hashedPassword, ip);
    res.send({ success, data });
}));
router.post("/api/users/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = (0, getIp_cjs_1.default)(req);
    const { username, hashedPassword } = yield req.body;
    const data = yield (0, userOperations_cjs_1.checkLogin)(username, hashedPassword);
    if (data.success) {
        yield (0, userOperations_cjs_1.addIp)(username, ip);
        yield res.send(data);
    }
    else {
        res.send({ success: false, status: "412 Precondition Failed" });
    }
}));
router.get("/api/users/:hashId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hashId } = req.params;
        const data = yield (0, userOperations_cjs_1.checkData)(hashId);
        yield res.send(data);
    }
    catch (_a) {
        yield res.send({ success: false });
    }
}));
router.get("/api/users/usernameByHashId/:hashId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hashId } = req.params;
    const user = yield user_model_cjs_1.default.find({ hashId }).exec();
    yield res.send({ username: user[0].username });
}));
router.post("/api/users/changePassword", authentication_cjs_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, oldPassword, newPassword } = req.body;
    const filter = { username: username };
    const user = yield user_model_cjs_1.default.findOne(filter);
    if ((user === null || user === void 0 ? void 0 : user.password) === oldPassword && user !== null) {
        user.password = newPassword;
        res.send({ success: true });
    }
    else {
        res.send({ success: false });
    }
    yield user.save();
}));
router.post("/api/users/deleteAccount", authentication_cjs_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authentication, username } = req.body;
    console.log(`deleting account: ${authentication}; username: ${username}`);
    user_model_cjs_1.default.findOneAndDelete({ username }).exec();
    let newDeletedUserModel = new deletedUser_model_cjs_1.default({
        username,
        ip: (0, getIp_cjs_1.default)(req),
    });
    (0, saveModel_cjs_1.default)(newDeletedUserModel);
    res.send({ success: true });
}));
router.post("/api/users/addProfilePicture", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const _imageDir = req.file.path;
    const newImageDir = _imageDir + 0;
    (0, sharp_1.default)(_imageDir)
        .resize(82, 82)
        .toFile(newImageDir, (err, info) => {
        console.log(info);
        console.error(err);
    });
    console.log("new profile image:", req.body.user, newImageDir);
    yield user_model_cjs_1.default.findOneAndUpdate({ username: req.body.user }, { imageDir: newImageDir });
    yield res.send({ status: "done" });
}));
router.get("/api/users/checkImageAvailability/:username", (req, res) => {
    const { username } = req.params;
    user_model_cjs_1.default.findOne({ username })
        .then(user => {
        if ((user === null || user === void 0 ? void 0 : user.imageDir) !== null) {
            console.log("exist", user === null || user === void 0 ? void 0 : user.imageDir);
            res.send({ success: true });
        }
        else {
            console.log("exist", user.imageDir);
            res.send({ success: false });
        }
    });
});
const handleDownload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const user = yield user_model_cjs_1.default.findOne({ username });
    yield res.download(user.imageDir, "profileImage.png");
});
router.route("/api/users/profilePicture/:username").get(handleDownload).post(handleDownload);
module.exports = router;
//# sourceMappingURL=users.cjs.map