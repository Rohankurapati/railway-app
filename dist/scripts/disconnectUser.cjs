"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.popOut = exports.emitDisconnect = exports.disconnectUser = void 0;
const disconnectUser = (socket, connectedUsers, username) => {
    const id = socket.id;
    let user = connectedUsers[username];
    if (user !== undefined) {
        connectedUsers[username].tabsOpen--;
        connectedUsers[username].socketIds = connectedUsers[username].socketIds.filter(_id => _id !== id);
        if (connectedUsers[username].tabsOpen <= 0) {
            socket.broadcast.emit("offline", { username });
            connectedUsers[username].status = "offline";
        }
    }
    else {
        Object.keys(connectedUsers).forEach((userN) => {
            user = connectedUsers[userN];
            if (user.socketIds.includes(`${id}`)) {
                connectedUsers[userN].socketIds = user.socketIds.filter(el => el !== id);
                connectedUsers[userN].tabsOpen--;
                return;
            }
        });
    }
};
exports.disconnectUser = disconnectUser;
const emitDisconnect = (socket, io, roomIds, usersInVoice) => {
    // emit disconnect message for voice chat users
    roomIds.forEach((roomid) => {
        usersInVoice[roomid].forEach((user) => {
            if (user.id === socket.id) {
                usersInVoice[roomid].forEach((user0) => {
                    if (user0.id !== socket.id) {
                        console.log("'peerDisconnect' emitted...");
                        io.to(user0.id).emit("peerDisconnected", { id: socket.id });
                    }
                });
            }
        });
    });
};
exports.emitDisconnect = emitDisconnect;
// _id === socket.id
const popOut = (socketIds, usersInVoice, roomIds, _id) => {
    socketIds = socketIds.filter((id, n) => {
        if (id !== _id) {
            return id;
        }
        else {
            usersInVoice[roomIds[n]] = usersInVoice[roomIds[n]].filter((el) => el.id !== _id);
            roomIds = roomIds.filter((r, n0) => n0 !== n);
        }
    });
};
exports.popOut = popOut;
//# sourceMappingURL=disconnectUser.cjs.map