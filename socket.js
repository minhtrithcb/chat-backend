// IO SET UP
const { createServer } = require("http");
const { Server } = require("socket.io");

const socketIo = (app) => {

    const httpServer = createServer(app);
    const io = new Server(httpServer,  {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        }
    });

    let users = []

    function addUser(uid , skid) {
        !users.some(u => u.uid === uid) &&
        users.push({uid, skid})
    }

    function removeUser(skid) {
        users = users.filter(u => u.skid !== skid)
    }

    function findUser(uid) {
        return users.find(u => u.uid === uid)
    }

    io.on("connection", (socket) => {

        // User online push and get user Online
        console.log("User connect");
        socket.on("join server" , (uid) => {
            addUser(uid, socket.id)
            io.emit("getUser", users)
        })

        socket.on("join room", (roomId) => {
            socket.join(roomId)
        })

        socket.on("leave room", (roomId) => {
            socket.leave(roomId)
        })

        socket.on("send-msg", ({roomId , ...data}) => {
            // Sent to room Id
            io.to(roomId).emit("getMessage", data)
        });


        // User disconnect & remove this user online
        socket.on("disconnect", () => {
            console.log("User disconnect");
            removeUser(socket.id)
            io.emit("getUser", users)
        })
    });

    return httpServer
}





module.exports = socketIo
