"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const userOperations_cjs_1 = require("./ts/userOperations.cjs");
const roomOperations_cjs_1 = require("./ts/roomOperations.cjs");
const msgOps = __importStar(require("./ts/msgOperations.cjs"));
const message_model_cjs_1 = __importDefault(require("./models/message.model.cjs"));
const rooms_model_cjs_1 = __importDefault(require("./models/rooms.model.cjs"));
require("./config/db.cjs");
const dotenv_1 = __importDefault(require("dotenv"));
const disconnectUser_cjs_1 = require("./scripts/disconnectUser.cjs");
const joinUser_cjs_1 = require("./scripts/joinUser.cjs");
const usersRouter = require("./routes/users.cjs");
const messagesRouter = require("./routes/messages.cjs");
const roomsRouter = require("./routes/rooms.cjs");
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};
dotenv_1.default.config(); // .env variables
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        // origins: "*:*",
        credentials: true,
        // optionSuccessStatus: 200,
    },
});
var usersInVoice = {};
var socketIds = [];
var roomIds = [];
const main = (connectedUsers) => {
    io.on("connection", (socket) => {
        let username;
        let room;
        console.log("new connection", socket.id);
        socket.on("join", (data) => __awaiter(void 0, void 0, void 0, function* () {
            let { roomId, _username } = data;
            let roomM = yield rooms_model_cjs_1.default.findOne({ _id: roomId }).exec();
            if (!roomM) {
                const { _name, _roomId } = yield (0, roomOperations_cjs_1.findLowestPositionRoom)();
                room = _name;
                roomId = _roomId;
            }
            else {
                room = roomM.name;
            }
            if (roomM && roomM.voice) {
                socket.emit("roomName", { name: room, roomId: roomId, voice: true });
            }
            else {
                const { messages } = yield (0, joinUser_cjs_1.sendInitMessages)(room);
                socket.emit("roomName", { name: room, roomId: roomId, voice: false });
                socket.emit("messages", messages);
            }
            username = _username;
            (0, joinUser_cjs_1.joinUser)(socket, connectedUsers, username, room);
            console.log(`== joined ${username} ${socket.id}`);
        }));
        socket.on("disconnect", () => {
            (0, disconnectUser_cjs_1.disconnectUser)(socket, connectedUsers, username);
            (0, disconnectUser_cjs_1.emitDisconnect)(socket, io, roomIds, usersInVoice);
            (0, disconnectUser_cjs_1.popOut)(socketIds, usersInVoice, roomIds, socket.id);
            console.log(`== disconnect ${username} ${socket.id}`);
            Object.keys(connectedUsers).forEach((usr) => {
                if (connectedUsers[usr].tabsOpen > 0) {
                    console.log(connectedUsers[usr]);
                }
            });
        });
        socket.on("popAccount", (data) => {
            console.log("deleting user", data.username);
            delete connectedUsers[data.username];
            console.log("user:", data.username);
        });
        socket.on("message", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { authentication, username, message, datetime, room } = data;
            let _id = msgOps.addToMongoose(Object.assign(Object.assign({}, data), { isFile: false }));
            let sdata = {
                _id,
                message,
                user: username,
                date: datetime,
                isFile: false,
                edited: false,
            };
            socket.emit("message", sdata);
            socket.in(room).emit("message", sdata);
            // console.log("sent (1)", room, message, "from", username);
        }));
        socket.on("deleteMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { messageId, username, hash } = data;
            const message = yield message_model_cjs_1.default.findOne({ _id: messageId });
            const { userHash, userStatus } = yield (0, userOperations_cjs_1.getUserHash)(username);
            if ((message.user === username && userHash === hash) || (userHash === hash && userStatus === "Admin")) {
                message.remove();
                socket.in(data.room).emit("messageDeleted", { success: true, _id: messageId });
                socket.emit("messageDeleted", { success: true, _id: messageId });
            }
            else {
                socket.emit("messageDeleted", { success: false, status: "You do not have privileges to delete that message..." });
            }
        }));
        socket.on("editMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { _id } = data;
            let filter = { _id };
            let msg = data.messageHTML
                .replace("</div><div>", "<br>")
                .replace("<div>", "")
                .replace("</div>", "<br>");
            console.log(`%cmsg: ${msg}`, "color: red");
            // msg = msg.substring(0, msg.length - 4);
            msg = replaceAll(msg, "<br>", "\n");
            let update = { message: msg, edited: true };
            message_model_cjs_1.default.findOneAndUpdate(filter, update).exec();
        }));
        socket.on("file", (data) => __awaiter(void 0, void 0, void 0, function* () {
            //const authentication, user, datetime, roomId, size, filename;
            const { _id, room } = data;
            msgOps.sendFileData(_id, room, socket);
        }));
        socket.on("attachEmoji", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { _id, emoji, user } = data;
            console.log("server received emoji:", emoji, _id, user);
            let message = yield message_model_cjs_1.default.findOne({ _id });
            let found = false;
            let suspend = false;
            let num = 1;
            message.emojis.forEach((_emoji) => {
                if (_emoji.emoji === emoji) {
                    if (_emoji.users.includes(user) === false) {
                        _emoji.num += 1;
                        _emoji.users.push(user);
                        found = true;
                        num = _emoji.num;
                    }
                    else {
                        suspend = true;
                    }
                }
            });
            if (suspend) {
                return;
            }
            else if (found === false) {
                message.emojis.push({ emoji, num: 1, users: [user] });
            }
            let jData = { emoji, num, _id };
            socket.emit("newEmoji", jData);
            socket.in(data.room).emit("newEmoji", jData);
            yield message.save();
        }));
        // #################################
        // #      WebRTC Signalling        #
        // #################################
        socket.on("joinVoice", (data) => {
            if (data.username === "") {
                // console.log("no username !!!!!!!!!!!");
                return;
            }
            const { room, roomId, username } = data;
            let payload = {
                id: socket.id,
                username: username,
            };
            if (usersInVoice[roomId] === undefined) {
                usersInVoice[roomId] = [];
            }
            // console.log("socketIds:", socketIds);
            // console.log("includes", socketIds.includes(socket.id));
            if (!socketIds.includes(socket.id)) {
                usersInVoice[roomId].push(payload);
                console.log(`
      ##########################################################
      #            UsersN: ${usersInVoice[roomId].length}  ${" ".repeat(33)}#
      #            New user connected: ${socket.id} ${" ".repeat(3)}#
      #            RoomID: ${roomId}            #
      #            Room: ${room}                    ${" ".repeat(11)}#
      ##########################################################\n`);
                // console.log("sent 0");
                socketIds.push(socket.id);
                roomIds.push(roomId);
                if (usersInVoice[roomId].length > 1) {
                    usersInVoice[roomId].forEach((user) => {
                        // console.log("sent 1");
                        if (socket.id !== user.id) {
                            // console.log("sent to", user.id);
                            setTimeout(() => {
                                io.to(user.id).emit("joined", {
                                    to: user.id,
                                    from: socket.id,
                                    username: data.username,
                                });
                            }, 1000);
                        }
                    });
                }
            }
        });
        socket.on("offer", (data) => {
            // {id, text, roomId}
            console.log(`* offer generated by: ${socket.id}; for: ${data.id}`);
            io.to(data.id).emit("offer", {
                text: data.text,
                to: data.id,
                from: socket.id,
            });
        });
        socket.on("candidate", (data) => {
            console.log(`* ice candidates generated by: ${socket.id}; for: ${data.id}`);
            io.to(data.id).emit("candidate", {
                text: data.text,
                to: data.id,
                from: socket.id,
            });
        });
        socket.on("answer", (data) => {
            console.log(`* answer generated by: ${socket.id}; for: ${data.to}`);
            io.to(data.to).emit("answer", {
                text: data.text,
                to: data.id,
                from: socket.id,
            });
        });
        socket.on("toggleVideo", (data) => {
            // console.log(`users in ${data.roomId}: ${usersInVoice[data.roomId]}`);
            usersInVoice[data.roomId].forEach((user) => {
                if (user.id !== socket.id) {
                    io.to(user.id).emit("changeStatus", {
                        id: socket.id,
                        status: data.status,
                    });
                }
            });
        });
        // socket.on("toggleAudio", (data) => {
        // console.log(`users in ${data.roomId}: ${usersInVoice[data.roomId]}`);
        // });
    });
    server.listen(PORT, () => console.log(`Server is on PORT: ${PORT}`));
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use((0, cors_1.default)(corsOptions));
    app.use(messagesRouter);
    app.use(usersRouter);
    app.use(roomsRouter);
};
// next two functions are taken out of stackoverflow
const escapeRegExp = (arg) => {
    return arg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};
const replaceAll = (str, match, replacement) => {
    return str.replace(new RegExp(escapeRegExp(match), "g"), () => replacement);
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    var connectedUsers = yield (0, userOperations_cjs_1.usersStatus)();
    console.log(connectedUsers);
    main(connectedUsers);
}))();
//# sourceMappingURL=index.js.map