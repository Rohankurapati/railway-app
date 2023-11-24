"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInitMessages = exports.joinUser = void 0;
const message_model_cjs_1 = __importDefault(require("../models/message.model.cjs"));
const joinUser = (socket, connectedUsers, username, room) => {
    let user = connectedUsers[username];
    const id = socket.id;
    if (user === undefined) {
        connectedUsers[username] = { status: "online", tabsOpen: 1, socketIds: [id] };
    }
    else if (user.tabsOpen === 0) {
        connectedUsers[username].status = "online";
        connectedUsers[username].tabsOpen = 1;
        connectedUsers[username].socketIds.push(id);
        socket.broadcast.emit("online", { username });
    }
    else if (!user.socketIds.includes(id)) {
        connectedUsers[username].tabsOpen++;
        connectedUsers[username].socketIds.push(id);
    }
    Object.keys(connectedUsers).forEach((usr) => {
        if (connectedUsers[usr].tabsOpen > 0) {
            console.log(connectedUsers[usr]);
        }
    });
    // let status: connectedUsersT = connectedUsers;
    // Object.keys(status).forEach((userN: string) => {
    //     status[userN].socketIds = [];
    // });
    // socket.emit("status", status);
    socket.emit("status", connectedUsers);
    socket.join(room);
};
exports.joinUser = joinUser;
const sendInitMessages = (room) => new Promise((resolve, reject) => {
    message_model_cjs_1.default.find({ room })
        .sort({ number: -1 })
        .limit(15)
        .exec()
        .then((doc) => resolve({ messages: doc.reverse() }));
});
exports.sendInitMessages = sendInitMessages;
//# sourceMappingURL=joinUser.cjs.map